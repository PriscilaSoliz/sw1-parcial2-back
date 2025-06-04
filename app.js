const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); 
const salaRoutes = require('./routes/salaRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Aquí montas las rutas con prefijo /api
app.use('/api', authRoutes);
app.use('/api', salaRoutes);
app.use('/api', userRoutes);


// 🔥 Puerto
app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});
