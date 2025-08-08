// File: backend/modelos/Medico.js

const mongoose = require('mongoose');

const MedicoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  especialidad: { type: String, required: true },
  telefono: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  horario: { type: String, required: true }
});

module.exports = mongoose.model('Medico', MedicoSchema); 