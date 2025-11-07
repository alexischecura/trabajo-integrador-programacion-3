import cron from 'node-cron';
import { procesarRecordatorios } from '../servicios/recordatorioServicio.js';
import { procesarConfirmaciones } from '../servicios/confirmacionServicio.js';

export const iniciarTareasProgramadas = () => {
  // Programar la tarea de recordatorios para que se ejecute cada hora
  cron.schedule('0 * * * *', async () => {
    console.log('Ejecutando tarea programada de recordatorios...');
    try {
      await procesarRecordatorios();
    } catch (error) {
      console.error('Error en la tarea programada de recordatorios:', error);
    }
  });

  // Programar la tarea de confirmaciones para que se ejecute cada minuto
  cron.schedule('* * * * *', async () => {
    console.log('Ejecutando tarea programada de confirmaciones...');
    try {
      await procesarConfirmaciones();
    } catch (error) {
      console.error('Error en la tarea programada de confirmaciones:', error);
    }
  });
};
