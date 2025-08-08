// File: backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// URI CON BASE test
const uri = 'mongodb+srv://nataly:admin123@prueba.bukahhl.mongodb.net/clinica?retryWrites=true&w=majority&appName=Clinica';

mongoose.connect(uri)
  .then(() => console.log('✅ Conectado a MongoDB Atlas - Base de datos: Clinica'))
  .catch(err => console.error('❌ Error de conexión:', err));

const rutasPacientes = require('./rutas/paciente');
const rutasMedicos = require('./rutas/medico');
const rutasCitas = require('./rutas/cita');
const rutasReportes = require('./rutas/reportes');

app.use('/api/pacientes', rutasPacientes);
app.use('/api/medicos', rutasMedicos);
app.use('/api/citas', rutasCitas);
app.use('/api/reportes', rutasReportes);
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
