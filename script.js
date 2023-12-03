function updateData () {
  // Simula la obtención de datos en tiempo real
  const temperature = Math.floor(Math.random() * 50) + 10
  const humidity = Math.floor(Math.random() * 100)
  const voltage = (Math.random() * 5).toFixed(2)
  const consumption = Math.floor(Math.random() * 1000)
  const control = Math.random() < 0.5 ? 'Apagado' : 'Encendido'

  const datos = {
    temperatura: temperature,
    humedad: humidity,
    voltaje: voltage,
    consumo: consumption,
    control
  }
  console.log(datos)
  // Configurar la solicitud POST
  // "https://dashboarsolar-rxzu-dev.fl0.io/guardar_datos"

  // "http://localhost:3000/guardar_datos"
  fetch('http://localhost:3000/guardar_datos', {
    method: 'POST', // Método de la solicitud
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    })
    .then(data => {
      console.log('Respuesta del servidor:', data)
    })
    .catch(error => {
      console.error('Error en la solicitud:', error)
    })
}

// Actualiza los datos cada 5 segundos
setInterval(updateData, 10000)

// Actualiza los datos al cargar la página
updateData()
