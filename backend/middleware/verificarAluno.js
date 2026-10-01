const jwt = require('jsonwebtoken');

// Exige um token válido (de aluno ou admin) e disponibiliza os dados em req.user.
// Quem precisa também restringir a um dono específico (ex.: só o próprio CPF)
// faz essa checagem depois, usando req.user.cpf / req.user.role.
const verificarAutenticado = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token malformado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
    req.user = decoded;
    next();
  });
};

// Permite passar se for admin OU se o :cpf da rota for o mesmo do token.
const verificarDonoOuAdmin = (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?.cpf === req.params.cpf) {
    return next();
  }
  return res.status(403).json({ message: 'Acesso negado.' });
};

module.exports = { verificarAutenticado, verificarDonoOuAdmin };
