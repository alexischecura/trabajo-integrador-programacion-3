import { validationResult } from 'express-validator';
import TurnosServicio from '../servicios/turnosServicio.js';

export default class TurnosControlador {
  constructor() {
    this.servicios = new TurnosServicio();
  }

  buscarTurnos = async (req, res, next) => {
    try {
      const turnos = await this.servicios.buscarTurnos(req.query);

      res.json({
        estado: true,
        datos: turnos,
      });
    } catch (error) {
      console.log('Error en GET /turnos');
      next(error);
    }
  };

  buscarTurnoPorId = async (req, res, next) => {
    try {
      const turno_id = req.params.turno_id;
      const turno = await this.servicios.buscarTurnoPorId(turno_id);

      res.json({ estado: true, datos: turno });
    } catch (error) {
      console.error('Error en GET /turnos/:turno_id');
      next(error);
    }
  };

  crearTurno = async (req, res, next) => {
    try {
      const idNuevo = await this.servicios.crearTurno(req.body);

      res.status(201).json({
        estado: true,
        mensaje: `Turno creado con id ${idNuevo}`,
      });
    } catch (error) {
      console.error('Error en POST /turnos');
      next(error);
    }
  };

  actualizarTurno = async (req, res, next) => {
    try {
      const turno_id = req.params.turno_id;

      const actualizado = await this.servicios.actualizarTurno(
        turno_id,
        req.body
      );

      res.json({
        estado: true,
        mensaje: `Turno con id ${turno_id} actualizado correctamente`,
      });
    } catch (error) {
      console.error('Error en PUT /turnos/:turno_id');
      next(error);
    }
  };

  borrarTurno = async (req, res, next) => {
    try {
      const turno_id = req.params.turno_id;
      await this.servicios.borrarTurno(turno_id);

      res.json({
        estado: true,
        mensaje: `Turno con id ${turno_id} borrado correctamente`,
      });
    } catch (error) {
      console.error('Error en DELETE /turnos/:turno_id');
      next(error);
    }
  };
}
