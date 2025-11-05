import express from 'express';
import UsuariosControlador from '../../controladores/usuariosControlador.js';
import { crearUsuarioValidations, actualizarUsuarioValidations, listarUsuariosValidations } from '../../validations/usuariosValidations.js';
import { allowRoles } from '../../middlewares/roleMiddleware.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { validarInputs } from '../../middlewares/validarInputs.js';

const usuariosControlador = new UsuariosControlador();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestionar usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         usuario_id:
 *           type: integer
 *           description: ID autoincremental del usuario.
 *         nombre:
 *           type: string
 *           description: Nombre del usuario.
 *         apellido:
 *           type: string
 *           description: Apellido del usuario.
 *         nombre_usuario:
 *           type: string
 *           description: Nombre de usuario.
 *         contrasenia:
 *           type: string
 *           description: Contraseña del usuario.
 *         tipo_usuario:
 *           type: string
 *           description: Tipo de usuario (cliente, empleado, administrador).
 *         celular:
 *           type: string
 *           description: Número de celular del usuario.
 *       foto:
 *         type: string
 *         description: URL de la foto del usuario.
 *         activo:
 *           type: integer
 *           description: Indica si el usuario está activo (1) o borrado lógicamente (0).
 *       example:
 *         usuario_id: 1
 *         nombre: "Juan"
 *         apellido: "Pérez"
 *         nombre_usuario: "juanp"
 *         contrasenia: "password123"
 *         tipo_usuario: "cliente"
 *         celular: "123456789"
 *         foto: "http://example.com/foto.jpg"
 *         activo: 1
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtiene una lista de usuarios con filtros, paginación y ordenación.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de resultados por página.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [usuario_id, nombre, apellido, nombre_usuario, tipo_usuario]
 *         description: Campo por el cual ordenar.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Dirección de la ordenación.
 *       - in: query
 *         name: tipoUsuario
 *         schema:
 *           type: string
 *           enum: [cliente, empleado, administrador]
 *         description: Filtrar por tipo de usuario.
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                 origen:
 *                   type: string
 *                 datos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 */
router.get('/', listarUsuariosValidations, validarInputs, usuariosControlador.buscarUsuarios);

/**
 * @swagger
 * /usuarios/{usuario_id}:
 *   get:
 *     summary: Obtiene un usuario por su ID.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a buscar.
 *     responses:
 *       200:
 *         description: Datos del usuario encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado.
 */
router.get('/:usuario_id', usuariosControlador.buscarUsuarioPorId);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crea un nuevo usuario.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               nombre_usuario:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *               tipo_usuario:
 *                 type: string
 *                 enum: [cliente, empleado, administrador]
 *               celular:
 *                 type: string
 *               foto:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *       400:
 *         description: Datos de entrada inválidos.
 */
router.post('/', crearUsuarioValidations, validarInputs, usuariosControlador.crearUsuario);

/**
 * @swagger
 * /usuarios/{usuario_id}:
 *   put:
 *     summary: Actualiza un usuario existente.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *       400:
 *         description: Datos de entrada inválidos.
 *       404:
 *         description: Usuario no encontrado.
 */
router.put('/:usuario_id', actualizarUsuarioValidations, validarInputs, usuariosControlador.actualizarUsuario);

/**
 * @swagger
 * /usuarios/{usuario_id}:
 *   delete:
 *     summary: Borra un usuario (borrado lógico).
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a borrar.
 *     responses:
 *       200:
 *         description: Usuario borrado correctamente.
 *       404:
 *         description: Usuario no encontrado.
 */
router.delete('/:usuario_id', usuariosControlador.borrarUsuario);
router.post('/', crearUsuarioValidations, validarInputs, usuariosControlador.crearUsuario);

router.get('/', authMiddleware, allowRoles('administrador'), usuariosControlador.buscarUsuarios);
router.get('/:usuario_id', authMiddleware, allowRoles('administrador'), usuariosControlador.buscarUsuarioPorId);
router.put('/:usuario_id', authMiddleware, allowRoles('administrador'), actualizarUsuarioValidations, validarInputs, usuariosControlador.actualizarUsuario);
router.delete('/:usuario_id', authMiddleware, allowRoles('administrador'), usuariosControlador.borrarUsuario);

export { router };