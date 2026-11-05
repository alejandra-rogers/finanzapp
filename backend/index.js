// Lee el archivo .env (SIEMPRE primero)
require('dotenv').config();

const express = require('express');
const pool = require('./db/conexion');
const authRutas = require('./rutas/auth');
const verificarToken = require('./middleware/verificarToken');

const app = express();
app.use(express.json());
const PUERTO = process.env.PUERTO || 3000;

app.get('/', (req, res) => {
  res.send('¡Hola! El servidor de FinanzApp está funcionando.');
});

app.get('/api/estado', (req, res) => {
  res.json({ estado: 'ok', aplicacion: 'FinanzApp' });
});

// Ruta de prueba: le pregunta algo a la base de datos
app.get('/api/prueba-db', async (req, res) => {
  try {
    const [filas] = await pool.query('SELECT COUNT(*) AS total FROM usuarios');
    res.json({ conectado: true, usuarios: filas[0].total });
  } catch (error) {
    res.status(500).json({ conectado: false, error: error.message });
  }
});

app.use('/api/auth', authRutas);

app.get('/api/perfil', verificarToken, (req, res) => {
  res.json({ mensaje: 'Acceso permitido', usuario: req.usuario });
});
app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});