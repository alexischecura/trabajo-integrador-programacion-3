import { conexion } from './conexion.js';
import { Parser } from 'json2csv';

export default class Reservas {

  crearReserva = async (datos) => {
    const { fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total } = datos;
    const [resultado] = await conexion.query(
      'INSERT INTO reservas (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total]
    );
    return resultado;
  };


  /**
   * Obtiene todas las reservas y las convierte a formato CSV.
   * @returns {Promise<string>} Una cadena de texto en formato CSV.
   */
  exportarCSV = async () => {

    const [reservas] = await conexion.query('SELECT * FROM reservas');


    if (reservas.length === 0) {

      throw new Error('No hay reservas para exportar.');
    }


    const fields = [
      'id',
      'usuario_id',
      'salon_id',
      'fecha_reserva',
      'hora_inicio',
      'hora_fin',
      'estado',
      'creada_en',
    ];


    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(reservas);

    return csv;
  };

}
