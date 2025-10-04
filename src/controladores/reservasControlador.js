// app.post('/notificacion', async (req, res) => {
//   console.log(req.body);

//   if (
//     !req.body.fecha ||
//     !req.body.salon ||
//     !req.body.turno ||
//     !req.body.correoDestino
//   ) {
//     return res.status(400).json({ ok: false, mensaje: 'Faltan datos' });
//   }

//   const { fecha, salon, turno, correoDestino } = req.body;

//   try {
//     const _fileName = fileURLToPath(import.meta.url);
//     const _dirname = path.dirname(_fileName);

//     const plantilla = path.join(
//       _dirname,
//       'utiles',
//       'handlebars',
//       'plantilla.hbs'
//     );

//     const datos = await readFile(plantilla, 'utf-8');

//     const template = handlebars.compile(datos);

//     const html = template({ fecha, salon, turno });

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.GOOGLE_EMAIL,
//         pass: process.env.GOOGLE_APP_PASSWORD,
//       },
//     });

//     const opciones = {
//       to: correoDestino,
//       subject: 'Notificación',
//       html,
//     };

//     transporter.sendMail(opciones, (error, info) => {
//       if (error) {
//         console.log(error);
//         res.json({ ok: false, mensaje: 'Error al enviar el correo' });
//       }
//       res.json({ ok: true, mensaje: 'Datos recibidos correctamente' });
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });