import { conexion } from './conexion.js';
import { Parser } from 'json2csv';

export default class Reservas {
  buscarReservas = async (options = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'reserva_id',
      order = 'ASC',
      importeTotalMax,
      usuarioId,
    } = options;

    const offset = (page - 1) * limit;

    let querySQL = `SELECT 
        reserva_id, 
        fecha_reserva, 
        salon_id, 
        usuario_id, 
        turno_id, 
        foto_cumpleaniero, 
        tematica, 
        importe_salon, 
        importe_total 
      FROM reservas 
      WHERE activo=1`;

    const values = [];

    if (usuarioId) {
      querySQL += ' AND usuario_id = ?';
      values.push(usuarioId);
    }

    if (importeTotalMax) {
      querySQL += ' AND importe_total <= ?';
      values.push(importeTotalMax);
    }

    // Whitelist for sortBy columns to prevent SQL injection
    const allowedSortBy = [
      'reserva_id',
      'tematica',
      'importe_salon',
      'importe_total',
    ];
    if (allowedSortBy.includes(sortBy)) {
      querySQL += ` ORDER BY ${sortBy} ${
        order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
      }`;
    }

    querySQL += ' LIMIT ? OFFSET ?';
    values.push(
      parseInt(limit, 10).toString(),
      parseInt(offset, 10).toString()
    );

    const [reservas] = await conexion.execute(querySQL, values);

    return reservas;
  };

  buscarReservaPorId = async (reserva_id) => {
    const querySQL = `
      SELECT 
        r.*, 
        u.usuario_id AS u_usuario_id, u.nombre AS u_nombre, u.nombre_usuario AS u_email,
        s.salon_id AS s_salon_id, s.titulo AS s_titulo, s.direccion AS s_direccion,
        t.turno_id AS t_turno_id, t.hora_desde, t.hora_hasta,
        sv.servicio_id AS sv_servicio_id, sv.descripcion AS sv_descripcion, rs.importe AS rs_importe
      FROM reservas AS r
      INNER JOIN usuarios AS u ON u.usuario_id = r.usuario_id
      INNER JOIN salones AS s ON s.salon_id = r.salon_id
      INNER JOIN turnos AS t ON t.turno_id = r.turno_id
      LEFT JOIN reservas_servicios AS rs ON rs.reserva_id = r.reserva_id
      LEFT JOIN servicios AS sv ON sv.servicio_id = rs.servicio_id
      WHERE r.activo = 1 AND r.reserva_id = ?;
    `;

    const [resultado] = await conexion.execute(querySQL, [reserva_id]);

    return resultado;
  };

  consultarDisponibilidad = async (
    fecha_reserva,
    salon_id,
    turno_id,
    reserva_id = null
  ) => {
    let querySQL = `
      SELECT COUNT(*) AS cantidad
      FROM reservas
      WHERE fecha_reserva = ? AND salon_id = ? AND turno_id = ? AND activo = 1
    `;
    const values = [fecha_reserva, salon_id, turno_id];

    if (reserva_id !== null) {
      querySQL += ' AND reserva_id != ?';
      values.push(reserva_id);
    }

    const [resultado] = await conexion.execute(querySQL, values);

    return resultado[0].cantidad === 0;
  };

  crearReserva = async (reserva) => {
    const {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total,
    } = reserva;

    const querySQL = `
      INSERT INTO reservas (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const [resultado] = await conexion.query(querySQL, [
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total,
    ]);

    return resultado;
  };

  async actualizarReserva(reserva_id, datosFiltrados) {
    const campos = Object.keys(datosFiltrados);
    const valores = Object.values(datosFiltrados);

    const setCampos = campos.map((campo) => `${campo} = ?`).join(', ');

    const querySQL = `
    UPDATE reservas
    SET ${setCampos}
    WHERE reserva_id = ? AND activo = 1
  `;

    const [resultado] = await conexion.execute(querySQL, [
      ...valores,
      reserva_id,
    ]);

    return resultado;
  }

  eliminarReserva = async (reserva_id) => {
    const querySQL = `
      UPDATE reservas 
      SET activo = 0 
      WHERE reserva_id = ?`;

    const [resultado] = await conexion.execute(querySQL, [reserva_id]);

    return resultado;
  };

  informe = async () => {
    const [informeReservas] = await conexion.execute('CALL informe_reservas()');

    return informeReservas[0];
  };

  buscarReservasParaConfirmacion = async () => {
    const [rows] = await conexion.query(`
        SELECT 
            r.reserva_id,
            r.fecha_reserva,
            t.hora_desde,
            u.nombre_usuario,
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

  marcarConfirmacionComoEnviada = async (reservaId) => {
    await conexion.query(
      'UPDATE reservas SET confirmacion_enviada = 1 WHERE reserva_id = ?',
      [reservaId]
    );
  };

  buscarReservasParaRecordatorio = async () => {
    const [rows] = await conexion.query(`
        SELECT 
            r.reserva_id,
            r.fecha_reserva,
            t.hora_desde,
            u.nombre_usuario,
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

  marcarRecordatorioComoEnviado = async (reservaId) => {
    await conexion.query(
      'UPDATE reservas SET recordatorio_enviado = 1 WHERE reserva_id = ?',
      [reservaId]
    );
  };
}
