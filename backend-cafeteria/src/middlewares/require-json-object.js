function requireJsonObject(req, res, next) {
  if (
    req.body === null ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body)
  ) {
    return res.status(400).json({ error: 'El cuerpo debe ser un objeto JSON' });
  }

  return next();
}

module.exports = requireJsonObject;
