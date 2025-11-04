import app from "./reservas.js";
import { conectarDB } from "./db/conexion.js";
import cron from 'node-cron';
import { procesarRecordatorios } from './servicios/recordatorioServicio.js';

const port = process.env.PORT || 3000;

// Programar la tarea para que se ejecute cada hora
cron.schedule('0 * * * *', () => {
  console.log('Ejecutando tarea programada de recordatorios...');
  procesarRecordatorios();
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