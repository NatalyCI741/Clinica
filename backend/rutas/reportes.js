const express = require("express")
const router = express.Router()
const reportesCtrl = require("../controladores/reportes")
const { verificarToken } = require("../middleware/auth")

// Ruta para generar reportes
router.post("/generar", verificarToken, reportesCtrl.generarReporte)

module.exports = router
