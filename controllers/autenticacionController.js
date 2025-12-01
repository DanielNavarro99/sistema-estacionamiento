// controllers/autenticacionController.js
const db = require('../config/db');

// --- Función 1: LOGIN (Se mantiene igual) ---
exports.login = async (req, res) => {
// ... (código del login se mantiene igual) ...
};

// --- Función 2: REGISTRO (CON DEBUG PARA ENCONTRAR EL ERROR DE REGISTRO) ---
exports.registro = async (req, res) => {
    try {
        const { nombre, email, password, tipo_vehiculo, marca_vehiculo, placa } = req.body;

        // 1. Validaciones
        if (!nombre || !email || !password || !placa) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }

        // 2. Verificar duplicados de EMAIL
        const [existe] = await db.query("SELECT id FROM usuarios WHERE email = ?", [email]);
        if (existe.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado.' });
        }

        // 3. Verificar si la placa ya tiene un registro activo (Buena práctica)
        const [placaActiva] = await db.query("SELECT id FROM registros WHERE placa = ? AND estado = 'activo'", [placa]);
        if (placaActiva.length > 0) {
            return res.status(400).json({ error: 'La placa ya tiene un vehículo registrado y activo en el estacionamiento.' });
        }


        // 4. INSERTAR USUARIO en la tabla 'usuarios'
        const sqlUser = "INSERT INTO usuarios (nombre, email, password, rol, tipo_vehiculo, marca_vehiculo, placa) VALUES (?, ?, ?, 'usuario', ?, ?, ?)";
        const [userResult] = await db.query(sqlUser, [nombre, email, password, tipo_vehiculo, marca_vehiculo, placa]);
        
        // Obtenemos el ID del usuario recién creado
        const nuevoUsuarioId = userResult.insertId; 


        // 5. CREAR TICKET DE ENTRADA en la tabla 'registros'
        const sqlRegistro = `
            INSERT INTO registros 
            (placa, tipo_vehiculo, usuario_entrada_id, estado) 
            VALUES (?, ?, ?, 'activo')
        `;
        
        // El problema debe estar aquí. Si falla, el error lo capturamos abajo.
        await db.query(sqlRegistro, [placa, tipo_vehiculo, nuevoUsuarioId]); 


        res.status(201).json({ mensaje: 'Usuario y ticket de entrada registrados exitosamente' });

    } catch (error) {
        // 🚨 CAMBIO CLAVE: Imprimir el error de la DB si existe para debug
        if (error.sqlMessage) {
            console.error("❌ ERROR CRÍTICO SQL al crear registro/ticket:", error.sqlMessage);
            console.error("SQL FALLIDA:", error.sql);
            // Enviamos el mensaje de error de MySQL al frontend para debug
            return res.status(500).json({ error: `Error DB (Ticket): ${error.sqlMessage}` });
        }
        
        console.error("Error al registrar usuario y ticket:", error);
        res.status(500).json({ error: 'Error al completar el registro en el servidor' });
    }
};