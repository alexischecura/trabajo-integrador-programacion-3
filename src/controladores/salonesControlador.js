import { validationResult } from 'express-validator';
import cache from 'memory-cache';
import SalonesServicio from '../servicios/salonesServicio.js';

export default class SalonesControlador {
  constructor() {
    this.salones = new SalonesServicio();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutos en milisegundos
  }

  buscarSalones = async (req, res) => {
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
      console.log('Error en GET /salones', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  buscarSalonPorId = async (req, res) => {
    try {
      const salon_id = req.params.salon_id;
      const salon = await this.salones.buscarSalonPorId(salon_id);

      if (!salon) {
        return res.status(404).json({
          estado: false,
          mensaje: `Salón con el id ${salon_id} no encontrado`,
        });
      }

      res.json({ estado: true, datos: salon });
    } catch (error) {
      console.error('Error en GET /salones/:salon_id', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  crearSalon = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const idNuevo = await this.salones.crearSalon(req.body);
      cache.clear(); // Limpiar caché al crear

      res.status(201).json({
        estado: true,
        mensaje: `Salón creado con id ${idNuevo}`,
      });
    } catch (error) {
      console.error('Error en POST /salones', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  actualizarSalon = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const salon_id = req.params.salon_id;

      const actualizado = await this.salones.actualizarSalon(salon_id, req.body);
      cache.clear(); // Limpiar caché al actualizar

      if (actualizado === null) {
        return res.status(404).json({
          estado: false,
          mensaje: `Salón con id ${salon_id} no encontrado`,
        });
      }

      res.json({
        estado: true,
        mensaje: `Salón con id ${salon_id} actualizado correctamente`,
      });
    } catch (error) {
      console.error('Error en PUT /salones/:salon_id', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  borrarSalon = async (req, res) => {
    try {
      const salon_id = req.params.salon_id;
      const borrado = await this.salones.borrarSalon(salon_id);
      cache.clear(); // Limpiar caché al borrar

      if (borrado === null) {
        return res.status(404).json({
          estado: false,
          mensaje: `Salón con id ${salon_id} no encontrado`,
        });
      }

      res.json({
        estado: true,
        mensaje: `Salón con id ${salon_id} borrado correctamente`,
      });
    } catch (error) {
      console.error('Error en DELETE /salones/:salon_id', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };
}
