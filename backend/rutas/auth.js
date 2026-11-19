const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/conexion');

const router = express.Router();

// REGISTRO: POST /api/auth/registro
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    // ¿Ya existe ese email?
    const [existentes] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?', [email]
    );
    if (existentes.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Convertimos la contraseña en hash (10 = nivel de dificultad)
    const hash = await bcrypt.hash(password, 10);

    const [resultado] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
      [nombre, email, hash]
    );

    res.status(201).json({ mensaje: 'Usuario creado', id: resultado.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// LOGIN: POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [filas] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?', [email]
    );
    if (filas.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = filas[0];
    const coincide = await bcrypt.compare(password, usuario.password_hash);
    if (!coincide) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Creamos el token con el id del usuario, válido por 2 horas
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, nombre: usuario.nombre });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
