export const errorHandler = (error, req, res, next) => {
  if (error.isOperational) {
    const responseBody = {
      estado: false,
      mensaje: error.message,
    };

    if (error.data) {
      responseBody.errores = error.data;
    }

    res.status(error.statusCode).json(responseBody);
  } else if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    'body' in error
  ) {
    return res.status(400).json({ estado: false, mensaje: 'JSON inválido' });
  } else {
    console.error('Error inesperado', error);
    return res.status(500).json({
      estado: false,
      mensaje: 'Error interno del servidor',
    });
  }
};
