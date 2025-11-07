import express from 'express';
import AuthControlador from '../../controladores/authControlador.js';
import {
  loginValidation,
  registerValidation,
} from '../../validations/authValidations.js';
import { validarInputs } from '../../middlewares/validarInputs.js';

const router = express.Router();

const authControlador = new AuthControlador();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Autentica un usuario y devuelve un token JWT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 example: usuario@ejemplo.com
 *               contrasenia:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', loginValidation, validarInputs, authControlador.login);

/**
 * @swagger
 * /api/v1/auth/registro:
 *   post:
 *     summary: Registra un nuevo usuario.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 example: Pérez
 *               nombre_usuario:
 *                 type: string
 *                 example: usuario@ejemplo.com
 *               contrasenia:
 *                 type: string
 *                 example: 123456
 *               celular:
 *                 type: string
 *                 example: 123456789
 *               foto:
 *                 type: string
 *                 example: https://ejemplo.com/foto.jpg
 */ 
router.post(
  '/registro',
  registerValidation,
  validarInputs,
  authControlador.register
);

export default router;
