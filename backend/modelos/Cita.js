// File: backend/modelos/Cita.js

const mongoose = require('mongoose');

const CitaSchema = new mongoose.Schema({
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  medico: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico', required: true },
  motivo: { type: String, required: true },
  estado: { type: String, enum: ['pendiente', 'confirmada', 'cancelada'], default: 'pendiente' }
});

module.exports = mongoose.model('Cita', CitaSchema); 