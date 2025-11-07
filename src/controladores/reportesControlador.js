import ReportesServicio from '../servicios/reportesServicio.js';

export default class ReportesControlador {
  constructor() {
    this.reportesServicio = new ReportesServicio();
  }

  salonesPopulares = async (req, res, next) => {
    try {
      const reporte = await this.reportesServicio.salonesPopulares();

      res.json(reporte);
    } catch (error) {
      next(error);
    }
  };

  ingresoPorPeriodo = async (req, res, next) => {
    try {
      const { fecha_inicio, fecha_fin } = req.body;
      const reporte = await this.reportesServicio.ingresoPorPeriodo(fecha_inicio, fecha_fin);

      res.json(reporte);
    } catch (error) {
      next(error);
    }
  };
}
