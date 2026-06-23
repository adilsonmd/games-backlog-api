import express from 'express';
const router = express.Router();
import SteamGameController from './steam.controller.js';

router.get('/games', SteamGameController.SteamAllGames);
router.get('/games/:id', SteamGameController.SteamGameById);
router.get('/player', SteamGameController.getPlayerSummary);
router.get('/recent-games', SteamGameController.getRecentPlayedGame);

export default router;
