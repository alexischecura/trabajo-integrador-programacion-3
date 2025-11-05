import { validationResult } from 'express-validator';
import ReservasServicio from '../servicios/reservasServicio.js';
import AppError from '../utiles/AppError.js';

export default class ReservasControlador {
  constructor() {
    this.reservas = new ReservasServicio();
  }

  crearReserva = async (req, res, next) => {
    try {
      const idNuevo = await this.reservas.crearReserva(req.body);

      res.status(201).json({
        estado: true,
        mensaje: `Reserva creada con id ${idNuevo}`,
      });
    } catch (error) {
      console.error('Error en POST /reservas');
      next(error);
    }
  };
}
