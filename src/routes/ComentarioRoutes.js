// src/routes/GameRoutes.js
const express = require('express');
const router = express.Router();
const ComentarioController = require('../controllers/ComentarioController');

// Define as rotas para "jogos"
router.get('/:gameId', ComentarioController.getComentario);
router.post('/', ComentarioController.create);

module.exports = router;