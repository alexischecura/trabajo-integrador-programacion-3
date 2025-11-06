import { conexion } from './conexion.js';

export default class ReservasServicios {
  crearReservaServicios = async (reservaId, servicios) => {
    try {
      await conexion.beginTransaction();


      const querySQL = 'INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?, ?, ?)';

      for (const servicio of servicios) {
        await conexion.execute(querySQL, [
          reservaId,
          servicio.servicio_id,
          servicio.importe,
        ]);
      }

      await conexion.commit();

    } catch (error) {
      console.error('Error al crear reserva servicios:', error);
      await conexion.rollback();
      throw error;
    }
  };
}
