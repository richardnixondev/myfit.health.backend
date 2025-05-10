const mongoose = require('mongoose');

const BMISchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 1, max: 120 },
  weight: { type: Number, required: true, min: 20, max: 300 }, // em kg
  height: { type: Number, required: true, min: 100, max: 250 }, // em cm
  gender: { type: String, enum: ['male', 'female', 'other'] },
  bmiValue: { type: Number },
  bmiCategory: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Middleware to calc the BMI before save
BMISchema.pre('save', function(next) {
  this.bmiValue = calculateBMI(this.weight, this.height);
  this.bmiCategory = getBMICategory(this.bmiValue);
  next();
});

// The BMI calc
function calculateBMI(weightKg, heightCm) {
  const heightMeters = heightCm / 100;
  return (weightKg / (heightMeters * heightMeters)).toFixed(1);
}

//  BMI Classification
function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi < 25) return 'Normal weight';
  if (bmi >= 25 && bmi < 30) return 'Overweight';
  return 'Obesity';
}

module.exports = mongoose.model('BMI', BMISchema);