const express = require('express');
const router = express.Router();
const multer = require('multer');
const { bucket } = require('../firebase');
const OpenAI = require('openai');
const { fetchDataFromDB, pool } = require('../db');
const authMiddleware = require('../authMiddleware');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.use(authMiddleware);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const handleRequest = async (req, res, query, params) => {
    try {
        const data = await fetchDataFromDB(query, params);
        res.json(data);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: error.message });
    }
}

router.post('/', async (req, res) => {
    try {
        const { rows } = await pool.query(
            "INSERT INTO questions (quiz_id, q_type) VALUES ($1, $2) RETURNING question_id",
            [req.body.param, req.body.q_type]
        );
        if (req.body.q_type === 'multiple_choice') {
            await pool.query(
                "INSERT INTO multiple_choice_questions (question_id) VALUES ($1)",
                [rows[0].question_id]
            );
        } else if (req.body.q_type === 'write_in') {
            await pool.query(
                "INSERT INTO write_in_questions (question_id) VALUES ($1)",
                [rows[0].question_id]
            )
        } else if (req.body.q_type === 'fill_in') {
            await pool.query(
                "INSERT INTO fill_in_questions (question_id) VALUES ($1)",
                [rows[0].question_id]
            )
        }
        console.log('currentUserQuery:', rows);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Error fetching data from database' });
    }

});

router.get('/:question_id', async (req, res) => {
    const params = [req.params.question_id];
    const query1 = `SELECT questions.q_type FROM questions WHERE questions.question_id=$1`;
    const { rows } = await pool.query(query1, params);
    const type = rows[0].q_type;
    if (type === 'multiple_choice') {
        const query = `SELECT questions.*, multiple_choice_questions.*
                        FROM questions
                        JOIN multiple_choice_questions ON questions.question_id = multiple_choice_questions.question_id
                        WHERE questions.question_id=$1`;
        handleRequest(req, res, query, params);
    } else if (type === 'write_in') {
        const query = `SELECT questions.*, write_in_questions.*
                        FROM questions
                        JOIN write_in_questions ON questions.question_id = write_in_questions.question_id
                        WHERE questions.question_id=$1`;
        handleRequest(req, res, query, params);
    } else if (type === 'fill_in') {
        const query = `SELECT questions.*, fill_in_questions.*
                        FROM questions
                        JOIN fill_in_questions ON questions.question_id = fill_in_questions.question_id
                        WHERE questions.question_id=$1`;
        handleRequest(req, res, query, params);
    }
});

router.put('/:question_id', async (req, res) => {
    try {
        for (let field in req.body) {
            if (field === 'question_text') {
                await pool.query(
                    `UPDATE questions SET question_text=$1 WHERE question_id=$2`,
                    [req.body[field], req.params.question_id]
                );
            }
            else if (req.body.q_type === 'multiple_choice' && field !== 'q_type') {
                await pool.query(
                    `UPDATE multiple_choice_questions SET ${field}=$1 WHERE question_id=$2`,
                    [req.body[field], req.params.question_id]
                );
            }
            else if (req.body.q_type === 'write_in' && field !== 'q_type') {
                await pool.query(
                    `UPDATE write_in_questions SET ${field}=$1 WHERE question_id=$2`,
                    [req.body[field], req.params.question_id]
                );
            }
            else if (req.body.q_type === 'fill_in' && field !== 'q_type') {
                await pool.query(
                    `UPDATE fill_in_questions SET ${field}=$1 WHERE question_id=$2`,
                    [req.body[field], req.params.question_id]
                );
            }
        }   
        res.status(200).json({ message: 'Question updated successfully' });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ error: 'Error updating question' });
    }
});

router.delete('/:question_id', async (req, res) => {
    try {
        await pool.query(
            "DELETE FROM questions WHERE question_id=$1",
            [req.params.question_id]
        );
        
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'Error deleting question' });
    }
});

