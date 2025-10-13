import Servicios from '../db/servicios.js';

export default class ServiciosServicio {
  constructor() {
    this.servicios = new Servicios();
  }

  buscarServicios = () => {
    return this.servicios.buscarServicios();
  };

  buscarServicioPorId = async (servicio_id) => {
    const resultado = await this.servicios.buscarServicioPorId(servicio_id);
    if (resultado.length === 0) return null;
    return resultado[0];
  };

  crearServicio = async (datos) => {
    const resultado = await this.servicios.crearServicio(datos);
    return resultado.insertId;
  };

  actualizarServicio = async (servicio_id, datos) => {
    const servicio = await this.buscarServicioPorId(servicio_id);
    if (!servicio) {
      return null;
    }
    const resultado = await this.servicios.actualizarServicio(servicio_id, datos);
    return resultado.affectedRows > 0;
  };

  borrarServicio = async (servicio_id) => {
    const servicio = await this.buscarServicioPorId(servicio_id);
    if (!servicio) {
      return null;
    }
    const resultado = await this.servicios.borrarServicio(servicio_id);
    return resultado.affectedRows > 0;
  };
}
