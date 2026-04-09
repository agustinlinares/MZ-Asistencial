USE MZAsistencial;
GO

EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT ALL";
GO

SET IDENTITY_INSERT [dbo].[AccesosUsuarios] ON;
INSERT INTO [dbo].[AccesosUsuarios] ([AccesoUsuario_id], [Perfil_id], [Ficha_id], [UsuarioModificacion], [FechaModificacion]) VALUES (1,1,1,1,NULL);
INSERT INTO [dbo].[AccesosUsuarios] ([AccesoUsuario_id], [Perfil_id], [Ficha_id], [UsuarioModificacion], [FechaModificacion]) VALUES (2,1,2,1,NULL);
INSERT INTO [dbo].[AccesosUsuarios] ([AccesoUsuario_id], [Perfil_id], [Ficha_id], [UsuarioModificacion], [FechaModificacion]) VALUES (3,2,1,1,NULL);
INSERT INTO [dbo].[AccesosUsuarios] ([AccesoUsuario_id], [Perfil_id], [Ficha_id], [UsuarioModificacion], [FechaModificacion]) VALUES (4,2,3,1,NULL);
INSERT INTO [dbo].[AccesosUsuarios] ([AccesoUsuario_id], [Perfil_id], [Ficha_id], [UsuarioModificacion], [FechaModificacion]) VALUES (5,3,1,1,NULL);
INSERT INTO [dbo].[AccesosUsuarios] ([AccesoUsuario_id], [Perfil_id], [Ficha_id], [UsuarioModificacion], [FechaModificacion]) VALUES (6,4,4,1,NULL);
INSERT INTO [dbo].[AccesosUsuarios] ([AccesoUsuario_id], [Perfil_id], [Ficha_id], [UsuarioModificacion], [FechaModificacion]) VALUES (7,6,5,1,NULL);
SET IDENTITY_INSERT [dbo].[AccesosUsuarios] OFF;

SET IDENTITY_INSERT [dbo].[Aux_AgrupacionConciertos] ON;
INSERT INTO [dbo].[Aux_AgrupacionConciertos] ([Agrupacion_id], [Agrupacion]) VALUES (1,'Vigente');
INSERT INTO [dbo].[Aux_AgrupacionConciertos] ([Agrupacion_id], [Agrupacion]) VALUES (2,'No Vigente');
INSERT INTO [dbo].[Aux_AgrupacionConciertos] ([Agrupacion_id], [Agrupacion]) VALUES (3,'No Casa');
SET IDENTITY_INSERT [dbo].[Aux_AgrupacionConciertos] OFF;

SET IDENTITY_INSERT [dbo].[Aux_AmbitosCobertura] ON;
INSERT INTO [dbo].[Aux_AmbitosCobertura] ([Ambito_id], [Ambito]) VALUES (1,'Hasta 25 Kms');
INSERT INTO [dbo].[Aux_AmbitosCobertura] ([Ambito_id], [Ambito]) VALUES (2,'Entre 25 y 50 Kms');
INSERT INTO [dbo].[Aux_AmbitosCobertura] ([Ambito_id], [Ambito]) VALUES (3,'Más de 50 Kms');
SET IDENTITY_INSERT [dbo].[Aux_AmbitosCobertura] OFF;

SET IDENTITY_INSERT [dbo].[Aux_Areas] ON;
INSERT INTO [dbo].[Aux_Areas] ([Area_id], [Area]) VALUES (1,'Área 1');
INSERT INTO [dbo].[Aux_Areas] ([Area_id], [Area]) VALUES (2,'Área 2');
INSERT INTO [dbo].[Aux_Areas] ([Area_id], [Area]) VALUES (3,'Área 3');
INSERT INTO [dbo].[Aux_Areas] ([Area_id], [Area]) VALUES (4,'Área 4');
SET IDENTITY_INSERT [dbo].[Aux_Areas] OFF;

SET IDENTITY_INSERT [dbo].[Aux_Citacion_Movimientos] ON;
INSERT INTO [dbo].[Aux_Citacion_Movimientos] ([Movimiento_id], [Movimiento]) VALUES (1,'Reserva');
INSERT INTO [dbo].[Aux_Citacion_Movimientos] ([Movimiento_id], [Movimiento]) VALUES (2,'Confirmación');
INSERT INTO [dbo].[Aux_Citacion_Movimientos] ([Movimiento_id], [Movimiento]) VALUES (3,'Rechazo');
INSERT INTO [dbo].[Aux_Citacion_Movimientos] ([Movimiento_id], [Movimiento]) VALUES (4,'Anulación');
SET IDENTITY_INSERT [dbo].[Aux_Citacion_Movimientos] OFF;

SET IDENTITY_INSERT [dbo].[Aux_Especialidades] ON;
INSERT INTO [dbo].[Aux_Especialidades] ([Especialidad_id], [Especialidad]) VALUES (1,'Traumatología');
INSERT INTO [dbo].[Aux_Especialidades] ([Especialidad_id], [Especialidad]) VALUES (2,'Medicina General');
INSERT INTO [dbo].[Aux_Especialidades] ([Especialidad_id], [Especialidad]) VALUES (3,'Rehabilitación');
INSERT INTO [dbo].[Aux_Especialidades] ([Especialidad_id], [Especialidad]) VALUES (4,'Cirugía Ortopédica');
INSERT INTO [dbo].[Aux_Especialidades] ([Especialidad_id], [Especialidad]) VALUES (5,'Fisioterapia');
INSERT INTO [dbo].[Aux_Especialidades] ([Especialidad_id], [Especialidad]) VALUES (6,'Neurología');
INSERT INTO [dbo].[Aux_Especialidades] ([Especialidad_id], [Especialidad]) VALUES (7,'Cardiología');
INSERT INTO [dbo].[Aux_Especialidades] ([Especialidad_id], [Especialidad]) VALUES (8,'Dermatología');
INSERT INTO [dbo].[Aux_Especialidades] ([Especialidad_id], [Especialidad]) VALUES (9,'Oftalmología');
INSERT INTO [dbo].[Aux_Especialidades] ([Especialidad_id], [Especialidad]) VALUES (10,'Psiquiatría');
SET IDENTITY_INSERT [dbo].[Aux_Especialidades] OFF;

SET IDENTITY_INSERT [dbo].[Aux_Estados_Demanda] ON;
INSERT INTO [dbo].[Aux_Estados_Demanda] ([Estado_id], [Estado], [UsuarioModificacion_id], [FechaModificacion]) VALUES (1,'Pendiente Asign',1,NULL);
INSERT INTO [dbo].[Aux_Estados_Demanda] ([Estado_id], [Estado], [UsuarioModificacion_id], [FechaModificacion]) VALUES (2,'Retraso',1,NULL);
INSERT INTO [dbo].[Aux_Estados_Demanda] ([Estado_id], [Estado], [UsuarioModificacion_id], [FechaModificacion]) VALUES (3,'Confirmada',1,NULL);
INSERT INTO [dbo].[Aux_Estados_Demanda] ([Estado_id], [Estado], [UsuarioModificacion_id], [FechaModificacion]) VALUES (4,'Pendiente Confirm',1,NULL);
INSERT INTO [dbo].[Aux_Estados_Demanda] ([Estado_id], [Estado], [UsuarioModificacion_id], [FechaModificacion]) VALUES (5,'Anulada',1,NULL);
INSERT INTO [dbo].[Aux_Estados_Demanda] ([Estado_id], [Estado], [UsuarioModificacion_id], [FechaModificacion]) VALUES (6,'Vacia',1,NULL);
INSERT INTO [dbo].[Aux_Estados_Demanda] ([Estado_id], [Estado], [UsuarioModificacion_id], [FechaModificacion]) VALUES (7,'Asignacion Nula',1,NULL);
INSERT INTO [dbo].[Aux_Estados_Demanda] ([Estado_id], [Estado], [UsuarioModificacion_id], [FechaModificacion]) VALUES (8,'Rechazada',1,NULL);
INSERT INTO [dbo].[Aux_Estados_Demanda] ([Estado_id], [Estado], [UsuarioModificacion_id], [FechaModificacion]) VALUES (9,'Cancelada',1,NULL);
SET IDENTITY_INSERT [dbo].[Aux_Estados_Demanda] OFF;

SET IDENTITY_INSERT [dbo].[Aux_EstadosInformesICG] ON;
INSERT INTO [dbo].[Aux_EstadosInformesICG] ([EstadoInforme_id], [EstadoInforme]) VALUES (1,'Pendiente de procesar');
INSERT INTO [dbo].[Aux_EstadosInformesICG] ([EstadoInforme_id], [EstadoInforme]) VALUES (2,'Procesado');
SET IDENTITY_INSERT [dbo].[Aux_EstadosInformesICG] OFF;

SET IDENTITY_INSERT [dbo].[Aux_FichasSistema] ON;
INSERT INTO [dbo].[Aux_FichasSistema] ([Ficha_id], [Ficha], [UsuarioModificacion], [FechaModificacion]) VALUES (1,'Ficha de Centro Propio',1,NULL);
INSERT INTO [dbo].[Aux_FichasSistema] ([Ficha_id], [Ficha], [UsuarioModificacion], [FechaModificacion]) VALUES (2,'Ficha de Centro Concertado',1,NULL);
INSERT INTO [dbo].[Aux_FichasSistema] ([Ficha_id], [Ficha], [UsuarioModificacion], [FechaModificacion]) VALUES (3,'Ficha de Mutua',1,NULL);
INSERT INTO [dbo].[Aux_FichasSistema] ([Ficha_id], [Ficha], [UsuarioModificacion], [FechaModificacion]) VALUES (4,'Ficha de Demanda',1,NULL);
INSERT INTO [dbo].[Aux_FichasSistema] ([Ficha_id], [Ficha], [UsuarioModificacion], [FechaModificacion]) VALUES (5,'Ficha de Citación',1,NULL);
SET IDENTITY_INSERT [dbo].[Aux_FichasSistema] OFF;

SET IDENTITY_INSERT [dbo].[Aux_IconosMutuas] ON;
INSERT INTO [dbo].[Aux_IconosMutuas] ([Icono_id], [Mutua_id], [Icono]) VALUES (1,1,'/iconos/mutualia.png');
INSERT INTO [dbo].[Aux_IconosMutuas] ([Icono_id], [Mutua_id], [Icono]) VALUES (2,2,'/iconos/prevensalud.png');
INSERT INTO [dbo].[Aux_IconosMutuas] ([Icono_id], [Mutua_id], [Icono]) VALUES (3,3,'/iconos/nexomutua.png');
INSERT INTO [dbo].[Aux_IconosMutuas] ([Icono_id], [Mutua_id], [Icono]) VALUES (4,4,'/iconos/laboralia.png');
INSERT INTO [dbo].[Aux_IconosMutuas] ([Icono_id], [Mutua_id], [Icono]) VALUES (5,5,'/iconos/salumut.png');
SET IDENTITY_INSERT [dbo].[Aux_IconosMutuas] OFF;

SET IDENTITY_INSERT [dbo].[Aux_Meses] ON;
INSERT INTO [dbo].[Aux_Meses] ([Mes_id], [Mes]) VALUES (1,'Enero');
INSERT INTO [dbo].[Aux_Meses] ([Mes_id], [Mes]) VALUES (2,'Febrero');
INSERT INTO [dbo].[Aux_Meses] ([Mes_id], [Mes]) VALUES (3,'Marzo');
INSERT INTO [dbo].[Aux_Meses] ([Mes_id], [Mes]) VALUES (4,'Abril');
INSERT INTO [dbo].[Aux_Meses] ([Mes_id], [Mes]) VALUES (5,'Mayo');
INSERT INTO [dbo].[Aux_Meses] ([Mes_id], [Mes]) VALUES (6,'Junio');
INSERT INTO [dbo].[Aux_Meses] ([Mes_id], [Mes]) VALUES (7,'Julio');
INSERT INTO [dbo].[Aux_Meses] ([Mes_id], [Mes]) VALUES (8,'Agosto');
INSERT INTO [dbo].[Aux_Meses] ([Mes_id], [Mes]) VALUES (9,'Septiembre');
INSERT INTO [dbo].[Aux_Meses] ([Mes_id], [Mes]) VALUES (10,'Octubre');
INSERT INTO [dbo].[Aux_Meses] ([Mes_id], [Mes]) VALUES (11,'Noviembre');
INSERT INTO [dbo].[Aux_Meses] ([Mes_id], [Mes]) VALUES (12,'Diciembre');
SET IDENTITY_INSERT [dbo].[Aux_Meses] OFF;

