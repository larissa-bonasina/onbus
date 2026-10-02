const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const avisosController = require('../controllers/avisosController');
const { verificarAutenticado } = require('../middleware/verificarAluno');
const { verificarAdmin } = require('../middleware/verificarAdmin');
const { handleValidation } = require('../middleware/validate');

const avisoValidation = [
  body('titulo').trim().isLength({ min: 3, max: 120 }).withMessage('O título deve ter entre 3 e 120 caracteres.'),
  body('mensagem').trim().isLength({ min: 3, max: 2000 }).withMessage('A mensagem deve ter entre 3 e 2000 caracteres.'),
];

// Alunos leem; só a associação publica e remove.
router.get('/', verificarAutenticado, avisosController.listar);
router.post('/', verificarAdmin, avisoValidation, handleValidation, avisosController.criar);
router.delete('/:id', verificarAdmin, avisosController.remover);

module.exports = router;
