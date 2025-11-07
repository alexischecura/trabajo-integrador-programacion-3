import Reservas from '../db/reservas.js';
import NotificacionEmailServicio from './notificacionEmailServicio.js';

const notificacionServicio = new NotificacionEmailServicio();
const reservasDb = new Reservas();

export const procesarConfirmaciones = async () => {
    console.log('Iniciando proceso de confirmaciones...');
    const reservas = await reservasDb.buscarReservasParaConfirmacion();

    if (reservas.length === 0) {
        console.log('No hay confirmaciones para enviar.');
        return;
    }

    for (const reserva of reservas) {
        try {
            console.log(`Enviando confirmación para la reserva ${reserva.reserva_id} al email ${reserva.nombre_usuario}`);
            
            const emailOptions = {
                to: reserva.nombre_usuario,
                subject: 'Confirmación de tu reserva',
                template: 'plantillaConfirmacionDeTurno',
                context: {
                    nombre: reserva.nombre,
                    fecha: new Date(reserva.fecha_reserva).toLocaleDateString(),
                    hora: reserva.hora_desde,
                    nombre_salon: reserva.nombre_salon
                }
            };

            await notificacionServicio.enviar(emailOptions);
            await reservasDb.marcarConfirmacionComoEnviada(reserva.reserva_id);
            
            console.log(`Confirmación enviada exitosamente para la reserva ${reserva.reserva_id}.`);

        } catch (error) {
            console.error(`Error al procesar confirmación para la reserva ${reserva.reserva_id}:`, error);
        }
    }
    console.log('Proceso de confirmaciones finalizado.');
};
