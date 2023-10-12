const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const app = express()
const { Pool } = require('pg')

const pool = new Pool({
  user: 'fl0user',
  host: 'ep-summer-band-96974789.us-east-2.aws.neon.fl0.io',
  database: 'SolarInstallation',
  password: 'Eo02KZVYqIdh',
  port: 5432, // El puerto por defecto de PostgreSQL
  ssl: {
    rejectUnauthorized: true // Esto habilita la verificación del certificado SSL
    // O bien, si tienes el certificado CA de tu servidor PostgreSQL:
    // ca: fs.readFileSync('/ruta/a/tu/certificado_ca.crt')
  }
})

// Habilita CORS para todas las rutas
app.use(cors())

const PORT = process.env.PORT ?? 3000 // Puedes cambiar el puerto según tus preferencias

// Datos simulados de monitoreo de una planta solar
let solarData = {}

// Configura el middleware body-parser para analizar las solicitudes POST
app.use(bodyParser.urlencoded({ extended: false }))

// Define la ruta de acceso a tu archivo HTML
const dashboardPath = path.join(__dirname, 'dashboar.html')
app.use(express.static(__dirname))

// Define una ruta para servir tu archivo HTML en la raíz del dominio
app.get('/', (req, res) => {
  res.sendFile(dashboardPath)
})
// Ruta para obtener los datos de monitoreo
app.get('/monitoreo', (req, res) => {
  // Realiza una consulta a la base de datos para obtener los datos de monitoreo
  const selectQuery = `
        SELECT temperatura, humedad, voltaje, consumo, control, hora
        FROM lecturas_solar
        ORDER BY hora DESC
        LIMIT 6; -- Obtener la última entrada`
  pool.query(selectQuery, (err, result) => {
    if (err) {
      console.error('Error al obtener datos de monitoreo:', err)
      res.status(500).json({ error: 'Error al obtener datos de monitoreo' })
    } else {
      if (result.rows.length === 6) {
        const data = result.rows
        res.json(data)
      } else {
        res.status(404).json({ error: 'No se encontraron datos de monitoreo' })
      }
    }
  })
})

app.post('/guardar_datos', (req, res) => {
  const { temperatura, humedad, voltaje, consumo, control } = req.body

  // Puedes guardar los datos en una base de datos, en memoria, o hacer cualquier otra acción necesaria.
  // En este ejemplo, solo mostraremos los datos en la consola.
  solarData = {
    temperatura: parseFloat(temperatura),
    humedad: parseFloat(humedad),
    voltaje: parseFloat(voltaje),
    consumo: parseFloat(consumo),
    control
  }
  console.log('Datos de monitoreo recibidos')
  // Define los valores para la inserción dentro de esta función
  const insertQuery = `
        INSERT INTO lecturas_solar (temperatura, humedad, voltaje, consumo, control)
        VALUES ($1, $2, $3, $4, $5)
    `
  const values = [
    solarData.temperatura,
    solarData.humedad,
    solarData.voltaje,
    solarData.consumo,
    solarData.control
  ]

  // Realiza la inserción en la base de datos
  pool.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error('Error al insertar datos:', err)
    } else {
      console.log('Datos insertados correctamente')
    }
  })
  res.sendStatus(201) // Respuesta exitosa
})

app.listen(PORT, () => {
  console.log(`La API está escuchando en el puerto ${PORT}`)
})
