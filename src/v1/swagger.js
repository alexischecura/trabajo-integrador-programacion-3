import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Reservas de Salones de Cumpleaños',
      version: '1.0.0',
      description: 'Documentación de la API para el Trabajo Final Integrador de Programación III',
    },
    servers: [
      {
        url: '/api/v1',
      },
    ],
    tags: [
      {
        name: 'Reservas',
        description: 'Operaciones relacionadas con las reservas',
      },
      {
        name: 'Salones',
        description: 'Operaciones relacionadas con los salones',
      },
      {
        name: 'Usuarios',
        description: 'Operaciones relacionadas con los usuarios',
      },
      {
        name: 'Servicios',
        description: 'Operaciones relacionadas con los servicios',
      },
    ],
  },
  apis: ['./src/v1/rutas/*.js'], // Archivos que contienen la documentación
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
