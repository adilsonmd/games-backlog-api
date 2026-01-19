// src/routes/GameRoutes.js
const express = require('express');
const router = express.Router();
const IGDBController = require('../controllers/IGDBController');

// Define as rotas para "imagens"
router.get('/game', IGDBController.searchGame);
router.get('/game/play-time', IGDBController.getPlayTimes);

module.exports = router;