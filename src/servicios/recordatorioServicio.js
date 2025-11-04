import { conexion } from '../db/conexion.js';
import NotificacionEmailServicio from './notificacionEmailServicio.js';

const notificacionServicio = new NotificacionEmailServicio();

const buscarReservasParaRecordatorio = async () => {
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
            r.recordatorio_enviado = 0 AND
            CONCAT(r.fecha_reserva, ' ', t.hora_desde) BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 24 HOUR);
    `);
    return rows;
};

const marcarRecordatorioComoEnviado = async (reservaId) => {
    await conexion.query('UPDATE reservas SET recordatorio_enviado = 1 WHERE reserva_id = ?', [reservaId]);
};

export const procesarRecordatorios = async () => {
    console.log('Iniciando proceso de recordatorios...');
    const reservas = await buscarReservasParaRecordatorio();

    if (reservas.length === 0) {
        console.log('No hay recordatorios para enviar.');
        return;
    }

    for (const reserva of reservas) {
        try {
            console.log(`Enviando recordatorio para la reserva ${reserva.reserva_id} al email ${reserva.email}`);
            
            const emailOptions = {
                to: reserva.email,
                subject: 'Recordatorio de tu reserva',
                template: 'plantillaRecordatorio',
                context: {
                    nombre: reserva.nombre,
                    fecha: new Date(reserva.fecha_reserva).toLocaleDateString(),
                    hora: reserva.hora_desde,
                    nombre_salon: reserva.nombre_salon
                }
            };

            await notificacionServicio.enviar(emailOptions);
            await marcarRecordatorioComoEnviado(reserva.reserva_id);
            
            console.log(`Recordatorio enviado exitosamente para la reserva ${reserva.reserva_id}.`);

        } catch (error) {
            console.error(`Error al procesar recordatorio para la reserva ${reserva.reserva_id}:`, error);
        }
    }
    console.log('Proceso de recordatorios finalizado.');
};
