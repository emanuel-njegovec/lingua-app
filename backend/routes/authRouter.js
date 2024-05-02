const express = require('express');
const router = express.Router();
const passport = require('passport');

/* function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
} */

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

module.exports = router;