const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Une erreur est survenue' });
  };
  
  module.exports = errorHandler;
  