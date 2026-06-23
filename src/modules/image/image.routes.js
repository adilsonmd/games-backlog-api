import express from 'express';
const router = express.Router();
import ImageController from './image.controller.js';

// Define as rotas para imagens
router.get('/game/:id', ImageController.getImagesForGame);
router.post('/', ImageController.create);
router.delete('/:id', ImageController.remove);

export default router;
