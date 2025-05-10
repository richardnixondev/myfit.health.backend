const nutritionixService = require('../services/nutritionixService');
const { validateNutritionQuery, validateExerciseQuery } = require('../validators/nutritionValidators');

exports.getFoodData = async (req, res, next) => {
  try {
    const { query } = req.body;
    validateNutritionQuery(query);
    
    const nutritionData = await nutritionixService.getNutritionData(query);
    res.json(nutritionData);
  } catch (error) {
    next(error);
  }
};

exports.searchFoods = async (req, res, next) => {
  try {
    const { query } = req.query;
    validateNutritionQuery(query);
    
    const searchResults = await nutritionixService.searchFoods(query);
    res.json(searchResults);
  } catch (error) {
    next(error);
  }
};

exports.getExerciseData = async (req, res, next) => {
  try {
    const { query } = req.body;
    validateExerciseQuery(query);
    
    const exerciseData = await nutritionixService.getExerciseData(query);
    res.json(exerciseData);
  } catch (error) {
    next(error);
  }
};