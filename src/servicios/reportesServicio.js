import Reportes from '../db/reportes.js';

export default class ReportesServicio {
  constructor() {
    this.reportes = new Reportes();
  }

  salonesPopulares = async () => {
    return await this.reportes.salonesPopulares();
  };

  ingresoPorPeriodo = async (fecha_inicio, fecha_fin) => {
    return await this.reportes.ingresoPorPeriodo(fecha_inicio, fecha_fin);
  }
}
