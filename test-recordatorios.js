
import { procesarRecordatorios } from './src/servicios/recordatorioServicio.js';
import { conexion, conectarDB } from './src/db/conexion.js';

const test = async () => {
  try {
    console.log('Iniciando test-recordatorios.js');
    console.log('Llamando a conectarDB...');
    await conectarDB(); // Establish the connection
    console.log('conectarDB completado.');
    console.log('Llamando a procesarRecordatorios...');
    await procesarRecordatorios();
    console.log('procesarRecordatorios completado.');
  } catch (error) {
    console.error('Error durante la prueba:', error);
  } finally {
    if (conexion) {
      await conexion.destroy(); // Close the connection
    }
  }
};

test();
