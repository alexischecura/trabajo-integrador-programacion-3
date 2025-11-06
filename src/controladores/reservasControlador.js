import cache from 'memory-cache';
import ReservasServicio from '../servicios/reservasServicio.js';

export default class ReservasControlador {
  constructor() {
    this.reservas = new ReservasServicio();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutos en milisegundos
  }

  buscarReservas = async (req, res, next) => {
    try {
      const cacheKey = `reservas_${JSON.stringify(req.query)}`;
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        return res.json({
          estado: true,
          origen: 'cache',
          datos: cachedData,
        });
      }

      const options = { ...req.query };

      if (req.user.tipo_usuario === 'cliente') {
        options.usuarioId = req.user.usuario_id;
      }
      
      const reservas = await this.reservas.buscarReservas(options);

      cache.put(cacheKey, reservas, this.cacheDuration);

      res.json({
        estado: true,
        origen: 'db',
        datos: reservas,
      });
    } catch (error) {
      console.error('Error en GET /reservas');
      next(error);
    }
  };

  buscarReservaPorId = async (req, res, next) => {
    try {
      const reserva = await this.reservas.buscarReservaPorId(
        req.params.reserva_id,
        req.user
      );

      res.json({ estado: true, datos: reserva });
    } catch (error) {
      console.error('Error en GET /reservas/:id');
      next(error);
    }
  };

  crearReserva = async (req, res, next) => {
    try {
      const idNuevo = await this.reservas.crearReserva(req.body);
      cache.clear();

      res.status(201).json({
        estado: true,
        mensaje: `Reserva creada con id ${idNuevo}`,
      });
    } catch (error) {
      console.error('Error en POST /reservas');
      next(error);
    }
  };

  actualizarReserva = async (req, res, next) => {
    try {
      await this.reservas.actualizarReserva(req.params.reserva_id, req.body);
      cache.clear();

      res.json({
        estado: true,
        mensaje: `Reserva con id ${req.params.reserva_id} actualizada correctamente`,
      });
    } catch (error) {
      console.error('Error en PUT /reservas/:id');
      next(error);
    }
  };

  eliminarReserva = async (req, res, next) => {
    try {
      await this.reservas.eliminarReserva(req.params.reserva_id);
      cache.clear();
      res.json({
        estado: true,
        mensaje: `Reserva con id ${req.params.reserva_id} eliminada correctamente`,
      });
    } catch (error) {
      console.error('Error en DELETE /reservas/:id');
      next(error);
    }
  };
}