INSERT INTO [dbo].[Aux_Provincias] ([Provincia_id], [Provincia], [CCAA_id]) VALUES (1,'Sevilla',1);
INSERT INTO [dbo].[Aux_Provincias] ([Provincia_id], [Provincia], [CCAA_id]) VALUES (2,'Málaga',1);
INSERT INTO [dbo].[Aux_Provincias] ([Provincia_id], [Provincia], [CCAA_id]) VALUES (3,'Barcelona',9);
INSERT INTO [dbo].[Aux_Provincias] ([Provincia_id], [Provincia], [CCAA_id]) VALUES (4,'Tarragona',9);
INSERT INTO [dbo].[Aux_Provincias] ([Provincia_id], [Provincia], [CCAA_id]) VALUES (5,'Valencia',10);
INSERT INTO [dbo].[Aux_Provincias] ([Provincia_id], [Provincia], [CCAA_id]) VALUES (6,'Alicante',10);
INSERT INTO [dbo].[Aux_Provincias] ([Provincia_id], [Provincia], [CCAA_id]) VALUES (10,'Cantabria',6);

SET IDENTITY_INSERT [dbo].[Aux_Poblaciones] ON;
INSERT INTO [dbo].[Aux_Poblaciones] ([Poblacion_id], [Poblacion], [Provincia_id]) VALUES (1,'Sevilla',1);
INSERT INTO [dbo].[Aux_Poblaciones] ([Poblacion_id], [Poblacion], [Provincia_id]) VALUES (2,'Dos Hermanas',1);
INSERT INTO [dbo].[Aux_Poblaciones] ([Poblacion_id], [Poblacion], [Provincia_id]) VALUES (3,'Málaga',2);
INSERT INTO [dbo].[Aux_Poblaciones] ([Poblacion_id], [Poblacion], [Provincia_id]) VALUES (4,'Marbella',2);
INSERT INTO [dbo].[Aux_Poblaciones] ([Poblacion_id], [Poblacion], [Provincia_id]) VALUES (5,'Barcelona',3);
INSERT INTO [dbo].[Aux_Poblaciones] ([Poblacion_id], [Poblacion], [Provincia_id]) VALUES (6,'Badalona',3);
INSERT INTO [dbo].[Aux_Poblaciones] ([Poblacion_id], [Poblacion], [Provincia_id]) VALUES (7,'Tarragona',4);
INSERT INTO [dbo].[Aux_Poblaciones] ([Poblacion_id], [Poblacion], [Provincia_id]) VALUES (8,'Valencia',5);
INSERT INTO [dbo].[Aux_Poblaciones] ([Poblacion_id], [Poblacion], [Provincia_id]) VALUES (9,'Alicante',6);
INSERT INTO [dbo].[Aux_Poblaciones] ([Poblacion_id], [Poblacion], [Provincia_id]) VALUES (10,'Santander',10);
SET IDENTITY_INSERT [dbo].[Aux_Poblaciones] OFF;

SET IDENTITY_INSERT [dbo].[Aux_Poblaciones_Cod_Postales] ON;
INSERT INTO [dbo].[Aux_Poblaciones_Cod_Postales] ([Registro_id], [Poblacion_id], [CP]) VALUES (1,1,'41001');
INSERT INTO [dbo].[Aux_Poblaciones_Cod_Postales] ([Registro_id], [Poblacion_id], [CP]) VALUES (2,1,'41004');
INSERT INTO [dbo].[Aux_Poblaciones_Cod_Postales] ([Registro_id], [Poblacion_id], [CP]) VALUES (3,2,'41700');
INSERT INTO [dbo].[Aux_Poblaciones_Cod_Postales] ([Registro_id], [Poblacion_id], [CP]) VALUES (4,3,'29001');
INSERT INTO [dbo].[Aux_Poblaciones_Cod_Postales] ([Registro_id], [Poblacion_id], [CP]) VALUES (5,4,'29600');
INSERT INTO [dbo].[Aux_Poblaciones_Cod_Postales] ([Registro_id], [Poblacion_id], [CP]) VALUES (6,5,'08001');
INSERT INTO [dbo].[Aux_Poblaciones_Cod_Postales] ([Registro_id], [Poblacion_id], [CP]) VALUES (7,5,'08011');
INSERT INTO [dbo].[Aux_Poblaciones_Cod_Postales] ([Registro_id], [Poblacion_id], [CP]) VALUES (8,6,'08911');
INSERT INTO [dbo].[Aux_Poblaciones_Cod_Postales] ([Registro_id], [Poblacion_id], [CP]) VALUES (9,8,'46001');
INSERT INTO [dbo].[Aux_Poblaciones_Cod_Postales] ([Registro_id], [Poblacion_id], [CP]) VALUES (10,9,'03001');
SET IDENTITY_INSERT [dbo].[Aux_Poblaciones_Cod_Postales] OFF;

SET IDENTITY_INSERT [dbo].[Aux_Servicios] ON;
INSERT INTO [dbo].[Aux_Servicios] ([Servicio_id], [Servicio], [TipoServicio_id]) VALUES (1,'Consulta Externa',1);
INSERT INTO [dbo].[Aux_Servicios] ([Servicio_id], [Servicio], [TipoServicio_id]) VALUES (2,'Ingreso Hospitalario',2);
INSERT INTO [dbo].[Aux_Servicios] ([Servicio_id], [Servicio], [TipoServicio_id]) VALUES (3,'Urgencias 24h',3);
INSERT INTO [dbo].[Aux_Servicios] ([Servicio_id], [Servicio], [TipoServicio_id]) VALUES (4,'Fisioterapia Ambulatoria',4);
INSERT INTO [dbo].[Aux_Servicios] ([Servicio_id], [Servicio], [TipoServicio_id]) VALUES (5,'Prevención Laboral',5);
INSERT INTO [dbo].[Aux_Servicios] ([Servicio_id], [Servicio], [TipoServicio_id]) VALUES (6,'Cirugía Ambulatoria',1);
INSERT INTO [dbo].[Aux_Servicios] ([Servicio_id], [Servicio], [TipoServicio_id]) VALUES (7,'Radiología',1);
INSERT INTO [dbo].[Aux_Servicios] ([Servicio_id], [Servicio], [TipoServicio_id]) VALUES (8,'Analítica Clínica',1);
INSERT INTO [dbo].[Aux_Servicios] ([Servicio_id], [Servicio], [TipoServicio_id]) VALUES (9,'Rehabilitación Intensiva',4);
INSERT INTO [dbo].[Aux_Servicios] ([Servicio_id], [Servicio], [TipoServicio_id]) VALUES (10,'Medicina del Trabajo',5);
SET IDENTITY_INSERT [dbo].[Aux_Servicios] OFF;

SET IDENTITY_INSERT [dbo].[Aux_TipoRechazo] ON;
INSERT INTO [dbo].[Aux_TipoRechazo] ([TipoRechazo_id], [Rechazo]) VALUES (1,'Por Asignacion Fuera de plazo');
INSERT INTO [dbo].[Aux_TipoRechazo] ([TipoRechazo_id], [Rechazo]) VALUES (2,'Por Alta de empleado');
INSERT INTO [dbo].[Aux_TipoRechazo] ([TipoRechazo_id], [Rechazo]) VALUES (3,'Incumplimiento de plazos descritos');
INSERT INTO [dbo].[Aux_TipoRechazo] ([TipoRechazo_id], [Rechazo]) VALUES (4,'Documentación incompleta');
INSERT INTO [dbo].[Aux_TipoRechazo] ([TipoRechazo_id], [Rechazo]) VALUES (5,'Otros');
SET IDENTITY_INSERT [dbo].[Aux_TipoRechazo] OFF;

SET IDENTITY_INSERT [dbo].[Aux_TiposAcreditacion] ON;
INSERT INTO [dbo].[Aux_TiposAcreditacion] ([TipoAcreditacion_id], [TipoAcreditacion], [UsuarioModificacion_id], [FechaModificacion]) VALUES (1,'ISO 9001',NULL,NULL);
INSERT INTO [dbo].[Aux_TiposAcreditacion] ([TipoAcreditacion_id], [TipoAcreditacion], [UsuarioModificacion_id], [FechaModificacion]) VALUES (2,'Joint Commission',NULL,NULL);
INSERT INTO [dbo].[Aux_TiposAcreditacion] ([TipoAcreditacion_id], [TipoAcreditacion], [UsuarioModificacion_id], [FechaModificacion]) VALUES (3,'AENOR',NULL,NULL);
INSERT INTO [dbo].[Aux_TiposAcreditacion] ([TipoAcreditacion_id], [TipoAcreditacion], [UsuarioModificacion_id], [FechaModificacion]) VALUES (4,'Acreditación Sanitaria Autonómica',NULL,NULL);
INSERT INTO [dbo].[Aux_TiposAcreditacion] ([TipoAcreditacion_id], [TipoAcreditacion], [UsuarioModificacion_id], [FechaModificacion]) VALUES (5,'Sin acreditación',NULL,NULL);
SET IDENTITY_INSERT [dbo].[Aux_TiposAcreditacion] OFF;

SET IDENTITY_INSERT [dbo].[Aux_TiposDemanda] ON;
INSERT INTO [dbo].[Aux_TiposDemanda] ([Tipo_id], [Tipo], [Usuario_id], [FechaModificacion]) VALUES (1,'Anual',NULL,NULL);
INSERT INTO [dbo].[Aux_TiposDemanda] ([Tipo_id], [Tipo], [Usuario_id], [FechaModificacion]) VALUES (2,'Individual',NULL,NULL);
INSERT INTO [dbo].[Aux_TiposDemanda] ([Tipo_id], [Tipo], [Usuario_id], [FechaModificacion]) VALUES (3,'Mensual',NULL,NULL);
INSERT INTO [dbo].[Aux_TiposDemanda] ([Tipo_id], [Tipo], [Usuario_id], [FechaModificacion]) VALUES (4,'Completa',NULL,NULL);
SET IDENTITY_INSERT [dbo].[Aux_TiposDemanda] OFF;

SET IDENTITY_INSERT [dbo].[Aux_TipoServicio] ON;
INSERT INTO [dbo].[Aux_TipoServicio] ([TipoServicio_id], [TipoServicio], [TipoServicio_nan]) VALUES (1,'Ambulatorio',NULL);
INSERT INTO [dbo].[Aux_TipoServicio] ([TipoServicio_id], [TipoServicio], [TipoServicio_nan]) VALUES (2,'Hospitalario',NULL);
INSERT INTO [dbo].[Aux_TipoServicio] ([TipoServicio_id], [TipoServicio], [TipoServicio_nan]) VALUES (3,'Urgencias',NULL);
INSERT INTO [dbo].[Aux_TipoServicio] ([TipoServicio_id], [TipoServicio], [TipoServicio_nan]) VALUES (4,'Rehabilitación',NULL);
INSERT INTO [dbo].[Aux_TipoServicio] ([TipoServicio_id], [TipoServicio], [TipoServicio_nan]) VALUES (5,'Prevención',NULL);
SET IDENTITY_INSERT [dbo].[Aux_TipoServicio] OFF;

SET IDENTITY_INSERT [dbo].[CCAA] ON;
INSERT INTO [dbo].[CCAA] ([CCAA_id], [CCAA]) VALUES (1,'Andalucía                                                                                           ');
INSERT INTO [dbo].[CCAA] ([CCAA_id], [CCAA]) VALUES (2,'Aragón                                                                                              ');
INSERT INTO [dbo].[CCAA] ([CCAA_id], [CCAA]) VALUES (3,'Asturias                                                                                            ');
INSERT INTO [dbo].[CCAA] ([CCAA_id], [CCAA]) VALUES (4,'Baleares                                                                                            ');
INSERT INTO [dbo].[CCAA] ([CCAA_id], [CCAA]) VALUES (5,'Canarias                                                                                            ');
INSERT INTO [dbo].[CCAA] ([CCAA_id], [CCAA]) VALUES (6,'Cantabria                                                                                           ');
INSERT INTO [dbo].[CCAA] ([CCAA_id], [CCAA]) VALUES (7,'Castilla-La Mancha                                                                                  ');
INSERT INTO [dbo].[CCAA] ([CCAA_id], [CCAA]) VALUES (8,'Castilla y León                                                                                     ');
INSERT INTO [dbo].[CCAA] ([CCAA_id], [CCAA]) VALUES (9,'Cataluña                                                                                            ');
INSERT INTO [dbo].[CCAA] ([CCAA_id], [CCAA]) VALUES (10,'Comunidad Valenciana                                                                                ');
SET IDENTITY_INSERT [dbo].[CCAA] OFF;

