const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/user-quizzes', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const { rows } = await pool.query(
                "SELECT * FROM quizzes WHERE quizzes.user_id=$1",
                [req.user.id]
            );
            console.log('currentUserQuery:', rows);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.json({});
        }
    } else {
        // User is not authenticated, respond with an empty object
        res.json({});
    }
});

router.get('/all-quizzes', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const { rows } = await pool.query(
                "SELECT * FROM quizzes WHERE quizzes.user_id!=$1",
                [req.user.id]
            );
            console.log('currentUserQuery:', rows);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.json({});
        }
    } else {
        // User is not authenticated, respond with an empty object
        res.json({});
    }
});

router.get('/quiz/:quiz_id', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const { rows } = await pool.query(
                `SELECT qz.*, questions.*, multiple_choice_questions.* 
                FROM quizzes qz
                LEFT JOIN questions ON qz.quiz_id = questions.quiz_id 
                LEFT JOIN multiple_choice_questions ON questions.question_id = multiple_choice_questions.question_id
                WHERE qz.quiz_id=$1`,
                [req.params.quiz_id]
            );
            console.log('currentUserQuery:', rows);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.json({});
        }
    } else {
        res.json({});
    }
})

router.post('/quiz', async (req, res) => {
    console.log('here');
    if (req.isAuthenticated()) {
        try {
            const { rows } = await pool.query(
                "INSERT INTO quizzes (user_id) VALUES ($1) RETURNING quiz_id",
                [req.user.id]
            );
            console.log('currentUserQuery:', rows);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.json({});
        }
    } else {
        res.json({});
    }
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
            res.json({});
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.json({});
        }
    } else {
        res.json({});
    }
});

router.delete('/quiz/:quiz_id', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const { rows } = await pool.query(
                "DELETE FROM quizzes WHERE quiz_id=$1",
                [req.params.quiz_id]
            );
            console.log('currentUserQuery:', rows);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.json({});
        }
    } else {
        res.json({});
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
            res.json({});
        }
    } else {
        res.json({});
    }
});

router.get('/question/:question_id', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const { rows } = await pool.query(
                `SELECT questions.*, multiple_choice_questions.*
                FROM questions
                LEFT JOIN multiple_choice_questions ON questions.question_id = multiple_choice_questions.question_id
                WHERE questions.question_id=$1`,
                [req.params.question_id]
            );
            console.log('currentUserQuery:', rows);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.json({});
        }
    } else {
        res.json({});
    }
});

router.put('/update-question/:question_id', async (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.body);
        try {
            for (let el in req.body) {
                console.log('el:', el);
                console.log('req.body[el]:', req.body[el]);
                if (el === 'question_text') {
                    const { rows } = await pool.query(
                        `UPDATE questions SET ${el}=$1 WHERE question_id=$2`,
                        [req.body[el], req.params.question_id]
                    );
                    console.log('currentUserQuery:', rows);
                }
                else if (req.body.q_type === 'multiple_choice' && el !== 'q_type') {
                    const { rows } = await pool.query(
                        `UPDATE multiple_choice_questions SET ${el}=$1 WHERE question_id=$2`,
                        [req.body[el], req.params.question_id]
                    );
                    console.log('currentUserQuery:', rows);
                }
            }   
            res.json({});
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.json({});
        }
    } else {
        res.json({});
    }
});

router.delete('/question/:question_id', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const { rows } = await pool.query(
                "DELETE FROM multiple_choice_questions WHERE question_id=$1",
                [req.params.question_id]
            );
            const { rows2 } = await pool.query(
                "DELETE FROM questions WHERE question_id=$1",
                [req.params.question_id]
            );
            
            console.log('currentUserQuery:', rows);
            console.log('currentUserQuery:', rows2);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.json({});
        }
    } else {
        res.json({});
    }
});

module.exports = router;