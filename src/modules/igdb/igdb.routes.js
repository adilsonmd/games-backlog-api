const express = require('express');
const router = express.Router();
const IGDBController = require('./igdb.controller');

router.get('/game', IGDBController.searchGame);
router.get('/play-time/:id', IGDBController.getPlayTimes);

module.exports = router;
