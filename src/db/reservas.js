import { conexion } from './conexion.js';

export default class Reservas {
  crearReserva = async (datos) => {
    const { fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total } = datos;
    const [resultado] = await conexion.query(
      'INSERT INTO reservas (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total]
    );
    return resultado;
  };
}
