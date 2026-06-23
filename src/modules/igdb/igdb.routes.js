import express from 'express';
const router = express.Router();
import IGDBController from './igdb.controller.js';

router.get('/game', IGDBController.searchGame);
router.get('/play-time/:id', IGDBController.getPlayTimes);

export default router;
