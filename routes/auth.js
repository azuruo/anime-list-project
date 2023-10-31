const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        // Optionally, you can also destroy the session here.
        req.session.destroy((err) => {
            // Ensure user is logged out and session is destroyed before redirecting.
            res.redirect('/');
        });
    });
});
module.exports = router;