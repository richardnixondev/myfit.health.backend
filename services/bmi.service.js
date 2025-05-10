const BMIModel = require('../models/bmi.model');

module.exports = {
  async createBMIRecord(data) {
    return await BMIModel.create(data);
  },

  async getBMIRecord(id) {
    return await BMIModel.findById(id);
  },

  async getAllBMIRecords(filter = {}) {
    return await BMIModel.find(filter).sort({ createdAt: -1 });
  },

  async updateBMIRecord(id, data) {
    return await BMIModel.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteBMIRecord(id) {
    return await BMIModel.findByIdAndDelete(id);
  },

  async calculateBMI(weight, height) {
    const heightMeters = height / 100;
    return (weight / (heightMeters * heightMeters)).toFixed(1);
  }
};