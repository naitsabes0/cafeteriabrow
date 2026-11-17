function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  if (status >= 500) {
    console.error(error);
  }

  return res.status(status).json({
    error: status >= 500 ? 'Error interno del servidor' : error.message
  });
}

module.exports = errorHandler;
