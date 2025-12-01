// controllers/authController.js
const db = require('../config/db');

exports.registroCompleto = async (req, res) => {
    try {
        const { nombre, email, password, tipo_vehiculo, marca_vehiculo, placa } = req.body;

        // 1. Validaciones básicas
        if (!nombre || !email || !password || !placa) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }

        // 2. Verificar si el correo YA existe
        const [userExists] = await db.query("SELECT id FROM usuarios WHERE email = ?", [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // 3. Insertar usuario con datos del vehículo
        // NOTA: Usamos las columnas nuevas que agregamos en el Paso 1
        const sql = `
            INSERT INTO usuarios 
            (nombre, email, password, rol, tipo_vehiculo, marca_vehiculo, placa) 
            VALUES (?, ?, ?, 'usuario', ?, ?, ?)
        `;

        await db.query(sql, [nombre, email, password, tipo_vehiculo, marca_vehiculo, placa]);

        res.status(201).json({ mensaje: 'Usuario y vehículo registrados correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor al guardar usuario' });
    }
};