SET IDENTITY_INSERT [dbo].[CentrosConcertados] ON;
INSERT INTO [dbo].[CentrosConcertados] ([Centro_id], [Centro], [Validado], [Localizador], [Proveedor_id], [Delegacion_id], [CIFNIF], [Direccion], [Numero], [DireccionGIS], [Poblacion_id], [CP], [Telefono], [Fax], [DireccionElectronica], [PersonaContacto], [ServiciosEspeciales], [AsistenciaHospitalaria], [AsistenciaAmbulatoria], [Rehabilitacion], [IncapacidadTransitoria], [Prevencion], [Administracion], [OtrasActividades], [AsistenciaSanitaria], [MediosAjenos], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [FechaBaja], [UsuarioBaja_id], [MotivoBaja], [TipoCentro], [TipoCentroAnt], [Observaciones], [TipoVia_id], [Piso], [Puerta], [OtrosDatos], [Traslado], [Centro_idNuevo], [Fautocom], [Fpufuncio], [Fcalisuf], [FechaCarga], [MapaValidado], [Latitud], [Longitud], [CodigoMZ], [id_ICG072013], [CIFNIFValido], [NumRegistroSanitario]) VALUES (101,'Clínica Condal',1,NULL,2,2,'B67890123      ','Calle de Vilana, 12',NULL,NULL,5,'08022','934 806 000    ',NULL,'info@clinicacondal.es','Núria Soler Camps',NULL,NULL,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'2024-01-01 00:00:00',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO [dbo].[CentrosConcertados] ([Centro_id], [Centro], [Validado], [Localizador], [Proveedor_id], [Delegacion_id], [CIFNIF], [Direccion], [Numero], [DireccionGIS], [Poblacion_id], [CP], [Telefono], [Fax], [DireccionElectronica], [PersonaContacto], [ServiciosEspeciales], [AsistenciaHospitalaria], [AsistenciaAmbulatoria], [Rehabilitacion], [IncapacidadTransitoria], [Prevencion], [Administracion], [OtrasActividades], [AsistenciaSanitaria], [MediosAjenos], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [FechaBaja], [UsuarioBaja_id], [MotivoBaja], [TipoCentro], [TipoCentroAnt], [Observaciones], [TipoVia_id], [Piso], [Puerta], [OtrosDatos], [Traslado], [Centro_idNuevo], [Fautocom], [Fpufuncio], [Fcalisuf], [FechaCarga], [MapaValidado], [Latitud], [Longitud], [CodigoMZ], [id_ICG072013], [CIFNIFValido], [NumRegistroSanitario]) VALUES (102,'Hospital San Leandro',1,NULL,3,1,'B78901234      ','Avenida Manuel Siurot, 12',NULL,NULL,1,'41013','955 012 000    ',NULL,'info@hsanleandro.es','Manuel Ortega Reyes',NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL,'2024-01-01 00:00:00',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO [dbo].[CentrosConcertados] ([Centro_id], [Centro], [Validado], [Localizador], [Proveedor_id], [Delegacion_id], [CIFNIF], [Direccion], [Numero], [DireccionGIS], [Poblacion_id], [CP], [Telefono], [Fax], [DireccionElectronica], [PersonaContacto], [ServiciosEspeciales], [AsistenciaHospitalaria], [AsistenciaAmbulatoria], [Rehabilitacion], [IncapacidadTransitoria], [Prevencion], [Administracion], [OtrasActividades], [AsistenciaSanitaria], [MediosAjenos], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [FechaBaja], [UsuarioBaja_id], [MotivoBaja], [TipoCentro], [TipoCentroAnt], [Observaciones], [TipoVia_id], [Piso], [Puerta], [OtrosDatos], [Traslado], [Centro_idNuevo], [Fautocom], [Fpufuncio], [Fcalisuf], [FechaCarga], [MapaValidado], [Latitud], [Longitud], [CodigoMZ], [id_ICG072013], [CIFNIFValido], [NumRegistroSanitario]) VALUES (103,'Hospital La Albufera',1,NULL,5,3,'B89012345      ','Bulevar Sur, 22',NULL,NULL,8,'46026','961 244 000    ',NULL,'info@halbufera.es','Amparo Llopis Ferri',NULL,NULL,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'2024-01-01 00:00:00',3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
SET IDENTITY_INSERT [dbo].[CentrosConcertados] OFF;

SET IDENTITY_INSERT [dbo].[CentrosEspecialidades] ON;
INSERT INTO [dbo].[CentrosEspecialidades] ([CentroEspecialidad_id], [Centro_id], [Mutua_id], [Año], [Especialidad_id], [Servicio], [Cantidad], [ImporteConIVA], [Servicio_id]) VALUES (1,101,2,2024,1,'Consulta Traumatología',120,85.5,1);
INSERT INTO [dbo].[CentrosEspecialidades] ([CentroEspecialidad_id], [Centro_id], [Mutua_id], [Año], [Especialidad_id], [Servicio], [Cantidad], [ImporteConIVA], [Servicio_id]) VALUES (2,102,1,2024,1,'Traumatología Cirugía',50,350,6);
INSERT INTO [dbo].[CentrosEspecialidades] ([CentroEspecialidad_id], [Centro_id], [Mutua_id], [Año], [Especialidad_id], [Servicio], [Cantidad], [ImporteConIVA], [Servicio_id]) VALUES (3,103,2,2024,3,'Rehabilitación Intensiva',200,40,9);
SET IDENTITY_INSERT [dbo].[CentrosEspecialidades] OFF;

SET IDENTITY_INSERT [dbo].[CentrosPropios] ON;
INSERT INTO [dbo].[CentrosPropios] ([Centro_id], [Mutua_id], [Centro], [CentroCesionario_id], [Validado], [Localizador], [CIFNIF], [Direccion], [Numero], [DireccionGIS], [Poblacion_id], [CP], [Telefono], [Fax], [DireccionElectronica], [PersonaContacto], [ServiciosEspeciales], [AsistenciaHospitalaria], [AsistenciaAmbulatoria], [Rehabilitacion], [IncapacidadTransitoria], [Prevencion], [Administracion], [OtrasActividades], [AsistenciaSanitaria], [MediosAjenos], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [FechaBaja], [UsuarioBaja_id], [MotivoBaja], [TipoCentro], [TipoCentroAnt], [Observaciones], [TipoVia_id], [Piso], [Puerta], [OtrosDatos], [Traslado], [Centro_idNuevo], [Fautocom], [Fpufuncio], [Fcalisuf], [FechaCarga], [MapaValidado], [Latitud], [Longitud], [CodigoMZ], [MarcaCentro], [FechaDesactivacion], [UsuarioDesactivacion], [Desactivado]) VALUES (1,1,'Centro Médico Valverde',NULL,1,NULL,'B12345678      ','Calle del Salvador, 14',NULL,NULL,1,'41004','954 321 100    ',NULL,'valverde@mutualia.es','Carmen Herrera Leal',NULL,NULL,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'2020-01-06 00:00:00',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0);
INSERT INTO [dbo].[CentrosPropios] ([Centro_id], [Mutua_id], [Centro], [CentroCesionario_id], [Validado], [Localizador], [CIFNIF], [Direccion], [Numero], [DireccionGIS], [Poblacion_id], [CP], [Telefono], [Fax], [DireccionElectronica], [PersonaContacto], [ServiciosEspeciales], [AsistenciaHospitalaria], [AsistenciaAmbulatoria], [Rehabilitacion], [IncapacidadTransitoria], [Prevencion], [Administracion], [OtrasActividades], [AsistenciaSanitaria], [MediosAjenos], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [FechaBaja], [UsuarioBaja_id], [MotivoBaja], [TipoCentro], [TipoCentroAnt], [Observaciones], [TipoVia_id], [Piso], [Puerta], [OtrosDatos], [Traslado], [Centro_idNuevo], [Fautocom], [Fpufuncio], [Fcalisuf], [FechaCarga], [MapaValidado], [Latitud], [Longitud], [CodigoMZ], [MarcaCentro], [FechaDesactivacion], [UsuarioDesactivacion], [Desactivado]) VALUES (3,2,'Centro Médico Ribalta',NULL,1,NULL,'B23456789      ','Avenida del Puerto, 55',NULL,NULL,8,'46023','963 500 300    ',NULL,'ribalta@prevensalud.es','Rosa Molina Climent',NULL,NULL,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'2020-01-07 00:00:00',3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0);
INSERT INTO [dbo].[CentrosPropios] ([Centro_id], [Mutua_id], [Centro], [CentroCesionario_id], [Validado], [Localizador], [CIFNIF], [Direccion], [Numero], [DireccionGIS], [Poblacion_id], [CP], [Telefono], [Fax], [DireccionElectronica], [PersonaContacto], [ServiciosEspeciales], [AsistenciaHospitalaria], [AsistenciaAmbulatoria], [Rehabilitacion], [IncapacidadTransitoria], [Prevencion], [Administracion], [OtrasActividades], [AsistenciaSanitaria], [MediosAjenos], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [FechaBaja], [UsuarioBaja_id], [MotivoBaja], [TipoCentro], [TipoCentroAnt], [Observaciones], [TipoVia_id], [Piso], [Puerta], [OtrosDatos], [Traslado], [Centro_idNuevo], [Fautocom], [Fpufuncio], [Fcalisuf], [FechaCarga], [MapaValidado], [Latitud], [Longitud], [CodigoMZ], [MarcaCentro], [FechaDesactivacion], [UsuarioDesactivacion], [Desactivado]) VALUES (4,3,'Centro Médico Gracia',NULL,1,NULL,'B34567890      ','Calle de Urgell, 240',NULL,NULL,5,'08036','934 394 400    ',NULL,'gracia@nexomutua.es','Jordi Mas Ferrer',NULL,NULL,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'2020-01-08 00:00:00',4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0);
INSERT INTO [dbo].[CentrosPropios] ([Centro_id], [Mutua_id], [Centro], [CentroCesionario_id], [Validado], [Localizador], [CIFNIF], [Direccion], [Numero], [DireccionGIS], [Poblacion_id], [CP], [Telefono], [Fax], [DireccionElectronica], [PersonaContacto], [ServiciosEspeciales], [AsistenciaHospitalaria], [AsistenciaAmbulatoria], [Rehabilitacion], [IncapacidadTransitoria], [Prevencion], [Administracion], [OtrasActividades], [AsistenciaSanitaria], [MediosAjenos], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [FechaBaja], [UsuarioBaja_id], [MotivoBaja], [TipoCentro], [TipoCentroAnt], [Observaciones], [TipoVia_id], [Piso], [Puerta], [OtrosDatos], [Traslado], [Centro_idNuevo], [Fautocom], [Fpufuncio], [Fcalisuf], [FechaCarga], [MapaValidado], [Latitud], [Longitud], [CodigoMZ], [MarcaCentro], [FechaDesactivacion], [UsuarioDesactivacion], [Desactivado]) VALUES (5,4,'Centro Médico Retiro',NULL,1,NULL,'B45678901      ','Calle de Velázquez, 78',NULL,NULL,8,'28001','915 780 500    ',NULL,'retiro@laboralia.es','Isabel Morales Nieto',NULL,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL,'2020-01-09 00:00:00',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0);
INSERT INTO [dbo].[CentrosPropios] ([Centro_id], [Mutua_id], [Centro], [CentroCesionario_id], [Validado], [Localizador], [CIFNIF], [Direccion], [Numero], [DireccionGIS], [Poblacion_id], [CP], [Telefono], [Fax], [DireccionElectronica], [PersonaContacto], [ServiciosEspeciales], [AsistenciaHospitalaria], [AsistenciaAmbulatoria], [Rehabilitacion], [IncapacidadTransitoria], [Prevencion], [Administracion], [OtrasActividades], [AsistenciaSanitaria], [MediosAjenos], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [FechaBaja], [UsuarioBaja_id], [MotivoBaja], [TipoCentro], [TipoCentroAnt], [Observaciones], [TipoVia_id], [Piso], [Puerta], [OtrosDatos], [Traslado], [Centro_idNuevo], [Fautocom], [Fpufuncio], [Fcalisuf], [FechaCarga], [MapaValidado], [Latitud], [Longitud], [CodigoMZ], [MarcaCentro], [FechaDesactivacion], [UsuarioDesactivacion], [Desactivado]) VALUES (6,5,'Centro Médico Gibralfaro',NULL,1,NULL,'B56789012      ','Avenida de Andalucía, 15',NULL,NULL,3,'29006','952 290 600    ',NULL,'gibralfaro@salumut.es','Francisco Rueda Díaz',NULL,NULL,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'2020-01-10 00:00:00',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0);
SET IDENTITY_INSERT [dbo].[CentrosPropios] OFF;

SET IDENTITY_INSERT [dbo].[CentrosPropiosCatalogoServicios] ON;
INSERT INTO [dbo].[CentrosPropiosCatalogoServicios] ([CentroPropioCatalogoServicios_id], [Centro_id], [Servicio_id], [Especialidad_id], [Año], [Disponibilidad], [UsuarioAlta_id], [FechaAlta], [UsuarioBaja_id], [FechaBaja]) VALUES (1,1,1,1,2024,10,2,'2024-01-01 00:00:00',NULL,NULL);
INSERT INTO [dbo].[CentrosPropiosCatalogoServicios] ([CentroPropioCatalogoServicios_id], [Centro_id], [Servicio_id], [Especialidad_id], [Año], [Disponibilidad], [UsuarioAlta_id], [FechaAlta], [UsuarioBaja_id], [FechaBaja]) VALUES (2,1,4,3,2024,8,2,'2024-01-01 00:00:00',NULL,NULL);
INSERT INTO [dbo].[CentrosPropiosCatalogoServicios] ([CentroPropioCatalogoServicios_id], [Centro_id], [Servicio_id], [Especialidad_id], [Año], [Disponibilidad], [UsuarioAlta_id], [FechaAlta], [UsuarioBaja_id], [FechaBaja]) VALUES (3,2,1,2,2024,15,2,'2024-01-01 00:00:00',NULL,NULL);
SET IDENTITY_INSERT [dbo].[CentrosPropiosCatalogoServicios] OFF;

SET IDENTITY_INSERT [dbo].[CentrosPropiosEspecialidades] ON;
INSERT INTO [dbo].[CentrosPropiosEspecialidades] ([CentroPropioEspecialidad_id], [Centro_id], [Año], [Especialidad_id], [Servicio], [Cantidad], [ImporteConIVA], [Servicio_id], [FechaAlta], [FechaBaja], [Disponibilidad], [Plazo], [ActualizarDisponibilidad], [FechaModificacion], [FechaActualizarDisponibilidad], [FechaGeneracionAcreditacion]) VALUES (1,1,2024,1,'Traumatología',120,0,NULL,'2024-01-01 00:00:00',NULL,10,NULL,NULL,NULL,NULL,NULL);
INSERT INTO [dbo].[CentrosPropiosEspecialidades] ([CentroPropioEspecialidad_id], [Centro_id], [Año], [Especialidad_id], [Servicio], [Cantidad], [ImporteConIVA], [Servicio_id], [FechaAlta], [FechaBaja], [Disponibilidad], [Plazo], [ActualizarDisponibilidad], [FechaModificacion], [FechaActualizarDisponibilidad], [FechaGeneracionAcreditacion]) VALUES (2,1,2024,3,'Rehabilitación',96,0,NULL,'2024-01-01 00:00:00',NULL,8,NULL,NULL,NULL,NULL,NULL);
INSERT INTO [dbo].[CentrosPropiosEspecialidades] ([CentroPropioEspecialidad_id], [Centro_id], [Año], [Especialidad_id], [Servicio], [Cantidad], [ImporteConIVA], [Servicio_id], [FechaAlta], [FechaBaja], [Disponibilidad], [Plazo], [ActualizarDisponibilidad], [FechaModificacion], [FechaActualizarDisponibilidad], [FechaGeneracionAcreditacion]) VALUES (3,2,2024,2,'Medicina General',180,0,NULL,'2024-01-01 00:00:00',NULL,15,NULL,NULL,NULL,NULL,NULL);
SET IDENTITY_INSERT [dbo].[CentrosPropiosEspecialidades] OFF;

SET IDENTITY_INSERT [dbo].[CitacionDocumentacion] ON;
INSERT INTO [dbo].[CitacionDocumentacion] ([Doc_id], [Nombre], [Nombre_fisico_servidor], [FechaAlta], [UsuarioAlta], [Mutua_id], [Citacion_id], [Demanda_id]) VALUES (1,'Solicitud Citación 001','cit_001_20240112.pdf','2024-12-01 00:00:00',2,1,1,1);
SET IDENTITY_INSERT [dbo].[CitacionDocumentacion] OFF;

SET IDENTITY_INSERT [dbo].[Citaciones] ON;
INSERT INTO [dbo].[Citaciones] ([citacion_id], [MutaOferta], [MutuaDemandante], [Centro_id], [Provincia_id], [Localidad], [Especialidad_id], [Servicio_id], [Movimiento_id], [Demanda_id], [FechaAltaSolicitud], [FechaRespuestaCitacion], [Necesidad], [Contestacion], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Diciembre], [Año], [Total], [Estado_id], [MotivoRechazo], [FechaRechazo], [UsuarioAlta_id], [FechaAlta], [UsuarioModificacion_id], [FechaModificacion]) VALUES (3,1,2,3,5,8,3,4,1,3,'2024-03-02 00:00:00','2024-07-02 00:00:00','Rehabilitación Valencia sur','Ajuste a 8 plazas',0,0,0,0,0,1,0,0,0,0,1,1,2024,3,5,NULL,NULL,NULL,'2024-03-02 00:00:00',NULL,NULL);
INSERT INTO [dbo].[Citaciones] ([citacion_id], [MutaOferta], [MutuaDemandante], [Centro_id], [Provincia_id], [Localidad], [Especialidad_id], [Servicio_id], [Movimiento_id], [Demanda_id], [FechaAltaSolicitud], [FechaRespuestaCitacion], [Necesidad], [Contestacion], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Diciembre], [Año], [Total], [Estado_id], [MotivoRechazo], [FechaRechazo], [UsuarioAlta_id], [FechaAlta], [UsuarioModificacion_id], [FechaModificacion]) VALUES (5,5,4,5,5,8,5,4,1,5,'2024-04-03 00:00:00','2024-08-03 00:00:00','Fisioterapia intensiva Madrid','Aceptado 20 sesiones',2,2,0,0,0,0,0,0,0,0,0,0,2024,4,7,NULL,NULL,NULL,'2024-04-03 00:00:00',NULL,NULL);
INSERT INTO [dbo].[Citaciones] ([citacion_id], [MutaOferta], [MutuaDemandante], [Centro_id], [Provincia_id], [Localidad], [Especialidad_id], [Servicio_id], [Movimiento_id], [Demanda_id], [FechaAltaSolicitud], [FechaRespuestaCitacion], [Necesidad], [Contestacion], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Diciembre], [Año], [Total], [Estado_id], [MotivoRechazo], [FechaRechazo], [UsuarioAlta_id], [FechaAlta], [UsuarioModificacion_id], [FechaModificacion]) VALUES (7,2,2,7,10,10,2,1,4,7,'2024-02-04 00:00:00',NULL,'Medicina general Santander',NULL,0,0,0,0,0,0,0,0,0,0,0,0,2024,0,4,NULL,NULL,NULL,'2024-02-04 00:00:00',NULL,NULL);
SET IDENTITY_INSERT [dbo].[Citaciones] OFF;

