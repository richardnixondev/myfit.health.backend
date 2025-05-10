const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { port, mongoURI } = require('./config/serverConfig');

// Middlewares
app.use(express.json());

// MongoDB Connect
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const bmiRoutes = require('./routes/bmi.routes');

// Setup routes
app.use('/api/bmi', bmiRoutes);

// routes health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app; 