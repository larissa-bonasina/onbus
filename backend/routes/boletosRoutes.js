const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const boletosController = require('../controllers/boletosController');
const { verificarAutenticado, verificarDonoOuAdmin } = require('../middleware/verificarAluno');
const { verificarAdmin } = require('../middleware/verificarAdmin');
const { handleValidation } = require('../middleware/validate');

const statusValidation = [
  body('status').isIn(['Em aberto', 'Pago', 'Vencido']).withMessage('Status inválido.'),
];

router.get('/:cpf', verificarAutenticado, verificarDonoOuAdmin, boletosController.getBoletosPorCpf);
router.get('/', verificarAdmin, boletosController.getTodosBoletos);
router.put('/:id/status', verificarAdmin, statusValidation, handleValidation, boletosController.atualizarStatusBoleto);

module.exports = router;
