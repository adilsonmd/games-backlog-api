import express from 'express';
const router = express.Router();
import SettingController from './setting.controller.js';

router.get('/', SettingController.getAll);
router.get('/:id', SettingController.getById);
router.post('/', SettingController.create);
router.put('/:id', SettingController.update);
router.get('/get/:key', SettingController.getSetting);

export default router;
