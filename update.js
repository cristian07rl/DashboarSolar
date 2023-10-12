/* global Chart */
const chartCanvas = document.getElementById('dataChart')
const ctx = chartCanvas.getContext('2d')
// Arreglos para almacenar los datos y etiquetas de tiempo
const timeLabels = []
const temperatureData = []
// const humidityData = []
// const voltageData = []
// const consumptionData = []
const Datapoints = 6
function updateData () {
  // "https://dashboarsolar-rxzu-dev.fl0.io/monitoreo"
  // "http://localhost:3000/monitoreo"
  fetch('https://dashboarsolar-rxzu-dev.fl0.io/monitoreo')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.status)
      }
      return response.json() // Esto convierte la respuesta en un objeto JSON
    })
    .then(function (data) {
      // Aquí puedes acceder a los datos JSON y guardarlos
      console.log(data)
      console.log(data[Datapoints - 1].hora)
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
      // Actualizar el gráfico
      updateChart()
      // Realiza cualquier otra operación con los datos
    })
    .catch(function (error) {
      console.error(error)
    })
}
// Crear un gráfico de línea
const dataChart = new Chart(
  ctx, {
    type: 'line',
    data: {
      labels: timeLabels,
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: temperatureData,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Temperatura (°C)'
          }
        }
      }
    }
  })

// Función para actualizar el gráfico
function updateChart () {
  dataChart.data.labels = timeLabels
  dataChart.data.datasets.data = temperatureData
  dataChart.update()
  if (timeLabels.length >= Datapoints) {
    timeLabels.shift()
    temperatureData.shift()
  }
}

// Actualiza los datos cada 5 segundos
updateData()
setInterval(updateData, 10000)