SET IDENTITY_INSERT [dbo].[CodigosCIEP] ON;
INSERT INTO [dbo].[CodigosCIEP] ([CIEP_id], [CIEP], [Especialidad_id]) VALUES (1,'88.72',1);
INSERT INTO [dbo].[CodigosCIEP] ([CIEP_id], [CIEP], [Especialidad_id]) VALUES (2,'89.41',2);
INSERT INTO [dbo].[CodigosCIEP] ([CIEP_id], [CIEP], [Especialidad_id]) VALUES (3,'89.5',3);
INSERT INTO [dbo].[CodigosCIEP] ([CIEP_id], [CIEP], [Especialidad_id]) VALUES (4,'89.61',1);
INSERT INTO [dbo].[CodigosCIEP] ([CIEP_id], [CIEP], [Especialidad_id]) VALUES (5,'89.52',6);
SET IDENTITY_INSERT [dbo].[CodigosCIEP] OFF;

SET IDENTITY_INSERT [dbo].[Conciertos] ON;
INSERT INTO [dbo].[Conciertos] ([Concierto_id], [Mutua_id], [Centro_id], [CodigoCASA], [CodigoMZ], [CentroAsociado_id], [Localizador], [TipoAsistencia_id], [AmbitoCobertura], [Muniambito], [Autorizado], [FechaAutorizacion], [UsuarioAutorizacion_id], [FechaSuscripcion], [FechaResolucion], [FechaVigencia], [FechaProrroga], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [FechaBaja], [UsuarioBaja_id], [Adhesion], [ClaveAcces]) VALUES (1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'2024-01-01 00:00:00',2,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO [dbo].[Conciertos] ([Concierto_id], [Mutua_id], [Centro_id], [CodigoCASA], [CodigoMZ], [CentroAsociado_id], [Localizador], [TipoAsistencia_id], [AmbitoCobertura], [Muniambito], [Autorizado], [FechaAutorizacion], [UsuarioAutorizacion_id], [FechaSuscripcion], [FechaResolucion], [FechaVigencia], [FechaProrroga], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [FechaBaja], [UsuarioBaja_id], [Adhesion], [ClaveAcces]) VALUES (2,2,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'2024-01-01 00:00:00',3,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO [dbo].[Conciertos] ([Concierto_id], [Mutua_id], [Centro_id], [CodigoCASA], [CodigoMZ], [CentroAsociado_id], [Localizador], [TipoAsistencia_id], [AmbitoCobertura], [Muniambito], [Autorizado], [FechaAutorizacion], [UsuarioAutorizacion_id], [FechaSuscripcion], [FechaResolucion], [FechaVigencia], [FechaProrroga], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [FechaBaja], [UsuarioBaja_id], [Adhesion], [ClaveAcces]) VALUES (3,3,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'2024-01-03 00:00:00',4,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO [dbo].[Conciertos] ([Concierto_id], [Mutua_id], [Centro_id], [CodigoCASA], [CodigoMZ], [CentroAsociado_id], [Localizador], [TipoAsistencia_id], [AmbitoCobertura], [Muniambito], [Autorizado], [FechaAutorizacion], [UsuarioAutorizacion_id], [FechaSuscripcion], [FechaResolucion], [FechaVigencia], [FechaProrroga], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [FechaBaja], [UsuarioBaja_id], [Adhesion], [ClaveAcces]) VALUES (4,4,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'2024-01-01 00:00:00',5,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO [dbo].[Conciertos] ([Concierto_id], [Mutua_id], [Centro_id], [CodigoCASA], [CodigoMZ], [CentroAsociado_id], [Localizador], [TipoAsistencia_id], [AmbitoCobertura], [Muniambito], [Autorizado], [FechaAutorizacion], [UsuarioAutorizacion_id], [FechaSuscripcion], [FechaResolucion], [FechaVigencia], [FechaProrroga], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [FechaBaja], [UsuarioBaja_id], [Adhesion], [ClaveAcces]) VALUES (5,5,6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'2024-01-06 00:00:00',6,NULL,NULL,NULL,NULL,NULL,NULL);
SET IDENTITY_INSERT [dbo].[Conciertos] OFF;

SET IDENTITY_INSERT [dbo].[ConciertosAmbitoCobertura] ON;
INSERT INTO [dbo].[ConciertosAmbitoCobertura] ([ID], [Concierto_id], [Ambito_id], [Poblacion_id], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [CP]) VALUES (1,1,3,1,'2024-01-01 00:00:00',2,NULL,NULL,NULL);
INSERT INTO [dbo].[ConciertosAmbitoCobertura] ([ID], [Concierto_id], [Ambito_id], [Poblacion_id], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [CP]) VALUES (2,2,3,5,'2024-01-01 00:00:00',3,NULL,NULL,NULL);
INSERT INTO [dbo].[ConciertosAmbitoCobertura] ([ID], [Concierto_id], [Ambito_id], [Poblacion_id], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [CP]) VALUES (3,3,2,5,'2024-01-03 00:00:00',4,NULL,NULL,NULL);
SET IDENTITY_INSERT [dbo].[ConciertosAmbitoCobertura] OFF;

SET IDENTITY_INSERT [dbo].[ConciertosEspecialidades] ON;
INSERT INTO [dbo].[ConciertosEspecialidades] ([ConciertoEspecialidad_id], [Concierto_id], [Año], [Especialidad_id], [Servicio_id], [Cantidad], [ImporteConIVA]) VALUES (1,1,2024,1,1,120,85.5);
INSERT INTO [dbo].[ConciertosEspecialidades] ([ConciertoEspecialidad_id], [Concierto_id], [Año], [Especialidad_id], [Servicio_id], [Cantidad], [ImporteConIVA]) VALUES (2,2,2024,3,4,200,40);
INSERT INTO [dbo].[ConciertosEspecialidades] ([ConciertoEspecialidad_id], [Concierto_id], [Año], [Especialidad_id], [Servicio_id], [Cantidad], [ImporteConIVA]) VALUES (3,3,2024,4,6,50,350);
SET IDENTITY_INSERT [dbo].[ConciertosEspecialidades] OFF;

SET IDENTITY_INSERT [dbo].[Configuracion_Administracion] ON;
INSERT INTO [dbo].[Configuracion_Administracion] ([ID], [FechaBloqueoDesde], [FechaBloqueoHasta], [MinimoServicios], [RatioServicios], [UsuarioModificacion_id], [FechaModificacion], [PlazoRespuestaDemandasAnuales], [PlazoRespuestaDemandaAnualTrasAviso], [PlazoContestacionRespuestaRecibida], [PlazoEjecucionProcesosAutomaticos]) VALUES (1,'2024-01-01','2024-01-15',3,0.75,NULL,NULL,30,15,10,1);
SET IDENTITY_INSERT [dbo].[Configuracion_Administracion] OFF;

SET IDENTITY_INSERT [dbo].[Delegaciones] ON;
INSERT INTO [dbo].[Delegaciones] ([Delegacion_id], [Proveedor_id], [Delegacion], [CodigoCuenta], [Poblacion_id], [CP]) VALUES (1,3,'Andalucía',NULL,1,NULL);
INSERT INTO [dbo].[Delegaciones] ([Delegacion_id], [Proveedor_id], [Delegacion], [CodigoCuenta], [Poblacion_id], [CP]) VALUES (2,2,'Cataluña',NULL,5,NULL);
INSERT INTO [dbo].[Delegaciones] ([Delegacion_id], [Proveedor_id], [Delegacion], [CodigoCuenta], [Poblacion_id], [CP]) VALUES (3,5,'Levante',NULL,8,NULL);
INSERT INTO [dbo].[Delegaciones] ([Delegacion_id], [Proveedor_id], [Delegacion], [CodigoCuenta], [Poblacion_id], [CP]) VALUES (4,1,'Centro',NULL,8,NULL);
INSERT INTO [dbo].[Delegaciones] ([Delegacion_id], [Proveedor_id], [Delegacion], [CodigoCuenta], [Poblacion_id], [CP]) VALUES (5,4,'Sur',NULL,3,NULL);
SET IDENTITY_INSERT [dbo].[Delegaciones] OFF;

SET IDENTITY_INSERT [dbo].[Demandas] ON;
INSERT INTO [dbo].[Demandas] ([Demanda_id], [Especialidad_id], [Servicio_id], [Centro_id], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Dic], [Año], [MutuaDemanda_id], [UsuarioAlta_id], [FechaAlta], [Estado_id], [Descripcion], [Tipo_id], [FechaRevision], [Localidad], [Plazos], [EnvioMail], [MotivoRechazo], [TipoRechazo], [TipoAnulacion], [MotivoAnulacion], [UsuarioAnulacion_id]) VALUES (1,1,1,1,10,10,1,1,1,2,0,8,11,12,11,10,2024,1,2,'2024-10-01 00:00:00',2,'Demanda traumatología Sevilla',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO [dbo].[Demandas] ([Demanda_id], [Especialidad_id], [Servicio_id], [Centro_id], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Dic], [Año], [MutuaDemanda_id], [UsuarioAlta_id], [FechaAlta], [Estado_id], [Descripcion], [Tipo_id], [FechaRevision], [Localidad], [Plazos], [EnvioMail], [MotivoRechazo], [TipoRechazo], [TipoAnulacion], [MotivoAnulacion], [UsuarioAnulacion_id]) VALUES (3,3,4,3,8,9,10,9,11,10,8,6,9,10,9,8,2024,2,3,'2024-01-02 00:00:00',2,'Rehabilitación ambulatoria VLC',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO [dbo].[Demandas] ([Demanda_id], [Especialidad_id], [Servicio_id], [Centro_id], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Dic], [Año], [MutuaDemanda_id], [UsuarioAlta_id], [FechaAlta], [Estado_id], [Descripcion], [Tipo_id], [FechaRevision], [Localidad], [Plazos], [EnvioMail], [MotivoRechazo], [TipoRechazo], [TipoAnulacion], [MotivoAnulacion], [UsuarioAnulacion_id]) VALUES (4,4,6,4,5,5,6,5,6,6,5,4,5,6,5,5,2024,3,4,'2024-10-02 00:00:00',3,'Cirugía ortopédica BCN',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO [dbo].[Demandas] ([Demanda_id], [Especialidad_id], [Servicio_id], [Centro_id], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Dic], [Año], [MutuaDemanda_id], [UsuarioAlta_id], [FechaAlta], [Estado_id], [Descripcion], [Tipo_id], [FechaRevision], [Localidad], [Plazos], [EnvioMail], [MotivoRechazo], [TipoRechazo], [TipoAnulacion], [MotivoAnulacion], [UsuarioAnulacion_id]) VALUES (5,5,4,5,9,2,5,2,2,5,0,1,2,4,2,0,2024,4,5,'2024-01-03 00:00:00',2,'Fisioterapia Madrid',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO [dbo].[Demandas] ([Demanda_id], [Especialidad_id], [Servicio_id], [Centro_id], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Dic], [Año], [MutuaDemanda_id], [UsuarioAlta_id], [FechaAlta], [Estado_id], [Descripcion], [Tipo_id], [FechaRevision], [Localidad], [Plazos], [EnvioMail], [MotivoRechazo], [TipoRechazo], [TipoAnulacion], [MotivoAnulacion], [UsuarioAnulacion_id]) VALUES (7,2,1,7,6,6,7,6,8,7,6,5,6,7,6,6,2024,2,3,'2024-01-04 00:00:00',4,'Medicina general Santander',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
SET IDENTITY_INSERT [dbo].[Demandas] OFF;

SET IDENTITY_INSERT [dbo].[DemandasDocumentacion] ON;
INSERT INTO [dbo].[DemandasDocumentacion] ([Documento_id], [NombreDocumento], [Nombre], [FechaAlta], [UsuarioAlta], [Mutua_id], [Demanda_id]) VALUES (1,'Memoria Demanda 2024','memoria_demanda_001.pdf','2024-10-01 00:00:00',2,1,1);
SET IDENTITY_INSERT [dbo].[DemandasDocumentacion] OFF;

SET IDENTITY_INSERT [dbo].[DisponibilidadCentrosPropios] ON;
INSERT INTO [dbo].[DisponibilidadCentrosPropios] ([DisponibilidadCentro_id], [Centro_id], [Servicio_id], [Especialidad_id], [Mes], [Año], [Cantidad]) VALUES (1,1,1,1,1,2024,10);
INSERT INTO [dbo].[DisponibilidadCentrosPropios] ([DisponibilidadCentro_id], [Centro_id], [Servicio_id], [Especialidad_id], [Mes], [Año], [Cantidad]) VALUES (2,1,4,3,1,2024,8);
INSERT INTO [dbo].[DisponibilidadCentrosPropios] ([DisponibilidadCentro_id], [Centro_id], [Servicio_id], [Especialidad_id], [Mes], [Año], [Cantidad]) VALUES (3,2,1,2,1,2024,15);
INSERT INTO [dbo].[DisponibilidadCentrosPropios] ([DisponibilidadCentro_id], [Centro_id], [Servicio_id], [Especialidad_id], [Mes], [Año], [Cantidad]) VALUES (4,3,4,5,1,2024,20);
INSERT INTO [dbo].[DisponibilidadCentrosPropios] ([DisponibilidadCentro_id], [Centro_id], [Servicio_id], [Especialidad_id], [Mes], [Año], [Cantidad]) VALUES (5,5,1,1,2,2024,10);
SET IDENTITY_INSERT [dbo].[DisponibilidadCentrosPropios] OFF;

SET IDENTITY_INSERT [dbo].[Ficheros] ON;
INSERT INTO [dbo].[Ficheros] ([Fichero_Id], [Fichero], [Descripción], [Usuario_id], [Fecha], [Area_id], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id]) VALUES (2,'tarifas_mutualia_2024.xlsx','Catálogo de Tarifas Mutualia 2024',2,'2024-01-01 00:00:00',2,'2024-01-01 00:00:00',2,NULL,NULL);
INSERT INTO [dbo].[Ficheros] ([Fichero_Id], [Fichero], [Descripción], [Usuario_id], [Fecha], [Area_id], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id]) VALUES (3,'protocolo_citaciones_2024.pdf','Protocolo de Citaciones 2024',1,'2024-01-02 00:00:00',3,'2024-01-02 00:00:00',1,NULL,NULL);
SET IDENTITY_INSERT [dbo].[Ficheros] OFF;

SET IDENTITY_INSERT [dbo].[FicherosAcreditaciones_Informes] ON;
INSERT INTO [dbo].[FicherosAcreditaciones_Informes] ([Fichero_id], [Fichero], [TipoAcreditacion_id], [Demanda_id], [Servicio], [Especialidad], [Poblacion], [Provincia], [Mutua_id], [NombreFichero], [FechaAlta], [Visible], [Activo_id]) VALUES (1,'acred_iso_valverde_sevilla.pdf',1,1,NULL,'Traumatología','Sevilla','Sevilla',1,'Acreditación ISO Centro Valverde','2024-02-01',1,1);
INSERT INTO [dbo].[FicherosAcreditaciones_Informes] ([Fichero_id], [Fichero], [TipoAcreditacion_id], [Demanda_id], [Servicio], [Especialidad], [Poblacion], [Provincia], [Mutua_id], [NombreFichero], [FechaAlta], [Visible], [Activo_id]) VALUES (2,'acred_aenor_montserrat_bcn.pdf',3,2,NULL,'Medicina General','Barcelona','Barcelona',2,'Acreditación AENOR Centro Montserrat','2024-02-15',1,1);
SET IDENTITY_INSERT [dbo].[FicherosAcreditaciones_Informes] OFF;

SET IDENTITY_INSERT [dbo].[FincasRegistrales] ON;
INSERT INTO [dbo].[FincasRegistrales] ([Finca_id], [Centro_id], [NombreVia], [Numero], [TipoVia_id], [Piso], [Puerta], [Otros Datos], [Superficie], [Coste], [Titinmueble], [Fadqoarr], [Finscreg], [Utilizacion], [Localizador], [FechaBaja], [id_Finca_ICG_Access], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [Referencia Catastral], [TipoFinca], [DireccionElectronica], [PersonaContacto]) VALUES (1,1,'Salvador','14','1',NULL,NULL,NULL,850.5,1.2e+006,'Mutualia SA',NULL,NULL,'Consultas médicas','LOC-VAL-001',NULL,NULL,'2020-01-06 00:00:00',1,NULL,NULL,1,NULL,NULL);
INSERT INTO [dbo].[FincasRegistrales] ([Finca_id], [Centro_id], [NombreVia], [Numero], [TipoVia_id], [Piso], [Puerta], [Otros Datos], [Superficie], [Coste], [Titinmueble], [Fadqoarr], [Finscreg], [Utilizacion], [Localizador], [FechaBaja], [id_Finca_ICG_Access], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [Referencia Catastral], [TipoFinca], [DireccionElectronica], [PersonaContacto]) VALUES (2,5,'Martin','74','1',NULL,NULL,NULL,657,670000,'Laboralia SA',NULL,NULL,'Oficinas y consultas','LOC-RET-002',NULL,NULL,'2020-01-09 00:00:00',1,NULL,NULL,1,NULL,NULL);
INSERT INTO [dbo].[FincasRegistrales] ([Finca_id], [Centro_id], [NombreVia], [Numero], [TipoVia_id], [Piso], [Puerta], [Otros Datos], [Superficie], [Coste], [Titinmueble], [Fadqoarr], [Finscreg], [Utilizacion], [Localizador], [FechaBaja], [id_Finca_ICG_Access], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [Referencia Catastral], [TipoFinca], [DireccionElectronica], [PersonaContacto]) VALUES (3,5,'Velázquez','78','1',NULL,NULL,NULL,650,950000,'Laboralia SA',NULL,NULL,'Oficinas y consultas','LOC-RET-003',NULL,NULL,'2020-01-09 00:00:00',1,NULL,NULL,1,NULL,NULL);
SET IDENTITY_INSERT [dbo].[FincasRegistrales] OFF;

SET IDENTITY_INSERT [dbo].[FincasRegistrales_CostesPorAño] ON;
INSERT INTO [dbo].[FincasRegistrales_CostesPorAño] ([Finca_id], [Localizador], [Año], [Coste], [ID]) VALUES (1,'011-32-01-000',2024,45000,1);
INSERT INTO [dbo].[FincasRegistrales_CostesPorAño] ([Finca_id], [Localizador], [Año], [Coste], [ID]) VALUES (2,'11-72-01-007',2024,38400,2);
INSERT INTO [dbo].[FincasRegistrales_CostesPorAño] ([Finca_id], [Localizador], [Año], [Coste], [ID]) VALUES (3,'01-02-91-045',2024,32000,3);
SET IDENTITY_INSERT [dbo].[FincasRegistrales_CostesPorAño] OFF;

SET IDENTITY_INSERT [dbo].[Historico_CentrosPropiosEspecialidades] ON;
INSERT INTO [dbo].[Historico_CentrosPropiosEspecialidades] ([HistoricoCentroPropioEspecialidad_id], [Centro_id], [Año], [Especialidad_id], [Servicio_id], [FechaAlta], [FechaBaja], [Disponibilidad], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Dic], [UsuarioModificacion_id]) VALUES (1,1,2023,1,NULL,'2023-01-01 00:00:00',NULL,10,10,10,12,11,13,12,10,8,11,12,11,10,NULL);
INSERT INTO [dbo].[Historico_CentrosPropiosEspecialidades] ([HistoricoCentroPropioEspecialidad_id], [Centro_id], [Año], [Especialidad_id], [Servicio_id], [FechaAlta], [FechaBaja], [Disponibilidad], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Dic], [UsuarioModificacion_id]) VALUES (2,2,2023,2,NULL,'2023-01-01 00:00:00',NULL,15,15,14,16,15,17,16,14,12,15,16,14,13,NULL);
SET IDENTITY_INSERT [dbo].[Historico_CentrosPropiosEspecialidades] OFF;

