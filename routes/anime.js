const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

router.get('/', animeController.getAllAnime);
router.post('/', ensureAuthenticated, animeController.createAnime);
router.get('/:animeId', animeController.getAnimeById);
router.patch('/:animeId', ensureAuthenticated, animeController.updateAnime);
router.delete('/:animeId', ensureAuthenticated, animeController.deleteAnime);
router.post('/add-to-my-list/:animeId', ensureAuthenticated, animeController.addToMyList);
router.delete('/remove-from-my-list/:animeId', ensureAuthenticated, animeController.removeFromMyList);
router.get('/search', animeController.searchAnime);

module.exports = router;