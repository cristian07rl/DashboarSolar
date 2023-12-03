import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import pg from 'pg'
import path from 'node:path'
const { Pool } = pg

const pool = new Pool({
  user: 'fl0user',
  host: 'ep-summer-band-96974789.us-east-2.aws.neon.fl0.io',
  database: 'SolarInstallation',
  password: 'Eo02KZVYqIdh',
  port: 5432,
  ssl: {
    rejectUnauthorized: true
    // O bien, si tienes el certificado CA de tu servidor PostgreSQL:
    // ca: fs.readFileSync('/ruta/a/tu/certificado_ca.crt')
  }
})

const PORT = process.env.PORT ?? 3000
const app = express()
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

const dashboardPath = path.join(process.cwd(), '/dashboar.html')
app.use(express.static(process.cwd()))

// Define una ruta para servir tu archivo HTML en la raíz del dominio
app.get('/', (req, res) => {
  res.sendFile(dashboardPath)
})

server.listen(PORT, () => {
  console.log('escuchando')
})
