// src/routes/index.js
const express = require('express');
const router = express.Router();
const PsnRoutes = require('./PsnRoutes');
const GameRoutes = require('./GameRoutes');
const SteamRoutes = require('./SteamRoutes');
const ImageRoutes = require('./ImageRoutes');
const SettingRoutes = require('./SettingRoutes');
const ComentarioRoutes = require('./ComentarioRoutes');

// Agrupa as rotas por prefixo

// Rotas principais
router.use('/games/', GameRoutes);
router.use('/setting/', SettingRoutes);
router.use('/images/', ImageRoutes);
router.use('/comentarios/', ComentarioRoutes);

// Rotas de terceiros
router.use('/psn/', PsnRoutes);
router.use('/steam/', SteamRoutes);

module.exports = router;