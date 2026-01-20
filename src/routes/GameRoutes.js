// src/routes/GameRoutes.js
const express = require('express');
const router = express.Router();
const GameController = require('../controllers/GameController');

// Define as rotas para "jogos"
router.get('/dashboard/', GameController.getDashboardData);
router.get('/wishlist/', GameController.getWishlist);   
router.get('/playing/', GameController.getPlayingGames);   

router.get('/', GameController.getAll);   
router.get('/:id', GameController.getById);  
router.post('/', GameController.create);
router.put('/:id', GameController.update);
router.delete('/', GameController.removeDuplicates); // Comentar depois

module.exports = router;