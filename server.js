const express = require('express');
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