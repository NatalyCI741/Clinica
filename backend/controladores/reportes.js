const Paciente = require("../modelos/Paciente")
const Medico = require("../modelos/Medico")
const Cita = require("../modelos/Cita")
const puppeteer = require('puppeteer');

exports.generarReporte = async (req, res) => {
  try {
    const { tipo, fechaInicio, fechaFin, usuarioId, tipoUsuario } = req.body

    let datos = {}
    let titulo = ""

    // Generar contenido según el tipo de reporte
    switch (tipo) {
      case "citas":
        datos = await generarReporteCitas(fechaInicio, fechaFin)
        titulo = "Reporte de Citas"
        break
      case "pacientes":
        datos = await generarReportePacientes()
        titulo = "Reporte de Pacientes"
        break
      case "medicos":
        datos = await generarReporteMedicos()
        titulo = "Reporte de Médicos"
        break
      case "mis-citas":
        datos = await generarReporteMisCitas(usuarioId, tipoUsuario, fechaInicio, fechaFin)
        titulo = "Mis Citas"
        break
      case "estadisticas":
        datos = await generarReporteEstadisticas()
        titulo = "Estadísticas Generales"
        break
      default:
        return res.status(400).json({ error: "Tipo de reporte no válido" })
    }

    // Generar HTML para el reporte
    const htmlReporte = generarHTMLReporte(titulo, datos, fechaInicio, fechaFin)

    res.json({
      titulo,
      html: htmlReporte,
      datos,
      fechaGeneracion: new Date().toLocaleDateString(),
    })
  } catch (error) {
    console.error("Error generando reporte:", error)
    const errorMessage = error.message || "Error al generar el reporte"
    res.status(500).json({ error: errorMessage })
  }
}

