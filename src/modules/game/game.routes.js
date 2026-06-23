import express from 'express';
const router = express.Router();
import GameController from './game.controller.js';

// Define as rotas para jogos
router.get('/dashboard/', GameController.getDashboardData);
router.get('/wishlist/', GameController.getWishlist);
router.get('/status/', GameController.getByStatus);
router.get('/', GameController.getAll);
router.get('/:id', GameController.getById);
router.post('/', GameController.create);
router.put('/:id', GameController.update);
router.delete('/', GameController.removeDuplicates); // Comentar depois

export default router;
