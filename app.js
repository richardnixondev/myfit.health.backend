const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Error handling
app.use(errorHandler);

module.exports = app;