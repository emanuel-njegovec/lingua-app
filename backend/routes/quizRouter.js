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


router.get('/all', async (req, res) => {
    const query = "SELECT * FROM quizzes";
    const params = null;
    handleRequest(req, res, query, params);
});

router.get('/:quiz_id', async (req, res) => {
    const query = "SELECT * FROM quizzes WHERE quiz_id=$1";
    const query_multiple_choice = `SELECT questions.*, multiple_choice_questions.*
                    FROM questions 
                    JOIN multiple_choice_questions ON questions.question_id = multiple_choice_questions.question_id
                    AND questions.q_type='multiple_choice'
                    WHERE questions.quiz_id=$1`;
    const query_write_in = `SELECT questions.*, write_in_questions.*
                    FROM questions
                    JOIN write_in_questions ON questions.question_id = write_in_questions.question_id
                    AND questions.q_type='write_in'
                    WHERE questions.quiz_id=$1`;
    const query_fill_in =`SELECT questions.*, fill_in_questions.*
                    FROM questions
                    JOIN fill_in_questions ON questions.question_id = fill_in_questions.question_id
                    AND questions.q_type='fill_in'
                    WHERE questions.quiz_id=$1`;
    const params = [req.params.quiz_id];
    if (req.isAuthenticated()) {
        try {
            const data_quiz = await fetchDataFromDB(query, params);
            const data_multiple_choice = await fetchDataFromDB(query_multiple_choice, params);
            const data_write_in = await fetchDataFromDB(query_write_in, params);
            const data_fill_in = await fetchDataFromDB(query_fill_in, params);
            const data = {
                quiz_name: data_quiz[0].quiz_name,
                quiz_description: data_quiz[0].description,
                multiple_choice: data_multiple_choice,
                write_in: data_write_in,
                fill_in: data_fill_in
            };
            res.json(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(401).json({ error: 'User is not authenticated' });
    }
});

router.post('/', async (req, res) => {
    const query = "INSERT INTO quizzes (user_id) VALUES ($1) RETURNING quiz_id";
    const params = [req.user.id];
    handleRequest(req, res, query, params);
});

router.put('/:quiz_id', async (req, res) => {
    if (req.isAuthenticated()) {
        //console.log(req.body, req.params.quiz_id);
        try {
            for (let el in req.body) {
                console.log('el:', el);
                console.log('req.body[el]:', req.body[el]);
                await pool.query(
                    `UPDATE quizzes SET ${el}=$1 WHERE quiz_id=$2`,
                    [req.body[el], req.params.quiz_id]
                );
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

router.delete('/:quiz_id', async (req, res) => {
    try {
        await pool.query("DELETE FROM quizzes WHERE quiz_id=$1", [req.params.quiz_id]);
        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ error: 'Error deleting quiz' });
    }
});

module.exports = router;