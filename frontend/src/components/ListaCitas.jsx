import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import CitaForm from './CitaForm';

function ListaCitas() {
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [citaEditar, setCitaEditar] = useState(null);

  const cargarCitas = () => {
    setLoading(true);
    axios.get('http://localhost:4000/api/citas')
      .then(res => {
        setCitas(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('No se pudo cargar la lista de citas');
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const handleAgregar = () => {
    setCitaEditar(null);
    setShowForm(true);
  };

  const handleEditar = cita => {
    setCitaEditar(cita);
    setShowForm(true);
  };

  const handleEliminar = async id => {
    if (window.confirm('¿Seguro que deseas eliminar esta cita?')) {
      try {
        await axios.delete(`http://localhost:4000/api/citas/${id}`);
        cargarCitas();
      } catch (err) {
        setError('No se pudo eliminar la cita');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    cargarCitas();
  };

  const handleGenerarPdf = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/citas/pdf', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'citas_medicas.pdf';
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
      <h2 className="text-center mb-4">Listado de Citas Médicas</h2>
      <div className="mb-3 text-end">
        <button className="btn btn-primary me-2" onClick={handleGenerarPdf}>Generar PDF</button>
        <button className="btn btn-primary" onClick={handleAgregar}>Agendar Cita</button>
      </div>
      {showForm && (
        <div className="mb-4">
          <CitaForm
            cita={citaEditar}
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
              <th>Fecha</th>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.length === 0 && !loading ? (
              <tr>
                <td colSpan="7" className="text-center">No hay citas programadas</td>
              </tr>
            ) : (
              citas.map(cita => (
                <tr key={cita._id}>
                  <td>{cita.fecha ? cita.fecha.substring(0, 10) : ''}</td>
                  <td>{cita.hora}</td>
                  <td>{cita.paciente?.nombre} {cita.paciente?.apellido}</td>
                  <td>{cita.medico?.nombre} {cita.medico?.apellido} ({cita.medico?.especialidad})</td>
                  <td>{cita.motivo}</td>
                  <td>{cita.estado}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(cita)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(cita._id)}>Eliminar</button>
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

export default ListaCitas; 