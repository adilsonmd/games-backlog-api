// src/routes/jogoRoutes.js
const express = require('express');
const router = express.Router();
const PsnGameController = require('../controllers/PsnGameController');

// Define as rotas para "jogos"
router.get('/search', PsnGameController.UniversalSearch);
router.get('/player/:userId', PsnGameController.GetPlayerById)
router.get('/player-basic/:userId', PsnGameController.GetPlayerByIdBasic)
router.get('/player/username/:username', PsnGameController.GetPlayerByUsername)
router.get('/games/recent', PsnGameController.GetRecentGames), 
router.get('/games/owned', PsnGameController.GetOwnedGames), 
module.exports = router;