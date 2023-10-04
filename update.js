// Referencia al elemento canvas y contexto
const chartCanvas = document.getElementById('dataChart');
const ctx = chartCanvas.getContext('2d');
// Arreglos para almacenar los datos y etiquetas de tiempo
const timeLabels = [];
const temperatureData = [];
const humidityData = [];
const voltageData = [];
const consumptionData = [];
const maxDataPoints = 6;
function updateData() {
    fetch("http://localhost:3000/monitoreo")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Error en la solicitud: " + response.status);
            }
            return response.json(); // Esto convierte la respuesta en un objeto JSON
        })
        .then(function (data) {
            // Aquí puedes acceder a los datos JSON y guardarlos
            console.log(data);// Referencia al elemento canvas y contexto
            const chartCanvas = document.getElementById('dataChart');
            const ctx = chartCanvas.getContext('2d');
            // Arreglos para almacenar los datos y etiquetas de tiempo
            const timeLabels = [];
            const temperatureData = [];
            const humidityData = [];
            const voltageData = [];
            const consumptionData = [];
            const maxDataPoints = 6;
            function updateData() {
                fetch("http://localhost:3000/monitoreo")
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error("Error en la solicitud: " + response.status);
                        }
                        return response.json(); // Esto convierte la respuesta en un objeto JSON
                    })
                    .then(function (data) {
                        // Aquí puedes acceder a los datos JSON y guardarlos
                        console.log(data);
            
                        // Puedes guardar los datos en una variable si lo deseas
                        const temperature = data.temperatura;
                        const humidity = data.humedad;
                        const voltage = data.voltaje;
                        const consumption = data.consumo;
                        const control = data.control;
            
                        var currentTime = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                        console.log(currentTime);
                        // Agregar datos a los arreglos
                        timeLabels.push(currentTime);
                        temperatureData.push(temperature);
                        document.getElementById("temperature").textContent = temperature + " °C";
                        document.getElementById('humidity').textContent = `${humidity} %`;
                        document.getElementById('voltage').textContent = `${voltage} V`;
                        document.getElementById('consumption').textContent = `${consumption} W`;
                        document.getElementById('control').textContent = control;
                        // Actualizar el gráfico
                        updateChart();
                        // Realiza cualquier otra operación con los datos
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            
            }
            // Crear un gráfico de línea
            const dataChart = new Chart(ctx, {
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
                    ],
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
                        },
                    },
                },
            });
            
            // Función para actualizar el gráfico
            function updateChart() {
                dataChart.data.labels = timeLabels;
                dataChart.data.datasets.data = temperatureData;
                dataChart.update();
                if (timeLabels.length > maxDataPoints) {
                    timeLabels.shift();
                    temperatureData.shift();
                }
            }
            
            
            
            
            // Actualiza los datos cada 5 segundos
            setInterval(updateData, 5000);

            // Puedes guardar los datos en una variable si lo deseas
            const temperature = data.temperatura;
            const humidity = data.humedad;
            const voltage = data.voltaje;
            const consumption = data.consumo;
            const control = data.control;

            var currentTime = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
            console.log(currentTime);
            // Agregar datos a los arreglos
            timeLabels.push(currentTime);
            temperatureData.push(temperature);
            document.getElementById("temperature").textContent = temperature + " °C";
            document.getElementById('humidity').textContent = `${humidity} %`;
            document.getElementById('voltage').textContent = `${voltage} V`;
            document.getElementById('consumption').textContent = `${consumption} W`;
            document.getElementById('control').textContent = control;
            // Actualizar el gráfico
            updateChart();
            // Realiza cualquier otra operación con los datos
        })
        .catch(function (error) {
            console.error(error);
        });

}
// Crear un gráfico de línea
const dataChart = new Chart(ctx, {
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
        ],
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
            },
        },
    },
});

// Función para actualizar el gráfico
function updateChart() {
    dataChart.data.labels = timeLabels;
    dataChart.data.datasets.data = temperatureData;
    dataChart.update();
    if (timeLabels.length > maxDataPoints) {
        timeLabels.shift();
        temperatureData.shift();
    }
}




// Actualiza los datos cada 5 segundos
setInterval(updateData, 5000);