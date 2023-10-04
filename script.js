

function updateData() {
    // Simula la obtención de datos en tiempo real
    var currentTime = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    const temperature = Math.floor(Math.random() * 50) + 10;
    const humidity = Math.floor(Math.random() * 100);
    const voltage = (Math.random() * 5).toFixed(2);
    const consumption = Math.floor(Math.random() * 1000);
    const control = Math.random() < 0.5 ? 'Apagado' : 'Encendido';

    var datos = {
        temperatura: temperature,
        humedad: humidity,
        voltaje: voltage,
        consumo: consumption,
        control: control
    };

    // Configurar la solicitud POST
    fetch("http://localhost:3000/guardar_datos", {
        method: "POST", // Método de la solicitud
        headers: {
            "Content-Type": "application/x-www-form-urlencoded" // Tipo de contenido (en este caso, datos codificados en URL)
        },
        body: new URLSearchParams(datos).toString() // Convertir los datos a una cadena codificada en URL
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Error en la solicitud: " + response.status);
            }
        })
}

// Actualiza los datos cada 5 segundos
setInterval(updateData, 5000);

// Actualiza los datos al cargar la página
updateData();