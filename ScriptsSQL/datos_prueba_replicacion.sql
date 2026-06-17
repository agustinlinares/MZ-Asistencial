-- Datos de prueba para probar los apartados de Replicación
-- Pestaña 2: Replicar Disponibilidad de Oferta
-- Pestaña 3: Replicar Catálogo de Servicios

-- DisponibilidadCentrosPropios (año 2023, para replicar a 2024)
INSERT INTO [dbo].[DisponibilidadCentrosPropios] 
    (Centro_id, Servicio_id, Especialidad_id, Mes, Año, Cantidad)
VALUES
(1, 1, 1, 1, 2023, 20),
(1, 1, 1, 2, 2023, 18),
(1, 1, 1, 3, 2023, 22),
(1, 4, 5, 1, 2023, 15),
(1, 4, 5, 2, 2023, 12),
(1, 4, 5, 3, 2023, 16),
(2, 1, 1, 1, 2023, 10),
(2, 1, 1, 2, 2023, 11),
(2, 4, 5, 1, 2023, 8),
(2, 4, 5, 2, 2023, 9)

-- CentrosPropiosEspecialidades (año 2023)
INSERT INTO [dbo].[CentrosPropiosEspecialidades]
    (Centro_id, Año, Especialidad_id, Servicio, Cantidad, ImporteConIva, Servicio_id, FechaAlta, Disponibilidad)
VALUES
(1, 2023, 1, 'Consulta Externa', 100, 85.5, 1, GETDATE(), 1),
(1, 2023, 5, 'Fisioterapia Ambulatoria', 80, 40.0, 4, GETDATE(), 1),
(2, 2023, 1, 'Consulta Externa', 60, 85.5, 1, GETDATE(), 1),
(2, 2023, 5, 'Fisioterapia Ambulatoria', 50, 40.0, 4, GETDATE(), 1)

-- CentrosPropiosCatalogoServicios (año 2023)
INSERT INTO [dbo].[CentrosPropiosCatalogoServicios]
    (Centro_id, Servicio_id, Especialidad_id, Año, Disponibilidad, UsuarioAlta_id, FechaAlta)
VALUES
(1, 1, 1, 2023, 1, 1, GETDATE()),
(1, 4, 5, 2023, 1, 1, GETDATE()),
(2, 1, 1, 2023, 1, 1, GETDATE()),
(2, 4, 5, 2023, 1, 1, GETDATE())