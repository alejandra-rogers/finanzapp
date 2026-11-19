// Lee el archivo .env (SIEMPRE primero)
require('dotenv').config();

const path = require('path');
const express = require('express');
const pool = require('./db/conexion');
const verificarToken = require('./middleware/verificarToken');

const authRutas = require('./rutas/auth');
const movimientosRutas = require('./rutas/movimientos');
const presupuestosRutas = require('./rutas/presupuestos');
const comprasRutas = require('./rutas/compras');

const app = express();
app.use(express.json());
const PUERTO = process.env.PUERTO || 3000;

// Sirve la página (carpeta frontend): abrir http://localhost:3000
app.use(express.static(path.join(__dirname, '..', 'frontend')));

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

// Rutas de la API
app.use('/api/auth', authRutas);
app.use('/api/movimientos', movimientosRutas);
app.use('/api/presupuestos', presupuestosRutas);
app.use('/api/compras', comprasRutas);

app.get('/api/perfil', verificarToken, (req, res) => {
  res.json({ mensaje: 'Acceso permitido', usuario: req.usuario });
});

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});
