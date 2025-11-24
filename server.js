const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Para recibir JSON
app.use(express.urlencoded({ extended: true })); // Para recibir datos de formularios HTML

// Archivos Estáticos (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas (Importar las rutas que crearás)
// const vehiculosRoutes = require('./routes/vehiculosRoutes');
// app.use('/api/vehiculos', vehiculosRoutes);

// Ruta base para servir el HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Arrancar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});