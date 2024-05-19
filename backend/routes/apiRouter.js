const express = require('express');
const router = express.Router();
const { fetchDataFromDB, pool } = require('../db');
const multer = require('multer');
const { bucket } = require('../firebase');

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

router.get('/user-quizzes', async (req, res) => {
    const query = "SELECT * FROM quizzes WHERE quizzes.user_id=$1";
    const params = [req.user.id];
    handleRequest(req, res, query, params);
});

router.get('/all-quizzes', async (req, res) => {
    const query = "SELECT * FROM quizzes WHERE quizzes.user_id!=$1";
    const params = [req.user.id];
    handleRequest(req, res, query, params);
});

router.get('/quiz/:quiz_id', async (req, res) => {
    const query = `SELECT qz.*, questions.*, multiple_choice_questions.* 
                    FROM quizzes qz
                    LEFT JOIN questions ON qz.quiz_id = questions.quiz_id 
                    LEFT JOIN multiple_choice_questions ON questions.question_id = multiple_choice_questions.question_id
                    WHERE qz.quiz_id=$1`;
    const params = [req.params.quiz_id];
    handleRequest(req, res, query, params);
});

router.post('/quiz', async (req, res) => {
    const query = "INSERT INTO quizzes (user_id) VALUES ($1) RETURNING quiz_id";
    const params = [req.user.id];
    handleRequest(req, res, query, params);
});

router.put('/update-quiz/:quiz_id', async (req, res) => {
    if (req.isAuthenticated()) {
        //console.log(req.body, req.params.quiz_id);
        try {
            for (let el in req.body) {
                console.log('el:', el);
                console.log('req.body[el]:', req.body[el]);
                const { rows } = await pool.query(
                    `UPDATE quizzes SET ${el}=$1 WHERE quiz_id=$2`,
                    [req.body[el], req.params.quiz_id]
                );
                console.log('currentUserQuery:', rows);
            }   
            res.status(200).json({ message: 'Quiz updated successfully' });
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).json({ error: 'Error updating quiz' });
        }
    } else {
        res.status(401).json({ error: 'User is not authenticated' });
    }
});

router.delete('/quiz/:quiz_id', async (req, res) => {
    try {
        await pool.query("DELETE FROM quizzes WHERE quiz_id=$1", [req.params.quiz_id]);
        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ error: 'Error deleting quiz' });
    }
});

router.post('/question', async (req, res) => {
    console.log('here', req.body);
    if (req.isAuthenticated()) {
        try {
            const { rows } = await pool.query(
                "INSERT INTO questions (quiz_id, q_type) VALUES ($1, $2) RETURNING question_id",
                [req.body.param, req.body.q_type]
            );
            if (req.body.q_type === 'multiple_choice') {
                const { rows2 } = await pool.query(
                    "INSERT INTO multiple_choice_questions (question_id) VALUES ($1)",
                    [rows[0].question_id]
                );
                console.log('currenrrererer:', rows2);
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

router.get('/question/:question_id', async (req, res) => {
    const query = `SELECT questions.*, multiple_choice_questions.*
                    FROM questions
                    LEFT JOIN multiple_choice_questions ON questions.question_id = multiple_choice_questions.question_id
                    WHERE questions.question_id=$1`;
    const params = [req.params.question_id];
    handleRequest(req, res, query, params);
});

router.put('/update-question/:question_id', async (req, res) => {
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

router.delete('/question/:question_id', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            await pool.query(
                "DELETE FROM multiple_choice_questions WHERE question_id=$1",
                [req.params.question_id]
            );
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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

module.exports = router;