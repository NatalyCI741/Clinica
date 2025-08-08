import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import MedicoForm from './MedicoForm';

function ListaMedicos() {
  const [medicos, setMedicos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [medicoEditar, setMedicoEditar] = useState(null);

  const cargarMedicos = () => {
    setLoading(true);
    axios.get('http://localhost:4000/api/medicos')
      .then(res => {
        setMedicos(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('No se pudo cargar la lista de médicos');
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarMedicos();
  }, []);

  const handleAgregar = () => {
    setMedicoEditar(null);
    setShowForm(true);
  };

  const handleEditar = medico => {
    setMedicoEditar(medico);
    setShowForm(true);
  };

  const handleEliminar = async id => {
    if (window.confirm('¿Seguro que deseas eliminar este médico?')) {
      try {
        await axios.delete(`http://localhost:4000/api/medicos/${id}`);
        cargarMedicos();
      } catch (err) {
        setError('No se pudo eliminar el médico');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    cargarMedicos();
  };

  const handleGenerarPdf = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/medicos/pdf', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lista_medicos.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo generar el PDF.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Listado de Médicos</h2>
      <div className="mb-3 text-end">
        <button className="btn btn-primary me-2" onClick={handleGenerarPdf}>Generar PDF</button>
        <button className="btn btn-primary" onClick={handleAgregar}>Agregar Médico</button>
      </div>
      {showForm && (
        <div className="mb-4">
          <MedicoForm
            medico={medicoEditar}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
      {loading && <div className="alert alert-info">Cargando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Especialidad</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Horario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicos.length === 0 && !loading ? (
              <tr>
                <td colSpan="7" className="text-center">No hay médicos registrados</td>
              </tr>
            ) : (
              medicos.map(medico => (
                <tr key={medico._id}>
                  <td>{medico.nombre}</td>
                  <td>{medico.apellido}</td>
                  <td>{medico.especialidad}</td>
                  <td>{medico.telefono}</td>
                  <td>{medico.email}</td>
                  <td>{medico.horario}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(medico)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(medico._id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListaMedicos; 