SET IDENTITY_INSERT [dbo].[Informes] ON;
INSERT INTO [dbo].[Informes] ([Informe_id], [Tipo], [Informe], [Pagina]) VALUES (1,'ICG','Informe ICG06 Propios','/informes/icg06');
INSERT INTO [dbo].[Informes] ([Informe_id], [Tipo], [Informe], [Pagina]) VALUES (2,'ICG','Informe ICG07 Concertados','/informes/icg07');
INSERT INTO [dbo].[Informes] ([Informe_id], [Tipo], [Informe], [Pagina]) VALUES (3,'MUTUA','Informe Actividad Mutua','/informes/actividad');
INSERT INTO [dbo].[Informes] ([Informe_id], [Tipo], [Informe], [Pagina]) VALUES (4,'MUTUA','Informe Presupuesto','/informes/presupuesto');
INSERT INTO [dbo].[Informes] ([Informe_id], [Tipo], [Informe], [Pagina]) VALUES (5,'DGOSS','Informe Anual DGOSS','/informes/dgoss');
SET IDENTITY_INSERT [dbo].[Informes] OFF;

SET IDENTITY_INSERT [dbo].[Informes_Acuerdos] ON;
INSERT INTO [dbo].[Informes_Acuerdos] ([Informes_id], [Informe], [Mutua_id], [Año], [Mes], [EstadoInforme_id], [TipoAcuerdo], [FechaModificacion], [UsuarioModificacion]) VALUES (1,'Acuerdos BI Mutualia 2024                                                                                                                                                                                                                                 ',1,2024,1,3,'1         ',NULL,NULL);
INSERT INTO [dbo].[Informes_Acuerdos] ([Informes_id], [Informe], [Mutua_id], [Año], [Mes], [EstadoInforme_id], [TipoAcuerdo], [FechaModificacion], [UsuarioModificacion]) VALUES (2,'Acuerdos ML Prevensalud 2024                                                                                                                                                                                                                              ',2,2024,1,2,'2         ',NULL,NULL);
INSERT INTO [dbo].[Informes_Acuerdos] ([Informes_id], [Informe], [Mutua_id], [Año], [Mes], [EstadoInforme_id], [TipoAcuerdo], [FechaModificacion], [UsuarioModificacion]) VALUES (3,'Acuerdos BI Salumut 2024                                                                                                                                                                                                                                  ',5,2024,2,1,'1         ',NULL,NULL);
SET IDENTITY_INSERT [dbo].[Informes_Acuerdos] OFF;

