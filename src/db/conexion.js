import mysql from 'mysql2/promise';

let conexion;

export const conectarDB = async () => {
  if (conexion) return; // Si ya está conectado, no hacer nada

  try {
    conexion = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      database: process.env.DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3307
    });
    console.log('Base de datos conectada exitosamente.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1); // Detener la aplicación si no se puede conectar
  }
};

export { conexion };