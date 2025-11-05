import { conexion } from './conexion.js';

export default class Turnos {
  buscarTurnos = async () => {
    const querySQL = 'SELECT * FROM turnos WHERE activo=1';
    const [turnos] = await conexion.execute(querySQL);

    return turnos;
  };

  buscarTurnoPorId = async (turno_id) => {
    const querySQL = `
      SELECT * FROM turnos WHERE activo=1 AND turno_id = ?`;
    const [resultado] = await conexion.execute(querySQL, [turno_id]);
    return resultado;
  };

  consultarDisponibilidad = async (
    hora_desde,
    hora_hasta,
    turno_id = null
  ) => {
    let querySQL = `
      SELECT * FROM turnos
      WHERE activo = 1
      AND hora_desde < ? AND hora_hasta > ?`;
    const valores = [hora_hasta, hora_desde];

    if (turno_id !== null) {
      querySQL += ' AND turno_id != ?';
      valores.push(turno_id);
    }

    const [resultado] = await conexion.execute(querySQL, valores);
    return resultado.length === 0;
  };

  crearTurno = async ({ hora_desde, hora_hasta }) => {
    const querySQL = `
      INSERT INTO turnos (hora_desde, hora_hasta) 
      VALUES (?, ?)`;

    const valores = [hora_desde, hora_hasta];
    const [resultado] = await conexion.execute(querySQL, valores);
    return resultado;
  };

  actualizarTurno = async (turno_id, datosFiltrados) => {
    const campos = Object.keys(datosFiltrados);
    const valores = Object.values(datosFiltrados);

    const setCampos = campos.map((campo) => `${campo} = ?`).join(', ');

    const querySQL = `
    UPDATE turnos 
    SET ${setCampos}
    WHERE turno_id = ? AND activo = 1
  `;
    const [resultado] = await conexion.execute(querySQL, [
      ...valores,
      turno_id,
    ]);
    return resultado;
  };

  borrarTurno = async (turno_id) => {
    const querySQL = `
      UPDATE turnos
      SET activo = 0
      WHERE turno_id = ?`;
    const [resultado] = await conexion.execute(querySQL, [turno_id]);

    return resultado;
  };
}
