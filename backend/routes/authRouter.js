const express = require('express');
const router = express.Router();
const passport = require('passport');
const { pool } = require('../db');
require('dotenv').config();

const frontendURL = process.env.FRONTEND_URL;

router.get('/google', passport.authenticate("google", {
    scope: 'profile'
}));

router.get('/google/callback', passport.authenticate(
  'google', { session: true }),
  function handleGoogleCallback(req, res) {
      res.redirect(frontendURL + '/home/');
  }
);

router.get('/logout', function handleLogout(req, res, next) {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect(frontendURL);
  });
});

router.get('/check-auth', function checkAuth(req, res) {
  if (req.isAuthenticated()) {
      res.status(200).json({ authenticated: true });
  } else {
      res.status(401).json({ authenticated: false });
  }
});

router.get('/profile', async (req, res) => {
    if (req.isAuthenticated()) {
      try {
        const { rows } = await pool.query(
          "SELECT users.username FROM users WHERE users.id=$1",
          [req.user.id]
        );
        console.log('currentUserQuery:', rows);
        res.status(200).json(rows);
      } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Error fetching data from database' });
      }
    } else {
      // User is not authenticated, respond with an empty object
      res.status(401).json({ error: 'User is not authenticated' });
    }
});

module.exports = router;