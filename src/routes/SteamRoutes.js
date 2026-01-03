// src/routes/jogoRoutes.js
const express = require('express');
const router = express.Router();
const SteamGameController = require('../controllers/SteamGameController');

// Define as rotas para "jogos"
router.get('/player',SteamGameController.SteamPlayerInfo);   
router.get('/games', SteamGameController.SteamAllGames);  
router.post('/games', SteamGameController.SteamCreateGame);

module.exports = router;