const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const checkinController = require('../controllers/checkinController');
const { verificarAutenticado } = require('../middleware/verificarAluno');
const { verificarAdmin } = require('../middleware/verificarAdmin');
const { handleValidation } = require('../middleware/validate');

const cpfValidation = [body('cpf').matches(/^\d{11}$/).withMessage('CPF inválido.')];

// Rotas para check-in e check-out (exige estar logado)
router.post('/checkin', verificarAutenticado, cpfValidation, handleValidation, checkinController.checkin);
router.post('/checkout', verificarAutenticado, cpfValidation, handleValidation, checkinController.checkout);

// Rota para listar alunos presentes (uso da associação/admin)
router.get('/presentes', verificarAdmin, checkinController.listarPresentes);

module.exports = router;
