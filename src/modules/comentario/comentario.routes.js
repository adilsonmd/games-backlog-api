import express from 'express';
const router = express.Router();
import ComentarioController from './comentario.controller.js';

router.get('/:gameId', ComentarioController.getComentario);
router.post('/', ComentarioController.create);

export default router;
