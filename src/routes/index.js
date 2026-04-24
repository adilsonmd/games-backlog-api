// src/routes/index.js
const express = require('express');
const router = express.Router();

const PsnRoutes = require('../modules/psn/psn.routes');
const AuthRoutes = require('../modules/auth/auth.routes');
const GameRoutes = require('../modules/game/game.routes');
const IGDBRoutes = require('../modules/igdb/igdb.routes');
const SteamRoutes = require('../modules/steam/steam.routes');
const ImageRoutes = require('../modules/image/image.routes');
const SettingRoutes = require('../modules/setting/setting.routes');
const ColecaoRoutes = require('../modules/colecao/colecao.routes');
const ComentarioRoutes = require('../modules/comentario/comentario.routes');

const authMiddleware = require('../middlewares/auth');
const setupDatabase = require('../middlewares/setupDatabase');

// Agrupa as rotas por prefixo
router.use(setupDatabase);

router.use('/auth/', AuthRoutes);

// Rotas principais 
router.use('/games/', authMiddleware, GameRoutes);
router.use('/images/', authMiddleware, ImageRoutes);
router.use('/setting/', authMiddleware, SettingRoutes);
router.use('/colecao/', authMiddleware, ColecaoRoutes);
router.use('/comentarios/', authMiddleware, ComentarioRoutes);

// Rotas de terceiros
router.use('/psn/', authMiddleware, PsnRoutes);
router.use('/igdb/', authMiddleware, IGDBRoutes);
router.use('/steam/', authMiddleware, SteamRoutes);

module.exports = router;