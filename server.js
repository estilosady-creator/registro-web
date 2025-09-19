const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware para procesar datos JSON
app.use(bodyParser.json());
app.use(express.static('public')); // Carpeta para archivos HTML

// Ruta para recibir datos
app.post('/guardar', (req, res) => {
    const dato = req.body.dato;
    if(!dato) return res.status(400).send({mensaje: 'No se recibió dato'});

    // Guardar en un archivo JSON
    fs.readFile('datos.json', (err, data) => {
        let json = [];
        if(!err) json = JSON.parse(data);
        json.push({dato, fecha: new Date()});
        fs.writeFile('datos.json', JSON.stringify(json, null, 2), err => {
            if(err) return res.status(500).send({mensaje: 'Error al guardar'});
            res.send({mensaje: 'Dato guardado correctamente'});
        });
    });
});

// Ruta para obtener los datos
app.get('/datos', (req, res) => {
    fs.readFile('datos.json', (err, data) => {
        if(err) return res.status(500).send({mensaje: 'Error al leer datos'});
        res.send(JSON.parse(data || '[]'));
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
