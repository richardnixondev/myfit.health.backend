const bmiService = require('../services/bmi.service');

module.exports = {
  async createRecord(req, res) {
    try {
      const { name, age, weight, height, gender } = req.body;
      
      if (!name || !age || !weight || !height) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newRecord = await bmiService.createBMIRecord({
        name,
        age,
        weight,
        height,
        gender
      });

      res.status(201).json(newRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getRecord(req, res) {
    try {
      const record = await bmiService.getBMIRecord(req.params.id);
      if (!record) {
        return res.status(404).json({ error: 'Record not found' });
      }
      res.json(record);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllRecords(req, res) {
    try {
      const records = await bmiService.getAllBMIRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateRecord(req, res) {
    try {
      const updatedRecord = await bmiService.updateBMIRecord(
        req.params.id,
        req.body
      );
      if (!updatedRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }
      res.json(updatedRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteRecord(req, res) {
    try {
      const deletedRecord = await bmiService.deleteBMIRecord(req.params.id);
      if (!deletedRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }
      res.json({ message: 'Record deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async calculate(req, res) {
    try {
      const { weight, height } = req.body;
      if (!weight || !height) {
        return res.status(400).json({ error: 'Weight and height are required' });
      }

      const bmiValue = await bmiService.calculateBMI(weight, height);
      const bmiCategory = getBMICategory(bmiValue);

      res.json({ bmiValue, bmiCategory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// Função auxiliar (também pode ser movida para o serviço)
function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi < 25) return 'Normal weight';
  if (bmi >= 25 && bmi < 30) return 'Overweight';
  return 'Obesity';
}