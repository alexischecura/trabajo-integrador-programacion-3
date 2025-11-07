import Reservas from '../db/reservas.js';
import ReservasServicios from '../db/reservas_servicios.js';
import AppError from '../utiles/AppError.js';

export default class ReservasServicio {
  constructor() {
    this.reservas = new Reservas();
    this.reservas_servicios = new ReservasServicios();
  }

  buscarReservas = (options) => {
    return this.reservas.buscarReservas(options);
  };

  buscarReservaPorId = async (reserva_id, user) => {
    const resultado = await this.reservas.buscarReservaPorId(reserva_id);

    if (resultado.length === 0) {
      throw new AppError(`Reserva con id ${reserva_id} no encontrada`, 404);
    }

    if (user.tipo_usuario === 'cliente') {
      const reserva = resultado[0];
      if (reserva.usuario_id !== user.usuario_id) {
        throw new AppError(
          'No tienes permiso para ver esta reserva',
          403
        );
      }
    }

    const r = resultado[0];

    const reserva = {
      reserva_id: r.reserva_id,
      fecha_reserva: r.fecha_reserva,
      salon_id: r.salon_id,
      usuario_id: r.usuario_id,
      turno_id: r.turno_id,
      foto_cumpleaniero: r.foto_cumpleaniero,
      tematica: r.tematica,
      importe_salon: r.importe_salon,
      importe_total: r.importe_total,
      usuario: {
        usuario_id: r.u_usuario_id,
        nombre: r.u_nombre,
        email: r.u_email,
      },
      salon: {
        salon_id: r.s_salon_id,
        titulo: r.s_titulo,
        direccion: r.s_direccion,
      },
      turno: {
        turno_id: r.t_turno_id,
        hora_desde: r.hora_desde,
        hora_hasta: r.hora_hasta,
      },
      servicios: resultado
        .filter((row) => row.sv_servicio_id !== null)
        .map((row) => ({
          servicio_id: row.sv_servicio_id,
          descripcion: row.sv_descripcion,
          importe: row.rs_importe,
        })),
    };

    return reserva;
  };

  crearReserva = async (datos) => {
    const {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
    } = datos;

    const disponibilidad = await this.reservas.consultarDisponibilidad(
      fecha_reserva,
      salon_id,
      turno_id
    );

    if (!disponibilidad) {
      throw new AppError(
        `El salón con id ${salon_id} no está disponible para la fecha ${fecha_reserva} y el turno ${turno_id}`,
        400
      );
    }

    const datosReserva = {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total:
        parseFloat(importe_salon) +
        (datos.servicios
          ? datos.servicios.reduce(
              (acc, servicio) => acc + parseFloat(servicio.importe),
              0
            )
          : 0),
    };

    const resultado = await this.reservas.crearReserva(datosReserva);

    await this.reservas_servicios.crearReservaServicios(
      resultado.insertId,
      datos.servicios || []
    );

    return resultado.insertId;
  };

  actualizarReserva = async (reserva_id, datos) => {
    const reservaActual = await this.buscarReservaPorId(reserva_id);

    const camposPermitidos = [
      'fecha_reserva',
      'salon_id',
      'turno_id',
      'foto_cumpleaniero',
      'tematica',
      'importe_salon',
    ];

    const datosFiltrados = Object.fromEntries(
      Object.entries(datos).filter(([key]) => camposPermitidos.includes(key))
    );

    if (Object.keys(datosFiltrados).length === 0) {
      throw new AppError('No hay campos válidos para actualizar', 400);
    }

    const salon_id = datos.salon_id || reservaActual.salon_id;
    const fecha_reserva = datos.fecha_reserva || reservaActual.fecha_reserva;
    const turno_id = datos.turno_id || reservaActual.turno_id;

    const disponibilidad = await this.reservas.consultarDisponibilidad(
      fecha_reserva,
      salon_id,
      turno_id,
      reserva_id
    );

    if (!disponibilidad) {
      throw new AppError(
        `El salón con id ${salon_id} no está disponible para la fecha ${fecha_reserva} y el turno ${turno_id}`,
        400
      );
    }

    if (datos.importe_salon) {
      const importe_total =
        reservaActual.importe_total -
        reservaActual.importe_salon +
        parseFloat(datos.importe_salon);

      datos.importe_total = importe_total;
    }

    return this.reservas.actualizarReserva(reserva_id, datosFiltrados);
  };

  eliminarReserva = async (reserva_id) => {
    // La función buscarReservaPorId lanza una excepción/404 si la reserva no existe.
    await this.buscarReservaPorId(reserva_id);

    return this.reservas.eliminarReserva(reserva_id);
  };
}
