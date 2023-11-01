const express = require('express');
const router = express.Router();
const Anime = require('../models/anime');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// GET: Fetch all anime
router.get('/', async (req, res) => {
  try {
    const animeList = await Anime.find({ userId: req.user.id });
    res.json(animeList);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// POST: Create a new anime
router.post('/', ensureAuthenticated, async (req, res) => {
  const anime = new Anime({
    title: req.body.title,
    genre: req.body.genre,
    description: req.body.description,
    rating: req.body.rating,
    userId: req.user.id
  });

  try {
    const savedAnime = await anime.save();
    res.json(savedAnime);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// GET: Fetch a specific anime by ID
router.get('/:animeId', async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.animeId);
    res.json(anime);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// PATCH: Update an anime by ID
router.patch('/:animeId', ensureAuthenticated, async (req, res) => {
  try {
    const updatedAnime = await Anime.updateOne(
      { _id: req.params.animeId },
      { $set: req.body }
    );
    res.json(updatedAnime);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// DELETE: Delete an anime by ID
router.delete('/:animeId', ensureAuthenticated, async (req, res) => {
  try {
    const removedAnime = await Anime.remove({ _id: req.params.animeId });
    res.json(removedAnime);
  } catch (err) {
    res.json({ message: err.message });
  }
});
// Search an Anime
router.get('/search', async (req, res) => {
  const query = req.query.q;
  const animeList = await Anime.find({ title: new RegExp(query, 'i') });
  res.render('search', { animeList, query });
});

module.exports = router;
