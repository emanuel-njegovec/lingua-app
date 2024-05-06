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

module.exports = router;