export function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  if (err.name === 'SqliteError') {
    return res.status(400).json({
      error: 'Database error',
      message: err.message
    });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
}
