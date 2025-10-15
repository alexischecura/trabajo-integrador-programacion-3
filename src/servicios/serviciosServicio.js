import Servicios from '../db/servicios.js';
import AppError from '../utiles/AppError.js';

export default class ServiciosServicio {
  constructor() {
    this.servicios = new Servicios();
  }

  buscarServicios = (options) => {
    return this.servicios.buscarServicios(options);
  };

  buscarServicioPorId = async (servicio_id) => {
    const resultado = await this.servicios.buscarServicioPorId(servicio_id);
    if (resultado.length === 0)
      throw new AppError(`Servicio con id ${servicio_id} no encontrado`, 404);
    return resultado[0];
  };

  crearServicio = async (datos) => {
    const resultado = await this.servicios.crearServicio(datos);
    return resultado.insertId;
  };

  actualizarServicio = async (servicio_id, datos) => {
    // La función buscarServicioPorId lanza una excepción/404 si el servicio no existe.
    await this.buscarServicioPorId(servicio_id);

    const camposPermitidos = ['descripcion', 'importe'];
    const datosFiltrados = Object.fromEntries(
      Object.entries(datos).filter(([key]) => camposPermitidos.includes(key))
    );

    if (Object.keys(datosFiltrados).length === 0) {
      throw new AppError('No hay campos válidos para actualizar', 400);
    }

    const resultado = await this.servicios.actualizarServicio(
      servicio_id,
      datosFiltrados
    );
    return resultado.affectedRows > 0;
  };

  borrarServicio = async (servicio_id) => {
    // La función buscarServicioPorId lanza una excepción/404 si el servicio no existe.
    await this.buscarServicioPorId(servicio_id);
    
    const resultado = await this.servicios.borrarServicio(servicio_id);
    return resultado.affectedRows > 0;
  };
}
