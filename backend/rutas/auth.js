const express = require("express")
const router = express.Router()
const authCtrl = require("../controladores/auth")

// Rutas de autenticación
router.post("/login", authCtrl.login)
router.post("/registro/paciente", authCtrl.registrarPaciente)
router.post("/registro/medico", authCtrl.registrarMedico)
router.post("/registro/admin", authCtrl.registrarAdmin)
router.get("/verificar", authCtrl.verificarUsuario)

module.exports = router
