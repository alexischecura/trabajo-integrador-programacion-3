import { conexion } from '../db/conexion.js';
import NotificacionEmailServicio from './notificacionEmailServicio.js';

const notificacionServicio = new NotificacionEmailServicio();

const buscarReservasParaConfirmacion = async () => {
    const [rows] = await conexion.query(`
        SELECT 
            r.reserva_id,
            r.fecha_reserva,
            t.hora_desde,
            u.email,
            u.nombre,
            s.titulo as nombre_salon
        FROM reservas r
        JOIN usuarios u ON r.usuario_id = u.usuario_id
        JOIN turnos t ON r.turno_id = t.turno_id
        JOIN salones s ON r.salon_id = s.salon_id
        WHERE 
            r.activo = 1 AND
            r.confirmacion_enviada = 0;
    `);
    return rows;
};

const marcarConfirmacionComoEnviada = async (reservaId) => {
    await conexion.query('UPDATE reservas SET confirmacion_enviada = 1 WHERE reserva_id = ?', [reservaId]);
};

export const procesarConfirmaciones = async () => {
    console.log('Iniciando proceso de confirmaciones...');
    const reservas = await buscarReservasParaConfirmacion();

    if (reservas.length === 0) {
        console.log('No hay confirmaciones para enviar.');
        return;
    }

    for (const reserva of reservas) {
        try {
            console.log(`Enviando confirmación para la reserva ${reserva.reserva_id} al email ${reserva.email}`);
            
            const emailOptions = {
                to: reserva.email,
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
            await marcarConfirmacionComoEnviada(reserva.reserva_id);
            
            console.log(`Confirmación enviada exitosamente para la reserva ${reserva.reserva_id}.`);

        } catch (error) {
            console.error(`Error al procesar confirmación para la reserva ${reserva.reserva_id}:`, error);
        }
    }
    console.log('Proceso de confirmaciones finalizado.');
};
