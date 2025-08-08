const express = require('express');
const router = express.Router();
const citaCtrl = require('../controladores/cita');
const reportesCtrl = require('../controladores/reportes');
const { verificarToken } = require('../middleware/auth');

router.get('/', citaCtrl.listarCitas);
router.get('/pdf', reportesCtrl.generarPdfCitas);
router.get('/:id', citaCtrl.obtenerCita);
router.post('/', citaCtrl.crearCita);
router.put('/:id', citaCtrl.actualizarCita);
router.delete('/:id', citaCtrl.eliminarCita);

module.exports = router; 