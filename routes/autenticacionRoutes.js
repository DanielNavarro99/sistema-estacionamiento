// routes/autenticacionRoutes.js
const express = require('express');
const router = express.Router();

// Importamos el controlador
// OJO: Asegúrate que el nombre del archivo en la carpeta controllers sea EXACTAMENTE 'autenticacionController.js'
const autenticacionController = require('../controllers/autenticacionController');

// Debugging: Esto nos dirá en la consola si está cargando bien las funciones
console.log("Cargando rutas de autenticación...");
console.log("Función login:", autenticacionController.login ? "✅ Existe" : "❌ No existe");
console.log("Función registro:", autenticacionController.registro ? "✅ Existe" : "❌ No existe");

// Definir rutas
router.post('/login', autenticacionController.login);
router.post('/registro', autenticacionController.registro);

module.exports = router;