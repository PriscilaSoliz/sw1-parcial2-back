// db/initDB.js
const pool = require('./db');

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS salas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        contenido TEXT,
        creado_por INTEGER REFERENCES users(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sala_usuarios (
        id SERIAL PRIMARY KEY,
        sala_id INTEGER NOT NULL REFERENCES salas(id),
        usuario_id INTEGER NOT NULL REFERENCES users(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS editor (
        id SERIAL PRIMARY KEY,
        contenido TEXT,
        sala_id INTEGER NOT NULL REFERENCES salas(id)
      );
    `);

    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  }
}

module.exports = initializeDatabase;
