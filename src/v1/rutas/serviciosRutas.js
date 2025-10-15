import express from 'express';
import ServiciosControlador from '../../controladores/serviciosControlador.js';
import { crearServicioValidations, actualizarServicioValidations, listarServiciosValidations } from '../../validations/serviciosValidations.js';
import { validarInputs } from '../../middlewares/validarInputs.js';

const serviciosControlador = new ServiciosControlador();

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Endpoints para gestionar servicios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Servicio:
 *       type: object
 *       properties:
 *         servicio_id:
 *           type: integer
 *           description: ID autoincremental del servicio.
 *         descripcion:
 *           type: string
 *           description: Descripción del servicio.
 *         importe:
 *           type: number
 *           format: float
 *           description: Precio del servicio.
 *         activo:
 *           type: integer
 *           description: Indica si el servicio está activo (1) o borrado lógicamente (0).
 *       example:
 *         servicio_id: 1
 *         descripcion: "Servicio de Catering"
 *         importe: 5000.00
 *         activo: 1
 */

/**
 * @swagger
 * /servicios:
 *   get:
 *     summary: Obtiene una lista de servicios con filtros, paginación y ordenación.
 *     tags: [Servicios]
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
 *           enum: [servicio_id, descripcion, importe]
 *         description: Campo por el cual ordenar.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Dirección de la ordenación.
 *       - in: query
 *         name: importeMax
 *         schema:
 *           type: number
 *         description: Filtrar por importe máximo.
 *     responses:
 *       200:
 *         description: Lista de salones.
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
 *                     $ref: '#/components/schemas/Servicio'
 */
router.get('/', listarServiciosValidations, validarInputs, serviciosControlador.buscarServicios);

/**
 * @swagger
 * /servicios/{servicio_id}:
 *   get:
 *     summary: Obtiene un servicio por su ID.
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a buscar.
 *     responses:
 *       200:
 *         description: Datos del servicio encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servicio'
 *       404:
 *         description: Servicio no encontrado.
 */
router.get('/:servicio_id', serviciosControlador.buscarServicioPorId);


/**
 * @swagger
 * /servicios:
 *   post:
 *     summary: Crea un nuevo servicio.
 *     tags: [Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               importe:
 *                 type: number
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente.
 *       400:
 *         description: Datos de entrada inválidos.
 */
router.post('/', crearServicioValidations, validarInputs, serviciosControlador.crearServicio);

/**
 * @swagger
 * /servicios/{servicio_id}:
 *   put:
 *     summary: Actualiza un servicio existente.
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Servicio'
 *     responses:
 *       200:
 *         description: Servicio actualizado correctamente.
 *       400:
 *         description: Datos de entrada inválidos.
 *       404:
 *         description: Servicio no encontrado.
 */
router.put('/:servicio_id', actualizarServicioValidations, validarInputs, serviciosControlador.actualizarServicio);

/**
 * @swagger
 * /servicios/{servicio_id}:
 *   delete:
 *     summary: Borra un servicio (borrado lógico).
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a borrar.
 *     responses:
 *       200:
 *         description: Servicio borrado correctamente.
 *       404:
 *         description: Servicio no encontrado.
 */
router.delete('/:servicio_id', serviciosControlador.borrarServicio);

export { router };