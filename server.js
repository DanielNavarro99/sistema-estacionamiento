const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Importante para leer tu archivo .env

// Importamos la conexión a la base de datos
const db = require('./config/db');

// Importamos las rutas (Asegúrate de que este archivo exista, si no, comenta esta línea)
const authRoutes = require('./routes/autenticacionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Para recibir JSON
app.use(express.urlencoded({ extended: true })); // Para formularios HTML normal

// --- 2. ARCHIVOS ESTÁTICOS ---
// Esto hace que la carpeta 'public' sea accesible desde el navegador
app.use(express.static(path.join(__dirname, 'public')));

// --- 3. RUTAS DEL API ---
// Aquí conectamos las rutas de autenticación que venían de GitHub
app.use('/api/auth', authRoutes);

// Ruta principal: Si entran a localhost:3000, los mandamos al login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// --- 4. INICIO DEL SERVIDOR ---
console.log("⏳ Intentando conectar a la base de datos...");

// Primero verificamos que la BD funcione, luego arrancamos el servidor
db.query('SELECT 1')
    .then(() => {
        console.log('✅ ¡Conexión exitosa a MySQL!');
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Error fatal: No se pudo conectar a la base de datos.');
        console.error('   Motivo:', err.message);
        console.error('   -> Revisa tu archivo .env y que XAMPP esté prendido.');
    });