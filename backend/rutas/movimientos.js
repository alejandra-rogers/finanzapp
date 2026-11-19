const express = require('express');
const pool = require('../db/conexion');
const verificarToken = require('../middleware/verificarToken');

const router = express.Router();

// Todas las rutas de este archivo exigen estar logueada
router.use(verificarToken);

// Revisa que los datos de un movimiento sean correctos.
// Devuelve un texto con el error, o null si está todo bien.
function validarMovimiento({ tipo, descripcion, categoria, monto, fecha }) {
  if (!tipo || !descripcion || !categoria || !monto || !fecha) {
    return 'Faltan datos';
  }
  if (tipo !== 'ingreso' && tipo !== 'gasto') {
    return 'El tipo debe ser "ingreso" o "gasto"';
  }
  if (isNaN(monto) || Number(monto) <= 0) {
    return 'El monto debe ser un número mayor a 0';
  }
  return null;
}

// LISTAR: GET /api/movimientos  (opcional: ?mes=2026-11)
router.get('/', async (req, res) => {
  const { mes } = req.query;

  try {
    let sql = 'SELECT * FROM movimientos WHERE usuario_id = ?';
    const valores = [req.usuario.id];

    if (mes) {
      sql += " AND DATE_FORMAT(fecha, '%Y-%m') = ?";
      valores.push(mes);
    }
    sql += ' ORDER BY fecha DESC';

    const [filas] = await pool.query(sql, valores);
    res.json(filas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// CREAR: POST /api/movimientos
router.post('/', async (req, res) => {
  const error = validarMovimiento(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { tipo, descripcion, categoria, monto, fecha } = req.body;

  try {
    const [resultado] = await pool.query(
      `INSERT INTO movimientos (usuario_id, tipo, descripcion, categoria, monto, fecha)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.usuario.id, tipo, descripcion, categoria, monto, fecha]
    );
    res.status(201).json({ mensaje: 'Movimiento creado', id: resultado.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// EDITAR: PUT /api/movimientos/:id
router.put('/:id', async (req, res) => {
  const error = validarMovimiento(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { tipo, descripcion, categoria, monto, fecha } = req.body;

  try {
    const [resultado] = await pool.query(
      `UPDATE movimientos
       SET tipo = ?, descripcion = ?, categoria = ?, monto = ?, fecha = ?
       WHERE id = ? AND usuario_id = ?`,
      [tipo, descripcion, categoria, monto, fecha, req.params.id, req.usuario.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    res.json({ mensaje: 'Movimiento actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// BORRAR: DELETE /api/movimientos/:id
router.delete('/:id', async (req, res) => {
  try {
    const [resultado] = await pool.query(
      'DELETE FROM movimientos WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    res.json({ mensaje: 'Movimiento eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
