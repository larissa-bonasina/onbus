const { validationResult } = require('express-validator');

// Roda depois das validation chains de cada rota; se algo falhou, corta com 400
// antes de chegar no controller.
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Dados inválidos.', errors: errors.array() });
  }
  next();
}

module.exports = { handleValidation };
