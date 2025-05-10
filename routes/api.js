const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');
const cors = require('cors');


app.use(cors({
    origin: 'http://localhost:5173', // Vite ports default
    credentials: true
  }));

// Nutrition endpoints
router.post('/nutrition', nutritionController.getFoodData);
router.get('/search', nutritionController.searchFoods);
router.post('/exercise', nutritionController.getExerciseData);

module.exports = router;

