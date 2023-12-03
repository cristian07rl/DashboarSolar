import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'
import { tempChart } from './graficas.js'
const socket = io()

// Arreglos para almacenar los datos y etiquetas de tiempo
const timeLabels = []
const temperatureData = []
// const humidityData = []
// const voltageData = []
// const consumptionData = []
const Datapoints = 6
socket.on('chat message', (data) => {
  const humidity = data[Datapoints - 1].humedad
  const voltage = data[Datapoints - 1].voltaje
  const consumption = data[Datapoints - 1].consumo
  const control = data[Datapoints - 1].control
  if (temperatureData.length === 0) {
    data.forEach(data => {
      const temperature = data.temperatura
      const currentTime = data.hora.toString().slice(11, data.hora.indexOf('.'))
      temperatureData.push(temperature)
      timeLabels.push(currentTime)
    })
  } else {
    const temperature = data[Datapoints - 1].temperatura
    temperatureData.push(temperature)
    const currentTime = data[Datapoints - 1].hora.toString().slice(11, data[0].hora.indexOf('.'))
    timeLabels.push(currentTime)
  }
  // Puedes guardar los datos en una variable si lo deseas
  document.getElementById('temperature').textContent = temperatureData[Datapoints - 1] + ' °C'
  document.getElementById('humidity').textContent = `${humidity} %`
  document.getElementById('voltage').textContent = `${voltage} V`
  document.getElementById('consumption').textContent = `${consumption} W`
  document.getElementById('control').textContent = control

  updateChart() // Actualizar el gráfico
})
function updateData () {
  // "https://dashboarsolar-rxzu-dev.fl0.io/monitoreo"
  // "http://localhost:3000/monitoreo"
  socket.emit('monitoreo', '')
}
// Crear un gráfico de línea

// Función para actualizar el gráfico
function updateChart () {
  tempChart.data.labels = timeLabels
  tempChart.data.datasets[0].data = temperatureData
  tempChart.update()
  if (timeLabels.length >= Datapoints) {
    timeLabels.shift()
    temperatureData.shift()
  }
}

// Actualiza los datos cada 5 segundos
updateData()
setInterval(updateData, 10000)
