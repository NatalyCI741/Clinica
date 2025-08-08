import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CitaForm({ cita, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    fecha: '',
    hora: '',
    paciente: '',
    medico: '',
    motivo: '',
    estado: 'pendiente'
  });
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:4000/api/pacientes').then(res => setPacientes(res.data));
    axios.get('http://localhost:4000/api/medicos').then(res => setMedicos(res.data));
    if (cita) {
      setForm({
        fecha: cita.fecha ? cita.fecha.substring(0, 10) : '',
        hora: cita.hora || '',
        paciente: cita.paciente?._id || cita.paciente || '',
        medico: cita.medico?._id || cita.medico || '',
        motivo: cita.motivo || '',
        estado: cita.estado || 'pendiente'
      });
    }
  }, [cita]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (cita && cita._id) {
        await axios.put(`http://localhost:4000/api/citas/${cita._id}`, form);
      } else {
        await axios.post('http://localhost:4000/api/citas', form);
      }
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Error al guardar la cita');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      <h4>{cita ? 'Editar Cita Médica' : 'Agendar Cita Médica'}</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-2">
        <label className="form-label">Fecha</label>
        <input type="date" className="form-control" name="fecha" value={form.fecha} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label className="form-label">Hora</label>
        <input type="time" className="form-control" name="hora" value={form.hora} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label className="form-label">Paciente</label>
        <select className="form-select" name="paciente" value={form.paciente} onChange={handleChange} required>
          <option value="">Seleccione un paciente</option>
          {pacientes.map(p => (
            <option key={p._id} value={p._id}>{p.nombre} {p.apellido}</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="form-label">Médico</label>
        <select className="form-select" name="medico" value={form.medico} onChange={handleChange} required>
          <option value="">Seleccione un médico</option>
          {medicos.map(m => (
            <option key={m._id} value={m._id}>{m.nombre} {m.apellido} ({m.especialidad})</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="form-label">Motivo</label>
        <input type="text" className="form-control" name="motivo" value={form.motivo} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label className="form-label">Estado</label>
        <select className="form-select" name="estado" value={form.estado} onChange={handleChange} required>
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </form>
  );
}

export default CitaForm; 