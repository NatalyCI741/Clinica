"use client"

import { useState } from "react"
import ListaPacientes from "./components/ListaPacientes"
import ListaMedicos from "./components/ListaMedicos"
import ListaCitas from "./components/ListaCitas"
import Inicio from "./components/Inicio"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

function App() {
  const [vista, setVista] = useState("inicio")

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-modern">
        <div className="container-fluid">
          <div className="navbar-brand-container" onClick={() => setVista("inicio")}>
            <div className="brand-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <span className="navbar-brand-text">Clínica Serenity</span>
          </div>

          <div className="navbar-nav-container">
            <button
              className={`nav-btn ${vista === "pacientes" ? "active" : ""}`}
              onClick={() => setVista("pacientes")}
            >
              <i className="fas fa-users"></i>
              <span>Pacientes</span>
            </button>
            <button className={`nav-btn ${vista === "medicos" ? "active" : ""}`} onClick={() => setVista("medicos")}>
              <i className="fas fa-user-md"></i>
              <span>Médicos</span>
            </button>
            <button className={`nav-btn ${vista === "citas" ? "active" : ""}`} onClick={() => setVista("citas")}>
              <i className="fas fa-calendar-alt"></i>
              <span>Citas</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {vista === "inicio" && <Inicio onIr={setVista} />}
        {vista === "pacientes" && <ListaPacientes />}
        {vista === "medicos" && <ListaMedicos />}
        {vista === "citas" && <ListaCitas />}
      </div>
    </div>
  )
}

export default App
