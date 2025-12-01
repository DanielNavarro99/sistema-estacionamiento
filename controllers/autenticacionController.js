// controllers/autenticacionController.js
const db = require('../config/db');

// --- Función 1: LOGIN ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Faltan datos' });

        const [users] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (users.length === 0 || users[0].password !== password) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        res.json({ message: 'Login exitoso', user: users[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// --- Función 2: REGISTRO (¡ESTA ES LA QUE TE FALTA!) ---
exports.registro = async (req, res) => {
    try {
        const { nombre, email, password, tipo_vehiculo, marca_vehiculo, placa } = req.body;

        // Validaciones
        if (!nombre || !email || !password || !placa) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }

        // Verificar duplicados
        const [existe] = await db.query("SELECT id FROM usuarios WHERE email = ?", [email]);
        if (existe.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado.' });
        }

        // Insertar
        const sql = "INSERT INTO usuarios (nombre, email, password, rol, tipo_vehiculo, marca_vehiculo, placa) VALUES (?, ?, ?, 'usuario', ?, ?, ?)";
        await db.query(sql, [nombre, email, password, tipo_vehiculo, marca_vehiculo, placa]);

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};