import express from 'express';
const router = express.Router();
import PsnGameController from './psn.controller.js';

router.get('/search', PsnGameController.UniversalSearch);
router.get('/player/:userId', PsnGameController.GetPlayerById);
router.get('/player-basic/:userId', PsnGameController.GetPlayerByIdBasic);
router.get('/player/username/:username', PsnGameController.GetPlayerByUsername);
router.get('/games/recent', PsnGameController.GetRecentGames);
router.get('/games/owned', PsnGameController.GetOwnedGames);

export default router;
