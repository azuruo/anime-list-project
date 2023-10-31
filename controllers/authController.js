const passport = require('passport');

exports.authenticateGoogle = passport.authenticate('google', {
    scope: ['profile', 'email']
});

exports.authenticateGoogleRedirect = passport.authenticate('google');

exports.googleRedirect = (req, res) => {
    res.redirect('/');
};
