const Usuario = require("../modelos/Usuario")
const Paciente = require("../modelos/Paciente")
const Medico = require("../modelos/Medico")
const jwt = require("jsonwebtoken")

// Clave secreta para JWT
const JWT_SECRET = "clinica_san_jose_secret_key_2025"

// Generar token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario._id,
      email: usuario.email,
      tipo: usuario.tipo,
      entidadId: usuario.entidadId,
    },
    JWT_SECRET,
    { expiresIn: "24h" },
  )
}

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" })
    }

    // Verificar la contraseña
    const passwordValido = await usuario.compararPassword(password)
    if (!passwordValido) {
      return res.status(401).json({ error: "Credenciales inválidas" })
    }

    // Generar token
    const token = generarToken(usuario)

    // Obtener datos adicionales según el tipo de usuario
    let datosAdicionales = null
    if (usuario.tipo === "medico" && usuario.entidadId) {
      datosAdicionales = await Medico.findById(usuario.entidadId)
    } else if (usuario.tipo === "paciente" && usuario.entidadId) {
      datosAdicionales = await Paciente.findById(usuario.entidadId)
    }

    // Responder con el token y datos del usuario
    res.json({
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        tipo: usuario.tipo,
        entidadId: usuario.entidadId,
        datosAdicionales,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Registro de paciente
exports.registrarPaciente = async (req, res) => {
  try {
    const { email, password, nombre, apellido, dni, telefono } = req.body

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email })
    if (usuarioExistente) {
      return res.status(400).json({ error: "El email ya está registrado" })
    }

    // Crear el paciente
    const nuevoPaciente = new Paciente({
      nombre,
      apellido,
      dni,
      telefono,
      email,
    })

    const pacienteGuardado = await nuevoPaciente.save()

    // Crear el usuario asociado al paciente
    const nuevoUsuario = new Usuario({
      email,
      password,
      nombre,
      apellido,
      tipo: "paciente",
      entidadId: pacienteGuardado._id,
    })

    await nuevoUsuario.save()

    // Generar token
    const token = generarToken(nuevoUsuario)

    res.status(201).json({
      token,
      usuario: {
        id: nuevoUsuario._id,
        email: nuevoUsuario.email,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        tipo: nuevoUsuario.tipo,
        entidadId: nuevoUsuario.entidadId,
        datosAdicionales: pacienteGuardado,
      },
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Registro de médico
exports.registrarMedico = async (req, res) => {
  try {
    const { email, password, nombre, apellido, especialidad, telefono, horario } = req.body

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email })
    if (usuarioExistente) {
      return res.status(400).json({ error: "El email ya está registrado" })
    }

    // Crear el médico
    const nuevoMedico = new Medico({
      nombre,
      apellido,
      especialidad,
      telefono,
      email,
      horario,
    })

    const medicoGuardado = await nuevoMedico.save()

    // Crear el usuario asociado al médico
    const nuevoUsuario = new Usuario({
      email,
      password,
      nombre,
      apellido,
      tipo: "medico",
      entidadId: medicoGuardado._id,
    })

    await nuevoUsuario.save()

    // Generar token
    const token = generarToken(nuevoUsuario)

    res.status(201).json({
      token,
      usuario: {
        id: nuevoUsuario._id,
        email: nuevoUsuario.email,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        tipo: nuevoUsuario.tipo,
        entidadId: nuevoUsuario.entidadId,
        datosAdicionales: medicoGuardado,
      },
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Registro de administrador
exports.registrarAdmin = async (req, res) => {
  try {
    const { email, password, nombre, apellido } = req.body

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email })
    if (usuarioExistente) {
      return res.status(400).json({ error: "El email ya está registrado" })
    }

    // Crear el usuario administrador
    const nuevoUsuario = new Usuario({
      email,
      password,
      nombre,
      apellido,
      tipo: "admin",
    })

    await nuevoUsuario.save()

    // Generar token
    const token = generarToken(nuevoUsuario)

    res.status(201).json({
      token,
      usuario: {
        id: nuevoUsuario._id,
        email: nuevoUsuario.email,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        tipo: nuevoUsuario.tipo,
      },
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Verificar token y obtener usuario actual
exports.verificarUsuario = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ error: "Acceso denegado" })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      const usuario = await Usuario.findById(decoded.id).select("-password")

      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" })
      }

      // Obtener datos adicionales según el tipo de usuario
      let datosAdicionales = null
      if (usuario.tipo === "medico" && usuario.entidadId) {
        datosAdicionales = await Medico.findById(usuario.entidadId)
      } else if (usuario.tipo === "paciente" && usuario.entidadId) {
        datosAdicionales = await Paciente.findById(usuario.entidadId)
      }

      res.json({
        usuario: {
          id: usuario._id,
          email: usuario.email,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          tipo: usuario.tipo,
          entidadId: usuario.entidadId,
          datosAdicionales,
        },
      })
    } catch (error) {
      res.status(401).json({ error: "Token inválido" })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
