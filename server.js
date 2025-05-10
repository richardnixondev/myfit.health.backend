const express = require('express');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();
const PORT = 3000;

// Path to our data file (now in root)
const DATA_FILE = path.join(__dirname, 'bmiData.json');

// Middleware to parse JSON requests
app.use(express.json());

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

/**
 * Helper function to read BMI data from file
 */
function readData() {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading data file:', error);
    return [];
  }
}

/**
 * Helper function to write BMI data to file
 */
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data file:', error);
  }
}

/**
 * Calculate BMI based on weight (kg) and height (cm)
 */
function calculateBMI(weight, height) {
  const heightMeters = height / 100;
  return (weight / (heightMeters * heightMeters)).toFixed(2);
}

/**
 * Determine BMI category based on BMI value
 */
function getBMICategory(bmi) {
  const bmiNum = parseFloat(bmi);
  if (bmiNum < 18.5) return 'Underweight';
  if (bmiNum < 25) return 'Normal weight';
  if (bmiNum < 30) return 'Overweight';
  return 'Obesity';
}

/**
 * Determine activity level description
 */
function getActivityDescription(level) {
  const levels = {
    sedentary: 'Little or no exercise',
    light: 'Light exercise 1-3 days/week',
    moderate: 'Moderate exercise 3-5 days/week',
    active: 'Hard exercise 6-7 days/week',
    extreme: 'Very hard exercise and physical job'
  };
  return levels[level.toLowerCase()] || 'Unknown activity level';
}

// Routes

/**
 * POST /bmi - Create a new BMI record
 */
app.post('/bmi', (req, res) => {
  try {
    const { name, age, weight, height, gender, activityLevel } = req.body;
    
    // Basic validation
    if (!name || !age || !weight || !height || !gender || !activityLevel) {
      return res.status(400).json({ 
        error: 'Missing fields. Please provide: name, age, weight, height, gender, activityLevel' 
      });
    }

    // Calculate values
    const bmiValue = calculateBMI(weight, height);
    const bmiCategory = getBMICategory(bmiValue);
    const activityDescription = getActivityDescription(activityLevel);

    // Create new record
    const newRecord = {
      id: Date.now(), // Simple ID generation
      name,
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseFloat(height),
      gender,
      activityLevel,
      activityDescription,
      bmiValue,
      bmiCategory,
      createdAt: new Date().toISOString()
    };

    // Save to file
    const records = readData();
    records.push(newRecord);
    writeData(records);

    res.status(201).json({
      message: 'BMI record created successfully',
      record: newRecord
    });
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Failed to create BMI record' });
  }
});

/**
 * GET /bmi - Get all BMI records
 */
app.get('/bmi', (req, res) => {
  try {
    const records = readData();
    res.json({
      count: records.length,
      records
    });
  } catch (error) {
    console.error('Error reading records:', error);
    res.status(500).json({ error: 'Failed to retrieve BMI records' });
  }
});

/**
 * GET /bmi/:id - Get a specific BMI record
 */
app.get('/bmi/:id', (req, res) => {
  try {
    const records = readData();
    const record = records.find(r => r.id === parseInt(req.params.id));
    
    if (!record) {
      return res.status(404).json({ error: 'BMI record not found' });
    }
    
    res.json(record);
  } catch (error) {
    console.error('Error finding record:', error);
    res.status(500).json({ error: 'Failed to retrieve BMI record' });
  }
});

/**
 * PUT /bmi/:id - Update a BMI record
 */
app.put('/bmi/:id', (req, res) => {
  try {
    const { name, age, weight, height, gender, activityLevel } = req.body;
    const records = readData();
    const recordIndex = records.findIndex(r => r.id === parseInt(req.params.id));
    
    if (recordIndex === -1) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // keep same values if it's not chance.
    const updatedRecord = {
      ...records[recordIndex],
      name: name || records[recordIndex].name,
      age: age || records[recordIndex].age,
      weight: weight || records[recordIndex].weight,
      height: height || records[recordIndex].height,
      gender: gender || records[recordIndex].gender,
      activityLevel: activityLevel || records[recordIndex].activityLevel,
      updatedAt: new Date().toISOString()
    };

    // redo BMi if needs
    if (weight || height) {
      updatedRecord.bmiValue = calculateBMI(
        weight || records[recordIndex].weight,
        height || records[recordIndex].height
      );
      updatedRecord.bmiCategory = getBMICategory(updatedRecord.bmiValue);
    }

    if (activityLevel) {
      updatedRecord.activityDescription = getActivityDescription(activityLevel);
    }

    records[recordIndex] = updatedRecord;
    writeData(records);

    res.json({
      message: 'Record updated successfully',
      record: updatedRecord
    });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
});


/**
 * DELETE /bmi/:id - Delete a BMI record
 */
app.delete('/bmi/:id', (req, res) => {
  try {
    const records = readData();
    const initialLength = records.length;
    
    // Filter out the record with matching ID
    const updatedRecords = records.filter(r => r.id !== parseInt(req.params.id));
    
    // If no record was deleted
    if (updatedRecords.length === initialLength) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    // Save the updated records
    writeData(updatedRecords);
    
    res.json({ 
      message: 'Record deleted successfully',
      deletedId: parseInt(req.params.id)
    });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`BMI API running at http://localhost:${PORT}`);
  console.log(`Data file location: ${DATA_FILE}`);
});