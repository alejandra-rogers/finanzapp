// Compras planificadas: cumple el requisito del «carro» de la materia
const express = require('express');
const pool = require('../db/conexion');
const verificarToken = require('../middleware/verificarToken');

const router = express.Router();
router.use(verificarToken);

// Fecha de hoy en formato AAAA-MM-DD (hora local)
function hoy() {
  const h = new Date();
  return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-${String(h.getDate()).padStart(2, '0')}`;
}

// LISTAR: GET /api/compras
router.get('/', async (req, res) => {
  try {
    const [filas] = await pool.query(
      'SELECT * FROM compras_planificadas WHERE usuario_id = ? ORDER BY creado_en',
      [req.usuario.id]
    );
    res.json(filas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// AGREGAR AL CARRO: POST /api/compras
router.post('/', async (req, res) => {
  const { producto, categoria, precio } = req.body;
  if (!producto || !categoria || !precio || isNaN(precio) || Number(precio) <= 0) {
    return res.status(400).json({ error: 'Faltan datos o el precio no es válido' });
  }

  try {
    const [resultado] = await pool.query(
      'INSERT INTO compras_planificadas (usuario_id, producto, categoria, precio) VALUES (?, ?, ?, ?)',
      [req.usuario.id, producto, categoria, precio]
    );
    res.status(201).json({ mensaje: 'Compra agregada', id: resultado.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// CONFIRMAR: POST /api/compras/:id/confirmar
// La compra se convierte en un gasto y sale del carro
router.post('/:id/confirmar', async (req, res) => {
  try {
    const [filas] = await pool.query(
      'SELECT * FROM compras_planificadas WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    if (filas.length === 0) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }
    const compra = filas[0];

    await pool.query(
      `INSERT INTO movimientos (usuario_id, tipo, descripcion, categoria, monto, fecha)
       VALUES (?, 'gasto', ?, ?, ?, ?)`,
      [req.usuario.id, compra.producto, compra.categoria, compra.precio, hoy()]
    );
    await pool.query('DELETE FROM compras_planificadas WHERE id = ?', [compra.id]);

    res.json({ mensaje: 'Compra confirmada y registrada como gasto' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// QUITAR DEL CARRO: DELETE /api/compras/:id
router.delete('/:id', async (req, res) => {
  try {
    const [resultado] = await pool.query(
      'DELETE FROM compras_planificadas WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }
    res.json({ mensaje: 'Compra quitada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