exports.generarPdfPacientes = async (req, res) => {
  let browser;
  try {
    const datos = await generarReportePacientes();
    const htmlReporte = generarHTMLReporte("Reporte de Pacientes", datos);

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setContent(htmlReporte, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4' });

    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length });
    res.send(pdf);
  } catch (error) {
    console.error("Error generando PDF de pacientes:", error);
    res.status(500).json({ error: "Error al generar el PDF de pacientes: " + error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

exports.generarPdfMedicos = async (req, res) => {
  let browser;
  try {
    const datos = await generarReporteMedicos();
    const htmlReporte = generarHTMLReporte("Reporte de Médicos", datos);

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setContent(htmlReporte, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4' });

    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length });
    res.send(pdf);
  } catch (error) {
    console.error("Error generando PDF de médicos:", error);
    res.status(500).json({ error: "Error al generar el PDF de médicos: " + error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

exports.generarPdfCitas = async (req, res) => {
  let browser;
  try {
    const datos = await generarReporteCitas();
    const htmlReporte = generarHTMLReporte("Reporte de Citas", datos);

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setContent(htmlReporte, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4' });

    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length });
    res.send(pdf);
  } catch (error) {
    console.error("Error generando PDF de citas:", error);
    res.status(500).json({ error: "Error al generar el PDF de citas: " + error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

async function generarReporteCitas(fechaInicio, fechaFin) {
  try {
    const query = {}

    if (fechaInicio && fechaFin) {
      query.fecha = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      }
    }

    const citas = await Cita.find(query)
      .populate("paciente", "nombre apellido dni")
      .populate("medico", "nombre apellido especialidad")
      .sort({ fecha: -1 })

    return {
      citas,
      total: citas.length,
      pendientes: citas.filter((c) => c.estado === "pendiente").length,
      confirmadas: citas.filter((c) => c.estado === "confirmada").length,
      canceladas: citas.filter((c) => c.estado === "cancelada").length,
    }
  } catch (error) {
    throw new Error("Error al generar reporte de citas")
  }
}

async function generarReportePacientes() {
  try {
    const pacientes = await Paciente.find().sort({ nombre: 1 })
    return {
      pacientes,
      total: pacientes.length,
    }
  } catch (error) {
    throw new Error("Error al generar reporte de pacientes")
  }
}

async function generarReporteMedicos() {
  try {
    const medicos = await Medico.find().sort({ nombre: 1 })
    return {
      medicos,
      total: medicos.length,
    }
  } catch (error) {
    throw new Error("Error al generar reporte de médicos")
  }
}

async function generarReporteMisCitas(usuarioId, tipoUsuario, fechaInicio, fechaFin) {
  try {
    const query = {}

    if (fechaInicio && fechaFin) {
      query.fecha = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      }
    }

    if (tipoUsuario === "medico") {
      query.medico = usuarioId
    } else if (tipoUsuario === "paciente") {
      query.paciente = usuarioId
    }

    const citas = await Cita.find(query)
      .populate("paciente", "nombre apellido dni")
      .populate("medico", "nombre apellido especialidad")
      .sort({ fecha: -1 })

    return {
      citas,
      total: citas.length,
      tipoUsuario,
    }
  } catch (error) {
    throw new Error("Error al generar reporte de citas")
  }
}

async function generarReporteEstadisticas() {
  try {
    const [totalPacientes, totalMedicos, totalCitas] = await Promise.all([
      Paciente.countDocuments(),
      Medico.countDocuments(),
      Cita.countDocuments(),
    ])

    const citasPorEstado = await Cita.aggregate([
      {
        $group: {
          _id: "$estado",
          count: { $sum: 1 },
        },
      },
    ])

    const citasPorMes = await Cita.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$fecha" },
            month: { $month: "$fecha" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ])

    return {
      totalPacientes,
      totalMedicos,
      totalCitas,
      citasPorEstado,
      citasPorMes,
    }
  } catch (error) {
    throw new Error("Error al generar estadísticas")
  }
}

function generarHTMLReporte(titulo, datos, fechaInicio, fechaFin) {
  const fechaActual = new Date().toLocaleDateString()
  const periodo = fechaInicio && fechaFin ? `Del ${fechaInicio} al ${fechaFin}` : "Todos los registros"

  let contenido = ""

  if (datos.citas) {
    contenido = `
      <div class="seccion">
        <h3>Resumen</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="numero">${datos.total}</span>
            <span class="label">Total de Citas</span>
          </div>
          ${
            datos.pendientes !== undefined
              ? `
          <div class="stat-item">
            <span class="numero">${datos.pendientes}</span>
            <span class="label">Pendientes</span>
          </div>
          <div class="stat-item">
            <span class="numero">${datos.confirmadas}</span>
            <span class="label">Confirmadas</span>
          </div>
          <div class="stat-item">
            <span class="numero">${datos.canceladas}</span>
            <span class="label">Canceladas</span>
          </div>
          `
              : ""
          }
        </div>
      </div>
      
      <div class="seccion">
        <h3>Detalle de Citas</h3>
        <table class="tabla-reporte">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Estado</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            ${datos.citas
              .map(
                (cita) => `
              <tr>
                <td>${new Date(cita.fecha).toLocaleDateString()}</td>
                <td>${cita.hora}</td>
                <td>${cita.paciente.nombre} ${cita.paciente.apellido}</td>
                <td>${cita.medico.nombre} ${cita.medico.apellido}<br><small>${cita.medico.especialidad}</small></td>
                <td><span class="estado estado-${cita.estado}">${cita.estado}</span></td>
                <td>${cita.motivo}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
  } else if (datos.pacientes) {
    contenido = `
      <div class="seccion">
        <h3>Resumen de Pacientes</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="numero">${datos.total}</span>
            <span class="label">Total de Pacientes</span>
          </div>
        </div>
      </div>
      
      <div class="seccion">
        <h3>Detalle de Pacientes</h3>
        <table class="tabla-reporte">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Teléfono</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            ${datos.pacientes
              .map(
                (paciente) => `
              <tr>
                <td>${paciente.nombre}</td>
                <td>${paciente.apellido}</td>
                <td>${paciente.dni}</td>
                <td>${paciente.telefono}</td>
                <td>${paciente.email}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
  } else if (datos.medicos) {
    contenido = `
      <div class="seccion">
        <h3>Resumen de Médicos</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="numero">${datos.total}</span>
            <span class="label">Total de Médicos</span>
          </div>
        </div>
      </div>
      
      <div class="seccion">
        <h3>Detalle de Médicos</h3>
        <table class="tabla-reporte">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Especialidad</th>
              <th>Teléfono</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            ${datos.medicos
              .map(
                (medico) => `
              <tr>
                <td>${medico.nombre}</td>
                <td>${medico.apellido}</td>
                <td>${medico.especialidad}</td>
                <td>${medico.telefono}</td>
                <td>${medico.email}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
  } else if (datos.totalPacientes !== undefined) {
    contenido = `
      <div class="seccion">
        <h3>Estadísticas Generales</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="numero">${datos.totalPacientes}</span>
            <span class="label">Total Pacientes</span>
          </div>
          <div class="stat-item">
            <span class="numero">${datos.totalMedicos}</span>
            <span class="label">Total Médicos</span>
          </div>
          <div class="stat-item">
            <span class="numero">${datos.totalCitas}</span>
            <span class="label">Total Citas</span>
          </div>
        </div>
      </div>
      
      <div class="seccion">
        <h3>Citas por Estado</h3>
        <table class="tabla-reporte">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            ${datos.citasPorEstado
              .map(
                (estado) => `
              <tr>
                <td><span class="estado estado-${estado._id}">${estado._id}</span></td>
                <td>${estado.count}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${titulo}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: white;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #667eea;
          margin: 0;
          font-size: 28px;
        }
        .header h2 {
          color: #333;
          margin: 10px 0;
          font-size: 20px;
        }
        .header p {
          color: #666;
          margin: 5px 0;
        }
        .seccion {
          margin-bottom: 30px;
        }
        .seccion h3 {
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-item {
          text-align: center;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f8f9fa;
        }
        .stat-item .numero {
          display: block;
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 5px;
        }
        .stat-item .label {
          color: #666;
          font-size: 14px;
        }
        .tabla-reporte {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .tabla-reporte th,
        .tabla-reporte td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .tabla-reporte th {
          background: #667eea;
          color: white;
          font-weight: bold;
        }
        .tabla-reporte tr:nth-child(even) {
          background: #f8f9fa;
        }
        .estado {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .estado-pendiente {
          background: #fff3cd;
          color: #856404;
        }
        .estado-confirmada {
          background: #d4edda;
          color: #155724;
        }
        .estado-cancelada {
          background: #f8d7da;
          color: #721c24;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Clínica Serenity</h1>
        <h2>${titulo}</h2>
        <p>Periodo: ${periodo}</p>
        <p>Fecha de generación: ${fechaActual}</p>
      </div>
      
      ${contenido}
      
      <div class="no-print" style="margin-top: 30px; text-align: center;">
        <button onclick="window.print()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          Imprimir / Guardar como PDF
        </button>
      </div>
    </body>
    </html>
  `
}
