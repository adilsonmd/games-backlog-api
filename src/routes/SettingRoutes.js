// src/routes/SettingRoutes.js
const express = require('express');
const router = express.Router();
const SettingController = require('../controllers/SettingController');

// Define as rotas para "jogos"
router.get('/', SettingController.getAll);
router.get('/:id', SettingController.getById);
router.post('/', SettingController.create);
router.put('/:id', SettingController.update);

module.exports = router;