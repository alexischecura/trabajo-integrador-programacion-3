import express from 'express';
import { body } from 'express-validator';
import SalonesControlador from '../../controladores/salonesControlador.js';

const salonesControlador = new SalonesControlador();

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Salones
 *   description: Endpoints para gestionar salones
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Salon:
 *       type: object
 *       properties:
 *         salon_id:
 *           type: integer
 *           description: ID autoincremental del salón.
 *         titulo:
 *           type: string
 *           description: Nombre del salón.
 *         direccion:
 *           type: string
 *           description: Dirección del salón.
 *         capacidad:
 *           type: integer
 *           description: Capacidad máxima de personas.
 *         importe:
 *           type: number
 *           format: float
 *           description: Precio del alquiler del salón.
 *         activo:
 *           type: integer
 *           description: Indica si el salón está activo (1) o borrado lógicamente (0).
 *       example:
 *         salon_id: 1
 *         titulo: "Salón Alegría"
 *         direccion: "Av. Siempre Viva 742"
 *         capacidad: 100
 *         importe: 5000.00
 *         activo: 1
 */

/**
 * @swagger
 * /salones:
 *   get:
 *     summary: Obtiene una lista de salones con filtros, paginación y ordenación.
 *     tags: [Salones]
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
 *           enum: [salon_id, titulo, capacidad, importe]
 *         description: Campo por el cual ordenar.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Dirección de la ordenación.
 *       - in: query
 *         name: capacidad
 *         schema:
 *           type: integer
 *         description: Filtrar por capacidad mínima.
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
 *                     $ref: '#/components/schemas/Salon'
 */
router.get('/', salonesControlador.buscarSalones);

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
router.get('/:salon_id', salonesControlador.buscarSalonPorId);

/**
 * @swagger
 * /salones:
 *   post:
 *     summary: Crea un nuevo salón.
 *     tags: [Salones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               direccion:
 *                 type: string
 *               capacidad:
 *                 type: integer
 *               importe:
 *                 type: number
 *     responses:
 *       201:
 *         description: Salón creado exitosamente.
 *       400:
 *         description: Datos de entrada inválidos.
 */
router.post(
  '/',
  [
    body('titulo').notEmpty().withMessage('El título es obligatorio'),
    body('direccion').notEmpty().withMessage('La dirección es obligatoria'),
    body('latitud')
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage('La latitud debe ser un número entre -90 y 90'),
    body('longitud')
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage('La longitud debe ser un número entre -180 y 180'),
    body('capacidad')
      .isInt({ min: 1 })
      .withMessage('La capacidad debe ser un número entero mayor que 0'),
    body('importe')
      .isFloat({ min: 0 })
      .withMessage('El importe debe ser un número mayor o igual que 0'),
  ],
  salonesControlador.crearSalon
);

/**
 * @swagger
 * /salones/{salon_id}:
 *   put:
 *     summary: Actualiza un salón existente.
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Salon'
 *     responses:
 *       200:
 *         description: Salón actualizado correctamente.
 *       400:
 *         description: Datos de entrada inválidos.
 *       404:
 *         description: Salón no encontrado.
 */
router.put(
  '/:salon_id',
  [
    body('titulo')
      .optional()
      .notEmpty()
      .withMessage('El título no puede estar vacío'),
    body('direccion')
      .optional()
      .notEmpty()
      .withMessage('La dirección no puede estar vacía'),
    body('latitud')
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage('La latitud debe ser un número entre -90 y 90'),
    body('longitud')
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage('La longitud debe ser un número entre -180 y 180'),
    body('capacidad')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La capacidad debe ser un número entero mayor que 0'),
    body('importe')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('El importe debe ser un número mayor o igual que 0'),
  ],
  salonesControlador.actualizarSalon
);

/**
 * @swagger
 * /salones/{salon_id}:
 *   delete:
 *     summary: Borra un salón (borrado lógico).
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón a borrar.
 *     responses:
 *       200:
 *         description: Salón borrado correctamente.
 *       404:
 *         description: Salón no encontrado.
 */
router.delete('/:salon_id', salonesControlador.borrarSalon);

export { router };
