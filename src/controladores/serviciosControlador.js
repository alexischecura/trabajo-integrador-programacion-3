import { validationResult } from 'express-validator';
import cache from 'memory-cache';
import ServiciosServicio from '../servicios/serviciosServicio.js';

export default class ServiciosControlador {
  constructor() {
    this.servicios = new ServiciosServicio();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutos en milisegundos
  }

  buscarServicios = async (req, res, next) => {
    try {
      const cacheKey = `servicios_${JSON.stringify(req.query)}`;
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        return res.json({
          estado: true,
          origen: 'cache',
          datos: cachedData,
        });
      }

      const servicios = await this.servicios.buscarServicios(req.query);

      cache.put(cacheKey, servicios, this.cacheDuration);

      res.json({
        estado: true,
        origen: 'db',
        datos: servicios,
      });
    } catch (error) {
      console.log('Error en GET /servicios');
      next(error);
    }
  };

  buscarServicioPorId = async (req, res, next) => {
    try {
      const servicio_id = req.params.servicio_id;
      const servicio = await this.servicios.buscarServicioPorId(servicio_id);

      res.json({ estado: true, datos: servicio });
    } catch (error) {
      console.error('Error en GET /servicios/:servicio_id');
      next(error);
    }
  };

  crearServicio = async (req, res) => {

    try {
      const idNuevo = await this.servicios.crearServicio(req.body);
      cache.clear();

      res.status(201).json({
        estado: true,
        mensaje: `Servicio creado con id ${idNuevo}`,
      });
    } catch (error) {
      console.error('Error en POST /servicios');
      next(error);
    }
  };

  actualizarServicio = async (req, res) => {

    try {
      const servicio_id = req.params.servicio_id;

      const actualizado = await this.servicios.actualizarServicio(
        servicio_id,
        req.body
      );
      cache.clear(); 

      if (actualizado === null) {
        return res.status(400).json({
          estado: false,
          mensaje: `No hay datos válidos para actualizar o servicio con id ${servicio_id} no encontrado`,
        });
      }


      res.json({
        estado: true,
        mensaje: `Servicio con id ${servicio_id} actualizado correctamente`,
      });
    } catch (error) {
      console.error('Error en PUT /servicios/:servicio_id');
      next(error);
    }
  };

  borrarServicio = async (req, res, next) => {
    try {
      const servicio_id = req.params.servicio_id;
      await this.servicios.borrarServicio(servicio_id);
      cache.clear(); // Limpiar caché al borrar

      res.json({
        estado: true,
        mensaje: `Servicio con id ${servicio_id} borrado correctamente`,
      });
    } catch (error) {
      console.error('Error en DELETE /servicios/:servicio_id');
      next(error);
    }
  };
}
