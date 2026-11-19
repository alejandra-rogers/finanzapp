const express = require('express');
const pool = require('../db/conexion');
const verificarToken = require('../middleware/verificarToken');

const router = express.Router();
router.use(verificarToken);

// LISTAR: GET /api/presupuestos
router.get('/', async (req, res) => {
  try {
    const [filas] = await pool.query(
      'SELECT * FROM presupuestos WHERE usuario_id = ? ORDER BY categoria',
      [req.usuario.id]
    );
    res.json(filas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// GUARDAR: POST /api/presupuestos
// Si ya hay un presupuesto para esa categoría, lo actualiza (hay un UNIQUE en la tabla)
router.post('/', async (req, res) => {
  const { categoria, limite } = req.body;
  if (!categoria || !limite || isNaN(limite) || Number(limite) <= 0) {
    return res.status(400).json({ error: 'Faltan datos o el límite no es válido' });
  }

  try {
    await pool.query(
      `INSERT INTO presupuestos (usuario_id, categoria, limite) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE limite = VALUES(limite)`,
      [req.usuario.id, categoria, limite]
    );
    res.status(201).json({ mensaje: 'Presupuesto guardado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// BORRAR: DELETE /api/presupuestos/:id
router.delete('/:id', async (req, res) => {
  try {
    const [resultado] = await pool.query(
      'DELETE FROM presupuestos WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }
    res.json({ mensaje: 'Presupuesto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
