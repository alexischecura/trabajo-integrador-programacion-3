import Salones from '../db/salones.js';

export default class SalonesServicio {
  constructor() {
    this.salones = new Salones();
  }

  buscarSalones = (options) => {
    return this.salones.buscarSalones(options);
  };

  buscarSalonPorId = async (salon_id) => {
    const resultado = await this.salones.buscarSalonPorId(salon_id);

    if (resultado.length === 0) return null;

    return resultado[0];
  };

  crearSalon = async (datos) => {
    const resultado = await this.salones.crearSalon(datos);
    return resultado.insertId;
  };

  actualizarSalon = async (salon_id, datos) => {
    const salon = await this.buscarSalonPorId(salon_id);
    if (!salon) {
      return null;
    }

    const camposPermitidos = [
      'titulo',
      'direccion',
      'latitud',
      'longitud',
      'capacidad',
      'importe',
    ];
    const datosFiltrados = Object.fromEntries(
      Object.entries(datos).filter(([key]) => camposPermitidos.includes(key))
    );

    if (Object.keys(datosFiltrados).length === 0) {
      // no hay campos válidos para actualizar
      return null;
    }

    const resultado = await this.salones.actualizarSalon(
      salon_id,
      datosFiltrados
    );
    return resultado.affectedRows > 0;
  };

  borrarSalon = async (salon_id) => {
    const salon = await this.buscarSalonPorId(salon_id);
    if (!salon) {
      return null;
    }

    const resultado = await this.salones.borrarSalon(salon_id);
    return resultado.affectedRows > 0;
  };
}
