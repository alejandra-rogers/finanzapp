const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  // El token llega en el encabezado: Authorization: Bearer <token>
  const encabezado = req.headers.authorization;
  if (!encabezado) {
    return res.status(401).json({ error: 'Falta el token' });
  }

  const token = encabezado.split(' ')[1];

  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = datos;   // queda disponible para la ruta
    next();                // ¡pase!
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o vencido' });
  }
}

module.exports = verificarToken;