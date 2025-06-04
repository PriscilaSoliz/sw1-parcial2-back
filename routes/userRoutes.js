const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // Asegúrate de que tienes acceso a pool

// 🔎 Buscar usuarios por nombre o correo
router.get('/usuarios', async (req, res) => {
    const { search } = req.query;

    try {
        const result = await pool.query(
        `SELECT id, name, email FROM users
        WHERE name ILIKE $1 OR email ILIKE $1
        LIMIT 10`,
        [`%${search}%`]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
