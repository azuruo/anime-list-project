const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Anime = require('../models/anime');
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/google');
}

router.get('/', function (req, res, next) {
  console.log(req.user);
  res.render('index', {
    user: req.user || {},
  });
});
router.get('/profile', ensureAuthenticated, async (req, res) => {
  const user = await User.findById(req.user.id);
  const animeList = user.animeList ? await Anime.find({ _id: { $in: user.animeList } }) : [];
  res.render('profile', {
    user: req.user,
    animeList,
  });
});

router.get('/search', async (req, res) => {
  const searchQuery = req.query.query;

  // Use a regex for a case-insensitive and partial match search
  const results = await Anime.find({ title: new RegExp(searchQuery, 'i') });

  res.render('searchResults', { animeList: results }) // Render a view with the results or send the results as needed
});

module.exports = router;
