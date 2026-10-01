const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const { verificarAdmin } = require('../middleware/verificarAdmin'); // Middleware para verificar se o usuário é administrador
const { handleValidation } = require('../middleware/validate');
const router = express.Router();

const loginValidation = [
  body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('password').notEmpty().withMessage('Senha é obrigatória.'),
];

const gerarBoletoValidation = [
  body('aluno.cpf').matches(/^\d{11}$/).withMessage('CPF do aluno inválido.'),
  body('valor').isFloat({ gt: 0 }).withMessage('Valor deve ser um número maior que zero.'),
  body('vencimento').isISO8601().withMessage('Data de vencimento inválida.'),
];

// Login de administrador
router.post('/login', loginValidation, handleValidation, adminController.loginAdmin);

// Rota para gerar boleto (apenas para administradores autenticados)
router.post('/gerar-boleto', verificarAdmin, gerarBoletoValidation, handleValidation, adminController.gerarBoleto);

// Prestação de contas (apenas para administradores autenticados)
router.get('/contas', verificarAdmin, adminController.visualizarContas);
router.put('/contas/:id', verificarAdmin, adminController.atualizarContas);

module.exports = router;

