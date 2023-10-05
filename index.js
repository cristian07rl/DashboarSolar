const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');
const app = express();
// Habilita CORS para todas las rutas
app.use(cors());
const PORT = process.env.PORT ?? 3000; // Puedes cambiar el puerto según tus preferencias
// Datos simulados de monitoreo de una planta solar
let solarData = {};

// Configura el middleware body-parser para analizar las solicitudes POST
app.use(bodyParser.urlencoded({ extended: false }));

// Define la ruta de acceso a tu archivo HTML
const dashboardPath = path.join(__dirname, 'dashboar.html');
app.use(express.static(__dirname));
// Define una ruta para servir tu archivo HTML en la raíz del dominio
app.get('/', (req, res) => {
    res.sendFile(dashboardPath);
});
// Ruta para obtener los datos de monitoreo
app.get('/monitoreo', (req, res) => {
    res.json(solarData);
});

app.post('/guardar_datos', (req, res) => {
    const { temperatura, humedad, voltaje, consumo, control } = req.body;

    // Puedes guardar los datos en una base de datos, en memoria, o hacer cualquier otra acción necesaria.
    // En este ejemplo, solo mostraremos los datos en la consola.
    solarData ={
        temperatura: parseFloat(temperatura),
        humedad: parseFloat(humedad),
        voltaje: parseFloat(voltaje),
        consumo: parseFloat(consumo),
        control
      };
    console.log('Datos de monitoreo recibidos:');
    console.log(`Temperatura: ${temperatura}°C`);
    console.log(`Humedad: ${humedad}%`);
    console.log(`Voltaje: ${voltaje}V`);
    console.log(`Consumo: ${consumo}W`);
    console.log(`Control: ${control}`);
    console.log("________________________________________________")

    res.sendStatus(200); // Respuesta exitosa
});


app.listen(PORT, () => {
    console.log(`La API está escuchando en el puerto ${PORT}`);
});