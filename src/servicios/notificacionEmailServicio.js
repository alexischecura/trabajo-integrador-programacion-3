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

  async enviar({ to, subject, template, context }) {
    try {
      const templatePath = `${template}.hbs`;
      const compiledTemplate = await this.crearTemplate(templatePath);
      const html = compiledTemplate(context);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GOOGLE_EMAIL,
          pass: process.env.GOOGLE_APP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        to: to,
        subject: subject,
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw error; // Re-lanzar el error para que el llamador pueda manejarlo
    }
  }
}
