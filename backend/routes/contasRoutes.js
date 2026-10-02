const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const contasController = require('../controllers/contasController');
const { verificarAutenticado } = require('../middleware/verificarAluno');
const { verificarAdmin } = require('../middleware/verificarAdmin');
const { handleValidation } = require('../middleware/validate');

const despesaValidation = [
  body('descricao').trim().isLength({ min: 2, max: 140 }).withMessage('Descreva a despesa (até 140 caracteres).'),
  body('valor').isFloat({ gt: 0 }).withMessage('O valor deve ser maior que zero.'),
  body('data').isISO8601({ strict: true }).withMessage('Data inválida.'),
];

// Transparência: qualquer aluno logado consulta; só a associação lança e remove.
router.get('/', verificarAutenticado, contasController.listar);
router.post('/', verificarAdmin, despesaValidation, handleValidation, contasController.criar);
router.delete('/:id', verificarAdmin, contasController.remover);

module.exports = router;
