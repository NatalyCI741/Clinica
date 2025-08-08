//controlladores/medico.js

const Medico = require('../modelos/Medico');

exports.listarMedicos = async (req, res) => {
  try {
    const medicos = await Medico.find();
    res.json(medicos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerMedico = async (req, res) => {
  try {
    const medico = await Medico.findById(req.params.id);
    if (!medico) return res.status(404).json({ error: 'Médico no encontrado' });
    res.json(medico);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crearMedico = async (req, res) => {
  try {
    const nuevoMedico = new Medico(req.body);
    await nuevoMedico.save();
    res.status(201).json(nuevoMedico);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.actualizarMedico = async (req, res) => {
  try {
    const medico = await Medico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medico) return res.status(404).json({ error: 'Médico no encontrado' });
    res.json(medico);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.eliminarMedico = async (req, res) => {
  try {
    const medico = await Medico.findByIdAndDelete(req.params.id);
    if (!medico) return res.status(404).json({ error: 'Médico no encontrado' });
    res.json({ mensaje: 'Médico eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 