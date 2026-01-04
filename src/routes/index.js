// src/routes/index.js
const express = require('express');
const router = express.Router();
const PsnRoutes = require('./PsnRoutes');
const AuthRoutes = require('./AuthRoutes');
const GameRoutes = require('./GameRoutes');
const SteamRoutes = require('./SteamRoutes');
const ImageRoutes = require('./ImageRoutes');
const SettingRoutes = require('./SettingRoutes');
const ComentarioRoutes = require('./ComentarioRoutes');

const authMiddleware = require('../middlewares/auth');
const setupDatabase = require('../middlewares/setupDatabase');

// Agrupa as rotas por prefixo
router.use(setupDatabase);

router.use('/auth/', AuthRoutes);

// Rotas principais 
router.use('/games/', authMiddleware, GameRoutes);
router.use('/images/', authMiddleware, ImageRoutes);
router.use('/setting/', authMiddleware, SettingRoutes);
router.use('/comentarios/', authMiddleware, ComentarioRoutes);

// Rotas de terceiros
router.use('/psn/', authMiddleware, PsnRoutes);
router.use('/steam/', authMiddleware, SteamRoutes);

module.exports = router;