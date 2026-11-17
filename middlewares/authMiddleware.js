import jwt from 'jsonwebtoken';

// Función "patovica" para proteger las rutas privadas
export const verificarToken = (req, res, next) => {
  // 1. Buscamos el token en la cabecera (headers) de la petición que hace el frontend
  const tokenHeader = req.header('Authorization');

  // 2. Si ni siquiera trae la pulsera VIP, le denegamos el acceso
  if (!tokenHeader) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Se requiere un token de seguridad.' });
  }

  try {
    // 3. El frontend suele enviar el token con la palabra "Bearer " adelante. Se la sacamos.
    const tokenLimpio = tokenHeader.replace('Bearer ', '');

    // 4. Verificamos que el token sea auténtico usando la palabra secreta del .env
    const usuarioVerificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
    
    // 5. Si es válido, guardamos los datos del usuario y le abrimos la puerta (next)
    req.usuario = usuarioVerificado;
    next();

  } catch (error) {
    // Si el token fue inventado o ya pasaron las 2 horas de vigencia
    res.status(401).json({ mensaje: 'Token inválido o expirado. Iniciá sesión nuevamente.' });
  }
};