const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

router.get('/', usersController.index);
router.get('/profile', ensureAuthenticated, usersController.profile);
router.get('/search', usersController.searchAnime);

module.exports = router;
