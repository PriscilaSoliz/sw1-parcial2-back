const express = require('express');
const { register, login } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware'); // 👈 Importamos el middleware

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// 🔥 Nueva ruta protegida
router.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: 'Perfil accedido correctamente',
        user: req.user
    }); 
});

module.exports = router;
