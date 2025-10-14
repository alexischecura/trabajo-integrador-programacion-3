import { validationResult } from 'express-validator';
import cache from 'memory-cache';
import UsuariosServicio from '../servicios/usuariosServicio.js';

export default class UsuariosControlador {
  constructor() {
    this.usuarios = new UsuariosServicio();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutos en milisegundos
  }

  buscarUsuarios = async (req, res) => {
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
      console.log('Error en GET /usuarios', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  buscarUsuarioPorId = async (req, res) => {
    try {
      const usuario_id = req.params.usuario_id;
      const usuario = await this.usuarios.buscarUsuarioPorId(usuario_id);

      if (!usuario) {
        return res.status(404).json({
          estado: false,
          mensaje: `Usuario con el id ${usuario_id} no encontrado`,
        });
      }

      res.json({ estado: true, datos: usuario });
    } catch (error) {
      console.error('Error en GET /usuarios/:usuario_id', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  crearUsuario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const idNuevo = await this.usuarios.crearUsuario(req.body);
      cache.clear(); // Limpiar caché al crear

      res.status(201).json({
        estado: true,
        mensaje: `Usuario creado con id ${idNuevo}`,
      });
    } catch (error) {
      console.error('Error en POST /usuarios', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  actualizarUsuario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const usuario_id = req.params.usuario_id;

      const actualizado = await this.usuarios.actualizarUsuario(
        usuario_id,
        req.body
      );
      cache.clear(); // Limpiar caché al actualizar

      if (actualizado === null) {
        return res.status(400).json({
          estado: false,
          mensaje: `No hay datos válidos para actualizar o usuario con id ${usuario_id} no encontrado`,
        });
      }

      res.json({
        estado: true,
        mensaje: `Usuario con id ${usuario_id} actualizado correctamente`,
      });
    } catch (error) {
      console.error('Error en PUT /usuarios/:usuario_id', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  borrarUsuario = async (req, res) => {
    try {
      const usuario_id = req.params.usuario_id;
      const borrado = await this.usuarios.borrarUsuario(usuario_id);

      if (borrado === null) {
        return res.status(404).json({
          estado: false,
          mensaje: `Usuario con id ${usuario_id} no encontrado`,
        });
      }

      res.json({
        estado: true,
        mensaje: `Usuario con id ${usuario_id} borrado correctamente`,
      });
    } catch (error) {
      console.error('Error en DELETE /usuarios/:usuario_id', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };
}
