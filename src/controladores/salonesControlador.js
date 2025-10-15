import { validationResult } from 'express-validator';
import cache from 'memory-cache';
import SalonesServicio from '../servicios/salonesServicio.js';
import AppError from '../utiles/AppError.js';

export default class SalonesControlador {
  constructor() {
    this.salones = new SalonesServicio();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutos en milisegundos
  }

  buscarSalones = async (req, res, next) => {
    try {
      const cacheKey = `salones_${JSON.stringify(req.query)}`;
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        return res.json({
          estado: true,
          origen: 'cache',
          datos: cachedData,
        });
      }

      const salones = await this.salones.buscarSalones(req.query);

      cache.put(cacheKey, salones, this.cacheDuration);

      res.json({
        estado: true,
        origen: 'db',
        datos: salones,
      });
    } catch (error) {
      console.log('Error en GET /salones');
      next(error);
    }
  };

  buscarSalonPorId = async (req, res, next) => {
    try {
      const salon_id = req.params.salon_id;
      const salon = await this.salones.buscarSalonPorId(salon_id);

      res.json({ estado: true, datos: salon });
    } catch (error) {
      console.error('Error en GET /salones/:salon_id');
      next(error);
    }
  };

  crearSalon = async (req, res) => {

    try {
      const idNuevo = await this.salones.crearSalon(req.body);
      cache.clear(); // Limpiar caché al crear

      res.status(201).json({
        estado: true,
        mensaje: `Salón creado con id ${idNuevo}`,
      });
    } catch (error) {
      console.error('Error en POST /salones');
      next(error);
    }
  };

  actualizarSalon = async (req, res) => {

    try {
      const salon_id = req.params.salon_id;

      await this.salones.actualizarSalon(
        salon_id,
        req.body
      );
      cache.clear(); // Limpiar caché al actualizar

      res.json({
        estado: true,
        mensaje: `Salón con id ${salon_id} actualizado correctamente`,
      });
    } catch (error) {
      console.error('Error en PUT /salones/:salon_id');
      next(error);
    }
  };

  borrarSalon = async (req, res, next) => {
    try {
      const salon_id = req.params.salon_id;
      await this.salones.borrarSalon(salon_id);
      cache.clear(); // Limpiar caché al borrar

      res.json({
        estado: true,
        mensaje: `Salón con id ${salon_id} borrado correctamente`,
      });
    } catch (error) {
      console.error('Error en DELETE /salones/:salon_id');
      next(error);
    }
  };
}
