import express from 'express';
import SalonesControlador from '../../controladores/salonesControlador.js';

const salonesControlador = new SalonesControlador();

const router = express.Router();

router.get('/', salonesControlador.buscarSalones);
router.get('/:salon_id', salonesControlador.buscarSalonPorId);
router.post('/', salonesControlador.crearSalon);
router.put('/:salon_id', salonesControlador.actualizarSalon);
router.delete('/:salon_id', salonesControlador.borrarSalon);

export { router };
