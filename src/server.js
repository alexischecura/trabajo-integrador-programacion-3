import app from "./reservas.js";
import { conectarDB } from "./db/conexion.js";

const port = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await conectarDB();
    app.listen(port, () => {
      console.log(`Servidor funcionando en puerto ${port}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error);
  }
};

iniciarServidor();