SET IDENTITY_INSERT [dbo].[Informes_Direccion_Agrupados] ON;
INSERT INTO [dbo].[Informes_Direccion_Agrupados] ([Informe_id], [Informe], [Mutua_id], [Año], [Mes], [Activo], [FechaModificacion], [UsuarioModificacion]) VALUES (1,'Resumen Dirección Enero 2024 - Mutualia',1,2024,1,1,NULL,NULL);
INSERT INTO [dbo].[Informes_Direccion_Agrupados] ([Informe_id], [Informe], [Mutua_id], [Año], [Mes], [Activo], [FechaModificacion], [UsuarioModificacion]) VALUES (2,'Resumen Dirección Febrero 2024 - Mutualia',1,2024,2,1,NULL,NULL);
INSERT INTO [dbo].[Informes_Direccion_Agrupados] ([Informe_id], [Informe], [Mutua_id], [Año], [Mes], [Activo], [FechaModificacion], [UsuarioModificacion]) VALUES (3,'Resumen Dirección Enero 2024 - Prevensalud',2,2024,1,1,NULL,NULL);
SET IDENTITY_INSERT [dbo].[Informes_Direccion_Agrupados] OFF;

SET IDENTITY_INSERT [dbo].[Informes_ICG] ON;
INSERT INTO [dbo].[Informes_ICG] ([Informe_id], [Informe], [ResultadoInforme], [Mutua_id], [Año], [Mes], [EstadoInforme_id], [TipoICG], [FechaModificacion], [UsuarioModificación]) VALUES (1,'ICG06 Mutualia 2024',NULL,1,2024,3,2,'ICG06',NULL,NULL);
INSERT INTO [dbo].[Informes_ICG] ([Informe_id], [Informe], [ResultadoInforme], [Mutua_id], [Año], [Mes], [EstadoInforme_id], [TipoICG], [FechaModificacion], [UsuarioModificación]) VALUES (2,'ICG07 Mutualia 2024',NULL,1,2024,3,2,'ICG07',NULL,NULL);
INSERT INTO [dbo].[Informes_ICG] ([Informe_id], [Informe], [ResultadoInforme], [Mutua_id], [Año], [Mes], [EstadoInforme_id], [TipoICG], [FechaModificacion], [UsuarioModificación]) VALUES (3,'ICG06 Prevensalud 2024',NULL,2,2024,3,1,'ICG06',NULL,NULL);
SET IDENTITY_INSERT [dbo].[Informes_ICG] OFF;

SET IDENTITY_INSERT [dbo].[Motivos] ON;
INSERT INTO [dbo].[Motivos] ([Motivo_id], [Motivo]) VALUES (1,'M001      ');
INSERT INTO [dbo].[Motivos] ([Motivo_id], [Motivo]) VALUES (2,'M002      ');
INSERT INTO [dbo].[Motivos] ([Motivo_id], [Motivo]) VALUES (3,'M003      ');
SET IDENTITY_INSERT [dbo].[Motivos] OFF;

SET IDENTITY_INSERT [dbo].[Mutuas_bm] ON;
INSERT INTO [dbo].[Mutuas_bm] ([Mutua_id], [NumeroMutua], [Mutua], [RazonSocial], [Direccion], [CP], [Poblacion_id], [Telefono], [Fax], [DireccionElectronica], [PersonaContacto], [Logotipo], [FechaAlta], [UsuarioAlta_id], [FechaModificacion], [UsuarioModificacion_id], [FechaBaja], [UsuarioBaja_id]) VALUES (1,'M01','Mutualia','Mutualia Mutua Colaboradora de la SS','Calle del Salvador, 14','28013',8,'913 421 800    ',NULL,NULL,NULL,NULL,'2020-10-01 00:00:00',NULL,NULL,NULL,NULL,NULL);
SET IDENTITY_INSERT [dbo].[Mutuas_bm] OFF;

SET IDENTITY_INSERT [dbo].[MutuasPresupuesto] ON;
INSERT INTO [dbo].[MutuasPresupuesto] ([Id_Presupuesto], [Año], [Mutua_id], [PresupuestoCapitulo1Propio], [PresupuestoCapitulo2Propio], [PresupuestoCapitulo3Propio], [PresupuestoCapitulo4Propio], [PresupuestoCapitulo5Propio], [PresupuestoCapitulo6Propio], [PresupuestoCapitulo1Concertado], [PresupuestoCapitulo2Concertado], [PresupuestoArticulo2581], [PresupuestoArticulo2582], [PresupuestoArticulo25Resto], [PresupuestoGastosFinancieros]) VALUES (1,'2024',1,1.2e+006,350000,80000,NULL,NULL,200000,500000,150000,120000,80000,NULL,0);
INSERT INTO [dbo].[MutuasPresupuesto] ([Id_Presupuesto], [Año], [Mutua_id], [PresupuestoCapitulo1Propio], [PresupuestoCapitulo2Propio], [PresupuestoCapitulo3Propio], [PresupuestoCapitulo4Propio], [PresupuestoCapitulo5Propio], [PresupuestoCapitulo6Propio], [PresupuestoCapitulo1Concertado], [PresupuestoCapitulo2Concertado], [PresupuestoArticulo2581], [PresupuestoArticulo2582], [PresupuestoArticulo25Resto], [PresupuestoGastosFinancieros]) VALUES (2,'2024',2,980000,280000,60000,NULL,NULL,180000,420000,130000,95000,65000,NULL,0);
INSERT INTO [dbo].[MutuasPresupuesto] ([Id_Presupuesto], [Año], [Mutua_id], [PresupuestoCapitulo1Propio], [PresupuestoCapitulo2Propio], [PresupuestoCapitulo3Propio], [PresupuestoCapitulo4Propio], [PresupuestoCapitulo5Propio], [PresupuestoCapitulo6Propio], [PresupuestoCapitulo1Concertado], [PresupuestoCapitulo2Concertado], [PresupuestoArticulo2581], [PresupuestoArticulo2582], [PresupuestoArticulo25Resto], [PresupuestoGastosFinancieros]) VALUES (3,'2024',3,750000,220000,50000,NULL,NULL,140000,320000,100000,75000,50000,NULL,0);
SET IDENTITY_INSERT [dbo].[MutuasPresupuesto] OFF;

SET IDENTITY_INSERT [dbo].[Ofertas] ON;
INSERT INTO [dbo].[Ofertas] ([Oferta_id], [Especialidad_id], [Servicio_id], [Centro_id], [Año], [Demanda_id], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Dic], [Estado_id], [FechaConfirmacion], [FechaModificacion], [UsuarioModificacion_id], [NotaContestacion], [FechaAsignacion], [UsuarioAlta_id], [ContestacionPlazos]) VALUES (1,1,1,1,2024,1,10,10,12,11,13,12,10,8,11,12,11,10,2,NULL,NULL,NULL,NULL,NULL,2,NULL);
INSERT INTO [dbo].[Ofertas] ([Oferta_id], [Especialidad_id], [Servicio_id], [Centro_id], [Año], [Demanda_id], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Dic], [Estado_id], [FechaConfirmacion], [FechaModificacion], [UsuarioModificacion_id], [NotaContestacion], [FechaAsignacion], [UsuarioAlta_id], [ContestacionPlazos]) VALUES (2,2,1,2,2024,2,15,14,16,15,17,16,14,12,15,16,14,13,2,NULL,NULL,NULL,NULL,NULL,2,NULL);
INSERT INTO [dbo].[Ofertas] ([Oferta_id], [Especialidad_id], [Servicio_id], [Centro_id], [Año], [Demanda_id], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Dic], [Estado_id], [FechaConfirmacion], [FechaModificacion], [UsuarioModificacion_id], [NotaContestacion], [FechaAsignacion], [UsuarioAlta_id], [ContestacionPlazos]) VALUES (3,3,4,3,2024,3,8,9,10,9,11,10,8,6,9,10,9,8,2,NULL,NULL,NULL,NULL,NULL,3,NULL);
INSERT INTO [dbo].[Ofertas] ([Oferta_id], [Especialidad_id], [Servicio_id], [Centro_id], [Año], [Demanda_id], [Ene], [Feb], [Mar], [Abr], [May], [Jun], [Jul], [Ago], [Sep], [Oct], [Nov], [Dic], [Estado_id], [FechaConfirmacion], [FechaModificacion], [UsuarioModificacion_id], [NotaContestacion], [FechaAsignacion], [UsuarioAlta_id], [ContestacionPlazos]) VALUES (4,5,4,5,2024,5,20,22,25,23,27,25,20,15,22,24,22,20,2,NULL,NULL,NULL,NULL,NULL,5,NULL);
SET IDENTITY_INSERT [dbo].[Ofertas] OFF;

