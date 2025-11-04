import { actualizarUsuarioValidations, crearUsuarioValidations } from '../../validations/usuariosValidations.js';

import UsuariosControlador from '../../controladores/usuariosControlador.js';
import { allowRoles } from '../../middlewares/roleMiddleware.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import express from 'express';
import { validarInputs } from '../../middlewares/validarInputs.js';

const usuariosControlador = new UsuariosControlador();
const router = express.Router();

router.post('/', crearUsuarioValidations, validarInputs, usuariosControlador.crearUsuario);

router.get('/', authMiddleware, allowRoles('administrador'), usuariosControlador.buscarUsuarios);
router.get('/:usuario_id', authMiddleware, allowRoles('administrador'), usuariosControlador.buscarUsuarioPorId);
router.put('/:usuario_id', authMiddleware, allowRoles('administrador'), actualizarUsuarioValidations, validarInputs, usuariosControlador.actualizarUsuario);
router.delete('/:usuario_id', authMiddleware, allowRoles('administrador'), usuariosControlador.borrarUsuario);

export { router };