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
                "SELECT * FROM quizzes LEFT JOIN questions ON quizzes.quiz_id = questions.quiz_id WHERE quizzes.quiz_id=$1",
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

module.exports = router;