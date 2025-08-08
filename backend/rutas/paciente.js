const express = require('express');
const router = express.Router();
const pacienteCtrl = require('../controladores/paciente');
const reportesCtrl = require('../controladores/reportes');
const { verificarToken } = require('../middleware/auth');

router.get('/', pacienteCtrl.listarPacientes);
router.get('/pdf', reportesCtrl.generarPdfPacientes);
router.get('/:id', pacienteCtrl.obtenerPaciente);
router.post('/', pacienteCtrl.crearPaciente);
router.put('/:id', pacienteCtrl.actualizarPaciente);
router.delete('/:id', pacienteCtrl.eliminarPaciente);

module.exports = router; 