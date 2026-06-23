// src/routes/index.js
import express from 'express';
const router = express.Router();

import AuthRoutes from '../modules/auth/auth.routes.js';
import PsnRoutes from '../modules/psn/psn.routes.js';
import GameRoutes from '../modules/game/game.routes.js';
import IGDBRoutes from '../modules/igdb/igdb.routes.js';
import SteamRoutes from '../modules/steam/steam.routes.js';
import ImageRoutes from '../modules/image/image.routes.js';
import SettingRoutes from '../modules/setting/setting.routes.js';
import ColecaoRoutes from '../modules/colecao/colecao.routes.js';
import ComentarioRoutes from '../modules/comentario/comentario.routes.js';

import {verifyJWT} from '../middlewares/auth.js';
import setupDatabase from '../middlewares/setupDatabase.js';

// Agrupa as rotas por prefixo
router.use(setupDatabase);

// Rotas principais 
router.use('/auth/', AuthRoutes);
router.use('/games/', verifyJWT, GameRoutes);
router.use('/images/', verifyJWT, ImageRoutes);
router.use('/setting/', verifyJWT, SettingRoutes);
router.use('/colecao/', verifyJWT, ColecaoRoutes);
router.use('/comentarios/', verifyJWT, ComentarioRoutes);

// Rotas de terceiros
router.use('/psn/', verifyJWT, PsnRoutes);
router.use('/igdb/', verifyJWT, IGDBRoutes);
router.use('/steam/', verifyJWT, SteamRoutes);

export default router;