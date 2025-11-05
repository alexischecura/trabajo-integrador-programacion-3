import Reservas from '../db/reservas.js';
import AppError from '../utiles/AppError.js';

export default class ReservasServicio {
  constructor() {
    this.reservas = new Reservas();
  }

  crearReserva = async (datos) => {
    // Aquí podrías añadir lógica de negocio adicional antes de crear la reserva
    // Por ejemplo, verificar disponibilidad del salón, validar fechas, etc.

    const resultado = await this.reservas.crearReserva(datos);
    return resultado.insertId;
  };
}
