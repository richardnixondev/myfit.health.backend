// routes/bmi.routes.js
const express = require('express');
const router = express.Router();
const bmiController = require('../controllers/bmi.controller');

// CRUD Routes
router.post('/', bmiController.createRecord);
router.get('/', bmiController.getAllRecords);
router.get('/:id', bmiController.getRecord);
router.put('/:id', bmiController.updateRecord);
router.delete('/:id', bmiController.deleteRecord);

// Rota adicional apenas para cálculo (sem armazenar)
router.post('/calculate', bmiController.calculate);

module.exports = router;