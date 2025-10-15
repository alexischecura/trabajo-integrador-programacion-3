import { validationResult } from 'express-validator';
import ServiciosServicio from '../servicios/serviciosServicio.js';

export default class ServiciosControlador {
  constructor() {
    this.servicios = new ServiciosServicio();
  }

  buscarServicios = async (req, res) => {
    try {
      const servicios = await this.servicios.buscarServicios();
      res.json({
        estado: true,
        datos: servicios,
      });
    } catch (error) {
      console.log('Error en GET /servicios', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  buscarServicioPorId = async (req, res) => {
    try {
      const servicio_id = req.params.servicio_id;
      const servicio = await this.servicios.buscarServicioPorId(servicio_id);

      if (!servicio) {
        return res.status(404).json({
          estado: false,
          mensaje: `Servicio con el id ${servicio_id} no encontrado`,
        });
      }

      res.json({ estado: true, datos: servicio });
    } catch (error) {
      console.error('Error en GET /servicios/:servicio_id', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  crearServicio = async (req, res) => {

    try {
      const idNuevo = await this.servicios.crearServicio(req.body);
      res.status(201).json({
        estado: true,
        mensaje: `Servicio creado con id ${idNuevo}`,
      });
    } catch (error) {
      console.error('Error en POST /servicios', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  actualizarServicio = async (req, res) => {

    try {
      const servicio_id = req.params.servicio_id;

      const actualizado = await this.servicios.actualizarServicio(servicio_id, req.body);

      if (actualizado === null) {
        return res.status(404).json({
          estado: false,
          mensaje: `Servicio con id ${servicio_id} no encontrado`,
        });
      }

      res.json({
        estado: true,
        mensaje: `Servicio con id ${servicio_id} actualizado correctamente`,
      });
    } catch (error) {
      console.error('Error en PUT /servicios/:servicio_id', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  borrarServicio = async (req, res) => {
    try {
      const servicio_id = req.params.servicio_id;
      const borrado = await this.servicios.borrarServicio(servicio_id);

      if (borrado === null) {
        return res.status(404).json({
          estado: false,
          mensaje: `Servicio con id ${servicio_id} no encontrado`,
        });
      }

      res.json({
        estado: true,
        mensaje: `Servicio con id ${servicio_id} borrado correctamente`,
      });
    } catch (error) {
      console.error('Error en DELETE /servicios/:servicio_id', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };
}
