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

  // Configurar la solicitud POST
  // "https://dashboarsolar-rxzu-dev.fl0.io/guardar_datos"

  // "http://localhost:3000/guardar_datos"
  fetch('https://dashboarsolar-rxzu-dev.fl0.io/guardar_datos', {
    method: 'POST', // Método de la solicitud
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded' // Tipo de contenido (en este caso, datos codificados en URL)
    },
    body: new URLSearchParams(datos).toString() // Convertir los datos a una cadena codificada en URL
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.status)
      }
    })
}

// Actualiza los datos cada 5 segundos
setInterval(updateData, 5000)

// Actualiza los datos al cargar la página
updateData()
