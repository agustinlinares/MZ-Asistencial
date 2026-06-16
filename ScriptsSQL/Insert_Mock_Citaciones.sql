USE [MZAsistencial];
GO

-- Script para probar citaciones con diferentes estados y tipos de movimiento

-- Inserción de Estados de Citación de prueba (si estuviesen vacíos)
IF NOT EXISTS (SELECT 1 FROM Aux_Estados_Citacion WHERE Estado_id = 1)
    INSERT INTO Aux_Estados_Citacion (Estado_id, Estado) VALUES (1, 'Pendiente');
IF NOT EXISTS (SELECT 1 FROM Aux_Estados_Citacion WHERE Estado_id = 2)
    INSERT INTO Aux_Estados_Citacion (Estado_id, Estado) VALUES (2, 'Aprobada');
IF NOT EXISTS (SELECT 1 FROM Aux_Estados_Citacion WHERE Estado_id = 3)
    INSERT INTO Aux_Estados_Citacion (Estado_id, Estado) VALUES (3, 'Rechazada');
IF NOT EXISTS (SELECT 1 FROM Aux_Estados_Citacion WHERE Estado_id = 4)
    INSERT INTO Aux_Estados_Citacion (Estado_id, Estado) VALUES (4, 'Finalizada');
GO

-- Inserción de Citaciones de prueba

-- 1) Movimiento_id 1: Reserva, Estado_id: 1 (Pendiente)
INSERT INTO Citaciones 
(MutaOferta, MutuaDemandante, Centro_id, Movimiento_id, Estado_id, FechaAltaSolicitud, Necesidad) 
VALUES 
(1, 2, 10, 1, 1, GETDATE(), 'Reserva inicial para prueba');

-- 2) Movimiento_id 2: Confirmación, Estado_id: 2 (Aprobada)
INSERT INTO Citaciones 
(MutaOferta, MutuaDemandante, Centro_id, Movimiento_id, Estado_id, FechaAltaSolicitud, FechaRespuestaCitacion, Necesidad, Contestacion) 
VALUES 
(1, 2, 10, 2, 2, DATEADD(day, -1, GETDATE()), GETDATE(), 'Reserva de cita confirmada', 'Confirmación generada en sistema');

-- 3) Movimiento_id 3: Rechazo, Estado_id: 3 (Rechazada)
INSERT INTO Citaciones 
(MutaOferta, MutuaDemandante, Centro_id, Movimiento_id, Estado_id, FechaAltaSolicitud, MotivoRechazo, FechaRechazo) 
VALUES 
(3, 4, 15, 3, 3, DATEADD(day, -2, GETDATE()), 'Sin disponibilidad en agenda', GETDATE());

-- 4) Movimiento_id 4: Anulación, Estado_id: 4 (Finalizada)
INSERT INTO Citaciones 
(MutaOferta, MutuaDemandante, Centro_id, Movimiento_id, Estado_id, FechaAltaSolicitud, Necesidad, MotivoRechazo) 
VALUES 
(2, 3, 12, 4, 4, DATEADD(day, -5, GETDATE()), 'Cita programada', 'Anulación por parte del paciente');
GO
