import dbconect from './database.js'
import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import pg from 'pg'
import path from 'node:path'
const { Pool } = pg
const pool = new Pool({
  user: dbconect.user,
  host: dbconect.host,
  database: dbconect.database,
  password: dbconect.password,
  port: 5432, // El puerto por defecto de PostgreSQL
  ssl: {
    rejectUnauthorized: true // Esto habilita la verificación del certificado SSL
    // O bien, si tienes el certificado CA de tu servidor PostgreSQL:
    // ca: fs.readFileSync('/ruta/a/tu/certificado_ca.crt')
  }
})

const PORT = process.env.PORT ?? 3000
const app = express()
app.use(express.json())
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {}
})
io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('chat message', (msg) => {
    console.log(msg)
    io.emit('chat message', msg)
    try {
      const Temp = msg.temp
      console.log(Temp)
    } catch (error) {
      console.log(error)
    }
  })

  socket.on('monitoreo', (msg) => {
    const selectQuery = `
        SELECT temperatura, humedad, voltaje, consumo, control, hora
        FROM lecturas_solar
        ORDER BY hora DESC
        LIMIT 6; -- Obtener la última entrada`
    pool.query(selectQuery, (err, result) => {
      if (err) {
        console.error('Error al obtener datos de monitoreo:', err)
        io.emit('chat message', 'error en la query')
      } else {
        if (result.rows.length === 6) {
          const data = result.rows

          io.emit('chat message', data)
        } else {
          io.emit('chat message', 'no se encontraron datos')
        }
      }
    })
  })
})
let solarData = {}
app.post('/guardar_datos', (req, res) => {
  const { temperatura, humedad, voltaje, consumo, control } = req.body
  console.log(req.body)
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
  console.log('value', values)
  // Realiza la inserción en la base de datos
  pool.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error('Error al insertar datos:', err)
    } else {
      console.log('Datos insertados correctamente')
      res.status(201).json(solarData)// Respuesta exitosa
    }
  })
})

const dashboardPath = path.join(process.cwd(), '/dashboar.html')
app.use(express.static(process.cwd()))

// Define una ruta para servir tu archivo HTML en la raíz del dominio
app.get('/', (req, res) => {
  res.sendFile(dashboardPath)
})

server.listen(PORT, () => {
  console.log('escuchando')
})
