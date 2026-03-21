import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // 1. Verificar existencia
    if (!authHeader) {
      return res.status(401).json({
        error: 'Token requerido',
      });
    }

    // 2. Verificar formato Bearer
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Formato de token inválido',
      });
    }

    // 3. Extraer token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token vacío',
      });
    }

    // 4. Verificar JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no definido');
      return res.status(500).json({
        error: 'Error de configuración del servidor',
      });
    }

    // 5. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 6. Adjuntar usuario al request
    req.user = decoded;
    console.log('User: ', req.user);
    next();
  } catch (error) {
    // Manejo específico de errores JWT
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        error: 'Token expirado',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        error: 'Token inválido',
      });
    }

    return res.status(403).json({
      error: 'No autorizado',
    });
  }
}