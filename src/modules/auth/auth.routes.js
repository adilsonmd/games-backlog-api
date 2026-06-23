const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');

// Define as rotas para autenticacao
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

module.exports = router;
