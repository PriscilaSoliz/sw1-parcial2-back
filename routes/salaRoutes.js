    const express = require('express');
    const router = express.Router();
    const pool = require('../db/db');
    const authenticateToken = require('../middlewares/authMiddleware');

    // 🔥 Crear sala
    router.post('/salas', authenticateToken, async (req, res) => {
        const { nombre, descripcion } = req.body;
        const userId = req.user.id; // 👈 ID del usuario autenticado
        try {
            const result = await pool.query(
                'INSERT INTO salas (nombre, descripcion, creado_por) VALUES ($1, $2, $3) RETURNING *',
                [nombre, descripcion, userId]
            );
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error al crear sala:', error);
            res.status(500).json({ message: 'Error al crear sala' });
        }
    });

    // 🔥 Obtener todas las salas
    router.get('/salas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM salas ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener salas:', error);
        res.status(500).json({ message: 'Error al obtener salas' });
    }
    });

    // 🔥 Editar sala
    router.put('/salas/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    try {
        await pool.query(
        'UPDATE salas SET nombre = $1, descripcion = $2 WHERE id = $3',
        [nombre, descripcion, id]
        );
        res.json({ message: 'Sala actualizada correctamente' });
    } catch (error) {
        console.error('Error al editar sala:', error);
        res.status(500).json({ message: 'Error al editar sala' });
    }
    });

    // 🔥 Eliminar sala
    router.delete('/salas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM salas WHERE id = $1', [id]);
        res.json({ message: 'Sala eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar sala:', error);
        res.status(500).json({ message: 'Error al eliminar sala' });
    }
    });

    // 🔵 Obtener contenido de una sala
    router.get('/salas/:id/contenido', async (req, res) => {
        const { id } = req.params;
        try {
        const result = await pool.query('SELECT contenido FROM salas WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Sala no encontrada' });
        res.json(result.rows[0]);
        } catch (error) {
        console.error('Error al obtener contenido:', error);
        res.status(500).json({ message: 'Error al obtener contenido' });
        }
    });
    
    // 🔵 Guardar contenido de una sala
    router.put('/salas/:id/contenido', async (req, res) => {
        const { id } = req.params;
        const { contenido } = req.body;
        try {
        await pool.query('UPDATE salas SET contenido = $1 WHERE id = $2', [contenido, id]);
        res.json({ message: 'Contenido actualizado correctamente' });
        } catch (error) {
        console.error('Error al guardar contenido:', error);
        res.status(500).json({ message: 'Error al guardar contenido' });
        }
    });

    // ✅ INVITAR UN USUARIO A UNA SALA
    router.post('/salas/:salaId/invitar', async (req, res) => {
        const { salaId } = req.params;
        const { usuarioId } = req.body;
    
        try {
        // Primero, validar que no exista ya
        const existe = await pool.query(
            'SELECT * FROM sala_usuarios WHERE sala_id = $1 AND usuario_id = $2',
            [salaId, usuarioId]
        );
    
        if (existe.rows.length > 0) {
            return res.status(400).json({ message: 'El usuario ya está invitado a esta sala.' });
        }
    
        // Insertar nueva invitación
        await pool.query(
            'INSERT INTO sala_usuarios (sala_id, usuario_id) VALUES ($1, $2)',
            [salaId, usuarioId]
        );
    
        res.json({ message: 'Usuario invitado correctamente' });
        } catch (error) {
        console.error('Error al invitar usuario:', error);
        res.status(500).json({ message: 'Error al invitar usuario' });
        }
    });
    
    // ✅ LISTAR USUARIOS INVITADOS A UNA SALA
    router.get('/salas/:salaId/usuarios', async (req, res) => {
        const { salaId } = req.params;
    
        try {
        const result = await pool.query(
            `SELECT u.id, u.name, u.email
            FROM sala_usuarios su
            JOIN users u ON su.usuario_id = u.id
            WHERE su.sala_id = $1`,
            [salaId]
        );
    
        res.json(result.rows);
        } catch (error) {
        console.error('Error al obtener usuarios invitados:', error);
        res.status(500).json({ message: 'Error al obtener usuarios invitados' });
        }
    });
    
    // ✅ ELIMINAR UN USUARIO INVITADO
    router.delete('/salas/:salaId/usuarios/:usuarioId', async (req, res) => {
        const { salaId, usuarioId } = req.params;
    
        try {
        await pool.query(
            'DELETE FROM sala_usuarios WHERE sala_id = $1 AND usuario_id = $2',
            [salaId, usuarioId]
        );
    
        res.json({ message: 'Usuario eliminado de la sala correctamente' });
        } catch (error) {
        console.error('Error al eliminar invitado:', error);
        res.status(500).json({ message: 'Error al eliminar invitado' });
        }
    });

    // 🔵 Listar salas propias o donde estoy invitado
    router.get('/mis-salas', authenticateToken, async (req, res) => {
        const userId = req.user.id;
        try {
            const result = await pool.query(
                `
                SELECT DISTINCT s.*,
                CASE
                    WHEN s.creado_por = $1 THEN 'propia'
                    ELSE 'invitada'
                END AS tipo_sala
                FROM salas s
                LEFT JOIN sala_usuarios su ON s.id = su.sala_id
                WHERE s.creado_por = $1 OR su.usuario_id = $1
                ORDER BY s.id DESC
                `,
                [userId]
            );
        
            res.json(result.rows);
            } catch (error) {
            console.error('Error al obtener salas del usuario:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    });

    module.exports = router;
