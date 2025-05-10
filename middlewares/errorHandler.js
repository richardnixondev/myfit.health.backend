function errorHandler(err, req, res, next) {
    console.error(err.stack);
    
    const apiErrors = {
      'Nutrition API Error': 502,
      'Search API Error': 502,
      'Exercise API Error': 502,
      'Invalid food query': 400,
      'Invalid exercise query': 400
    };
  
    const statusCode = apiErrors[err.message.split(':')[0]] || 500;
  
    res.status(statusCode).json({ 
      error: err.message.includes('API Error') 
        ? 'Error communicating with external API' 
        : err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
  
  module.exports = errorHandler;