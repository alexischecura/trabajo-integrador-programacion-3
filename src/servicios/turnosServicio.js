import Turnos from '../db/turnos.js';
import AppError from '../utiles/AppError.js';

export default class TurnosServicio {
  constructor() {
    this.turnos = new Turnos();
  }

  buscarTurnos = (options) => {
    return this.turnos.buscarTurnos(options);
  };

  buscarTurnoPorId = async (turno_id) => {
    const resultado = await this.turnos.buscarTurnoPorId(turno_id);
    if (resultado.length === 0)
      throw new AppError(`Turno con id ${turno_id} no encontrado`, 404);
    return resultado[0];
  };

  crearTurno = async (datos) => {
    const disponibilidad = await this.turnos.consultarDisponibilidad(
      datos.hora_desde,
      datos.hora_hasta
    );

    if (!disponibilidad) {
      throw new AppError(
        'El horario del nuevo turno se superpone con otro turno existente',
        400
      );
    }

    const resultado = await this.turnos.crearTurno(datos);
    return resultado.insertId;
  };

  actualizarTurno = async (turno_id, datos) => {
    const turnoActual = await this.buscarTurnoPorId(turno_id);

    const disponibilidad = await this.turnos.consultarDisponibilidad(
      datos.hora_desde || turnoActual.hora_desde,
      datos.hora_hasta || turnoActual.hora_hasta,
      turno_id
    );

    if (!disponibilidad) {
      throw new AppError(
        'El horario del turno se superpone con otro turno existente',
        400
      );
    }

    const camposPermitidos = ['hora_desde', 'hora_hasta'];
    const datosFiltrados = Object.fromEntries(
      Object.entries(datos).filter(([key]) => camposPermitidos.includes(key))
    );

    if (Object.keys(datosFiltrados).length === 0) {
      throw new AppError('No hay campos válidos para actualizar', 400);
    }

    const resultado = await this.turnos.actualizarTurno(
      turno_id,
      datosFiltrados
    );
    return resultado.affectedRows > 0;
  };

  borrarTurno = async (turno_id) => {
    // La función buscarTurnoPorId lanza una excepción/404 si el turno no existe.
    await this.buscarTurnoPorId(turno_id);

    const resultado = await this.turnos.borrarTurno(turno_id);
    return resultado.affectedRows > 0;
  };
}
