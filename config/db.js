const mysql = require('mysql2');
// Importamos dotenv para leer el archivo .env
require('dotenv').config();

// No usar createConnection, ya que si hay 2 usuarios el segundo usuario tendría que esperar al primero.
const pool = mysql.createPool({
    host: process.env.DB_HOST,      // Lee del archivo .env
    user: process.env.DB_USER,      // Lee del archivo .env
    password: process.env.DB_PASSWORD, // Lee del archivo .env
    database: process.env.DB_NAME,  // Lee del archivo .env
    waitForConnections: true,
    connectionLimit: 10, // hasta 10 conexiones simultáneas
    queueLimit: 0
});

module.exports = pool.promise();