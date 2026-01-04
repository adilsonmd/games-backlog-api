const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Define as rotas para autenticação
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

module.exports = router;