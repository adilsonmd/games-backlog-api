import express from 'express';
const router = express.Router();
import AuthController from './auth.controller.js';

// Define as rotas para autenticacao
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

export default router;
