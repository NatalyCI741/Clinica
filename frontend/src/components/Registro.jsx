"use client"

import { useState } from "react"
import axios from "axios"
import "./Registro.css"

function Registro({ setUsuarioActual, onBackToLogin }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    password: "",
    confirmarPassword: "",
    tipo: "paciente", // Valor por defecto
    // Campos adicionales para médicos
    especialidad: "",
    horario: "",
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmarPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    // Validar campos específicos para médicos
    if (formData.tipo === "medico" && (!formData.especialidad || !formData.horario)) {
      setError("Por favor complete la especialidad y horario para médicos")
      return
    }

    setLoading(true)

    try {
      let endpoint = ""
      const dataToSend = { ...formData }

      // Determinar endpoint según el tipo de usuario
      switch (formData.tipo) {
        case "paciente":
          endpoint = "http://localhost:4000/api/auth/registro/paciente"
          break
        case "medico":
          endpoint = "http://localhost:4000/api/auth/registro/medico"
          break
        case "admin":
          endpoint = "http://localhost:4000/api/auth/registro/admin"
          break
        default:
          endpoint = "http://localhost:4000/api/auth/registro/paciente"
      }

      const response = await axios.post(endpoint, dataToSend)

      // Guardar token en localStorage
      localStorage.setItem("token", response.data.token)

      // Actualizar estado de usuario
      setUsuarioActual(response.data.usuario)
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrar usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          <div className="registro-logo">
            <div className="logo-icon">
              <div className="heartbeat">💗</div>
            </div>
          </div>
          <h1>Registro de Usuario</h1>
          <p>Crea tu cuenta para acceder a nuestros servicios</p>
        </div>

        {error && (
          <div className="registro-error">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="registro-form">
          {/* Selector de tipo de usuario */}
          <div className="form-group">
            <label htmlFor="tipo">
              <i className="fas fa-user-tag"></i>
              <span>Tipo de Usuario</span>
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="paciente">Paciente</option>
              <option value="medico">Médico</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">
                <i className="fas fa-user"></i>
                <span>Nombre</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ingresa tu nombre"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido">
                <i className="fas fa-user"></i>
                <span>Apellido</span>
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                placeholder="Ingresa tu apellido"
                className="form-control"
              />
            </div>
          </div>

          {/* Campos específicos para médicos */}
          {formData.tipo === "medico" && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="especialidad">
                  <i className="fas fa-stethoscope"></i>
                  <span>Especialidad</span>
                </label>
                <input
                  type="text"
                  id="especialidad"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Cardiología, Pediatría"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="horario">
                  <i className="fas fa-clock"></i>
                  <span>Horario</span>
                </label>
                <input
                  type="text"
                  id="horario"
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                  required
                  placeholder="Ej: 8:00 - 16:00"
                  className="form-control"
                />
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dni">
                <i className="fas fa-id-card"></i>
                <span>DNI</span>
              </label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
                placeholder="Ingresa tu DNI"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">
                <i className="fas fa-phone"></i>
                <span>Teléfono</span>
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                placeholder="Ingresa tu teléfono"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
              <span>Email</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Ingresa tu email"
              className="form-control"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i>
                <span>Contraseña</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Ingresa tu contraseña"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmarPassword">
                <i className="fas fa-lock"></i>
                <span>Confirmar Contraseña</span>
              </label>
              <input
                type="password"
                id="confirmarPassword"
                name="confirmarPassword"
                value={formData.confirmarPassword}
                onChange={handleChange}
                required
                placeholder="Confirma tu contraseña"
                className="form-control"
              />
            </div>
          </div>

          <button type="submit" className="registro-button" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Registrando...</span>
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i>
                <span>Registrarse como {formData.tipo}</span>
              </>
            )}
          </button>
        </form>

        <div className="registro-footer">
          <p>¿Ya tienes una cuenta?</p>
          <button className="login-link" onClick={onBackToLogin}>
            <i className="fas fa-sign-in-alt"></i>
            <span>Iniciar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Registro
