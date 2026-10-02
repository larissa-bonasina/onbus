const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const checkinController = require('../controllers/checkinController');
const { verificarAutenticado } = require('../middleware/verificarAluno');
const { verificarAdmin } = require('../middleware/verificarAdmin');
const { handleValidation } = require('../middleware/validate');

// O aluno usa o CPF do próprio token; o CPF no corpo só vale para o admin.
const cpfValidation = [body('cpf').optional().matches(/^\d{11}$/).withMessage('CPF inválido.')];

router.post('/checkin', verificarAutenticado, cpfValidation, handleValidation, checkinController.checkin);
router.post('/checkout', verificarAutenticado, cpfValidation, handleValidation, checkinController.checkout);
router.get('/hoje', verificarAutenticado, checkinController.minhaHoje);

// Lista de presença de um dia (uso da associação/admin)
router.get(
  '/presencas',
  verificarAdmin,
  query('data').optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Data inválida (use AAAA-MM-DD).'),
  handleValidation,
  checkinController.presencasDoDia
);

module.exports = router;
