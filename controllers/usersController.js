const User = require('../models/user');
const Anime = require('../models/anime');

exports.index = (req, res) => {
  console.log(req.user);
  res.render('index', {
    user: req.user || {},
  });
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const animeList = user.animeList ? await Anime.find({ _id: { $in: user.animeList } }) : [];
    res.render('profile', {
      user: req.user,
      animeList,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchAnime = async (req, res) => {
  try {
    const searchQuery = req.query.query;
    const message = req.query.message;
    const results = await Anime.find({ title: new RegExp(searchQuery, 'i') });
    res.render('searchResults', { animeList: results, message: message, user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};