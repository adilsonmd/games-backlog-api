import express from 'express';
const router = express.Router();
import ColecaoController from './colecao.controller.js';

router.get('/', ColecaoController.getAll);
router.get('/:id', ColecaoController.getId);
router.post('/', ColecaoController.create);
router.put('/:id', ColecaoController.update);
router.delete('/', ColecaoController.remove);

export default router;
