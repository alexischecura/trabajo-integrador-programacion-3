import Reservas from '../db/reservas.js';
import NotificacionEmailServicio from './notificacionEmailServicio.js';

const notificacionServicio = new NotificacionEmailServicio();
const reservasDb = new Reservas();

export const procesarRecordatorios = async () => {
  console.log('Iniciando proceso de recordatorios...');
  const reservas = await reservasDb.buscarReservasParaRecordatorio();

  if (reservas.length === 0) {
    console.log('No hay recordatorios para enviar.');
    return;
  }

  for (const reserva of reservas) {
    try {
      console.log(
        `Enviando recordatorio para la reserva ${reserva.reserva_id} al email ${reserva.nombre_usuario}`
      );

      const emailOptions = {
        to: reserva.nombre_usuario,
        subject: 'Recordatorio de tu reserva',
        template: 'plantillaRecordatorio',
        context: {
          nombre: reserva.nombre,
          fecha: new Date(reserva.fecha_reserva).toLocaleDateString(),
          hora: reserva.hora_desde,
          nombre_salon: reserva.nombre_salon,
        },
      };

      await notificacionServicio.enviar(emailOptions);
      await reservasDb.marcarRecordatorioComoEnviado(reserva.reserva_id);

      console.log(
        `Recordatorio enviado exitosamente para la reserva ${reserva.reserva_id}.`
      );
    } catch (error) {
      console.error(
        `Error al procesar recordatorio para la reserva ${reserva.reserva_id}:`,
        error
      );
    }
  }
  console.log('Proceso de recordatorios finalizado.');
};
