export const allowRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, mensaje: 'No autorizado' });
    }

    const { tipo_usuario } = req.user;

    if (!rolesPermitidos.includes(tipo_usuario)) {
      return res.status(403).json({
        ok: false,
        mensaje: 'Acceso denegado: no tenés permisos para esta acción',
      });
    }

    next();
  };
};