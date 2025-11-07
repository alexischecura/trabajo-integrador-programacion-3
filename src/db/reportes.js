import { conexion } from './conexion.js';

export default class Reportes {

  salonesPopulares = async () => {

    const [resultados] = await conexion.query('CALL sp_salones_mas_reservados()');

    return resultados[0];
  };

  ingresoPorPeriodo = async (fecha_inicio, fecha_fin) => {
   const [resultado] = await conexion.query('CALL sp_ingreso_por_periodo(?, ?)', [
      fecha_inicio,
      fecha_fin,
    ]);
    
    return resultado[0][0];
  };

}