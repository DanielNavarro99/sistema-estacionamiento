
// routes/autenticacionRoutes.js
const express = require('express');
const router = express.Router();
// Importamos el archivo que modificamos en el Paso 2
const autenticacionController = require('../controllers/autenticacionController');

router.post('/login', autenticacionController.login);

// Esta línea conecta el botón del frontend con la función del backend
router.post('/registro', autenticacionController.registro);

module.exports = router;