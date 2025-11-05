import express from 'express';

import { allowRoles } from '../../middlewares/roleMiddleware.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { validarInputs } from '../../middlewares/validarInputs.js';
import {
  crearTurnoValidations,
  actualizarTurnoValidations,
} from '../../validations/turnosValidations.js';
import TurnosControlador from '../../controladores/turnosControlador.js';

const turnosControlador = new TurnosControlador();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: Endpoints para gestionar turnos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Turno:
 *       type: object
 *       properties:
 *         turno_id:
 *           type: integer
 *           description: ID autoincremental del turno.
 *         hora_desde:
 *           type: date-time
 *           description: Hora de inicio del turno.
 *         hora_hasta:
 *           type: date-time
 *           description: Hora de fin del turno.
 *       example:
 *         turno_id: 1
 *         hora_desde: "2023-03-15T10:00:00Z"
 *         hora_hasta: "2023-03-15T12:00:00Z"
 */

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Obtiene una lista de turnos.
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                 datos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Turno'
 */
router.get('/', turnosControlador.buscarTurnos);

/**
 * @swagger
 * /turnos/{turno_id}:
 *   get:
 *     summary: Obtiene un turno por su ID.
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno a buscar.
 *     responses:
 *       200:
 *         description: Datos del turno encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       404:
 *         description: Turno no encontrado.
 */
router.get('/:turno_id', turnosControlador.buscarTurnoPorId);

/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crea un nuevo turno.
 *     tags: [Turnos]
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
router.post(
  '/',
  authMiddleware,
  allowRoles('administrador', 'empleado'),
  crearTurnoValidations,
  validarInputs,
  turnosControlador.crearTurno
);

/**
 * @swagger
 * /turnos/{turno_id}:
 *   put:
 *     summary: Actualiza un turno existente.
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Servicio'
 *     responses:
 *       200:
 *         description: Turno actualizado correctamente.
 *       400:
 *         description: Datos de entrada inválidos.
 *       404:
 *         description: Turno no encontrado.
 */
router.put(
  '/:turno_id',
  authMiddleware,
  allowRoles('administrador', 'empleado'),
  actualizarTurnoValidations,
  validarInputs,
  turnosControlador.actualizarTurno
);

/**
 * @swagger
 * /turnos/{turno_id}:
 *   delete:
 *     summary: Borra un turno (borrado lógico).
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno a borrar.
 *     responses:
 *       200:
 *         description: Turno borrado correctamente.
 *       404:
 *         description: Turno no encontrado.
 */
router.delete(
  '/:turno_id',
  authMiddleware,
  allowRoles('administrador', 'empleado'),
  turnosControlador.borrarTurno
);

export { router };
