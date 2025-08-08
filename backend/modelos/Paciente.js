// File: backend/modelos/Paciente.js

const mongoose = require('mongoose');

const PacienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  dni: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Paciente', PacienteSchema); 