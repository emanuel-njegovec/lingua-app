const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate("google", {
    scope: 'profile'
}));

router.get('/google/callback', passport.authenticate(
    'google', { session: true }),
    (req, res) => {
        res.redirect('http://localhost:8080/home');
    }
);

module.exports = router;