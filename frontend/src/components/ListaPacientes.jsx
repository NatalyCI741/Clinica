import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import PacienteForm from './PacienteForm';

function ListaPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [pacienteEditar, setPacienteEditar] = useState(null);

  const cargarPacientes = () => {
    setLoading(true);
    axios.get('http://localhost:4000/api/pacientes')
      .then(res => {
        setPacientes(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('No se pudo cargar la lista de pacientes');
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const handleAgregar = () => {
    setPacienteEditar(null);
    setShowForm(true);
  };

  const handleEditar = paciente => {
    setPacienteEditar(paciente);
    setShowForm(true);
  };

  const handleEliminar = async id => {
    if (window.confirm('¿Seguro que deseas eliminar este paciente?')) {
      try {
        await axios.delete(`http://localhost:4000/api/pacientes/${id}`);
        cargarPacientes();
      } catch (err) {
        setError('No se pudo eliminar el paciente');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    cargarPacientes();
  };

  const handleGenerarPdf = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/pacientes/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'lista_pacientes.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo generar el PDF.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center flex-grow-1 mb-0">Listado de Pacientes</h2>
        <button className="btn btn-primary me-2" onClick={handleGenerarPdf}>Generar PDF</button>
        <button className="btn btn-success ms-3" onClick={handleAgregar}>+ Agregar Paciente</button>
      </div>
      {showForm && (
        <div className="mb-4">
          <PacienteForm
            paciente={pacienteEditar}
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
              <th>NT</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.length === 0 && !loading ? (
              <tr>
                <td colSpan="6" className="text-center">No hay pacientes registrados</td>
              </tr>
            ) : (
              pacientes.map(paciente => (
                <tr key={paciente._id}>
                  <td>{paciente.nombre}</td>
                  <td>{paciente.apellido}</td>
                  <td>{paciente.dni}</td>
                  <td>{paciente.telefono}</td>
                  <td>{paciente.email}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(paciente)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(paciente._id)}>Eliminar</button>
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

export default ListaPacientes; 