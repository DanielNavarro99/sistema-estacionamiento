const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Asegúrate que esta ruta a tu DB sea correcta

// 1. OBTENER EL ÚLTIMO REGISTRO
router.get('/ultimo', async (req, res) => {
    try {
        const sql = "SELECT * FROM registros ORDER BY id DESC LIMIT 1";
        const [rows] = await db.query(sql);
        res.json(rows.length > 0 ? rows[0] : null);
    } catch (error) {
        console.error("Error al obtener último:", error);
        res.status(500).send("Error del servidor");
    }
});

// 2. REGISTRAR ENTRADA (Usado por tu otra página de registro)
router.post('/', async (req, res) => {
    const { placa, tipo_vehiculo } = req.body;
    
    if (!placa) return res.status(400).json({ mensaje: "Falta la placa" });

    try {
        const sql = `
            INSERT INTO registros (placa, tipo_vehiculo, hora_entrada, estado) 
            VALUES (?, ?, NOW(), 'activo')
        `;
        const [result] = await db.query(sql, [placa, tipo_vehiculo || 'Automovil']);
        res.json({ mensaje: "Entrada registrada", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al guardar entrada");
    }
});

// 3. REGISTRAR SALIDA (COBRO CON MÍNIMO DE 1 HORA)
router.put('/:id/salida', async (req, res) => {
    const { id } = req.params;

    try {
        // --- TARIFAS ---
        const TARIFA_MOTO = 10;
        const TARIFA_AUTO = 20;
        const TARIFA_CAMIONETA = 30;

        // LÓGICA SQL AVANZADA:
        // 1. Calcula horas reales.
        // 2. Si horas < 1, cobra 1 hora completa. Si no, cobra lo real.
        const sql = `
            UPDATE registros 
            SET 
                hora_salida = NOW(), 
                estado = 'finalizado',
                
                -- Guardamos las horas reales
                horas_totales = TIMESTAMPDIFF(SECOND, hora_entrada, NOW()) / 3600.0,

                -- Calculamos costo (Mínimo 1 hora)
                costo_total = (
                    CASE 
                        WHEN (TIMESTAMPDIFF(SECOND, hora_entrada, NOW()) / 3600.0) < 1 THEN 1 
                        ELSE (TIMESTAMPDIFF(SECOND, hora_entrada, NOW()) / 3600.0) 
                    END
                ) * CASE 
                    WHEN tipo_vehiculo = 'Motocicleta' THEN ?
                    WHEN tipo_vehiculo = 'Camioneta' THEN ?
                    ELSE ? 
                END

            WHERE id = ?
        `;

        const [result] = await db.query(sql, [TARIFA_MOTO, TARIFA_CAMIONETA, TARIFA_AUTO, id]);

        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Registro no encontrado" });

        res.json({ mensaje: "Salida registrada exitosamente" });

    } catch (error) {
        console.error("Error en salida:", error);
        res.status(500).send("Error del servidor");
    }
});

module.exports = router;