SET IDENTITY_INSERT [dbo].[Perfiles] ON;
INSERT INTO [dbo].[Perfiles] ([Perfil_id], [Perfil]) VALUES (1,'Administrador');
INSERT INTO [dbo].[Perfiles] ([Perfil_id], [Perfil]) VALUES (2,'Gestor Mutua');
INSERT INTO [dbo].[Perfiles] ([Perfil_id], [Perfil]) VALUES (4,'Gestor Centro');
INSERT INTO [dbo].[Perfiles] ([Perfil_id], [Perfil]) VALUES (6,'Consultor');
INSERT INTO [dbo].[Perfiles] ([Perfil_id], [Perfil]) VALUES (7,'Cuadro Médico');
SET IDENTITY_INSERT [dbo].[Perfiles] OFF;

SET IDENTITY_INSERT [dbo].[Proveedores] ON;
INSERT INTO [dbo].[Proveedores] ([Proveedor_id], [TipoProveedor_id], [CIFNIF], [CodigoCuenta], [Proveedor], [Poblacion_id], [CP]) VALUES (1,NULL,'B90123456',NULL,'Hospital San Leandro',8,'28040');
INSERT INTO [dbo].[Proveedores] ([Proveedor_id], [TipoProveedor_id], [CIFNIF], [CodigoCuenta], [Proveedor], [Poblacion_id], [CP]) VALUES (2,NULL,'B67890123',NULL,'Clínica Condal',5,'08022');
INSERT INTO [dbo].[Proveedores] ([Proveedor_id], [TipoProveedor_id], [CIFNIF], [CodigoCuenta], [Proveedor], [Poblacion_id], [CP]) VALUES (3,NULL,'B78901234',NULL,'Hospital de la Macarena',1,'41013');
INSERT INTO [dbo].[Proveedores] ([Proveedor_id], [TipoProveedor_id], [CIFNIF], [CodigoCuenta], [Proveedor], [Poblacion_id], [CP]) VALUES (4,NULL,'B56789012',NULL,'Clínica El Limonar',3,'29004');
INSERT INTO [dbo].[Proveedores] ([Proveedor_id], [TipoProveedor_id], [CIFNIF], [CodigoCuenta], [Proveedor], [Poblacion_id], [CP]) VALUES (5,NULL,'B89012345',NULL,'Hospital La Albufera',8,'46026');
SET IDENTITY_INSERT [dbo].[Proveedores] OFF;

SET IDENTITY_INSERT [dbo].[PS_AcuerdosBI_MultilateralesMutuas_Demanda] ON;
INSERT INTO [dbo].[PS_AcuerdosBI_MultilateralesMutuas_Demanda] ([ID], [IDMutuaAnio], [MutuaOfertante_id], [MutuaDemandante_id], [NumServicios], [ContraprestacionEconomica], [Anio]) VALUES (1,'1-2-2024',2,1,120,10200.00,2024);
INSERT INTO [dbo].[PS_AcuerdosBI_MultilateralesMutuas_Demanda] ([ID], [IDMutuaAnio], [MutuaOfertante_id], [MutuaDemandante_id], [NumServicios], [ContraprestacionEconomica], [Anio]) VALUES (2,'3-1-2024',3,1,96,3840.00,2024);
SET IDENTITY_INSERT [dbo].[PS_AcuerdosBI_MultilateralesMutuas_Demanda] OFF;

SET IDENTITY_INSERT [dbo].[PS_AcuerdosBI_MultilateralesMutuas_Oferta] ON;
INSERT INTO [dbo].[PS_AcuerdosBI_MultilateralesMutuas_Oferta] ([ID], [IDMutuaAnio], [MutuaOfertante_id], [MutuaDemandante_id], [NumServicios], [ContraprestacionEconomica], [Anio]) VALUES (1,'2-1-2024',2,1,120,10200.00,2024);
INSERT INTO [dbo].[PS_AcuerdosBI_MultilateralesMutuas_Oferta] ([ID], [IDMutuaAnio], [MutuaOfertante_id], [MutuaDemandante_id], [NumServicios], [ContraprestacionEconomica], [Anio]) VALUES (2,'5-4-2024',5,4,240,9600.00,2024);
SET IDENTITY_INSERT [dbo].[PS_AcuerdosBI_MultilateralesMutuas_Oferta] OFF;

SET IDENTITY_INSERT [dbo].[PS_AcuerdosBI_MultilateralesMutuasProvincias_Demanda] ON;
INSERT INTO [dbo].[PS_AcuerdosBI_MultilateralesMutuasProvincias_Demanda] ([ID], [IDMutuaAnio], [MutuaDemandante_id], [Provincia_id], [NumServiciosBI], [ContraprestacionEconomicaBI], [NumServiciosTerceros], [ContraprestacionEconomicaTerceros], [Anio]) VALUES (1,'1-1-2024',1,1,60,5100.00,60,5100.00,2024);
SET IDENTITY_INSERT [dbo].[PS_AcuerdosBI_MultilateralesMutuasProvincias_Demanda] OFF;

SET IDENTITY_INSERT [dbo].[PS_AcuerdosBI_MultilateralesMutuasProvincias_Oferta] ON;
INSERT INTO [dbo].[PS_AcuerdosBI_MultilateralesMutuasProvincias_Oferta] ([ID], [IDMutuaAnio], [MutuaOfertante_id], [Provincia_id], [NumServiciosBI], [ContraprestacionEconomicaBI], [NumServiciosTerceros], [ContraprestacionEconomicaTerceros], [Anio]) VALUES (1,'2-3-2024',2,3,120,10200.00,0,0.00,2024);
SET IDENTITY_INSERT [dbo].[PS_AcuerdosBI_MultilateralesMutuasProvincias_Oferta] OFF;

SET IDENTITY_INSERT [dbo].[PS_AcuerdosBI_MultilateralesMutuasTipoServicio_Demanda] ON;
INSERT INTO [dbo].[PS_AcuerdosBI_MultilateralesMutuasTipoServicio_Demanda] ([ID], [IDMutuaAnio], [MutuaDemandante_id], [TipoServicio_id], [NumTipoServicio], [NumServiciosBI], [ContraprestacionEconomicaBI], [NumServiciosTerceros], [ContraprestacionEconomicaTerceros], [Anio]) VALUES (1,'1-1-2024',1,1,'AM',60,5100.00,60,5100.00,2024);
SET IDENTITY_INSERT [dbo].[PS_AcuerdosBI_MultilateralesMutuasTipoServicio_Demanda] OFF;

SET IDENTITY_INSERT [dbo].[PS_AcuerdosBI_MultilateralesMutuasTipoServicio_Oferta] ON;
INSERT INTO [dbo].[PS_AcuerdosBI_MultilateralesMutuasTipoServicio_Oferta] ([ID], [IDMutuaAnio], [MutuaOfertante_id], [TipoServicio_id], [NumTipoServicio], [NumServiciosBI], [ContraprestacionEconomicaBI], [NumServiciosTerceros], [ContraprestacionEconomicaTerceros], [Anio]) VALUES (1,'2-1-2024',2,4,'RE',120,4800.00,0,0.00,2024);
SET IDENTITY_INSERT [dbo].[PS_AcuerdosBI_MultilateralesMutuasTipoServicio_Oferta] OFF;

SET IDENTITY_INSERT [dbo].[Registro_Errores] ON;
INSERT INTO [dbo].[Registro_Errores] ([Error_id], [Usuario_id], [FechaError], [Descripcion], [FicheroLog], [Estado_Id], [FechaResolucion], [FechaCierre], [Comentarios]) VALUES (1,2,'2024-05-02 00:00:00','Error al guardar citación: FK no encontrada',NULL,1,NULL,NULL,NULL);
INSERT INTO [dbo].[Registro_Errores] ([Error_id], [Usuario_id], [FechaError], [Descripcion], [FicheroLog], [Estado_Id], [FechaResolucion], [FechaCierre], [Comentarios]) VALUES (2,3,'2024-10-03 00:00:00','Timeout al generar informe ICG06',NULL,1,NULL,NULL,NULL);
SET IDENTITY_INSERT [dbo].[Registro_Errores] OFF;

SET IDENTITY_INSERT [dbo].[RegistroActividad] ON;
INSERT INTO [dbo].[RegistroActividad] ([Registro_id], [Usuario_id], [Fecha], [Accion], [Sql]) VALUES (1,2,'2024-10-01 00:00:00','Alta Demanda Traumatología Sevilla','INSERT INTO Demandas (...)');
INSERT INTO [dbo].[RegistroActividad] ([Registro_id], [Usuario_id], [Fecha], [Accion], [Sql]) VALUES (3,1,'2024-01-02 00:00:00','Login administrador','SELECT FROM Usuarios WHERE...');
INSERT INTO [dbo].[RegistroActividad] ([Registro_id], [Usuario_id], [Fecha], [Accion], [Sql]) VALUES (4,2,'2024-12-02 00:00:00','Confirmación citación 1','UPDATE Citaciones SET Estado_id=2 WHERE...');
SET IDENTITY_INSERT [dbo].[RegistroActividad] OFF;

SET IDENTITY_INSERT [dbo].[SeguimientoOD] ON;
INSERT INTO [dbo].[SeguimientoOD] ([Gestion_id], [Usuario_id], [FechaAlta], [TipoAccion_id], [DescripcionAccion_id], [OfertaDemanda_id], [Estado_id], [Nota], [Estado_Linea], [FechaModificacion], [UsuarioModificacion_id]) VALUES (1,2,'2024-12-01 00:00:00',2,1,1,2,'Demanda publicada y disponible para oferta',NULL,NULL,NULL);
INSERT INTO [dbo].[SeguimientoOD] ([Gestion_id], [Usuario_id], [FechaAlta], [TipoAccion_id], [DescripcionAccion_id], [OfertaDemanda_id], [Estado_id], [Nota], [Estado_Linea], [FechaModificacion], [UsuarioModificacion_id]) VALUES (3,4,'2024-12-02 00:00:00',2,4,4,3,'Demanda rechazada por falta de quirófano',NULL,NULL,NULL);
SET IDENTITY_INSERT [dbo].[SeguimientoOD] OFF;

SET IDENTITY_INSERT [dbo].[Tarifas] ON;
INSERT INTO [dbo].[Tarifas] ([Tarifa_id], [Tarifa], [Año], [Porcentaje], [Activo]) VALUES (1,'Tarifa General 2024','2024',100,1);
INSERT INTO [dbo].[Tarifas] ([Tarifa_id], [Tarifa], [Año], [Porcentaje], [Activo]) VALUES (2,'Tarifa Especial Rehabilitación 2024','2024',110,1);
INSERT INTO [dbo].[Tarifas] ([Tarifa_id], [Tarifa], [Año], [Porcentaje], [Activo]) VALUES (3,'Tarifa Hospitalaria 2024','2024',120,1);
INSERT INTO [dbo].[Tarifas] ([Tarifa_id], [Tarifa], [Año], [Porcentaje], [Activo]) VALUES (4,'Tarifa General 2023','2023',95,0);
INSERT INTO [dbo].[Tarifas] ([Tarifa_id], [Tarifa], [Año], [Porcentaje], [Activo]) VALUES (5,'Tarifa Urgencias 2024','2024',130,1);
SET IDENTITY_INSERT [dbo].[Tarifas] OFF;

