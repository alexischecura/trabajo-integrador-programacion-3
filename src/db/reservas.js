// src/db/reservas.js
import { conexion } from './conexion.js';
import { Parser } from 'json2csv';

export default class Reservas {
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

  /**
   * Inserta una nueva reserva en la base de datos.
   * @param {object} datosReserva - Objeto con los datos de la reserva.
   * @returns {Promise<object>} El resultado de la consulta (ej. { insertId: 5 })
   */
  crearReserva = async (datosReserva) => {

    const { usuario_id, salon_id, fecha_reserva, hora_inicio, hora_fin } =
      datosReserva;


    const querySQL = `
      INSERT INTO reservas (usuario_id, salon_id, fecha_reserva, hora_inicio, hora_fin) 
      VALUES (?, ?, ?, ?, ?)`;

    const valores = [
      usuario_id,
      salon_id,
      fecha_reserva,
      hora_inicio,
      hora_fin,
    ];


    const [resultado] = await conexion.execute(querySQL, valores);


    return resultado;
  };

}
