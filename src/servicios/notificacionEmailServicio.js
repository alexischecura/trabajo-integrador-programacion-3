import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import path from 'path';
import { readFile } from 'fs/promises';
import handlebars from 'handlebars';

export default class NotificacionEmailServicio {

  async crearTemplate(nombreArchivo) {
    const _fileName = fileURLToPath(import.meta.url);
    const _dirname = path.dirname(_fileName);
    const rootDir = path.resolve(_dirname, '..');

    const plantilla = path.join(
      rootDir,
      'utiles',
      'handlebars',
      nombreArchivo
    );

    const datos = await readFile(plantilla, 'utf-8');

    return handlebars.compile(datos);
  }

  async confirmacionDeTurno({ fecha, salon, turno, correoDestino }) {
    try {
      const nombrePlantilla = 'plantillaConfirmacionDeTurno.hbs';

      const template = await this.crearTemplate(nombrePlantilla);

      const html = template({ fecha, salon, turno });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GOOGLE_EMAIL,
          pass: process.env.GOOGLE_APP_PASSWORD,
        },
      });

      const opciones = {
        to: correoDestino,
        subject: 'Notificación',
        html,
      };

      transporter.sendMail(opciones, (error, info) => {
        if (error) {
          console.log(error);
          return null;
        }
        console.log(info);

        return info;
      });
    } catch (error) {
      console.log(error);
    }
  }
}
