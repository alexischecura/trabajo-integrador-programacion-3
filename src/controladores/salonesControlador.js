import SalonesServicio from '../servicios/salonesServicio.js';

export default class SalonesControlador {
  constructor() {
    this.salones = new SalonesServicio();
  }

  buscarSalones = async (req, res) => {
    try {
      const salones = await this.salones.buscarSalones();

      res.json({
        estado: true,
        datos: salones,
      });
    } catch (error) {
      console.log('Error en GET /salones', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  buscarSalonPorId = async (req, res) => {
    try {
      const salon_id = req.params.salon_id;
      const salon = await this.salones.buscarSalonPorId(salon_id);

      if (!salon) {
        return res.status(404).json({
          estado: false,
          mensaje: `Salón con el id ${salon_id} no encontrado`,
        });
      }

      res.json({ estado: true, salon });
    } catch (error) {
      console.error('Error en GET /salones/:salon_id', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  crearSalon = async (req, res) => {
    try {
      const { titulo, direccion, capacidad, importe } = req.body;

      if (!titulo || !direccion || !capacidad || !importe) {
        res.status(400).json({
          estado: false,
          mensaje: 'Faltan campos',
        });
      }

      const idNuevo = await this.salones.crearSalon(req.body);

      res.status(201).json({
        estado: true,
        mensaje: `Salón creado con id ${idNuevo}`,
      });

      res.status(201).json({
        estado: true,
        mensaje: `Salón creado con id ${idNuevo}`,
      });
    } catch (error) {
      console.error('Error en POST /salones', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  actualizarSalon = async (req, res) => {
    try {
      const { titulo, direccion, capacidad, importe } = req.body;

      if (!titulo || !direccion || !capacidad || !importe) {
        res.status(400).json({
          estado: false,
          mensaje: 'Faltan campos',
        });
      }

      const salon_id = req.params.salon_id;

      const actualizado = this.salones.actualizarSalon(salon_id, req.body);

      if (actualizado === null) {
        return res.status(404).json({
          estado: false,
          mensaje: `Salón con id ${salon_id} no encontrado`,
        });
      }

      if (!actualizado) {
        return res.status(400).json({
          estado: false,
          mensaje: 'No se pudo actualizar el salón',
        });
      }

      res.json({
        estado: true,
        mensaje: `Salón con id ${salon_id} actualizado correctamente`,
      });
    } catch (error) {
      console.error('Error en POST /salones', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };

  borrarSalon = async (req, res) => {
    try {
      const salon_id = req.params.salon_id;
      const borrado = this.salones.borrarSalon(salon_id);

      if (borrado === null) {
        return res.status(404).json({
          estado: false,
          mensaje: `Salón con id ${salon_id} no encontrado`,
        });
      }

      if (!borrado) {
        return res.status(400).json({
          estado: false,
          mensaje: 'No se pudo borrar el salón',
        });
      }

      res.json({
        estado: true,
        mensaje: `Salón con id ${salon_id} borrado correctamente`,
      });
    } catch (error) {
      console.error('Error en POST /salones', error);
      res.status(500).json({
        estado: false,
        mensaje: 'Error interno del servidor',
      });
    }
  };
}
