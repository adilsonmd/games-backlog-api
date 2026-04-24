const express = require('express');
const router = express.Router();
const ComentarioController = require('./comentario.controller');

router.get('/:gameId', ComentarioController.getComentario);
router.post('/', ComentarioController.create);

module.exports = router;