SET IDENTITY_INSERT [dbo].[TarifasDetalle] ON;
INSERT INTO [dbo].[TarifasDetalle] ([TarifaDetalle_id], [Tarifa_id], [Servicio], [Importe], [Especialidad_id], [CIEP_id], [Observaciones], [Servicio_id], [AltaTec]) VALUES (1,1,'Consulta Primera Traumatología',85.5,1,NULL,NULL,1,NULL);
INSERT INTO [dbo].[TarifasDetalle] ([TarifaDetalle_id], [Tarifa_id], [Servicio], [Importe], [Especialidad_id], [CIEP_id], [Observaciones], [Servicio_id], [AltaTec]) VALUES (2,1,'Consulta Sucesiva Traumatología',55,1,NULL,NULL,1,NULL);
INSERT INTO [dbo].[TarifasDetalle] ([TarifaDetalle_id], [Tarifa_id], [Servicio], [Importe], [Especialidad_id], [CIEP_id], [Observaciones], [Servicio_id], [AltaTec]) VALUES (3,2,'Sesión Fisioterapia',40,5,NULL,NULL,4,NULL);
INSERT INTO [dbo].[TarifasDetalle] ([TarifaDetalle_id], [Tarifa_id], [Servicio], [Importe], [Especialidad_id], [CIEP_id], [Observaciones], [Servicio_id], [AltaTec]) VALUES (4,3,'Ingreso Hospitalario/día',350,4,NULL,NULL,2,NULL);
INSERT INTO [dbo].[TarifasDetalle] ([TarifaDetalle_id], [Tarifa_id], [Servicio], [Importe], [Especialidad_id], [CIEP_id], [Observaciones], [Servicio_id], [AltaTec]) VALUES (5,5,'Atención Urgencias',120,2,NULL,NULL,3,NULL);
INSERT INTO [dbo].[TarifasDetalle] ([TarifaDetalle_id], [Tarifa_id], [Servicio], [Importe], [Especialidad_id], [CIEP_id], [Observaciones], [Servicio_id], [AltaTec]) VALUES (6,1,'Consulta Neurología',90,6,NULL,NULL,1,NULL);
SET IDENTITY_INSERT [dbo].[TarifasDetalle] OFF;

SET IDENTITY_INSERT [dbo].[TiposAsistencia] ON;
INSERT INTO [dbo].[TiposAsistencia] ([Registro_id], [TipoAsistencia_id], [TipoAsistencia], [Año]) VALUES (1,1,'Asistencia Sanitaria Propia',2024);
INSERT INTO [dbo].[TiposAsistencia] ([Registro_id], [TipoAsistencia_id], [TipoAsistencia], [Año]) VALUES (2,2,'Asistencia Sanitaria Concertada',2024);
INSERT INTO [dbo].[TiposAsistencia] ([Registro_id], [TipoAsistencia_id], [TipoAsistencia], [Año]) VALUES (3,3,'Incapacidad Temporal',2024);
INSERT INTO [dbo].[TiposAsistencia] ([Registro_id], [TipoAsistencia_id], [TipoAsistencia], [Año]) VALUES (4,4,'Prevención de Riesgos Laborales',2024);
INSERT INTO [dbo].[TiposAsistencia] ([Registro_id], [TipoAsistencia_id], [TipoAsistencia], [Año]) VALUES (5,5,'Administración General',2024);
SET IDENTITY_INSERT [dbo].[TiposAsistencia] OFF;

SET IDENTITY_INSERT [dbo].[TiposDemanda] ON;
INSERT INTO [dbo].[TiposDemanda] ([TipoDemanda_id], [Año], [TipoDemanda], [PeriodoDesde], [PeriodoHasta], [Activa_id], [Tipo_id], [GeneracionAcreditacion], [FechaModificacion], [UsuarioModificacion_id]) VALUES (1,2024,'Demanda Anual','2024-01-01','2024-12-31',1,1,NULL,NULL,NULL);
INSERT INTO [dbo].[TiposDemanda] ([TipoDemanda_id], [Año], [TipoDemanda], [PeriodoDesde], [PeriodoHasta], [Activa_id], [Tipo_id], [GeneracionAcreditacion], [FechaModificacion], [UsuarioModificacion_id]) VALUES (2,2024,'Demanda Semestral','2024-01-01','2024-06-30',1,2,NULL,NULL,NULL);
INSERT INTO [dbo].[TiposDemanda] ([TipoDemanda_id], [Año], [TipoDemanda], [PeriodoDesde], [PeriodoHasta], [Activa_id], [Tipo_id], [GeneracionAcreditacion], [FechaModificacion], [UsuarioModificacion_id]) VALUES (3,2024,'Demanda Urgente','2024-01-01','2024-12-31',1,3,NULL,NULL,NULL);
INSERT INTO [dbo].[TiposDemanda] ([TipoDemanda_id], [Año], [TipoDemanda], [PeriodoDesde], [PeriodoHasta], [Activa_id], [Tipo_id], [GeneracionAcreditacion], [FechaModificacion], [UsuarioModificacion_id]) VALUES (4,2023,'Demanda Anual 2023','2023-01-01','2023-12-31',0,1,NULL,NULL,NULL);
SET IDENTITY_INSERT [dbo].[TiposDemanda] OFF;

SET IDENTITY_INSERT [dbo].[TiposVia] ON;
INSERT INTO [dbo].[TiposVia] ([TipoVia_id], [TipoVia], [TipoVia_Abreviada]) VALUES (1,'Calle','C/');
INSERT INTO [dbo].[TiposVia] ([TipoVia_id], [TipoVia], [TipoVia_Abreviada]) VALUES (2,'Avenida','Avda.');
INSERT INTO [dbo].[TiposVia] ([TipoVia_id], [TipoVia], [TipoVia_Abreviada]) VALUES (3,'Paseo','Pº');
INSERT INTO [dbo].[TiposVia] ([TipoVia_id], [TipoVia], [TipoVia_Abreviada]) VALUES (4,'Plaza','Pza.');
INSERT INTO [dbo].[TiposVia] ([TipoVia_id], [TipoVia], [TipoVia_Abreviada]) VALUES (5,'Carretera','Ctra.');
SET IDENTITY_INSERT [dbo].[TiposVia] OFF;

SET IDENTITY_INSERT [dbo].[Usuarios] ON;
INSERT INTO [dbo].[Usuarios] ([Usuario_id], [Perfil_id], [Mutua_id], [Centro_id], [Usuario], [DireccionElectronica], [PreguntaRecordatorio], [RespuestaRecordatorio], [DGOSSRecibeCorreo], [Password], [CorreoElectronico], [Contraseña], [FechaBaja], [FechaPassword], [CambioPassword], [RecibirNotificaciones], [Nombre], [Apellidos], [LimiteCorreos], [Pass_TMP], [UltimoLogin], [PermisoQlikSense]) VALUES (1,1,1,NULL,'admin','admin@nexos.es',NULL,NULL,0,'hash_admin_01',NULL,NULL,NULL,NULL,0,0,'Administrador','Sistema',0,NULL,NULL,0);
INSERT INTO [dbo].[Usuarios] ([Usuario_id], [Perfil_id], [Mutua_id], [Centro_id], [Usuario], [DireccionElectronica], [PreguntaRecordatorio], [RespuestaRecordatorio], [DGOSSRecibeCorreo], [Password], [CorreoElectronico], [Contraseña], [FechaBaja], [FechaPassword], [CambioPassword], [RecibirNotificaciones], [Nombre], [Apellidos], [LimiteCorreos], [Pass_TMP], [UltimoLogin], [PermisoQlikSense]) VALUES (2,2,1,NULL,'cmartinez','c.martinez@salamut.es',NULL,NULL,1,'hash_cm_02',NULL,NULL,NULL,NULL,0,1,'Carlos','Martínez Gil',0,NULL,NULL,0);
INSERT INTO [dbo].[Usuarios] ([Usuario_id], [Perfil_id], [Mutua_id], [Centro_id], [Usuario], [DireccionElectronica], [PreguntaRecordatorio], [RespuestaRecordatorio], [DGOSSRecibeCorreo], [Password], [CorreoElectronico], [Contraseña], [FechaBaja], [FechaPassword], [CambioPassword], [RecibirNotificaciones], [Nombre], [Apellidos], [LimiteCorreos], [Pass_TMP], [UltimoLogin], [PermisoQlikSense]) VALUES (3,2,2,NULL,'lsanchez','l.sanchez@massal.es',NULL,NULL,1,'hash_ls_03',NULL,NULL,NULL,NULL,0,1,'Laura','Sánchez Ruiz',0,NULL,NULL,0);
INSERT INTO [dbo].[Usuarios] ([Usuario_id], [Perfil_id], [Mutua_id], [Centro_id], [Usuario], [DireccionElectronica], [PreguntaRecordatorio], [RespuestaRecordatorio], [DGOSSRecibeCorreo], [Password], [CorreoElectronico], [Contraseña], [FechaBaja], [FechaPassword], [CambioPassword], [RecibirNotificaciones], [Nombre], [Apellidos], [LimiteCorreos], [Pass_TMP], [UltimoLogin], [PermisoQlikSense]) VALUES (4,3,3,1,'pgomez','p.gomez@mutuaval.es',NULL,NULL,0,'hash_pg_04',NULL,NULL,NULL,NULL,0,1,'Pedro','Gómez Torres',0,NULL,NULL,0);
INSERT INTO [dbo].[Usuarios] ([Usuario_id], [Perfil_id], [Mutua_id], [Centro_id], [Usuario], [DireccionElectronica], [PreguntaRecordatorio], [RespuestaRecordatorio], [DGOSSRecibeCorreo], [Password], [CorreoElectronico], [Contraseña], [FechaBaja], [FechaPassword], [CambioPassword], [RecibirNotificaciones], [Nombre], [Apellidos], [LimiteCorreos], [Pass_TMP], [UltimoLogin], [PermisoQlikSense]) VALUES (5,4,4,NULL,'arodriguez','a.rodriguez@hisapmz.es',NULL,NULL,1,'hash_ar_05',NULL,NULL,NULL,NULL,1,1,'Ana','Rodríguez Vega',0,NULL,NULL,0);
INSERT INTO [dbo].[Usuarios] ([Usuario_id], [Perfil_id], [Mutua_id], [Centro_id], [Usuario], [DireccionElectronica], [PreguntaRecordatorio], [RespuestaRecordatorio], [DGOSSRecibeCorreo], [Password], [CorreoElectronico], [Contraseña], [FechaBaja], [FechaPassword], [CambioPassword], [RecibirNotificaciones], [Nombre], [Apellidos], [LimiteCorreos], [Pass_TMP], [UltimoLogin], [PermisoQlikSense]) VALUES (6,2,5,NULL,'jlopez','j.lopez@fermutumz.es',NULL,NULL,1,'hash_jl_06',NULL,NULL,NULL,NULL,0,1,'Javier','López Moreno',0,NULL,NULL,0);
INSERT INTO [dbo].[Usuarios] ([Usuario_id], [Perfil_id], [Mutua_id], [Centro_id], [Usuario], [DireccionElectronica], [PreguntaRecordatorio], [RespuestaRecordatorio], [DGOSSRecibeCorreo], [Password], [CorreoElectronico], [Contraseña], [FechaBaja], [FechaPassword], [CambioPassword], [RecibirNotificaciones], [Nombre], [Apellidos], [LimiteCorreos], [Pass_TMP], [UltimoLogin], [PermisoQlikSense]) VALUES (7,3,1,2,'mfernandez','m.fernandez@sanisamz.es',NULL,NULL,0,'hash_mf_07',NULL,NULL,NULL,NULL,0,0,'María','Fernández Castro',0,NULL,NULL,0);
INSERT INTO [dbo].[Usuarios] ([Usuario_id], [Perfil_id], [Mutua_id], [Centro_id], [Usuario], [DireccionElectronica], [PreguntaRecordatorio], [RespuestaRecordatorio], [DGOSSRecibeCorreo], [Password], [CorreoElectronico], [Contraseña], [FechaBaja], [FechaPassword], [CambioPassword], [RecibirNotificaciones], [Nombre], [Apellidos], [LimiteCorreos], [Pass_TMP], [UltimoLogin], [PermisoQlikSense]) VALUES (8,4,2,NULL,'rjimenez','r.jimenez@seasas.es',NULL,NULL,1,'hash_rj_08',NULL,NULL,NULL,NULL,0,1,'Roberto','Jiménez Pardo',0,NULL,NULL,0);
SET IDENTITY_INSERT [dbo].[Usuarios] OFF;

SET IDENTITY_INSERT [dbo].[UsuariosPorPerfilesModificar] ON;
INSERT INTO [dbo].[UsuariosPorPerfilesModificar] ([AccesoUsuario_id], [Perfil_id], [PerfilModificar_id], [FechaModificacion], [UsuarioModificacion]) VALUES (1,1,2,'2024-01-01',1);
INSERT INTO [dbo].[UsuariosPorPerfilesModificar] ([AccesoUsuario_id], [Perfil_id], [PerfilModificar_id], [FechaModificacion], [UsuarioModificacion]) VALUES (2,1,3,'2024-01-01',1);
INSERT INTO [dbo].[UsuariosPorPerfilesModificar] ([AccesoUsuario_id], [Perfil_id], [PerfilModificar_id], [FechaModificacion], [UsuarioModificacion]) VALUES (3,2,3,'2024-01-01',1);
SET IDENTITY_INSERT [dbo].[UsuariosPorPerfilesModificar] OFF;

PRINT 'Carga completada';
