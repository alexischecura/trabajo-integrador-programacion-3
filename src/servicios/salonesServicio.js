import Salones from '../db/salones.js';
import AppError from '../utiles/AppError.js';

export default class SalonesServicio {
  constructor() {
    this.salones = new Salones();
  }

  buscarSalones = (options) => {
    return this.salones.buscarSalones(options);
  };

  buscarSalonPorId = async (salon_id) => {
    const resultado = await this.salones.buscarSalonPorId(salon_id);

    if (resultado.length === 0) {
      throw new AppError(`Salón con id ${salon_id} no encontrado`, 404);
    }

    return resultado[0];
  };

  crearSalon = async (datos) => {
    const resultado = await this.salones.crearSalon(datos);
    return resultado.insertId;
  };

  actualizarSalon = async (salon_id, datos) => {
    // La función buscarSalonPorId lanza una excepción/404 si el salón no existe.
    await this.buscarSalonPorId(salon_id);

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
      throw new AppError('No hay campos válidos para actualizar', 400);
    }

    const resultado = await this.salones.actualizarSalon(
      salon_id,
      datosFiltrados
    );
    return resultado.affectedRows > 0;
  };

  borrarSalon = async (salon_id) => {
    // La función buscarSalonPorId lanza una excepción/404 si el salón no existe.
    await this.buscarSalonPorId(salon_id);

    const resultado = await this.salones.borrarSalon(salon_id);
    return resultado.affectedRows > 0;
  };
}
