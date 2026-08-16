// middleware/errorHandler.js
// Express recognises error-handling middleware by its four parameters:
// err, req, res, and next. This catches errors passed via next(err)
// anywhere in the app and returns a consistent, safe response.

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  // A secure API should not expose stack traces, file paths, database
  // details, or internal implementation details to the client.
  res.status(500).json({
    error: 'Something went wrong'
  });
};

module.exports = errorHandler;
