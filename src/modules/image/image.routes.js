const express = require('express');
const router = express.Router();
const ImageController = require('./image.controller');

// Define as rotas para imagens
router.get('/game/:id', ImageController.getImagesForGame);
router.post('/', ImageController.create);
router.delete('/:id', ImageController.remove);

module.exports = router;
