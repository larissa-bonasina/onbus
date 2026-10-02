const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const rotasController = require('../controllers/rotasController');
const { verificarAutenticado } = require('../middleware/verificarAluno');
const { verificarAdmin } = require('../middleware/verificarAdmin');
const { handleValidation } = require('../middleware/validate');

const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

const pontoValidation = (campo, rotulo) => [
  body(`${campo}.nome`).trim().isLength({ min: 2, max: 80 }).withMessage(`Informe o local de ${rotulo}.`),
  body(`${campo}.lat`).isFloat({ min: -90, max: 90 }).withMessage(`Localização de ${rotulo} inválida.`),
  body(`${campo}.lng`).isFloat({ min: -180, max: 180 }).withMessage(`Localização de ${rotulo} inválida.`),
];

const rotaValidation = [
  body('nome').trim().isLength({ min: 3, max: 80 }).withMessage('O nome deve ter entre 3 e 80 caracteres.'),
  ...pontoValidation('embarque', 'embarque'),
  ...pontoValidation('destino', 'destino'),
  body('horarioIda').matches(HORA).withMessage('Horário de ida inválido (use HH:MM).'),
  body('horarioVolta').optional({ values: 'falsy' }).matches(HORA).withMessage('Horário de volta inválido (use HH:MM).'),
  body('dias').isArray({ min: 1, max: 7 }).withMessage('Escolha ao menos um dia da semana.'),
  body('dias.*').isInt({ min: 0, max: 6 }).withMessage('Dia da semana inválido.'),
];

// Alunos e admin leem; só a associação cadastra, edita e remove.
router.get('/', verificarAutenticado, rotasController.listar);
router.get('/minha', verificarAutenticado, rotasController.minha);
router.post('/', verificarAdmin, rotaValidation, handleValidation, rotasController.criar);
router.put('/:id', verificarAdmin, rotaValidation, handleValidation, rotasController.atualizar);
router.delete('/:id', verificarAdmin, rotasController.remover);

// Alerta do dia (atraso, desvio, viagem cancelada) — o problema da BR-163 que motivou o app.
const alertaValidation = [
  body('tipo').isIn(['atraso', 'desvio', 'cancelada']).withMessage('Tipo de alerta inválido.'),
  body('mensagem').trim().isLength({ min: 3, max: 500 }).withMessage('A mensagem deve ter entre 3 e 500 caracteres.'),
  body('atrasoMin').optional({ values: 'falsy' }).isInt({ min: 1, max: 600 }).withMessage('Atraso deve ser entre 1 e 600 minutos.'),
];
router.put('/:id/alerta', verificarAdmin, alertaValidation, handleValidation, rotasController.publicarAlerta);
router.delete('/:id/alerta', verificarAdmin, rotasController.encerrarAlerta);

router.put(
  '/alunos/:cpf',
  verificarAdmin,
  param('cpf').matches(/^\d{11}$/).withMessage('CPF inválido.'),
  body('rotaId').optional({ values: 'null' }).isString().withMessage('Rota inválida.'),
  handleValidation,
  rotasController.vincularAluno
);

module.exports = router;
