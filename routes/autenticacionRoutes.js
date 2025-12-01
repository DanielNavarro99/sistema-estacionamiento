const express = require('express');
const router = express.Router();
const autenticacionController = require('../controllers/autenticacionController');

// Definimos la ruta POST para el login
router.post('/login', autenticacionController.login);

module.exports = router;