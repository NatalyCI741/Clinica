const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const UsuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ["admin", "medico", "paciente"],
    required: true,
  },
  // Referencia al ID del médico o paciente según corresponda
  entidadId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "tipo" === "medico" ? "Medico" : "tipo" === "paciente" ? "Paciente" : null,
  },
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
})

// Método para encriptar la contraseña antes de guardar
UsuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Método para comparar contraseñas
UsuarioSchema.methods.compararPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("Usuario", UsuarioSchema)
