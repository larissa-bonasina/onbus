const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const { verificarAutenticado, verificarDonoOuAdmin } = require('../middleware/verificarAluno');
const { verificarAdmin } = require('../middleware/verificarAdmin');
const { handleValidation } = require('../middleware/validate');

const cadastroValidation = [
  body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('senha').isLength({ min: 6 }).withMessage('A senha deve ter ao menos 6 caracteres.'),
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('curso').trim().notEmpty().withMessage('Curso é obrigatório.'),
  body('cpf').matches(/^\d{11}$/).withMessage('CPF deve ter 11 dígitos numéricos.'),
  body('numero').trim().notEmpty().withMessage('Número é obrigatório.'),
  body('endereco').trim().notEmpty().withMessage('Endereço é obrigatório.'),
];

const loginValidation = [
  body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('senha').notEmpty().withMessage('Senha é obrigatória.'),
];

router.post('/cadastro', cadastroValidation, handleValidation, alunoController.cadastrarAluno);

router.post('/login', loginValidation, handleValidation, alunoController.loginAluno);

// Lista completa (com hash de senha) é uma ação de admin, não pública.
router.get('/', verificarAdmin, alunoController.listarAlunos);

router.get('/:cpf', verificarAutenticado, verificarDonoOuAdmin, alunoController.obterAluno);

const atualizacaoValidation = [
  body('email').optional().isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('nome').optional().trim().notEmpty().withMessage('Nome não pode ficar vazio.'),
  body('numero').optional().trim().notEmpty().withMessage('Telefone não pode ficar vazio.'),
  body('endereco').optional().trim().notEmpty().withMessage('Endereço não pode ficar vazio.'),
  body('curso').optional().trim().notEmpty().withMessage('Curso não pode ficar vazio.'),
];

router.put('/:cpf', verificarAutenticado, verificarDonoOuAdmin, atualizacaoValidation, handleValidation, alunoController.atualizarAluno);

router.delete('/:cpf', verificarAdmin, alunoController.deletarAluno);

module.exports = router;
