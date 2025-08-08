"use client"

import { useState, useEffect } from "react"

function Inicio({ onIr }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentStat, setCurrentStat] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [rotation, setRotation] = useState(0)

  const stats = [
    { number: "24/7", label: "Disponible", icon: "🕐" },
    { number: "50000+", label: "Pacientes", icon: "👥" },
    { number: "50+", label: "Médicos", icon: "👨‍⚕️" },
    { number: "50000+", label: "Citas", icon: "📅" },
  ]

  const rouletteMessages = [
    "¡Tu salud es tu mayor tesoro! 💎",
    "Una sonrisa al día mantiene al doctor en la bahía 😊",
    "El ejercicio es medicina natural 🏃‍♀️",
    "Bebe agua, tu cuerpo te lo agradecerá 💧",
    "Duerme bien, vive mejor 😴",
    "Una manzana al día... ya sabes el resto 🍎",
    "La prevención es la mejor medicina 🛡️",
    "Tu bienestar mental importa tanto como el físico 🧠",
    "Pequeños cambios, grandes resultados 🌱",
    "¡Eres más fuerte de lo que crees! 💪",
    "La salud no tiene precio, pero sí tiene valor 💝",
    "Cuida tu cuerpo, es el único lugar que tienes para vivir 🏠",
  ]

  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const spinRoulette = () => {
    if (isSpinning) return

    setIsSpinning(true)
    const spins = 5 + Math.random() * 5
    const finalRotation = rotation + spins * 360 + Math.random() * 360
    setRotation(finalRotation)

    setTimeout(() => {
      const messageIndex = Math.floor(Math.random() * rouletteMessages.length)
      setCurrentMessage(rouletteMessages[messageIndex])
      setIsSpinning(false)
    }, 3000)
  }

  const resetRoulette = () => {
    setRotation(0)
    setCurrentMessage("")
  }

  return (
    <div className="inicio-container" onMouseMove={handleMouseMove}>
      {/* Elementos de fondo animados */}
      <div className="particles-background">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Cursor personalizado */}
      <div
        className="custom-cursor"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
        }}
      />

      {/* Hero Section */}
      <section className={`hero-section ${isLoaded ? "loaded" : ""}`}>
        {/* Logo animado */}
        <div className="logo-container">
          <div className="logo-animated">
            <div className="logo-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
            </div>
            <div className="logo-icon">
              <div className="heartbeat">💗</div>
            </div>
          </div>
        </div>

        {/* Título */}
        <h1 className="main-title">
          <span className="word" style={{ animationDelay: "0.1s" }}>
            Clínica
          </span>
          <span className="word" style={{ animationDelay: "0.3s" }}>
            Médica
          </span>
          <span className="word gradient-text" style={{ animationDelay: "0.5s" }}>
            Serenity
          </span>
        </h1>

        <p className="subtitle">Bienvenido a nuestro sistema de salud integral ❤️</p>

        {/* Estadísticas dinámicas */}
        <div className="stats-container">
          <div className="stat-display">
            <div className="stat-icon">{stats[currentStat].icon}</div>
            <div className="stat-content">
              <span className="stat-number">{stats[currentStat].number}</span>
              <span className="stat-label">{stats[currentStat].label}</span>
            </div>
          </div>
          <div className="stat-indicators">
            {stats.map((_, index) => (
              <div key={index} className={`indicator ${index === currentStat ? "active" : ""}`} />
            ))}
          </div>
        </div>

        {/* Ruleta Médica */}
        <div className="roulette-section">
          <h3 className="roulette-title">🎯 Ruleta de Bienestar</h3>
          <div className="roulette-container">
            <div className="roulette-wheel">
              <div className={`wheel ${isSpinning ? "spinning" : ""}`} style={{ transform: `rotate(${rotation}deg)` }}>
                <div className="wheel-inner">
                  {rouletteMessages.map((_, index) => (
                    <div
                      key={index}
                      className="wheel-segment"
                      style={{
                        transform: `rotate(${(360 / rouletteMessages.length) * index}deg)`,
                      }}
                    />
                  ))}
                  <div className="wheel-center">🎲</div>
                </div>
              </div>
              <div className="wheel-pointer"></div>
            </div>

            <div className="roulette-controls">
              <button onClick={spinRoulette} disabled={isSpinning} className="btn btn-primary">
                ▶️ {isSpinning ? "Girando..." : "Girar Ruleta"}
              </button>
              <button onClick={resetRoulette} className="btn btn-secondary">
                🔄 Reiniciar
              </button>
            </div>

            {currentMessage && (
              <div className="message-result">
                <p>{currentMessage}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Nuestros Servicios</h2>
          <div className="title-underline"></div>

          <div className="services-grid">
            <div className="service-card patients-card" onClick={() => onIr("pacientes")}>
              <div className="card-icon">👥</div>
              <h3>Gestión de Pacientes</h3>
              <p>Sistema completo para el registro y seguimiento de pacientes</p>
              <div className="card-stat">
                <span className="number">50000+</span>
                <span className="label">Registrados</span>
              </div>
            </div>

            <div className="service-card doctors-card" onClick={() => onIr("medicos")}>
              <div className="card-icon">👨‍⚕️</div>
              <h3>Equipo Médico</h3>
              <p>Gestión completa de médicos y especialidades</p>
              <div className="card-stat">
                <span className="number">50+</span>
                <span className="label">Especialistas</span>
              </div>
            </div>

            <div className="service-card appointments-card" onClick={() => onIr("citas")}>
              <div className="card-icon">📅</div>
              <h3>Citas Médicas</h3>
              <p>Programación inteligente y gestión de citas</p>
              <div className="card-stat">
                <span className="number">50000+</span>
                <span className="label">Programadas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="contact-section">
        <div className="container">
          <h2 className="section-title white">Contáctanos</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <h4>Ubicación</h4>
              <p>
                Calle Principal #123
                <br />
                Ciudad Salud
              </p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <h4>Teléfono</h4>
              <p>(555) 123-4567</p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">🕐</div>
              <h4>Horarios</h4>
              <p>Lun - Vie: 8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .inicio-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          cursor: none;
        }

        .particles-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: float infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100px) rotate(180deg);
            opacity: 0.8;
          }
        }

        .custom-cursor {
          position: fixed;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 70%, transparent 100%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transition: all 0.1s ease;
          mix-blend-mode: difference;
          transform: translate(-50%, -50%);
        }

        .hero-section {
          position: relative;
          text-align: center;
          padding: 4rem 2rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 2;
          opacity: 0;
          transform: translateY(50px);
          transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .hero-section.loaded {
          opacity: 1;
          transform: translateY(0);
        }

        .logo-container {
          position: relative;
          margin-bottom: 3rem;
        }

        .logo-animated {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto;
        }

        .logo-rings {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .ring {
          position: absolute;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: pulse-ring 2s infinite;
        }

        .ring-1 {
          width: 100%;
          height: 100%;
          animation-delay: 0s;
        }

        .ring-2 {
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          animation-delay: 0.5s;
        }

        .ring-3 {
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
          animation-delay: 1s;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        .logo-icon {
          position: relative;
          z-index: 3;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .heartbeat {
          font-size: 4rem;
          animation: heartbeat 1.5s infinite;
        }

        @keyframes heartbeat {
          0%, 50%, 100% {
            transform: scale(1);
          }
          25%, 75% {
            transform: scale(1.1);
          }
        }

        .main-title {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 2rem;
          color: white;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .word {
          display: inline-block;
          opacity: 0;
          transform: translateY(50px);
          animation: slideInUp 0.8s forwards;
          margin-right: 0.5rem;
        }

        .gradient-text {
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease-in-out infinite, slideInUp 0.8s forwards;
        }

        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .subtitle {
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 3rem;
          animation: fadeIn 1s ease-out 0.5s forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        .stats-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 4rem;
        }

        .stat-display {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 2rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.5s ease;
          animation: statSlide 0.5s ease;
        }

        @keyframes statSlide {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .stat-icon {
          font-size: 2.5rem;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          color: white;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
        }

        .stat-label {
          font-size: 1rem;
          opacity: 0.8;
        }

        .stat-indicators {
          display: flex;
          gap: 0.5rem;
        }

        .indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: white;
          transform: scale(1.2);
        }

        .roulette-section {
          margin-bottom: 4rem;
        }

        .roulette-title {
          font-size: 2rem;
          font-weight: bold;
          color: white;
          margin-bottom: 2rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .roulette-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .roulette-wheel {
          position: relative;
          width: 250px;
          height: 250px;
        }

        .wheel {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
          padding: 4px;
          transition: transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .wheel.spinning {
          animation: spin 3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(1800deg); }
        }

        .wheel-inner {
          width: 100%;
          height: 100%;
          background: white;
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .wheel-segment {
          position: absolute;
          width: 2px;
          height: 100px;
          background: linear-gradient(to top, #667eea, #f093fb);
          top: 20px;
          left: 50%;
          margin-left: -1px;
          transform-origin: bottom center;
        }

        .wheel-center {
          font-size: 3rem;
          z-index: 10;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .wheel-pointer {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 20px solid #ff4757;
          z-index: 20;
        }

        .roulette-controls {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .message-result {
          padding: 1.5rem;
          background: linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(33, 150, 243, 0.1));
          border: 2px solid rgba(76, 175, 80, 0.3);
          border-radius: 15px;
          backdrop-filter: blur(10px);
          animation: messageAppear 0.5s ease-out;
          max-width: 400px;
        }

        .message-result p {
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          text-align: center;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        @keyframes messageAppear {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .services-section {
          padding: 6rem 2rem;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          text-align: center;
          margin-bottom: 1rem;
        }

        .section-title.white {
          color: white;
        }

        .title-underline {
          width: 100px;
          height: 4px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          margin: 0 auto 4rem;
          border-radius: 2px;
          animation: expandLine 1s ease-out;
        }

        @keyframes expandLine {
          from {
            width: 0;
          }
          to {
            width: 100px;
          }
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
        }

        .service-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          padding: 3rem;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: 1;
        }

        .patients-card::before {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .doctors-card::before {
          background: linear-gradient(135deg, #f093fb, #f5576c);
        }

        .appointments-card::before {
          background: linear-gradient(135deg, #4facfe, #00f2fe);
        }

        .service-card:hover {
          transform: translateY(-20px) scale(1.05);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
        }

        .service-card:hover::before {
          opacity: 1;
        }

        .service-card > * {
          position: relative;
          z-index: 2;
        }

        .card-icon {
          font-size: 4rem;
          margin-bottom: 2rem;
          display: block;
        }

        .service-card h3 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .service-card p {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .card-stat {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 1rem;
          backdrop-filter: blur(10px);
        }

        .card-stat .number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .card-stat .label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .contact-section {
          padding: 6rem 2rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
        }

        .contact-item {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
          color: white;
          transition: all 0.5s ease;
          animation: slideUp 0.8s forwards;
        }

        .contact-item:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .contact-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        .contact-item h4 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .contact-item p {
          font-size: 1rem;
          opacity: 0.9;
          line-height: 1.4;
          margin: 0;
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .main-title {
            font-size: 2.5rem;
          }
          
          .services-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .service-card {
            padding: 2rem;
          }
          
          .contact-grid {
            grid-template-columns: 1fr;
          }
          
          .hero-section {
            padding: 2rem 1rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .roulette-wheel {
            width: 200px;
            height: 200px;
          }
        }
      `}</style>
    </div>
  )
}

export default Inicio
