const db = require('../config/db');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscamos el usuario en la base de datos
        // NOTA: Usamos 'email' porque así lo definimos en tu base de datos
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password]);

        // 2. Si el arreglo está vacío, no existe el usuario
        if (rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Correo o contraseña incorrectos' 
            });
        }

        const usuario = rows[0];

        // 3. Si existe, respondemos con éxito y enviamos el ROL (admin/usuario)
        res.json({
            success: true,
            message: 'Bienvenido al sistema',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.rol // IMPORTANTE: Esto le dirá al frontend a dónde redirigir
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};