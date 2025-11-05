import { conexion } from './conexion.js';

export default class Reportes {
  /**
   * Llama al Stored Procedure para obtener los salones más populares.
   * @returns {Promise<Array>} Un array con los resultados del reporte.
   */
  salonesPopulares = async () => {

    const [resultados] = await conexion.query('CALL sp_salones_mas_reservados()');


    return resultados[0];
  };

}