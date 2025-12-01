const express = require('express');
<<<<<<< HEAD
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
=======
const cors = require('cors');
// Importamos la conexión a la base de datos
const db = require('./config/db');

// Importamos las rutas de autenticación
const authRoutes = require('./routes/autenticacionRoutes');

const app = express();

// --- 1. MIDDLEWARE (Configuraciones) ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. FRONTEND (Archivos estáticos) ---
app.use(express.static('public')); 

// --- 3. RUTAS DEL API ---
app.use('/api/auth', authRoutes);


// --- 4. INICIO DEL SERVIDOR ---
console.log("⏳ Intentando conectar a la base de datos...");

db.query('SELECT 1 + 1 AS result')
    .then(() => {
        console.log('✅ ¡Conexión exitosa a MySQL!');
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📄 Abre tu navegador en http://localhost:${PORT}/login.html`);
        });
    })
    .catch(err => {
        console.error('❌ Error fatal: No se pudo conectar a la base de datos.');
        console.error('   Motivo:', err.sqlMessage || err.code);
    });
>>>>>>> 12bc8c102eedeef976b680cfe24df7af50b0fa25