router.post('/upload-image/:question_id', upload.single('photo'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    //delete previous image
    const query = `SELECT image_url FROM questions WHERE question_id=$1`;
    const params = [req.params.question_id];
    const { rows } = await pool.query(query, params);
    if (rows[0].image_url) {
        const filePath = rows[0].image_url.replace('https://storage.googleapis.com/lingua-storage.appspot.com/', '');
        const file = bucket.file(filePath);
        await file.delete();
    }
    //----------------------------------
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
        resumable: false,
        public: true
    });
    blobStream.on('error', (err) => {
        console.error('Error uploading image:', err);
        res.status(500).json({ error: 'Error uploading image' });
    });
    blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        console.log('Image uploaded successfully');
        res.status(200).json({ imageUrl: publicUrl });
        try {
            await pool.query(
                `UPDATE questions SET image_url=$1 WHERE question_id=$2`,
                [publicUrl, req.params.question_id]
            );
        } catch (error) {
            console.error('Error updating image URL:', error);
        }
    });
    blobStream.end(req.file.buffer);
});

router.post('/delete-image/:question_id', async (req, res) => {
    const fileUrl = req.body.image_url;
    try {
        console.log('File URL:', fileUrl);
        const filePath = fileUrl.replace('https://storage.googleapis.com/lingua-storage.appspot.com/', '');
        const file = bucket.file(filePath);
        await file.delete();
        await pool.query(
            `UPDATE questions SET image_url=$1 WHERE question_id=$2`,
            [null, req.params.question_id]
        );
        res.status(200).send('File deleted successfully');
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).send('Error deleting file');
    }
});

router.post('/check-answer-write-in/:lang', async (req, res) => {
    const { question_text, user_answer, correct_answer } = req.body;
    console.log(question_text, user_answer, correct_answer);
    let prompt;
    if (req.params.lang == 'en') {
        prompt = `You are an english language expert providing feedback on quiz questions for a language learning application where the user is learning english.`;
    } else if (req.params.lang == 'kr') {
        prompt = `You are a korean language expert providing feedback on quiz questions for a language learning application where the user is learning korean.`;
    }
    const response = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: `The word that needs to be translated is: "${question_text}". The correct translation is "${correct_answer}". The user's translation is "${user_answer}".
                                        First check if the user's translation is in the same language as the correct translation. If not, return incorrect without providing an explanation.
                                        Then valuate if the user's translation is correct or incorrect.
                                        If the translation is incorrect give a brief explanation of why and do not reveal the correct answer.
                                        Provide every response as a JSON with the following elements: result which is one of (correct, incorrect) and explanation in Croatian without ever including the correct answer in the explanation.` },
        ],
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
    });
    console.log('Response:', response.choices[0].message.content);
    res.json(JSON.parse(response.choices[0].message.content));
});

router.post('/check-answer/:lang', async (req, res) => {
    const { user_answer, correct_answer, question } = req.body;
    let prompt;
    let prompt2;
    if (req.params.lang == 'en') {
        prompt = `You are an english language expert providing feedback on quiz questions for a language learning application where the user is learning english.`;
        prompt2 = `Evalute the user's answer: "${user_answer}" compared to the correct answer: "${correct_answer}" within the context of the entire sentence: "${question}".
                    First check if the user's answer is in english. If not, return incorrect without providing an explanation.
                    If the answer is in english then evaluate if it's correct or incorrect.
                    If the answer is incorrect give a brief explanation of why and do not reveal the correct answer.
                    Provide every response as a JSON with the following elements: result which is one of (correct, incorrect) and explanation in Croatian without ever including the correct answer in the explanation.`
    } else if (req.params.lang == 'kr') {
        prompt = `You are a korean language expert providing feedback on quiz questions for a language learning application where the user is learning korean.`;
        prompt2 = `Evalute the user's answer: "${user_answer}" compared to the correct answer: "${correct_answer}".
                    First check if the user's answer is in korean. If not, return incorrect without providing an explanation.
                    If the answer is in korean then evaluate if it's correct or incorrect.
                    If the answer is incorrect give a brief explanation of why and do not reveal the correct answer.
                    Provide every response as a JSON with the following elements: result which is one of (correct, incorrect) and explanation in Croatian without ever including the correct answer in the explanation.`
    }
    const response = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: prompt2 },
        ],
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
    });
    console.log('Response:', response.choices[0].message.content);
    res.json(JSON.parse(response.choices[0].message.content));
});

module.exports = router;