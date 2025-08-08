import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MedicoForm({ medico, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    telefono: '',
    email: '',
    horario: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (medico) {
      setForm({
        nombre: medico.nombre || '',
        apellido: medico.apellido || '',
        especialidad: medico.especialidad || '',
        telefono: medico.telefono || '',
        email: medico.email || '',
        horario: medico.horario || ''
      });
    }
  }, [medico]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (medico && medico._id) {
        await axios.put(`http://localhost:4000/api/medicos/${medico._id}`, form);
      } else {
        await axios.post('http://localhost:4000/api/medicos', form);
      }
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Error al guardar el médico');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      <h4>{medico ? 'Editar Médico' : 'Agregar Médico'}</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-2">
        <label className="form-label">Nombre</label>
        <input type="text" className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label className="form-label">Apellido</label>
        <input type="text" className="form-control" name="apellido" value={form.apellido} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label className="form-label">Especialidad</label>
        <input type="text" className="form-control" name="especialidad" value={form.especialidad} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label className="form-label">Teléfono</label>
        <input type="text" className="form-control" name="telefono" value={form.telefono} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label className="form-label">Email</label>
        <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label className="form-label">Horario</label>
        <input type="text" className="form-control" name="horario" value={form.horario} onChange={handleChange} required />
      </div>
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </form>
  );
}

export default MedicoForm; 