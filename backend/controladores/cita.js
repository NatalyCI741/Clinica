//controladores/cita.js

const Cita = require('../modelos/Cita');

exports.listarCitas = async (req, res) => {
  try {
    const citas = await Cita.find().populate('paciente').populate('medico');
    res.json(citas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerCita = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id).populate('paciente').populate('medico');
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(cita);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crearCita = async (req, res) => {
  try {
    const { medico, fecha, hora } = req.body;
    // Validar que no exista una cita igual para el mismo médico, fecha y hora
    const citaExistente = await Cita.findOne({ medico, fecha, hora });
    if (citaExistente) {
      return res.status(400).json({ error: 'El médico ya tiene una cita agendada en esa fecha y hora.' });
    }
    const nuevaCita = new Cita(req.body);
    await nuevaCita.save();
    res.status(201).json(nuevaCita);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.actualizarCita = async (req, res) => {
  try {
    const { medico, fecha, hora } = req.body;
    // Validar que no exista otra cita igual para el mismo médico, fecha y hora (excluyendo la actual)
    const citaExistente = await Cita.findOne({ medico, fecha, hora, _id: { $ne: req.params.id } });
    if (citaExistente) {
      return res.status(400).json({ error: 'El médico ya tiene una cita agendada en esa fecha y hora.' });
    }
    const cita = await Cita.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(cita);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.eliminarCita = async (req, res) => {
  try {
    const cita = await Cita.findByIdAndDelete(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json({ mensaje: 'Cita eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 