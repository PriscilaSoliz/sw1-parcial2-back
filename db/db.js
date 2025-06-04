const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

module.exports = pool;

/*

    -- Tabla de usuarios
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );

    -- Tabla de salas
    CREATE TABLE salas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        contenido TEXT,
        creado_por INTEGER REFERENCES users(id)
    );

    -- Tabla intermedia de usuarios invitados a una sala
    CREATE TABLE sala_usuarios (
        id SERIAL PRIMARY KEY,
        sala_id INTEGER NOT NULL REFERENCES salas(id),
        usuario_id INTEGER NOT NULL REFERENCES users(id)
    );

    -- Tabla editor
    CREATE TABLE editor (
        id SERIAL PRIMARY KEY,
        contenido TEXT,
        sala_id INTEGER NOT NULL REFERENCES salas(id)
    );


*/