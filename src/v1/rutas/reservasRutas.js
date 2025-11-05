import express from 'express';
import { crearReservaValidations } from '../../validations/reservasValidations.js';
import { validarInputs } from '../../middlewares/validarInputs.js';
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
router.post('/', crearReservaValidations, validarInputs, reservasControlador.crearReserva);


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