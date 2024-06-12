const express = require('express');
const router = express.Router();
const multer = require('multer');
const { bucket } = require('../firebase');
const OpenAI = require('openai');
const { fetchDataFromDB, pool } = require('../db');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const handleRequest = async (req, res, query, params) => {
    if (req.isAuthenticated()) {
        try {
            const data = await fetchDataFromDB(query, params);
            res.json(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(401).json({ error: 'User is not authenticated' });
    }
}

router.post('/', async (req, res) => {
    console.log('here', req.body);
    if (req.isAuthenticated()) {
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
    } else {
        res.status(401).json({ error: 'User is not authenticated' });
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
    if (req.isAuthenticated()) {
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
    } else {
        res.status(401).json({ error: 'User is not authenticated' });
    }
});

router.delete('/:question_id', async (req, res) => {
    if (req.isAuthenticated()) {
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
    } else {
        res.status(401).json({ error: 'User is not authenticated' });
    }
});

router.post('/upload-image/:question_id', upload.single('photo'), async (req, res) => {
    if (req.isAuthenticated()) {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
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
    } else {
        res.status(401).json({ error: 'User is not authenticated' });
    }
});

router.post('/check-answer', async (req, res) => {
    if (req.isAuthenticated()) {
        const { user_answer, correct_answer } = req.body;
        const response = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a language expert providing feedback on quiz questions for a language learning application. Provide every response in the form of a JSON object with two fields: result which can be either correct, incorrect or partially correct and explanation which is a brief explanation if the answer is incorrect. Provide the explanation in Croatian and pretend you are talking to the user directly.' },
                { role: 'user', content: `Evaluate the user's answer ${user_answer} with the correct answer ${correct_answer}` },
            ],
            model: 'gpt-4o',
            response_format: { type: 'json_object' },
        });
        console.log('Response:', response.choices[0].message.content);
        res.json(JSON.parse(response.choices[0].message.content));
    } else {
        res.status(401).json({ error: 'User is not authenticated' });
    }
});

module.exports = router;