const express = require('express');
const router = express.Router();
const NintendoController = require('../controllers/NintendoController');

// Define as rotas para "jogos"
router.get('/login', NintendoController.GetNSOLogin);
router.post('/token-code', NintendoController.getSessionTokenCode);
router.post('/token', NintendoController.getSessionToken);

module.exports = router;