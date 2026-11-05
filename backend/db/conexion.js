// Trae la librería para hablar con MySQL (versión con promesas)
const mysql = require('mysql2/promise');

// Lee los datos del archivo .env
require('dotenv').config();

// Crea un "pool" de conexiones a la base
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Lo exportamos para usarlo desde otros archivos
module.exports = pool;
