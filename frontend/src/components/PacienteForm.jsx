import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PacienteForm({ paciente, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paciente) {
      setForm({
        nombre: paciente.nombre || '',
        apellido: paciente.apellido || '',
        dni: paciente.dni || '',
        telefono: paciente.telefono || '',
        email: paciente.email || ''
      });
    }
  }, [paciente]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (paciente && paciente._id) {
        await axios.put(`http://localhost:4000/api/pacientes/${paciente._id}`, form);
      } else {
        await axios.post('http://localhost:4000/api/pacientes', form);
      }
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Error al guardar el paciente');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      <h4>{paciente ? 'Editar Paciente' : 'Agregar Paciente'}</h4>
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
        <label className="form-label">NT</label>
        <input type="text" className="form-control" name="dni" value={form.dni} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label className="form-label">Teléfono</label>
        <input type="text" className="form-control" name="telefono" value={form.telefono} onChange={handleChange} required />
      </div>
      <div className="mb-2">
        <label className="form-label">Email</label>
        <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </form>
  );
}

export default PacienteForm; 