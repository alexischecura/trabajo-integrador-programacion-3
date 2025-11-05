import express from 'express';
import { validarInputs } from '../../middlewares/validarInputs.js';
import {
  crearReservaValidations,
  listarReservasValidations,
  idParamReserva,
  actualizarReservaValidations,
} from '../../validations/reservasValidations.js';
import ReservasControlador from '../../controladores/reservasControlador.js';
import Reservas from '../../db/reservas.js';

const reservasControlador = new ReservasControlador();
const reservasDb = new Reservas();

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Endpoints para gestionar reservas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reserva:
 *       type: object
 *       required:
 *         - fecha_reserva
 *         - salon_id
 *         - usuario_id
 *         - turno_id
 *         - importe_salon
 *         - importe_total
 *       properties:
 *         reserva_id:
 *           type: integer
 *           description: ID autoincremental de la reserva.
 *         fecha_reserva:
 *           type: string
 *           format: date
 *           description: Fecha de la reserva (YYYY-MM-DD).
 *         salon_id:
 *           type: integer
 *           description: ID del salón reservado.
 *         usuario_id:
 *           type: integer
 *           description: ID del usuario que realiza la reserva.
 *         turno_id:
 *           type: integer
 *           description: ID del turno reservado.
 *         foto_cumpleaniero:
 *           type: string
 *           nullable: true
 *           description: URL de la foto del cumpleañero.
 *         tematica:
 *           type: string
 *           nullable: true
 *           description: Temática de la fiesta.
 *         importe_salon:
 *           type: number
 *           format: float
 *           description: Importe del salón en el momento de la reserva.
 *         importe_total:
 *           type: number
 *           format: float
 *           description: Importe total de la reserva (salón + servicios).
 *         recordatorio_enviado:
 *           type: integer
 *           description: Indica si el recordatorio ha sido enviado (1) o no (0).
 *         confirmacion_enviada:
 *           type: integer
 *           description: Indica si la confirmación ha sido enviada (1) o no (0).
 *         activo:
 *           type: integer
 *           description: Indica si la reserva está activa (1) o borrada lógicamente (0).
 *       example:
 *         reserva_id: 1
 *         fecha_reserva: "2025-12-25"
 *         salon_id: 1
 *         usuario_id: 1
 *         turno_id: 1
 *         foto_cumpleaniero: "http://example.com/foto.jpg"
 *         tematica: "Princesas"
 *         importe_salon: 15000.00
 *         importe_total: 20000.00
 *         recordatorio_enviado: 0
 *         confirmacion_enviada: 0
 *         activo: 1
 */

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtiene una lista de reservas con filtros, paginación y ordenación.
 *     tags: [Reservas]
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
 *           enum: [reserva_id, tematica, importe_salon, importe_total]
 *         description: Campo por el cual ordenar.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Dirección de la ordenación.
 *       - in: query
 *         name: importeTotalMin
 *         schema:
 *           type: integer
 *         description: Filtrar por importe mínimo del reserva.
 *       - in: query
 *         name: importeTotalMax
 *         schema:
 *           type: number
 *         description: Filtrar por importe máximo de reserva.
 *     responses:
 *       200:
 *         description: Lista de reservas.
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
 *                     $ref: '#/components/schemas/Reserva'
 */
router.get(
  '/',
  listarReservasValidations,
  validarInputs,
  reservasControlador.buscarReservas
);

/**
 * @swagger
 * /salones/{salon_id}:
 *   get:
 *     summary: Obtiene un salón por su ID.
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón a buscar.
 *     responses:
 *       200:
 *         description: Datos del salón encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Salon'
 *       404:
 *         description: Salón no encontrado.
 */
router.get(
  '/:reserva_id',
  idParamReserva,
  validarInputs,
  reservasControlador.buscarReservaPorId
);

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crea una nueva reserva.
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reserva'
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente.
 *       400:
 *         description: Datos de entrada inválidos.
 */
router.post(
  '/',
  // authMiddleware,
  // allowRoles('administrador', 'empleado'),
  crearReservaValidations,
  validarInputs,
  reservasControlador.crearReserva
);

/**
 * @swagger
 * /reservas/{reserva_id}:
 *   put:
 *     summary: Actualiza una reserva existente.
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reserva'
 *     responses:
 *       200:
 *         description: Reserva actualizada correctamente.
 *       400:
 *         description: Datos de entrada inválidos.
 *       404:
 *         description: Reserva no encontrada.
 */

router.put(
  '/:reserva_id',
  // authMiddleware,
  // allowRoles('administrador', 'empleado'),
  actualizarReservaValidations,
  validarInputs,
  reservasControlador.actualizarReserva
);

/**
 * @swagger
 * /reservas/{reserva_id}:
 *   delete:
 *     summary: Elimina una reserva (borrado lógico).
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a eliminar.
 *     responses:
 *       200:
 *         description: Reserva eliminada correctamente.
 *       404:
 *         description: Reserva no encontrada.
 */

router.delete(
  '/:reserva_id',
  // authMiddleware,
  // allowRoles('administrador'),
  idParamReserva,
  validarInputs,
  reservasControlador.eliminarReserva
);

router.get('/exportar/csv', async (req, res, next) => {
  try {
    const csv = await reservasDb.exportarCSV();
    res.header('Content-Type', 'text/csv');
    res.attachment('reporte-reservas.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

export { router };
