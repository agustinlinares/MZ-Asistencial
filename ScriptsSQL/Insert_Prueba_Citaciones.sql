-- ====================================================================
-- Script de datos de prueba para el módulo de Citaciones
-- Extraído de inserts_datos.sql
-- ====================================================================

-- 1. Movimientos de Citación
SET IDENTITY_INSERT [dbo].[Aux_Citacion_Movimientos] ON;
INSERT INTO [dbo].[Aux_Citacion_Movimientos] ([Movimiento_id], [Movimiento]) VALUES (1,'Reserva');
INSERT INTO [dbo].[Aux_Citacion_Movimientos] ([Movimiento_id], [Movimiento]) VALUES (2,'Confirmación');
INSERT INTO [dbo].[Aux_Citacion_Movimientos] ([Movimiento_id], [Movimiento]) VALUES (3,'Rechazo');
INSERT INTO [dbo].[Aux_Citacion_Movimientos] ([Movimiento_id], [Movimiento]) VALUES (4,'Anulación');
SET IDENTITY_INSERT [dbo].[Aux_Citacion_Movimientos] OFF;

-- 2. Documentación asociada a Citaciones
SET IDENTITY_INSERT [dbo].[CitacionDocumentacion] ON;
INSERT INTO [dbo].[CitacionDocumentacion] ([Doc_id], [Nombre], [Nombre_fisico_servidor], [FechaAlta], [UsuarioAlta], [Mutua_id], [Citacion_id], [Demanda_id]) 
VALUES (1,'Solicitud Citación 001','cit_001_20240112.pdf','2024-12-01 00:00:00',2,1,1,1);
SET IDENTITY_INSERT [dbo].[CitacionDocumentacion] OFF;

-- 3. Citaciones (Datos de prueba principales)
SET IDENTITY_INSERT [dbo].[Citaciones] ON;
INSERT INTO [dbo].[Citaciones] ([citacion_id], [MutaOferta], [MutuaDemandante], [Centro_id], [Provincia_id], [Localidad], [Especialidad_id], [Servicio_id], [Movimiento_id], [Demanda_id], [FechaAltaSolicitud], [FechaRespuestaCitacion], [Necesidad], [Contestacion], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Diciembre], [Año], [Total], [Estado_id], [MotivoRechazo], [FechaRechazo], [UsuarioAlta_id], [FechaAlta], [UsuarioModificacion_id], [FechaModificacion]) 
VALUES (3,1,2,3,5,8,3,4,1,3,'2024-03-02 00:00:00','2024-07-02 00:00:00','Rehabilitación Valencia sur','Ajuste a 8 plazas',0,0,0,0,0,1,0,0,0,0,1,1,2024,3,5,NULL,NULL,NULL,'2024-03-02 00:00:00',NULL,NULL);

INSERT INTO [dbo].[Citaciones] ([citacion_id], [MutaOferta], [MutuaDemandante], [Centro_id], [Provincia_id], [Localidad], [Especialidad_id], [Servicio_id], [Movimiento_id], [Demanda_id], [FechaAltaSolicitud], [FechaRespuestaCitacion], [Necesidad], [Contestacion], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Diciembre], [Año], [Total], [Estado_id], [MotivoRechazo], [FechaRechazo], [UsuarioAlta_id], [FechaAlta], [UsuarioModificacion_id], [FechaModificacion]) 
VALUES (5,5,4,5,5,8,5,4,1,5,'2024-04-03 00:00:00','2024-08-03 00:00:00','Fisioterapia intensiva Madrid','Aceptado 20 sesiones',2,2,0,0,0,0,0,0,0,0,0,0,2024,4,7,NULL,NULL,NULL,'2024-04-03 00:00:00',NULL,NULL);

INSERT INTO [dbo].[Citaciones] ([citacion_id], [MutaOferta], [MutuaDemandante], [Centro_id], [Provincia_id], [Localidad], [Especialidad_id], [Servicio_id], [Movimiento_id], [Demanda_id], [FechaAltaSolicitud], [FechaRespuestaCitacion], [Necesidad], [Contestacion], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Diciembre], [Año], [Total], [Estado_id], [MotivoRechazo], [FechaRechazo], [UsuarioAlta_id], [FechaAlta], [UsuarioModificacion_id], [FechaModificacion]) 
VALUES (7,2,2,7,10,10,2,1,4,7,'2024-02-04 00:00:00',NULL,'Medicina general Santander',NULL,0,0,0,0,0,0,0,0,0,0,0,0,2024,0,4,NULL,NULL,NULL,'2024-02-04 00:00:00',NULL,NULL);
SET IDENTITY_INSERT [dbo].[Citaciones] OFF;
