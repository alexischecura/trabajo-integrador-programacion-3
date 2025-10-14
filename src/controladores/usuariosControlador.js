import { validationResult } from 'express-validator';
import cache from 'memory-cache';
import UsuariosServicio from '../servicios/usuariosServicio.js';
import AppError from '../utiles/AppError.js';

export default class UsuariosControlador {
  constructor() {
    this.usuarios = new UsuariosServicio();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutos en milisegundos
  }

  buscarUsuarios = async (req, res, next) => {
    try {
      const cacheKey = `usuarios_${JSON.stringify(req.query)}`;
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        return res.json({
          estado: true,
          origen: 'cache',
          datos: cachedData,
        });
      }

      const usuarios = await this.usuarios.buscarUsuarios(req.query);
      cache.put(cacheKey, usuarios, this.cacheDuration);

      res.json({
        estado: true,
        origen: 'db',
        datos: usuarios,
      });
    } catch (error) {
      console.log('Error en GET /usuarios');
      next(error);
    }
  };

  buscarUsuarioPorId = async (req, res, next) => {
    try {
      const usuario_id = req.params.usuario_id;
      const usuario = await this.usuarios.buscarUsuarioPorId(usuario_id);

      res.json({ estado: true, datos: usuario });
    } catch (error) {
      console.error('Error en GET /usuarios/:usuario_id');
      next(error);
    }
  };

  crearUsuario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrores = errors.array();
      const error = new AppError(
        'Error de validación en los datos de entrada.',
        400
      );
      error.data = validationErrores;
      return next(error);
    }

    try {
      const idNuevo = await this.usuarios.crearUsuario(req.body);
      cache.clear(); // Limpiar caché al crear

      res.status(201).json({
        estado: true,
        mensaje: `Usuario creado con id ${idNuevo}`,
      });
    } catch (error) {
      console.error('Error en POST /usuarios');
      next(error);
    }
  };


  actualizarUsuario = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrores = errors.array();
      const error = new AppError(
        'Error de validación en los datos de entrada.',
        400
      );
      error.data = validationErrores;
      return next(error);
    }
    try {
      const usuario_id = req.params.usuario_id;

      await this.usuarios.actualizarUsuario(usuario_id, req.body);
      cache.clear(); // Limpiar caché al actualizar

      res.json({
        estado: true,
        mensaje: `Usuario con id ${usuario_id} actualizado correctamente`,
      });
    } catch (error) {
      console.error('Error en PUT /usuarios/:usuario_id');
      next(error);
    }
  };

  borrarUsuario = async (req, res, next) => {
    try {
      const usuario_id = req.params.usuario_id;
      await this.usuarios.borrarUsuario(usuario_id);

      res.json({
        estado: true,
        mensaje: `Usuario con id ${usuario_id} borrado correctamente`,
      });
    } catch (error) {
      console.error('Error en DELETE /usuarios/:usuario_id');
      next(error);
    }
  };
}
