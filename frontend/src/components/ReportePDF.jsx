"use client"

import { useState } from "react"
import axios from "axios"
import "./ReportePDF.css"

function ReportePDF({ usuario }) {
  const [loading, setLoading] = useState(false)
  const [tipoReporte, setTipoReporte] = useState("citas")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [error, setError] = useState(null)

  const generarReporte = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "http://localhost:4000/api/reportes/generar",
        {
          tipo: tipoReporte,
          fechaInicio,
          fechaFin,
          usuarioId: usuario.entidadId || usuario.id,
          tipoUsuario: usuario.tipo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      // Abrir el reporte en una nueva ventana
      const nuevaVentana = window.open("", "_blank")
      nuevaVentana.document.write(response.data.html)
      nuevaVentana.document.close()

      // Opcional: También mostrar los datos en consola para debug
      console.log("Datos del reporte:", response.data.datos)
    } catch (err) {
      setError(err.response?.data?.error || "Error al generar el reporte")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reporte-container">
      <div className="reporte-header">
        <h2>
          <i className="fas fa-file-alt"></i>
          Generar Reportes
        </h2>
        <p>Genera reportes detallados que puedes imprimir o guardar como PDF</p>
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      <div className="reporte-form">
        <div className="form-group">
          <label htmlFor="tipoReporte">Tipo de Reporte</label>
          <select
            id="tipoReporte"
            value={tipoReporte}
            onChange={(e) => setTipoReporte(e.target.value)}
            className="form-control"
          >
            {usuario.tipo === "admin" && (
              <>
                <option value="citas">Reporte de Citas</option>
                <option value="pacientes">Reporte de Pacientes</option>
                <option value="medicos">Reporte de Médicos</option>
                <option value="estadisticas">Estadísticas Generales</option>
              </>
            )}
            {usuario.tipo === "medico" && (
              <>
                <option value="mis-citas">Mis Citas</option>
                <option value="mis-pacientes">Mis Pacientes</option>
              </>
            )}
            {usuario.tipo === "paciente" && (
              <>
                <option value="mis-citas">Mis Citas</option>
                <option value="historial">Mi Historial Médico</option>
              </>
            )}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fechaInicio">Fecha Inicio (opcional)</label>
            <input
              type="date"
              id="fechaInicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fechaFin">Fecha Fin (opcional)</label>
            <input
              type="date"
              id="fechaFin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <button onClick={generarReporte} disabled={loading} className="generar-btn">
          {loading ? (
            <>
              <div className="spinner"></div>
              <span>Generando...</span>
            </>
          ) : (
            <>
              <i className="fas fa-file-alt"></i>
              <span>Generar Reporte</span>
            </>
          )}
        </button>
      </div>

      <div className="reporte-info">
        <h3>Información del Reporte</h3>
        <div class="info-grid">
          <div className="info-item">
            <i className="fas fa-user"></i>
            <span>
              Usuario: {usuario.nombre} {usuario.apellido}
            </span>
          </div>
          <div className="info-item">
            <i className="fas fa-calendar"></i>
            <span>Fecha: {new Date().toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <i className="fas fa-print"></i>
            <span>Formato: HTML (imprimible como PDF)</span>
          </div>
        </div>

        <div className="instrucciones">
          <h4>📋 Instrucciones:</h4>
          <ol>
            <li>Selecciona el tipo de reporte que deseas generar</li>
            <li>Opcionalmente, filtra por fechas</li>
            <li>Haz clic en "Generar Reporte"</li>
            <li>Se abrirá una nueva ventana con el reporte</li>
            <li>Usa Ctrl+P para imprimir o guardar como PDF</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default ReportePDF
