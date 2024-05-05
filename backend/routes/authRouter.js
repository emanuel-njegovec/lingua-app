const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../db');


router.get('/google', passport.authenticate("google", {
    scope: 'profile'
}));

router.get('/google/callback', passport.authenticate(
    'google', { session: true }),
    (req, res) => {
        res.redirect('http://localhost:8080/home/');
    }
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
      // User is authenticated, respond with authenticated status
      res.json({ authenticated: true });
    } else {
      // User is not authenticated, respond with unauthenticated status
      res.json({ authenticated: false });
    }}
);

router.get('/user-data', async (req, res) => {
    if (req.isAuthenticated()) {
      try {
        const { rows } = await pool.query(
          "SELECT users.username, quizzes.* FROM users JOIN quizzes ON users.id = quizzes.user_id WHERE users.id=$1",
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