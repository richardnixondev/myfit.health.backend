const axios = require('axios');
const apiConfig = require('../config/apiConfig').nutritionix;

class NutritionixService {
  constructor() {
    this.instance = axios.create({
      baseURL: apiConfig.baseUrl,
      headers: apiConfig.headers
    });
  }

  async getNutritionData(query) {
    try {
      const response = await this.instance.post(
        apiConfig.endpoints.nutrients, 
        { query }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Nutrition API Error: ${error.message}`);
    }
  }

  async searchFoods(query) {
    try {
      const response = await this.instance.get(
        apiConfig.endpoints.instantSearch, 
        { params: { query } }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Search API Error: ${error.message}`);
    }
  }

  async getExerciseData(query) {
    try {
      const response = await this.instance.post(
        apiConfig.endpoints.exercise,
        { query }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Exercise API Error: ${error.message}`);
    }
  }
}

module.exports = new NutritionixService();