const express = require('express');
const router = express.Router();
const medicoCtrl = require('../controladores/medico');
const reportesCtrl = require('../controladores/reportes');
const { verificarToken } = require('../middleware/auth');

router.get('/', medicoCtrl.listarMedicos);
router.get('/pdf', reportesCtrl.generarPdfMedicos);
router.get('/:id', medicoCtrl.obtenerMedico);
router.post('/', medicoCtrl.crearMedico);
router.put('/:id', medicoCtrl.actualizarMedico);
router.delete('/:id', medicoCtrl.eliminarMedico);

module.exports = router; 