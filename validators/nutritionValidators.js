exports.validateNutritionQuery = (query) => {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new Error('Invalid food query - must be a non-empty string');
    }
  };
  
  exports.validateExerciseQuery = (query) => {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new Error('Invalid exercise query - must be a non-empty string');
    }
    
    if (!query.match(/\d+\s*(min|minutes|hour|hours)/i)) {
      throw new Error('Exercise query should include duration (e.g., "ran for 30 minutes")');
    }
  };