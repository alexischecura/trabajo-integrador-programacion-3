-- Usar la base de datos del proyecto
USE `prog3_integrador`;


INSERT INTO `turnos` (`orden`, `hora_desde`, `hora_hasta`) VALUES
(1, '09:00:00', '12:00:00'),
(2, '13:00:00', '16:00:00'),
(3, '17:00:00', '20:00:00');


INSERT INTO `salones` (`titulo`, `direccion`, `capacidad`, `importe`) VALUES
('Salón El Rey León', 'Calle Falsa 123, Springfield', 100, 15000.00),
('Salón Aladdín', 'Avenida Agrabah 456, Oasis', 80, 12000.50),
('Salón La Sirenita', 'Boulevard del Mar 789, Atlántica', 120, 18000.00),
('Salón Frozen', 'Pasaje Arendelle 101, Montaña Nevada', 150, 25000.75),
('Salón Encanto', 'Vereda Colombia 202, Casa Madrigal', 90, 16500.00);


-- Clientes (contraseñas hasheadas con bcrypt: "password123")

INSERT INTO `usuarios` (`nombre`, `apellido`, `nombre_usuario`, `contrasenia`, `tipo_usuario`) VALUES
('Arthur', 'Conan Doyle', 'acdoyle@example.com', '$2a$12$K08rDFOU6JTwRi.VCcoNUuhlyMoMfGqGTB671bdRIJq70RVnw2AsW', 'cliente'),
('Agatha', 'Christie', 'achristie@example.com', '$2a$12$K08rDFOU6JTwRi.VCcoNUuhlyMoMfGqGTB671bdRIJq70RVnw2AsW', 'cliente'),
('Juanchi', 'Sommaruga', 'juanchisommaruga@gmail.com', '$2a$12$K08rDFOU6JTwRi.VCcoNUuhlyMoMfGqGTB671bdRIJq70RVnw2AsW', 'cliente'),
('Julio', 'Cortázar', 'jcortazar@example.com', '$2a$12$K08rDFOU6JTwRi.VCcoNUuhlyMoMfGqGTB671bdRIJq70RVnw2AsW', 'cliente'),
('Eduardo', 'Lazzari', 'elazzari@example.com', '$2a$12$K08rDFOU6JTwRi.VCcoNUuhlyMoMfGqGTB671bdRIJq70RVnw2AsW', 'cliente');

-- Empleados y Administradores
INSERT INTO `usuarios` (`nombre`, `apellido`, `nombre_usuario`, `contrasenia`, `tipo_usuario`) VALUES
('Darth', 'Vader', 'dvader@example.com', '$2a$12$K08rDFOU6JTwRi.VCcoNUuhlyMoMfGqGTB671bdRIJq70RVnw2AsW', 'administrador'),
('Obi-Wan', 'Kenobi', 'okenobi@example.com', '$2a$12$K08rDFOU6JTwRi.VCcoNUuhlyMoMfGqGTB671bdRIJq70RVnw2AsW', 'empleado'),
('Leia', 'Organa', 'lorgana@example.com', '$2a$12$K08rDFOU6JTwRi.VCcoNUuhlyMoMfGqGTB671bdRIJq70RVnw2AsW', 'empleado');

INSERT INTO `reservas` (`reserva_id`, `fecha_reserva`, `salon_id`, `usuario_id`, `turno_id`, `importe_salon`, `importe_total`, `recordatorio_enviado`, `activo`) VALUES
(1, '2025-10-20', 1, 1, 1, 15000.00, 15000.00, 0, 1), 
(2, '2025-10-28', 2, 2, 2, 12000.50, 12000.50, 0, 1), 
(3, '2025-11-05', 3, 3, 3, 18000.00, 18000.00, 0, 1), 
(4, '2025-11-25', 4, 4, 1, 25000.75, 25000.75, 0, 1),
(5, '2025-12-05', 5, 5, 2, 16500.00, 16500.00, 0, 1);


INSERT INTO `servicios` (`servicio_id`, `descripcion`, `importe`) VALUES
(1, 'Decoración temática personalizada', 5000.00),
(2, 'Servicio de catering', 15000.00),
(3, 'Animadores o payasos', 8000.00),
(4, 'Fotografía y video profesional', 12000.00),
(5, 'Alquiler de inflables o juegos', 7000.00),
(6, 'Mesa dulce y candy bar', 9000.00),
(7, 'DJ o música infantil', 6000.00),
(8, 'Servicio de limpieza post-evento', 3000.00),
(9, 'Souvenirs personalizados', 4000.00),
(10, 'Personal de seguridad o asistencia', 5000.00);


INSERT INTO `reservas_servicios` (`reserva_id`, `servicio_id`, `importe`) VALUES
(1, 1, 5000.00), (1, 2, 15000.00), (1, 3, 8000.00), (1, 5, 7000.00);


INSERT INTO `reservas_servicios` (`reserva_id`, `servicio_id`, `importe`) VALUES
(2, 4, 12000.00), (2, 6, 9000.00), (2, 7, 6000.00), (2, 8, 3000.00);


INSERT INTO `reservas_servicios` (`reserva_id`, `servicio_id`, `importe`) VALUES
(3, 1, 5000.00), (3, 5, 7000.00), (3, 9, 4000.00), (3, 10, 5000.00);


INSERT INTO `reservas_servicios` (`reserva_id`, `servicio_id`, `importe`) VALUES
(4, 2, 15000.00), (4, 3, 8000.00), (4, 4, 12000.00), (4, 6, 9000.00);


INSERT INTO `reservas_servicios` (`reserva_id`, `servicio_id`, `importe`) VALUES
(5, 7, 6000.00), (5, 8, 3000.00), (5, 9, 4000.00), (5, 10, 5000.00);


UPDATE `reservas` SET `importe_total` = 15000.00 + 5000.00 + 15000.00 + 8000.00 + 7000.00 WHERE `reserva_id` = 1;
UPDATE `reservas` SET `importe_total` = 12000.50 + 12000.00 + 9000.00 + 6000.00 + 3000.00 WHERE `reserva_id` = 2;
UPDATE `reservas` SET `importe_total` = 18000.00 + 5000.00 + 7000.00 + 4000.00 + 5000.00 WHERE `reserva_id` = 3;
UPDATE `reservas` SET `importe_total` = 25000.75 + 15000.00 + 8000.00 + 12000.00 + 9000.00 WHERE `reserva_id` = 4;
UPDATE `reservas` SET `importe_total` = 16500.00 + 6000.00 + 3000.00 + 4000.00 + 5000.00 WHERE `reserva_id` = 5;