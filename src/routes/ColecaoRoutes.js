// src/routes/ColecaoRoutes.js
const express = require('express');
const router = express.Router();
const ColecaoController = require('../controllers/ColecaoController');

router.get('/', ColecaoController.getAll);
router.get('/:id', ColecaoController.getId);
router.post('/', ColecaoController.create);
router.put('/:id', ColecaoController.update);
router.delete('/', ColecaoController.remove);

module.exports = router;