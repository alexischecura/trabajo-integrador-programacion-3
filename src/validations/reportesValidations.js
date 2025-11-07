import { body } from "express-validator";

export const validarIngresoPorPeriodo = [
  body("fecha_inicio").isDate().withMessage("Fecha de inicio inválida"),
  body("fecha_fin").isDate().withMessage("Fecha de fin inválida"),
];
