const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const verificarAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Obtem o cabeçalho Authorization

  if (!authHeader) {
    return res.status(403).json({ message: 'Token não fornecido' });
  }

  // Verifica se o token segue o formato "Bearer <token>"
  const token = authHeader.split(' ')[1]; // Extrai o token após "Bearer"
  if (!token) {
    return res.status(403).json({ message: 'Token malformado' });
  }

  // Verifica o token usando a chave secreta
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }

    // Verifica se o papel do usuário é "admin"
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Privilégios insuficientes.' });
    }

    next(); // Token válido, continua a execução
  });
};

module.exports = { verificarAdmin };
