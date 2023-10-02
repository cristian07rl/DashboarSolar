const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
// Habilita CORS para todas las rutas
app.use(cors());
const port = 3000; // Puedes cambiar el puerto según tus preferencias

var temperature, humidity, voltage, consumption, Control;
// Datos simulados de monitoreo de una planta solar
let solarData = {};

// Configura el middleware body-parser para analizar las solicitudes POST
app.use(bodyParser.urlencoded({ extended: false }));


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


app.listen(port, () => {
    console.log(`La API está escuchando en el puerto ${port}`);
});
