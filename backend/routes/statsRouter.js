const express = require('express');
const router = express.Router();
const { fetchDataFromDB, pool } = require('../db');

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

router.post('/save', async (req, res) => {
    console.log('req.body:', req.body);
    const query = `INSERT INTO user_quiz_results (user_id, quiz_id, correct_answers, incorrect_answers, started_at, completed_at)
                    VALUES ($1, $2, $3, $4,
                        (($5::timestamptz AT TIME ZONE 'UTC')::timestamp),
                        (($6::timestamptz AT TIME ZONE 'UTC')::timestamp)
                    ) RETURNING result_id`;
    const params = [req.body.user_id, req.body.quiz_id, req.body.correct_answers, req.body.incorrect_answers, req.body.start_time, req.body.end_time];
    handleRequest(req, res, query, params);
});

router.get('/user-quiz-results', async (req, res) => {
    const query = `SELECT uqr.*
                    FROM user_quiz_results uqr
                    WHERE uqr.user_id=$1`;
    const params = [req.user.id];
    handleRequest(req, res, query, params);
});

router.get('/user-quiz-results/:quiz_id', async (req, res) => {
    const query = `SELECT uqr.*
                    FROM user_quiz_results uqr
                    WHERE uqr.user_id=$1 AND uqr.quiz_id=$2`;
    const params = [req.user.id, req.params.quiz_id];
    handleRequest(req, res, query, params);
});

router.get('/quiz/:quiz_id', async (req, res) => {
    const query = `SELECT uqr.correct_answers, uqr.incorrect_answers, uqr.started_at, uqr.completed_at
                    FROM user_quiz_results uqr
                    WHERE uqr.quiz_id=$1`;
    const params = [req.params.quiz_id];
    handleRequest(req, res, query, params);
});

router.post('/rate-quiz', async (req, res) => {
    const query = `INSERT INTO quiz_ratings (user_id, quiz_id, rating)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (user_id, quiz_id)
                    DO UPDATE SET rating=EXCLUDED.rating`;
    const params = [req.user.id, req.body.quiz_id, req.body.rating];
    handleRequest(req, res, query, params);
});

module.exports = router;