const db = require('../config/db'); // Importamos la conexión

// --- Función 1: LOGIN (Necesaria para entrar) ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar datos básicos
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Faltan datos' });
        }

        // Buscar usuario en BD
        const [users] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        // Verificar si existe y la contraseña coincide
        if (users.length === 0 || users[0].password !== password) {
            return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
        }

        // ¡Login exitoso!
        res.json({ 
            success: true, 
            message: 'Login exitoso', 
            usuario: users[0] 
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ success: false, error: 'Error en el servidor' });
    }
};

// --- Función 2: REGISTRO (La nueva que guarda en BD) ---
exports.registro = async (req, res) => {
    try {
        // Recibimos todos los datos del formulario
        const { nombre, email, password, tipo_vehiculo, marca_vehiculo, placa } = req.body;

        // 1. Validar que no falten datos obligatorios
        if (!nombre || !email || !password || !placa) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (Nombre, Email, Pass o Placa)' });
        }

        // 2. INSERTAR EN MYSQL
        const sql = `
            INSERT INTO usuarios 
            (nombre, email, password, rol, tipo_vehiculo, marca_vehiculo, placa) 
            VALUES (?, ?, ?, 'usuario', ?, ?, ?)
        `;
        
        await db.query(sql, [nombre, email, password, tipo_vehiculo, marca_vehiculo, placa]);

        // Responder éxito
        res.status(201).json({ mensaje: 'Usuario guardado exitosamente' });

    } catch (error) {
        console.error("Error en registro:", error);
        
        // Si el correo o placa ya existen (Error duplicado de MySQL)
        if (error.code === 'ER_DUP_ENTRY') { 
            return res.status(400).json({ error: 'Ese correo o placa ya están registrados.' });
        }
        
        res.status(500).json({ error: 'Error del servidor al registrar' });
    }
};