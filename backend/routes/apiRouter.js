const express = require('express');
const router = express.Router();
const { fetchDataFromDB, pool } = require('../db');
const multer = require('multer');
const { bucket } = require('../firebase');
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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