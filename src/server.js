import app from "./reservas.js";
import { conectarDB } from "./db/conexion.js";
import cron from 'node-cron';
import { procesarRecordatorios } from './servicios/recordatorioServicio.js';
import { procesarConfirmaciones } from './servicios/confirmacionServicio.js';

const port = process.env.PORT || 3000;

// Programar la tarea para que se ejecute cada hora
cron.schedule('0 * * * *', async () => {
  console.log('Ejecutando tarea programada de recordatorios...');
  try {
    await procesarRecordatorios();
  } catch (error) {
    console.error('Error en la tarea programada de recordatorios:', error);
  }
});

// Programar la tarea para que se ejecute cada minuto
cron.schedule('* * * * *', async () => {
  console.log('Ejecutando tarea programada de confirmaciones...');
  try {
    await procesarConfirmaciones();
  } catch (error) {
    console.error('Error en la tarea programada de confirmaciones:', error);
  }
});

const iniciarServidor = async () => {
  try {
    await conectarDB();
    app.listen(port, () => {
      console.log(`Servidor funcionando en puerto ${port}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error);
  }
};

iniciarServidor();