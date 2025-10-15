import express from 'express';
import { body } from 'express-validator';
import UsuariosControlador from '../../controladores/usuariosControlador.js';
import { crearUsuarioValidations, actualizarUsuarioValidations } from '../../validations/usuariosValidations.js';
import { validarInputs } from '../../middlewares/validarInputs.js';

const usuariosControlador = new UsuariosControlador();

const router = express.Router();

router.get('/', usuariosControlador.buscarUsuarios);
router.get('/:usuario_id', usuariosControlador.buscarUsuarioPorId);

router.post('/', crearUsuarioValidations, validarInputs, usuariosControlador.crearUsuario);
router.put('/:usuario_id', actualizarUsuarioValidations, validarInputs, usuariosControlador.actualizarUsuario);
router.delete('/:usuario_id', usuariosControlador.borrarUsuario);

export { router };
