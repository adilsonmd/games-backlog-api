const express = require('express');
const router = express.Router();
const SettingController = require('./setting.controller');

router.get('/', SettingController.getAll);
router.get('/:id', SettingController.getById);
router.post('/', SettingController.create);
router.put('/:id', SettingController.update);
router.get('/get/:key', SettingController.getSetting);

module.exports = router;
