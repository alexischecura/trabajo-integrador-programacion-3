import express from 'express';
import { body } from 'express-validator';
import UsuariosControlador from '../../controladores/usuariosControlador.js';

const usuariosControlador = new UsuariosControlador();

const router = express.Router();

router.get('/', usuariosControlador.buscarUsuarios);

router.get('/:usuario_id', usuariosControlador.buscarUsuarioPorId);

router.post(
  '/',
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
    body('nombre_usuario').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('contrasenia').notEmpty().withMessage('La contraseña es obligatoria'),
    body('tipo_usuario').isIn(['cliente', 'empleado', 'administrador']).withMessage('Tipo de usuario inválido'),
  ],
  usuariosControlador.crearUsuario
);

router.put(
  '/:usuario_id',
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
    body('nombre_usuario').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('tipo_usuario').isIn(['cliente', 'empleado', 'administrador']).withMessage('Tipo de usuario inválido'),
  ],
  usuariosControlador.actualizarUsuario
);

router.delete('/:usuario_id', usuariosControlador.borrarUsuario);

export { router };
