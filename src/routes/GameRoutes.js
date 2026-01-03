// src/routes/GameRoutes.js
const express = require('express');
const router = express.Router();
const GameController = require('../controllers/GameController');

// Define as rotas para "jogos"
router.get('/',GameController.getAll);   
router.get('/:id', GameController.getById);  
router.post('/', GameController.create);
router.put('/:id', GameController.update);

module.exports = router;