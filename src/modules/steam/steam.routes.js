const express = require('express');
const router = express.Router();
const SteamGameController = require('./steam.controller');

router.get('/games', SteamGameController.SteamAllGames);
router.get('/games/:id', SteamGameController.SteamGameById);
router.get('/player', SteamGameController.getPlayerSummary);
router.get('/recent-games', SteamGameController.getRecentPlayedGame);

module.exports = router;
