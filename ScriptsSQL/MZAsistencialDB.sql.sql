USE [MZAsistencial]
GO
/****** Object:  Table [dbo].[Citaciones]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CCAA')
BEGIN
CREATE TABLE [dbo].[CCAA](
	[CCAA_id] [int] IDENTITY(1,1) NOT NULL,
	[CCAA] [char](100) NULL,
 CONSTRAINT [PK_CCAA] PRIMARY KEY CLUSTERED 
(
	[CCAA_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Citaciones')
BEGIN
CREATE TABLE [dbo].[Citaciones](
	[citacion_id] [int] IDENTITY(1,1) NOT NULL,
	[MutaOferta] [int] NULL,
	[MutuaDemandante] [int] NULL,
	[Centro_id] [int] NULL,
	[Provincia_id] [int] NULL,
	[Localidad] [int] NULL,
	[Especialidad_id] [int] NULL,
	[Servicio_id] [int] NULL,
	[Movimiento_id] [int] NULL,
	[Demanda_id] [int] NULL,
	[FechaAltaSolicitud] [datetime] NULL,
	[FechaRespuestaCitacion] [datetime] NULL,
	[Necesidad] [nvarchar](max) NULL,
	[Contestacion] [nvarchar](max) NULL,
	[Ene] [int] NULL,
	[Feb] [int] NULL,
	[Mar] [int] NULL,
	[Abr] [int] NULL,
	[May] [int] NULL,
	[Jun] [int] NULL,
	[Jul] [int] NULL,
	[Ago] [int] NULL,
	[Sep] [int] NULL,
	[Oct] [int] NULL,
	[Nov] [int] NULL,
	[Diciembre] [int] NULL,
	[Año] [int] NULL,
	[Total] [int] NULL,
	[Estado_id] [int] NULL,
	[MotivoRechazo] [nvarchar](max) NULL,
	[FechaRechazo] [datetime] NULL,
	[UsuarioAlta_id] [int] NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioModificacion_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Citaciones] PRIMARY KEY CLUSTERED 
(
	[citacion_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_Citacion_Movimientos]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_Citacion_Movimientos')
BEGIN
CREATE TABLE [dbo].[Aux_Citacion_Movimientos](
	[Movimiento_id] [int] IDENTITY(1,1) NOT NULL,
	[Movimiento] [nvarchar](max) NULL,
 CONSTRAINT [PK_aux_Movimientos] PRIMARY KEY CLUSTERED 
(
	[Movimiento_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_Poblaciones]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_Poblaciones')
BEGIN
CREATE TABLE [dbo].[Aux_Poblaciones](
	[Poblacion_id] [int] IDENTITY(1,1) NOT NULL,
	[Poblacion] [nvarchar](max) NULL,
	[Provincia_id] [int] NOT NULL,
 CONSTRAINT [PK_Aux_Poblaciones] PRIMARY KEY CLUSTERED 
(
	[Poblacion_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Ofertas]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Ofertas')
BEGIN
CREATE TABLE [dbo].[Ofertas](
	[Oferta_id] [int] IDENTITY(1,1) NOT NULL,
	[Especialidad_id] [int] NULL,
	[Servicio_id] [int] NULL,
	[Centro_id] [int] NULL,
	[Año] [int] NULL,
	[Demanda_id] [int] NULL,
	[Ene] [int] NULL,
	[Feb] [int] NULL,
	[Mar] [int] NULL,
	[Abr] [int] NULL,
	[May] [int] NULL,
	[Jun] [int] NULL,
	[Jul] [int] NULL,
	[Ago] [int] NULL,
	[Sep] [int] NULL,
	[Oct] [int] NULL,
	[Nov] [int] NULL,
	[Dic] [int] NULL,
	[Estado_id] [int] NULL,
	[FechaConfirmacion] [datetime] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificacion_id] [int] NULL,
	[NotaContestacion] [nvarchar](max) NULL,
	[FechaAsignacion] [datetime] NULL,
	[UsuarioAlta_id] [int] NULL,
	[ContestacionPlazos] [nvarchar](max) NULL,
 CONSTRAINT [PK_Ofertas] PRIMARY KEY CLUSTERED 
(
	[Oferta_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_Especialidades]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_Especialidades')
BEGIN
CREATE TABLE [dbo].[Aux_Especialidades](
	[Especialidad_id] [int] IDENTITY(68,1) NOT NULL,
	[Especialidad] [nvarchar](150) NULL,
 CONSTRAINT [PK_Especialidades] PRIMARY KEY CLUSTERED 
(
	[Especialidad_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_Provincias]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_Provincias')
BEGIN
CREATE TABLE [dbo].[Aux_Provincias](
	[Provincia_id] [int] NOT NULL,
	[CCAA_id] [int] NOT NULL,
	[Provincia] [char](200) NOT NULL,
 CONSTRAINT [PK_Aux_Provincias_1] PRIMARY KEY CLUSTERED 
(
	[Provincia_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_Servicios]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_Servicios')
BEGIN
CREATE TABLE [dbo].[Aux_Servicios](
	[Servicio_id] [bigint] IDENTITY(445,1) NOT NULL,
	[Servicio] [nvarchar](200) NULL,
	[TipoServicio_id] [int] NULL,
 CONSTRAINT [PK_Aux_Servicios] PRIMARY KEY CLUSTERED 
(
	[Servicio_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Mutuas]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Mutuas')
BEGIN
CREATE TABLE [dbo].[Mutuas](
	[Mutua_id] [int] NOT NULL,
	[NumeroMutua] [varchar](3) NULL,
	[Mutua] [varchar](100) NULL,
	[RazonSocial] [varchar](100) NULL,
	[Direccion] [varchar](100) NULL,
	[CP] [char](5) NULL,
	[Poblacion_id] [int] NULL,
	[Telefono] [char](15) NULL,
	[Fax] [char](15) NULL,
	[DireccionElectronica] [varchar](100) NULL,
	[PersonaContacto] [varchar](250) NULL,
	[Logotipo] [varchar](100) NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioAlta_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificacion_id] [int] NULL,
	[FechaBaja] [datetime] NULL,
	[UsuarioBaja_id] [int] NULL,
	[RatioConsultas] [decimal](18, 2) NULL,
	[Usuario_id] [int] NULL,
 CONSTRAINT [PK_Mutuas] PRIMARY KEY CLUSTERED 
(
	[Mutua_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 100) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[CentrosPropios]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CentrosPropios')
BEGIN
CREATE TABLE [dbo].[CentrosPropios](
	[Centro_id] [int] IDENTITY(82592,1) NOT NULL,
	[Mutua_id] [int] NOT NULL,
	[Centro] [nvarchar](150) NULL,
	[CentroCesionario_id] [int] NULL,
	[Validado] [bit] NULL,
	[Localizador] [nvarchar](50) NULL,
	[CIFNIF] [char](15) NULL,
	[Direccion] [varchar](100) NULL,
	[Numero] [nvarchar](50) NULL,
	[DireccionGIS] [varchar](100) NULL,
	[Poblacion_id] [int] NULL,
	[CP] [char](5) NULL,
	[Telefono] [char](15) NULL,
	[Fax] [char](15) NULL,
	[DireccionElectronica] [varchar](100) NULL,
	[PersonaContacto] [varchar](100) NULL,
	[ServiciosEspeciales] [int] NULL,
	[AsistenciaHospitalaria] [bit] NULL,
	[AsistenciaAmbulatoria] [bit] NULL,
	[Rehabilitacion] [bit] NULL,
	[IncapacidadTransitoria] [bit] NULL,
	[Prevencion] [bit] NULL,
	[Administracion] [bit] NULL,
	[OtrasActividades] [bit] NULL,
	[AsistenciaSanitaria] [bit] NULL,
	[MediosAjenos] [bit] NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioAlta_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificacion_id] [int] NULL,
	[FechaBaja] [datetime] NULL,
	[UsuarioBaja_id] [int] NULL,
	[MotivoBaja] [nvarchar](500) NULL,
	[TipoCentro] [int] NULL,
	[TipoCentroAnt] [int] NULL,
	[Observaciones] [varchar](500) NULL,
	[TipoVia_id] [int] NULL,
	[Piso] [nvarchar](15) NULL,
	[Puerta] [nvarchar](15) NULL,
	[OtrosDatos] [nvarchar](255) NULL,
	[Traslado] [bit] NULL,
	[Centro_idNuevo] [int] NULL,
	[Fautocom] [datetime] NULL,
	[Fpufuncio] [datetime] NULL,
	[Fcalisuf] [datetime] NULL,
	[FechaCarga] [datetime] NULL,
	[MapaValidado] [bit] NULL,
	[Latitud] [nvarchar](50) NULL,
	[Longitud] [nvarchar](50) NULL,
	[CodigoMZ] [nvarchar](50) NULL,
	[MarcaCentro] [int] NULL,
	[FechaDesactivacion] [date] NULL,
	[UsuarioDesactivacion] [int] NULL,
	[Desactivado] [bit] NOT NULL
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_Estados_Citacion]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_Estados_Citacion')
BEGIN
CREATE TABLE [dbo].[Aux_Estados_Citacion](
	[Estado_id] [int] NOT NULL,
	[Estado] [nvarchar](200) NULL,
	[UsuarioModificacion_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[Agrupacion] [int] NULL,
 CONSTRAINT [PK_Aux_Estados_Citacion] PRIMARY KEY CLUSTERED 
(
	[Estado_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  View [dbo].[vwCitaciones]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER VIEW [dbo].[vwCitaciones]
AS
SELECT        c.Demanda_id AS id, c.Año, mo.Mutua AS MutuaOfertante, ms.Mutua AS MutuaSolicitante, cp.Localizador + '' + cp.Centro AS Centro, p.Provincia, pob.Poblacion AS Localidad, esp.Especialidad, mov.Movimiento_id, 
                         mov.Movimiento AS TipoMovimiento, serv.Servicio, c.Ene, c.Feb, c.Mar, c.Abr, c.May, c.Jun, c.Jul, c.Ago, c.Sep, c.Oct, c.Nov, c.Diciembre, c.Total, cp.DireccionGIS, cp.Telefono, ofe.FechaAsignacion, ofe.FechaConfirmacion, 
                         c.FechaAltaSolicitud, c.Necesidad, c.Contestacion, c.Estado_id, mo.Mutua_id AS MutuaOfertanteId, ms.Mutua_id AS MutuaDemandanteId, c.citacion_id, cp.Centro_id, esp.Especialidad_id, serv.Servicio_id, p.Provincia_id, 
                         pob.Poblacion_id AS Localidad_id, ec.Estado, c.MotivoRechazo, c.FechaRechazo, c.FechaRespuestaCitacion
FROM            dbo.Citaciones AS c INNER JOIN
                         dbo.Mutuas AS mo ON mo.Mutua_id = c.MutaOferta INNER JOIN
                         dbo.Mutuas AS ms ON ms.Mutua_id = c.MutuaDemandante INNER JOIN
                         dbo.Aux_Provincias AS p ON p.Provincia_id = c.Provincia_id INNER JOIN
                         dbo.Aux_Poblaciones AS pob ON pob.Poblacion_id = c.Localidad INNER JOIN
                         dbo.Aux_Citacion_Movimientos AS mov ON mov.Movimiento_id = c.Movimiento_id INNER JOIN
                         dbo.CentrosPropios AS cp ON cp.Centro_id = c.Centro_id INNER JOIN
                         dbo.Aux_Especialidades AS esp ON esp.Especialidad_id = c.Especialidad_id INNER JOIN
                         dbo.Aux_Servicios AS serv ON serv.Servicio_id = c.Servicio_id INNER JOIN
                         dbo.Ofertas AS ofe ON ofe.Demanda_id = c.Demanda_id INNER JOIN
                         dbo.Aux_Estados_Citacion AS ec ON ec.Estado_id = c.Estado_id
GO
/****** Object:  Table [dbo].[Demandas]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Demandas')
BEGIN
CREATE TABLE [dbo].[Demandas](
	[Demanda_id] [int] IDENTITY(1,1) NOT NULL,
	[Especialidad_id] [int] NULL,
	[Servicio_id] [int] NULL,
	[Centro_id] [int] NULL,
	[Ene] [int] NULL,
	[Feb] [int] NULL,
	[Mar] [int] NULL,
	[Abr] [int] NULL,
	[May] [int] NULL,
	[Jun] [int] NULL,
	[Jul] [int] NULL,
	[Ago] [int] NULL,
	[Sep] [int] NULL,
	[Oct] [int] NULL,
	[Nov] [int] NULL,
	[Dic] [int] NULL,
	[Año] [int] NULL,
	[MutuaDemanda_id] [int] NULL,
	[UsuarioAlta_id] [int] NOT NULL,
	[FechaAlta] [datetime] NULL,
	[Estado_id] [int] NULL,
	[Descripcion] [nvarchar](max) NULL,
	[Tipo_id] [int] NULL,
	[FechaRevision] [datetime] NULL,
	[Localidad] [int] NULL,
	[Plazos] [nvarchar](max) NULL,
	[EnvioMail] [int] NULL,
	[MotivoRechazo] [nvarchar](200) NULL,
	[TipoRechazo] [int] NULL,
	[TipoAnulacion] [int] NULL,
	[MotivoAnulacion] [varchar](500) NULL,
	[UsuarioAnulacion_id] [int] NULL,
 CONSTRAINT [PK_Demandas] PRIMARY KEY CLUSTERED 
(
	[Demanda_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  View [dbo].[vwDemandas_Citaciones]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER VIEW [dbo].[vwDemandas_Citaciones]
AS
SELECT        ID, Demanda_id, Anio, Mutua, Mutua_id, MutuaOfertante_Id, MutuaOfertante, Centro, Especialidad, Servicio, Centro_id, Agrupacion, Servicio_id, Especialidad_id, FechaConfirmacion, FechaRevision, Localidad, Provincia, 
                         Tipo_id, CodigoDemanda, TipoMovimiento_id, TipoMovimiento, Peticiones_Atendidas, Peticiones_Pendientes, Estado_id, DireccionGIS, Telefono, FechaAsignacion, Ene, Feb, Mar, Abr, May, Jun, Jul, Ago, Sep, Oct, Nov, Dic, 
                         Total, FechaAltaSolicitud, Necesidad, Contestacion, citacion_id, Provincia_id, Poblacion_id, Estado, Estado_Citacion_id
FROM            (SELECT        ID, Demanda_id, Anio, Mutua, Mutua_id, MutuaOfertante_Id, MutuaOfertante, Centro, Especialidad, Servicio, Centro_id, Agrupacion, Servicio_id, Especialidad_id, FechaConfirmacion, FechaRevision, Localidad, 
                                                    Provincia, Tipo_id, CodigoDemanda, TipoMovimiento_id, TipoMovimiento, Peticiones_Atendidas, Peticiones_Pendientes, Estado_id, DireccionGIS, Telefono, FechaAsignacion, SUM(Ene) AS Ene, SUM(Feb) AS Feb, 
                                                    SUM(Mar) AS Mar, SUM(Abr) AS Abr, SUM(May) AS May, SUM(Jun) AS Jun, SUM(Jul) AS Jul, SUM(Ago) AS Ago, SUM(Sep) AS Sep, SUM(Oct) AS Oct, SUM(Nov) AS Nov, SUM(Dic) AS Dic, SUM(Ene) + SUM(Feb) 
                                                    + SUM(Mar) + SUM(Abr) + SUM(May) + SUM(Jun) + SUM(Jul) + SUM(Ago) + SUM(Sep) + SUM(Oct) + SUM(Nov) + SUM(Dic) AS Total, FechaAltaSolicitud, Necesidad, Contestacion, citacion_id, Provincia_id, 
                                                    Poblacion_id, Estado, Estado_Citacion_id
                          FROM            (SELECT        dbo.Demandas.Demanda_id AS ID, CAST(ISNULL(dbo.Demandas.Centro_id, 0) AS varchar) + ';' + CAST(ISNULL(dbo.Demandas.Servicio_id, 0) AS nvarchar) 
                                                                              + ';' + CAST(ISNULL(dbo.Demandas.Especialidad_id, 0) AS varchar) + ';2;' + CAST(ISNULL(dbo.Demandas.Demanda_id, 0) AS nvarchar) AS Demanda_id, dbo.Demandas.Año AS Anio, dbo.Mutuas.Mutua, 
                                                                              dbo.Mutuas.Mutua_id, MutuasOfertantes.MutuaOfertante_Id, MutuasOfertantes.Mutua AS MutuaOfertante, LTRIM(CAST(dbo.CentrosPropios.Localizador AS varchar)) 
                                                                              + ' ' + LTRIM(CAST(ISNULL(dbo.CentrosPropios.Centro, 'Agrupación de Centros') AS varchar)) AS Centro, dbo.Aux_Especialidades.Especialidad, dbo.Aux_Servicios.Servicio, dbo.Demandas.Centro_id, 
                                                                              'Año: ' + CAST(dbo.Demandas.Año AS nvarchar) + ' | Mutua: ' + dbo.Mutuas.Mutua + ' | Centro: ' + ISNULL(dbo.CentrosPropios.Centro, 'Individual') 
                                                                              + ' | Especialidad: ' + dbo.Aux_Especialidades.Especialidad + ' | Servicio: ' + dbo.Aux_Servicios.Servicio + ' | ' + CAST(dbo.Demandas.Demanda_id AS nvarchar) AS Agrupacion, 
                                                                              dbo.Demandas.Servicio_id, dbo.Demandas.Especialidad_id, CONVERT(nvarchar(10), MAX(dbo.Ofertas.FechaConfirmacion), 103) AS FechaConfirmacion, dbo.Demandas.FechaRevision, 
                                                                              dbo.Aux_Poblaciones.Poblacion AS Localidad, dbo.Aux_Provincias.Provincia, dbo.Demandas.Tipo_id, dbo.Demandas.Demanda_id AS CodigoDemanda, 2 AS TipoMovimiento_id, 
                                                                              'DEMANDA' AS TipoMovimiento,
                                                                                  (SELECT        COUNT(Demanda_id) AS Expr1
                                                                                    FROM            dbo.Demandas AS B
                                                                                    WHERE        (Demanda_id = dbo.Demandas.Demanda_id) AND (Estado_id IN (1, 2, 3, 4))) AS Peticiones_Atendidas,
                                                                                  (SELECT        COUNT(Demanda_id) AS Expr1
                                                                                    FROM            dbo.Demandas AS B
                                                                                    WHERE        (Demanda_id = dbo.Demandas.Demanda_id) AND (NOT (Estado_id IN (2, 3)))) AS Peticiones_Pendientes, dbo.Demandas.Estado_id, dbo.CentrosPropios.DireccionGIS, 
                                                                              dbo.CentrosPropios.Telefono, dbo.Ofertas.FechaAsignacion, MAX(dbo.Ofertas.Ene) AS Ene, MAX(dbo.Ofertas.Feb) AS Feb, MAX(dbo.Ofertas.Mar) AS Mar, MAX(dbo.Ofertas.Abr) AS Abr, 
                                                                              MAX(dbo.Ofertas.May) AS May, MAX(dbo.Ofertas.Jun) AS Jun, MAX(dbo.Ofertas.Jul) AS Jul, MAX(dbo.Ofertas.Ago) AS Ago, MAX(dbo.Ofertas.Sep) AS Sep, MAX(dbo.Ofertas.Oct) AS Oct, 
                                                                              MAX(dbo.Ofertas.Nov) AS Nov, MAX(dbo.Ofertas.Dic) AS Dic, MAX(dbo.Ofertas.Ene) + MAX(dbo.Ofertas.Feb) + MAX(dbo.Ofertas.Mar) + MAX(dbo.Demandas.Abr) + MAX(dbo.Ofertas.May) 
                                                                              + MAX(dbo.Ofertas.Jun) + MAX(dbo.Ofertas.Jul) + MAX(dbo.Ofertas.Ago) + MAX(dbo.Ofertas.Sep) + MAX(dbo.Ofertas.Oct) + MAX(dbo.Ofertas.Nov) + MAX(dbo.Ofertas.Dic) AS Total, c.FechaAltaSolicitud, 
                                                                              c.Necesidad, c.Contestacion, c.citacion_id, dbo.Aux_Provincias.Provincia_id, dbo.Aux_Poblaciones.Poblacion_id, ec.Estado, ec.Estado_id AS Estado_Citacion_id
                                                    FROM            dbo.Demandas LEFT OUTER JOIN
                                                                              dbo.Ofertas ON dbo.Demandas.Demanda_id = dbo.Ofertas.Demanda_id LEFT OUTER JOIN
                                                                              dbo.CentrosPropios ON dbo.Demandas.Centro_id = dbo.CentrosPropios.Centro_id LEFT OUTER JOIN
                                                                              dbo.Aux_Poblaciones ON dbo.CentrosPropios.Poblacion_id = dbo.Aux_Poblaciones.Poblacion_id LEFT OUTER JOIN
                                                                              dbo.Aux_Provincias ON dbo.Aux_Poblaciones.Provincia_id = dbo.Aux_Provincias.Provincia_id LEFT OUTER JOIN
                                                                              dbo.Mutuas ON dbo.Demandas.MutuaDemanda_id = dbo.Mutuas.Mutua_id LEFT OUTER JOIN
                                                                                  (SELECT        CentrosPropios_1.Centro_id, Mutuas_1.Mutua, CentrosPropios_1.Mutua_id AS MutuaOfertante_Id
                                                                                    FROM            dbo.CentrosPropios AS CentrosPropios_1 LEFT OUTER JOIN
                                                                                                              dbo.Mutuas AS Mutuas_1 ON CentrosPropios_1.Mutua_id = Mutuas_1.Mutua_id) AS MutuasOfertantes ON dbo.Demandas.Centro_id = MutuasOfertantes.Centro_id LEFT OUTER JOIN
                                                                              dbo.Aux_Especialidades ON dbo.Demandas.Especialidad_id = dbo.Aux_Especialidades.Especialidad_id LEFT OUTER JOIN
                                                                              dbo.Aux_Servicios ON dbo.Demandas.Servicio_id = dbo.Aux_Servicios.Servicio_id LEFT OUTER JOIN
                                                                              dbo.Citaciones AS c ON dbo.Demandas.Demanda_id = c.Demanda_id LEFT OUTER JOIN
                                                                              dbo.Aux_Estados_Citacion AS ec ON ec.Estado_id = c.Estado_id
                                                    WHERE        (dbo.Demandas.Tipo_id = 1)
                                                    GROUP BY dbo.Demandas.Año, dbo.Mutuas.Mutua, MutuasOfertantes.Mutua, dbo.CentrosPropios.Centro, dbo.Demandas.Centro_id, dbo.Aux_Especialidades.Especialidad, dbo.Demandas.Especialidad_id, 
                                                                              dbo.Aux_Servicios.Servicio, dbo.Demandas.Servicio_id, dbo.Demandas.FechaRevision, dbo.Aux_Poblaciones.Poblacion, dbo.Aux_Provincias.Provincia, dbo.Demandas.Tipo_id, 
                                                                              dbo.Demandas.Demanda_id, dbo.CentrosPropios.Localizador, dbo.Demandas.Estado_id, dbo.CentrosPropios.DireccionGIS, dbo.CentrosPropios.Telefono, dbo.Ofertas.FechaAsignacion, 
                                                                              dbo.Mutuas.Mutua_id, MutuasOfertantes.MutuaOfertante_Id, c.FechaAltaSolicitud, c.Necesidad, c.Contestacion, c.citacion_id, dbo.Aux_Provincias.Provincia_id, dbo.Aux_Poblaciones.Poblacion_id, 
                                                                              ec.Estado, ec.Estado_id) AS tab
                          GROUP BY Mutua, Centro, Centro_id, Especialidad, Especialidad_id, Servicio_id, FechaRevision, TipoMovimiento_id, TipoMovimiento, Peticiones_Atendidas, Tipo_id, Demanda_id, Localidad, Provincia, Anio, MutuaOfertante, 
                                                    Servicio, Agrupacion, FechaConfirmacion, CodigoDemanda, Peticiones_Pendientes, Estado_id, Telefono, ID, DireccionGIS, FechaAsignacion, Mutua_id, MutuaOfertante_Id, FechaAltaSolicitud, Necesidad, 
                                                    Contestacion, citacion_id, citacion_id, Provincia_id, Poblacion_id, Estado, Estado_Citacion_id) AS GestionDemanda
WHERE        (TipoMovimiento_id = 2) AND (Tipo_id = 1) AND (Estado_id = 3) AND (ID IN
                             (SELECT        Demanda_id
                               FROM            dbo.Ofertas AS Ofertas_1
                               WHERE        (FechaConfirmacion IS NOT NULL) AND (ISNULL(Ene, 0) + ISNULL(Feb, 0) + ISNULL(Mar, 0) + ISNULL(Abr, 0) + ISNULL(May, 0) + ISNULL(Jun, 0) + ISNULL(Jul, 0) + ISNULL(Ago, 0) + ISNULL(Sep, 0) + ISNULL(Oct, 0) 
                                                         + ISNULL(Nov, 0) + ISNULL(Dic, 0) > 0)))
GO
/****** Object:  Table [dbo].[Demandas_SubSol]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Demandas_SubSol')
BEGIN
CREATE TABLE [dbo].[Demandas_SubSol](
	[Demandas_SubSol_id] [int] IDENTITY(1,1) NOT NULL,
	[Demanda_id] [int] NULL,
	[Centro_id] [int] NULL,
	[Ene] [int] NULL,
	[Feb] [int] NULL,
	[Mar] [int] NULL,
	[Abr] [int] NULL,
	[May] [int] NULL,
	[Jun] [int] NULL,
	[Jul] [int] NULL,
	[Ago] [int] NULL,
	[Sep] [int] NULL,
	[Oct] [int] NULL,
	[Nov] [int] NULL,
	[Dic] [int] NULL,
	[UsuarioAlta_id] [int] NOT NULL,
	[FechaAlta] [datetime] NULL,
	[Estado_id] [int] NULL,
	[Oferta_id] [int] NULL,
	[Doc] [bit] NULL,
 CONSTRAINT [PK_Demandas_SubSol] PRIMARY KEY CLUSTERED 
(
	[Demandas_SubSol_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  View [dbo].[vwDemandas_Citaciones_SinAgrupar]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*select * from [vwDemandas_Citaciones] where anio= 2017
order by Demanda_id, mutua*/
CREATE OR ALTER VIEW [dbo].[vwDemandas_Citaciones_SinAgrupar]
AS
SELECT        ID, Demanda_id, Anio, Mutua, Mutua_id, MutuaOfertante_Id, MutuaOfertante, Centro, Especialidad, Servicio, Centro_id, Agrupacion, Servicio_id, Especialidad_id, FechaConfirmacion, FechaRevision, Localidad, Provincia, 
                         Tipo_id, CodigoDemanda, TipoMovimiento_id, TipoMovimiento, Peticiones_Atendidas, Peticiones_Pendientes, Estado_id, DireccionGIS, Telefono, FechaAsignacion, Ene, Feb, Mar, Abr, May, Jun, Jul, Ago, Sep, Oct, Nov, Dic, 
                         Total, FechaAltaSolicitud, Necesidad, Contestacion, citacion_id
FROM            (SELECT        ID, Demanda_id, Anio, Mutua, Mutua_id, MutuaOfertante_Id, MutuaOfertante, Centro, Especialidad, Servicio, Centro_id, Agrupacion, Servicio_id, Especialidad_id, FechaConfirmacion, FechaRevision, Localidad, 
                                                    Provincia, Tipo_id, CodigoDemanda, TipoMovimiento_id, TipoMovimiento, Peticiones_Atendidas, Peticiones_Pendientes, Estado_id, DireccionGIS, Telefono, FechaAsignacion, COUNT(Ene) AS Ene, COUNT(Feb) 
                                                    AS Feb, COUNT(Mar) AS Mar, COUNT(Abr) AS Abr, COUNT(May) AS May, COUNT(Jun) AS Jun, COUNT(Jul) AS Jul, COUNT(Ago) AS Ago, COUNT(Sep) AS Sep, COUNT(Oct) AS Oct, COUNT(Nov) AS Nov, COUNT(Dic) 
                                                    AS Dic, COUNT(Ene) + COUNT(Feb) + COUNT(Mar) + COUNT(Abr) + COUNT(May) + COUNT(Jun) + COUNT(Jul) + COUNT(Ago) + COUNT(Sep) + COUNT(Oct) + COUNT(Nov) + COUNT(Dic) AS Total, FechaAltaSolicitud, 
                                                    Necesidad, Contestacion, citacion_id
                          FROM            (SELECT        dbo.Demandas.Demanda_id AS ID, CAST(ISNULL(dbo.Demandas.Centro_id, 0) AS varchar) + ';' + CAST(ISNULL(dbo.Demandas.Servicio_id, 0) AS nvarchar) 
                                                                              + ';' + CAST(ISNULL(dbo.Demandas.Especialidad_id, 0) AS varchar) + ';2;' + CAST(ISNULL(dbo.Demandas.Demanda_id, 0) AS nvarchar) AS Demanda_id, dbo.Demandas.Año AS Anio, dbo.Mutuas.Mutua, 
                                                                              dbo.Mutuas.Mutua_id, MutuasOfertantes.MutuaOfertante_Id, MutuasOfertantes.Mutua AS MutuaOfertante, LTRIM(CAST(dbo.CentrosPropios.Localizador AS varchar)) 
                                                                              + ' ' + LTRIM(CAST(ISNULL(dbo.CentrosPropios.Centro, 'Agrupación de Centros') AS varchar)) AS Centro, dbo.Aux_Especialidades.Especialidad, dbo.Aux_Servicios.Servicio, dbo.Demandas.Centro_id, 
                                                                              'Año: ' + CAST(dbo.Demandas.Año AS nvarchar) + ' | Mutua: ' + dbo.Mutuas.Mutua + ' | Centro: ' + ISNULL(dbo.CentrosPropios.Centro, 'Individual') 
                                                                              + ' | Especialidad: ' + dbo.Aux_Especialidades.Especialidad + ' | Servicio: ' + dbo.Aux_Servicios.Servicio + ' | ' + CAST(dbo.Demandas.Demanda_id AS nvarchar) AS Agrupacion, 
                                                                              dbo.Demandas.Servicio_id, dbo.Demandas.Especialidad_id, CONVERT(nvarchar(10), MAX(dbo.Ofertas.FechaConfirmacion), 103) AS FechaConfirmacion, dbo.Demandas.FechaRevision, 
                                                                              dbo.Aux_Poblaciones.Poblacion AS Localidad, dbo.Aux_Provincias.Provincia, dbo.Demandas.Tipo_id, dbo.Demandas.Demanda_id AS CodigoDemanda, 2 AS TipoMovimiento_id, 
                                                                              'DEMANDA' AS TipoMovimiento,
                                                                                  (SELECT        COUNT(Demanda_id) AS Expr1
                                                                                    FROM            dbo.Demandas AS B
                                                                                    WHERE        (Demanda_id = dbo.Demandas.Demanda_id) AND (Estado_id IN (1, 2, 3, 4))) AS Peticiones_Atendidas,
                                                                                  (SELECT        COUNT(Demanda_id) AS Expr1
                                                                                    FROM            dbo.Demandas AS B
                                                                                    WHERE        (Demanda_id = dbo.Demandas.Demanda_id) AND (NOT (Estado_id IN (2, 3)))) AS Peticiones_Pendientes, dbo.Demandas.Estado_id, dbo.CentrosPropios.DireccionGIS, 
                                                                              dbo.CentrosPropios.Telefono, dbo.Ofertas.FechaAsignacion, COUNT(dbo.Demandas.Ene) AS Ene, COUNT(dbo.Demandas.Feb) AS Feb, COUNT(dbo.Demandas.Mar) AS Mar, COUNT(dbo.Demandas.Abr) 
                                                                              AS Abr, COUNT(dbo.Demandas.May) AS May, COUNT(dbo.Demandas.Jun) AS Jun, COUNT(dbo.Demandas.Jul) AS Jul, COUNT(dbo.Demandas.Ago) AS Ago, COUNT(dbo.Demandas.Sep) AS Sep, 
                                                                              COUNT(dbo.Demandas.Oct) AS Oct, COUNT(dbo.Demandas.Nov) AS Nov, COUNT(dbo.Demandas.Dic) AS Dic, COUNT(dbo.Demandas.Ene) + COUNT(dbo.Demandas.Feb) + MAX(dbo.Demandas.Mar) 
                                                                              + COUNT(dbo.Demandas.Abr) + COUNT(dbo.Demandas.May) + COUNT(dbo.Demandas.Jun) + COUNT(dbo.Demandas.Jul) + COUNT(dbo.Demandas.Ago) + COUNT(dbo.Demandas.Sep) 
                                                                              + COUNT(dbo.Demandas.Oct) + MAX(dbo.Demandas.Nov) + COUNT(dbo.Demandas.Dic) AS Total, c.FechaAltaSolicitud, c.Necesidad, c.Contestacion, c.citacion_id
                                                    FROM            dbo.Demandas LEFT OUTER JOIN
                                                                              dbo.Ofertas ON dbo.Demandas.Demanda_id = dbo.Ofertas.Demanda_id LEFT OUTER JOIN
                                                                              dbo.CentrosPropios ON dbo.Demandas.Centro_id = dbo.CentrosPropios.Centro_id LEFT OUTER JOIN
                                                                              dbo.Aux_Poblaciones ON dbo.CentrosPropios.Poblacion_id = dbo.Aux_Poblaciones.Poblacion_id LEFT OUTER JOIN
                                                                              dbo.Aux_Provincias ON dbo.Aux_Poblaciones.Provincia_id = dbo.Aux_Provincias.Provincia_id LEFT OUTER JOIN
                                                                              dbo.Mutuas ON dbo.Demandas.MutuaDemanda_id = dbo.Mutuas.Mutua_id LEFT OUTER JOIN
                                                                                  (SELECT        dbo.CentrosPropios.Centro_id, dbo.Mutuas.Mutua, dbo.CentrosPropios.Mutua_id AS MutuaOfertante_Id
                                                                                    FROM            dbo.CentrosPropios LEFT OUTER JOIN
                                                                                                              dbo.Mutuas ON dbo.CentrosPropios.Mutua_id = dbo.Mutuas.Mutua_id) AS MutuasOfertantes ON dbo.Demandas.Centro_id = MutuasOfertantes.Centro_id LEFT OUTER JOIN
                                                                              dbo.Aux_Especialidades ON dbo.Demandas.Especialidad_id = dbo.Aux_Especialidades.Especialidad_id LEFT OUTER JOIN
                                                                              dbo.Aux_Servicios ON dbo.Demandas.Servicio_id = dbo.Aux_Servicios.Servicio_id LEFT OUTER JOIN
                                                                              dbo.Citaciones AS c ON dbo.Demandas.Demanda_id = c.Demanda_id
                                                    WHERE        (dbo.Demandas.Tipo_id = 1)
                                                    GROUP BY dbo.Demandas.Año, dbo.Mutuas.Mutua, MutuasOfertantes.Mutua, dbo.CentrosPropios.Centro, dbo.Demandas.Centro_id, dbo.Aux_Especialidades.Especialidad, dbo.Demandas.Especialidad_id, 
                                                                              dbo.Aux_Servicios.Servicio, dbo.Demandas.Servicio_id, dbo.Demandas.FechaRevision, dbo.Aux_Poblaciones.Poblacion, dbo.Aux_Provincias.Provincia, dbo.Demandas.Tipo_id, 
                                                                              dbo.Demandas.Demanda_id, dbo.CentrosPropios.Localizador, dbo.Demandas.Estado_id, dbo.CentrosPropios.DireccionGIS, dbo.CentrosPropios.Telefono, dbo.Ofertas.FechaAsignacion, 
                                                                              dbo.Mutuas.Mutua_id, MutuasOfertantes.MutuaOfertante_Id, c.FechaAltaSolicitud, c.Necesidad, c.Contestacion, c.citacion_id
                                                    UNION ALL
                                                    SELECT        dbo.Demandas.Demanda_id AS ID, CAST(ISNULL(dbo.Demandas.Centro_id, 0) AS nvarchar) + ';' + CAST(ISNULL(dbo.Demandas.Servicio_id, 0) AS varchar) 
                                                                             + ';' + CAST(ISNULL(dbo.Demandas.Especialidad_id, 0) AS nvarchar) + ';2;' + CAST(ISNULL(dbo.Demandas.Demanda_id, 0) AS varchar) AS Demanda_id, dbo.Demandas.Año AS Anio, dbo.Mutuas.Mutua, 
                                                                             dbo.Mutuas.Mutua_id, 0 AS MutuaOfertante_id, 'Mutuas Ofertantes' AS MutuaOfertante, 'Centros de demanda Individual' AS Centro, dbo.Aux_Especialidades.Especialidad, dbo.Aux_Servicios.Servicio, 
                                                                             dbo.Demandas.Centro_id, 'Año: ' + CAST(dbo.Demandas.Año AS nvarchar) + ' | Mutua: ' + dbo.Mutuas.Mutua + ' | Centro: ' + ISNULL(dbo.CentrosPropios.Centro, 'Individual') 
                                                                             + ' | Especialidad: ' + dbo.Aux_Especialidades.Especialidad + ' | Servicio: ' + dbo.Aux_Servicios.Servicio + ' | ' + CAST(dbo.Demandas.Demanda_id AS nvarchar) AS Agrupacion, 
                                                                             dbo.Demandas.Servicio_id, dbo.Demandas.Especialidad_id, CONVERT(nvarchar(10), MAX(dbo.Ofertas.FechaConfirmacion), 103) AS FechaConfirnmacion, dbo.Demandas.FechaRevision, 
                                                                             ISNULL(dbo.Aux_Poblaciones.Poblacion, '') AS Localidad, ISNULL(dbo.Aux_Provincias.Provincia, '') AS Provincia, dbo.Demandas.Tipo_id, dbo.Demandas.Demanda_id AS CodigoDemanda, 
                                                                             2 AS TipoMovimiento_id, 'DEMANDA' AS TipoMovimiento,
                                                                                 (SELECT        COUNT(Demanda_id) AS Expr1
                                                                                   FROM            dbo.Demandas_SubSol AS B
                                                                                   WHERE        (Demanda_id = dbo.Demandas.Demanda_id) AND (Estado_id IN (1, 2, 3, 4))) AS Peticiones_Atendidas,
                                                                                 (SELECT        COUNT(Demanda_id) AS Expr1
                                                                                   FROM            dbo.Demandas AS B
                                                                                   WHERE        (Demanda_id = dbo.Demandas.Demanda_id) AND (NOT (Estado_id IN (2, 3)))) AS Peticiones_Pendientes, dbo.Demandas.Estado_id, dbo.CentrosPropios.DireccionGIS, 
                                                                             dbo.CentrosPropios.Telefono, dbo.Ofertas.FechaAsignacion, COUNT(dbo.Demandas.Ene) AS Ene, COUNT(dbo.Demandas.Feb) AS Feb, COUNT(dbo.Demandas.Mar) AS Mar, COUNT(dbo.Demandas.Abr) 
                                                                             AS Abr, COUNT(dbo.Demandas.May) AS May, COUNT(dbo.Demandas.Jun) AS Jun, COUNT(dbo.Demandas.Jul) AS Jul, COUNT(dbo.Demandas.Ago) AS Ago, COUNT(dbo.Demandas.Sep) AS Sep, 
                                                                             COUNT(dbo.Demandas.Oct) AS Oct, COUNT(dbo.Demandas.Nov) AS Nov, COUNT(dbo.Demandas.Dic) AS Dic, COUNT(dbo.Demandas.Ene) + COUNT(dbo.Demandas.Feb) + MAX(dbo.Demandas.Mar) 
                                                                             + COUNT(dbo.Demandas.Abr) + COUNT(dbo.Demandas.May) + COUNT(dbo.Demandas.Jun) + COUNT(dbo.Demandas.Jul) + COUNT(dbo.Demandas.Ago) + COUNT(dbo.Demandas.Sep) 
                                                                             + COUNT(dbo.Demandas.Oct) + MAX(dbo.Demandas.Nov) + COUNT(dbo.Demandas.Dic) AS Total, c.FechaAltaSolicitud, c.Necesidad, c.Contestacion, c.citacion_id
                                                    FROM            dbo.Demandas LEFT OUTER JOIN
                                                                             dbo.Ofertas ON dbo.Demandas.Demanda_id = dbo.Ofertas.Demanda_id LEFT OUTER JOIN
                                                                             dbo.CentrosPropios ON dbo.Demandas.Centro_id = dbo.CentrosPropios.Centro_id LEFT OUTER JOIN
                                                                             dbo.Aux_Poblaciones ON dbo.Demandas.Localidad = dbo.Aux_Poblaciones.Poblacion_id LEFT OUTER JOIN
                                                                             dbo.Aux_Provincias ON dbo.Aux_Poblaciones.Provincia_id = dbo.Aux_Provincias.Provincia_id LEFT OUTER JOIN
                                                                             dbo.Mutuas ON dbo.Demandas.MutuaDemanda_id = dbo.Mutuas.Mutua_id LEFT OUTER JOIN
                                                                             dbo.Aux_Especialidades ON dbo.Demandas.Especialidad_id = dbo.Aux_Especialidades.Especialidad_id LEFT OUTER JOIN
                                                                             dbo.Aux_Servicios ON dbo.Demandas.Servicio_id = dbo.Aux_Servicios.Servicio_id LEFT OUTER JOIN
                                                                             dbo.Citaciones AS c ON dbo.Demandas.Demanda_id = c.Demanda_id
                                                    WHERE        (dbo.Demandas.Tipo_id = 2)
                                                    GROUP BY dbo.Demandas.Año, dbo.Mutuas.Mutua, dbo.CentrosPropios.Centro, dbo.Demandas.Centro_id, dbo.Aux_Especialidades.Especialidad, dbo.Demandas.Especialidad_id, dbo.Aux_Servicios.Servicio, 
                                                                             dbo.Demandas.Servicio_id, dbo.Demandas.FechaRevision, dbo.Aux_Poblaciones.Poblacion, dbo.Aux_Provincias.Provincia, dbo.Demandas.Tipo_id, dbo.Demandas.Demanda_id, 
                                                                             dbo.CentrosPropios.Localizador, dbo.Demandas.Localidad, dbo.Demandas.Estado_id, dbo.CentrosPropios.DireccionGIS, dbo.CentrosPropios.Telefono, dbo.Ofertas.FechaAsignacion, 
                                                                             dbo.Mutuas.Mutua_id, c.FechaAltaSolicitud, c.Necesidad, c.Contestacion, c.citacion_id) AS tab
                          GROUP BY Mutua, Centro, Centro_id, Especialidad, Especialidad_id, Servicio_id, FechaRevision, TipoMovimiento_id, TipoMovimiento, Peticiones_Atendidas, Tipo_id, Demanda_id, Localidad, Provincia, Anio, MutuaOfertante, 
                                                    Servicio, Agrupacion, FechaConfirmacion, CodigoDemanda, Peticiones_Pendientes, Estado_id, Telefono, ID, DireccionGIS, FechaAsignacion, Mutua_id, MutuaOfertante_Id, FechaAltaSolicitud, Necesidad, 
                                                    Contestacion, citacion_id
                          UNION ALL
                          SELECT        dbo.Demandas.Demanda_id AS ID, CAST(ISNULL(dbo.Demandas.Centro_id, 0) AS nvarchar) + ';' + CAST(ISNULL(dbo.Demandas.Servicio_id, 0) AS nvarchar) + ';' + CAST(ISNULL(dbo.Demandas.Especialidad_id, 0) 
                                                   AS nvarchar) + ';1;' + CAST(ISNULL(dbo.Ofertas.Demanda_id, 0) AS nvarchar) AS Demanda_id, dbo.Demandas.Año AS Anio, dbo.Mutuas.Mutua, dbo.Mutuas.Mutua_id, 
                                                   CASE WHEN Tipo_id = 1 THEN MutuasOfertantes.MutuaOfertante_id ELSE 0 END AS MutuaOfertante_id, CASE WHEN Tipo_id = 1 THEN MutuasOfertantes.Mutua ELSE 'Mutuas Ofertantes' END AS MutuaOfertante, 
                                                   CASE WHEN tipo_id = 1 THEN ltrim(CAST(CentrosPropios.Localizador AS varchar)) + ' ' + ltrim(CAST(CentrosPropios.Centro AS varchar)) 
                                                   ELSE CASE WHEN DemandasSub.Estado_id = 3 THEN DemandasSub.Centro ELSE 'Centros Demanda Individual' END END AS Centro, dbo.Aux_Especialidades.Especialidad, dbo.Aux_Servicios.Servicio, 
                                                   dbo.Demandas.Centro_id, 'Año: ' + CAST(dbo.Demandas.Año AS nvarchar) + ' | Mutua: ' + dbo.Mutuas.Mutua + ' | Centro: ' + ISNULL(dbo.CentrosPropios.Centro, 'Individual') 
                                                   + ' | Especialidad: ' + dbo.Aux_Especialidades.Especialidad + ' | Servicio: ' + dbo.Aux_Servicios.Servicio + ' | ' + CAST(ISNULL(dbo.Demandas.Demanda_id, 0) AS nvarchar) AS Agrupacion, 
                                                   dbo.Demandas.Servicio_id, dbo.Demandas.Especialidad_id, CONVERT(nvarchar(10), MAX(dbo.Ofertas.FechaConfirmacion), 103) AS FechaConfirnmacion, dbo.Demandas.FechaRevision, 
                                                   CASE WHEN Tipo_id = 1 THEN isnull(Aux_Poblaciones.Poblacion, '') ELSE Poblaciones.Poblacion END AS Localidad, CASE WHEN Tipo_id = 1 THEN isnull(Aux_Provincias.Provincia, '') 
                                                   ELSE Provincias.Provincia END AS Provincia, dbo.Demandas.Tipo_id, dbo.Demandas.Demanda_id AS CodigoDemanda, 1 AS TipoMovimiento_id, 'OFERTA' AS TipoMovimiento, 
                                                   CASE WHEN Tipo_id = 1 THEN
                                                       (SELECT        COUNT(B.Demanda_id)
                                                         FROM            Demandas B
                                                         WHERE        B.Demanda_id = Demandas.Demanda_id AND b.Estado_id IN (1, 2, 3, 4)) ELSE
                                                       (SELECT        COUNT(B.Demanda_id)
                                                         FROM            Demandas_SubSol B
                                                         WHERE        B.Demanda_id = Demandas.Demanda_id AND b.Estado_id IN (1, 2, 3, 4)) END AS Peticiones_Atendidas,
                                                       (SELECT        COUNT(Demanda_id) AS Expr1
                                                         FROM            dbo.Demandas AS B
                                                         WHERE        (Demanda_id = dbo.Demandas.Demanda_id) AND (NOT (Estado_id IN (2, 3)))) AS Peticiones_Pendientes, dbo.Demandas.Estado_id, dbo.CentrosPropios.DireccionGIS, dbo.CentrosPropios.Telefono, 
                                                   dbo.Ofertas.FechaAsignacion, CASE WHEN NOT MAX(FechaConfirmacion) IS NULL THEN isnull(COUNT(Ofertas.Ene), 0) ELSE isnull(MAX(Ofertas.Ene), 0) END AS Ene, CASE WHEN NOT MAX(FechaConfirmacion) 
                                                   IS NULL THEN isnull(COUNT(Ofertas.Feb), 0) ELSE isnull(MAX(Ofertas.Feb), 0) END AS Feb, CASE WHEN NOT MAX(FechaConfirmacion) IS NULL THEN isnull(COUNT(Ofertas.Mar), 0) ELSE isnull(MAX(Ofertas.Mar), 0) 
                                                   END AS Mar, CASE WHEN NOT MAX(FechaConfirmacion) IS NULL THEN isnull(COUNT(Ofertas.Abr), 0) ELSE isnull(MAX(Ofertas.Abr), 0) END AS Abr, CASE WHEN NOT MAX(FechaConfirmacion) IS NULL 
                                                   THEN isnull(COUNT(Ofertas.May), 0) ELSE isnull(MAX(Ofertas.May), 0) END AS May, CASE WHEN NOT MAX(FechaConfirmacion) IS NULL THEN isnull(COUNT(Ofertas.Jun), 0) ELSE isnull(MAX(Ofertas.Jun), 0) 
                                                   END AS Jun, CASE WHEN NOT MAX(FechaConfirmacion) IS NULL THEN isnull(COUNT(Ofertas.Jul), 0) ELSE isnull(MAX(Ofertas.Jul), 0) END AS Jul, CASE WHEN NOT MAX(FechaConfirmacion) IS NULL 
                                                   THEN isnull(COUNT(Ofertas.Ago), 0) ELSE isnull(MAX(Ofertas.Ago), 0) END AS Ago, CASE WHEN NOT MAX(FechaConfirmacion) IS NULL THEN isnull(COUNT(Ofertas.Sep), 0) ELSE isnull(MAX(Ofertas.Sep), 0) 
                                                   END AS Sep, CASE WHEN NOT MAX(FechaConfirmacion) IS NULL THEN isnull(COUNT(Ofertas.Oct), 0) ELSE isnull(MAX(Ofertas.Oct), 0) END AS Oct, CASE WHEN NOT MAX(FechaConfirmacion) IS NULL 
                                                   THEN isnull(COUNT(Ofertas.Nov), 0) ELSE isnull(MAX(Ofertas.Nov), 0) END AS Nov, CASE WHEN NOT MAX(FechaConfirmacion) IS NULL THEN isnull(COUNT(Ofertas.Dic), 0) ELSE isnull(MAX(Ofertas.Dic), 0) 
                                                   END AS Dic, CASE WHEN NOT MAX(FechaConfirmacion) IS NULL THEN isnull(COUNT(Ofertas.Ene), 0) + isnull(COUNT(Ofertas.Feb), 0) + isnull(COUNT(Ofertas.Mar), 0) + isnull(COUNT(Ofertas.Abr), 0) 
                                                   + isnull(COUNT(Ofertas.May), 0) + isnull(COUNT(Ofertas.Jun), 0) + isnull(COUNT(Ofertas.Jul), 0) + isnull(COUNT(Ofertas.Ago), 0) + isnull(COUNT(Ofertas.Sep), 0) + isnull(COUNT(Ofertas.Oct), 0) 
                                                   + isnull(COUNT(Ofertas.Nov), 0) + isnull(COUNT(Ofertas.Dic), 0) ELSE isnull(MAX(Ofertas.Ene), 0) + isnull(MAX(Ofertas.Feb), 0) + isnull(MAX(Ofertas.Mar), 0) + isnull(MAX(Ofertas.Abr), 0) + isnull(MAX(Ofertas.May), 0) 
                                                   + isnull(MAX(Ofertas.Jun), 0) + isnull(MAX(Ofertas.Jul), 0) + isnull(MAX(Ofertas.Ago), 0) + isnull(MAX(Ofertas.Sep), 0) + isnull(MAX(Ofertas.Oct), 0) + isnull(MAX(Ofertas.Nov), 0) + isnull(MAX(Ofertas.Dic), 0) 
                                                   END AS Total, c.FechaAltaSolicitud, c.Necesidad, c.Contestacion, c.citacion_id
                          FROM            dbo.Demandas LEFT OUTER JOIN
                                                       (SELECT        CAST(dbo.CentrosPropios.Localizador AS nvarchar) + ' ' + CAST(dbo.CentrosPropios.Centro AS nvarchar) AS Centro, dbo.Demandas_SubSol.Centro_id, dbo.Demandas_SubSol.Demanda_id, 
                                                                                   dbo.Demandas_SubSol.Estado_id
                                                         FROM            dbo.Demandas_SubSol INNER JOIN
                                                                                   dbo.CentrosPropios ON dbo.Demandas_SubSol.Centro_id = dbo.CentrosPropios.Centro_id
                                                         WHERE        (dbo.Demandas_SubSol.Estado_id = 3)) AS DemandasSub ON dbo.Demandas.Demanda_id = DemandasSub.Demanda_id LEFT OUTER JOIN
                                                   dbo.Ofertas ON dbo.Demandas.Demanda_id = dbo.Ofertas.Demanda_id LEFT OUTER JOIN
                                                   dbo.CentrosPropios ON dbo.Demandas.Centro_id = dbo.CentrosPropios.Centro_id LEFT OUTER JOIN
                                                   dbo.Aux_Poblaciones ON dbo.CentrosPropios.Poblacion_id = dbo.Aux_Poblaciones.Poblacion_id LEFT OUTER JOIN
                                                   dbo.Aux_Poblaciones AS Poblaciones ON ISNULL(dbo.Demandas.Localidad, 0) = Poblaciones.Poblacion_id LEFT OUTER JOIN
                                                   dbo.Aux_Provincias ON dbo.Aux_Poblaciones.Provincia_id = dbo.Aux_Provincias.Provincia_id LEFT OUTER JOIN
                                                   dbo.Aux_Provincias AS Provincias ON ISNULL(Poblaciones.Provincia_id, 0) = Provincias.Provincia_id LEFT OUTER JOIN
                                                   dbo.Mutuas ON dbo.Demandas.MutuaDemanda_id = dbo.Mutuas.Mutua_id LEFT OUTER JOIN
                                                       (SELECT        dbo.CentrosPropios.Centro_id, dbo.Mutuas.Mutua, dbo.CentrosPropios.Mutua_id AS MutuaOfertante_id
                                                         FROM            dbo.CentrosPropios LEFT OUTER JOIN
                                                                                   dbo.Mutuas ON dbo.CentrosPropios.Mutua_id = dbo.Mutuas.Mutua_id) AS MutuasOfertantes ON dbo.Demandas.Centro_id = MutuasOfertantes.Centro_id LEFT OUTER JOIN
                                                   dbo.Aux_Especialidades ON dbo.Demandas.Especialidad_id = dbo.Aux_Especialidades.Especialidad_id LEFT OUTER JOIN
                                                   dbo.Aux_Servicios ON dbo.Demandas.Servicio_id = dbo.Aux_Servicios.Servicio_id LEFT OUTER JOIN
                                                   dbo.Citaciones AS c ON dbo.Demandas.Demanda_id = c.Demanda_id
                          GROUP BY dbo.Demandas.Año, dbo.CentrosPropios.Centro, DemandasSub.Centro, dbo.Demandas.Centro_id, dbo.Aux_Especialidades.Especialidad, dbo.Demandas.Especialidad_id, dbo.Aux_Servicios.Servicio, 
                                                   dbo.Demandas.Servicio_id, dbo.Demandas.FechaRevision, dbo.Aux_Poblaciones.Poblacion, Poblaciones.Poblacion, dbo.Aux_Provincias.Provincia, Provincias.Provincia, dbo.Demandas.Tipo_id, 
                                                   dbo.Demandas.Demanda_id, dbo.CentrosPropios.Localizador, dbo.Ofertas.Demanda_id, dbo.Mutuas.Mutua, MutuasOfertantes.Mutua, DemandasSub.Estado_id, dbo.Demandas.Estado_id, 
                                                   dbo.CentrosPropios.DireccionGIS, dbo.CentrosPropios.Telefono, dbo.Ofertas.FechaAsignacion, MutuasOfertantes.MutuaOfertante_id, dbo.Mutuas.Mutua_id, c.FechaAltaSolicitud, c.Necesidad, c.Contestacion, 
                                                   c.citacion_id) AS GestionDemanda
WHERE        (TipoMovimiento_id = 2) AND (Tipo_id = 1) AND (Estado_id = 3)
GO
/****** Object:  Table [dbo].[DisponibilidadCentrosPropios]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DisponibilidadCentrosPropios')
BEGIN
CREATE TABLE [dbo].[DisponibilidadCentrosPropios](
	[DisponibilidadCentro_id] [int] IDENTITY(1,1) NOT NULL,
	[Centro_id] [int] NULL,
	[Servicio_id] [int] NULL,
	[Especialidad_id] [int] NULL,
	[Mes] [int] NULL,
	[Año] [int] NULL,
	[Cantidad] [int] NULL,
 CONSTRAINT [PK_DisponibilidadCentrosPropios] PRIMARY KEY CLUSTERED 
(
	[DisponibilidadCentro_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  View [dbo].[vw_Disponibilidad]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER VIEW [dbo].[vw_Disponibilidad] AS
SELECT        Año, Centro_id, Especialidad_id, Servicio_id, Enero, Febrero, Marzo, Abril, Mayo, Junio, Julio, Agosto, Septiembre, Octubre, Noviembre, Diciembre, Total
FROM            (SELECT        Año, Centro_id, Especialidad_id, Servicio_id, isnull([1], 0) AS Enero, isnull([2], 0) AS Febrero, isnull([3], 0) AS Marzo, isnull([4], 0) AS Abril, isnull([5], 0) AS Mayo, isnull([6], 0) AS Junio, isnull([7], 0) 
                                                    AS Julio, isnull([8], 0) AS Agosto, isnull([9], 0) AS Septiembre, isnull([10], 0) AS Octubre, isnull([11], 0) AS Noviembre, isnull([12], 0) AS Diciembre, isnull([1], 0) + isnull([2], 0) + isnull([3], 0) + isnull([4], 0) 
                                                    + isnull([5], 0) + isnull([6], 0) + isnull([7], 0) + isnull([8], 0) + isnull([9], 0) + isnull([10], 0) + isnull([11], 0) + isnull([12], 0) AS Total
                          FROM            (SELECT        Cantidad, mes, Año, Centro_id, Servicio_id, Especialidad_id
                                                    FROM            DisponibilidadCentrosPropios) AS tb1 PIVOT (Sum(Cantidad) FOR Mes IN ([1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12])) AS PivotTable) AS Disponibilidad
   
GO
/****** Object:  Table [dbo].[ICG06]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ICG06')
BEGIN
CREATE TABLE [dbo].[ICG06](
	[Id_ICG] [int] IDENTITY(1,1) NOT NULL,
	[Año] [int] NOT NULL,
	[Centro_id] [int] NOT NULL,
	[GasfinAG] [numeric](10, 2) NULL,
	[GasfinASCC] [numeric](10, 2) NULL,
	[GasfinASCP] [numeric](10, 2) NULL,
	[GasfinCIT] [numeric](10, 2) NULL,
	[GasfinPSS] [numeric](10, 2) NULL,
	[Actidesde] [datetime] NULL,
	[Actihasta] [datetime] NULL,
	[PAcen25km] [nvarchar](max) NULL,
	[PAcen50km] [nvarchar](max) NULL,
	[PAcen+50km] [nvarchar](max) NULL,
	[PrimCons(Prog)25km] [nvarchar](max) NULL,
	[PrimCons(Prog)50km] [nvarchar](max) NULL,
	[PrimCons(Prog)+50km] [nvarchar](max) NULL,
	[Conssuc25km] [nvarchar](max) NULL,
	[Conssuc50km] [nvarchar](max) NULL,
	[Conssuc+50km] [nvarchar](max) NULL,
	[Pradtrmut(Radio)] [numeric](10, 2) NULL,
	[Iquirtrmut] [numeric](10, 2) NULL,
	[Otrpptrmut] [numeric](10, 2) NULL,
	[PAcenArt82] [numeric](10, 2) NULL,
	[PrimConsArt82(Prog)] [numeric](10, 2) NULL,
	[PradArt82(Radio)] [numeric](10, 2) NULL,
	[OppractArt82] [numeric](10, 2) NULL,
	[SesrehabArt82] [numeric](10, 2) NULL,
	[IquircenArt82] [numeric](10, 2) NULL,
	[PAotmutArt12] [numeric](10, 2) NULL,
	[PAentgyAPArt12] [numeric](10, 2) NULL,
	[PAotrosArt12] [numeric](10, 2) NULL,
	[Panoapant] [numeric](10, 2) NULL,
	[PrimConsotmutArt12(Prog)] [numeric](10, 2) NULL,
	[PrimConentgyAPArt12(Prog)] [numeric](10, 2) NULL,
	[PrimConotrosArt12(Prog)] [numeric](10, 2) NULL,
	[PrimConsnoapant(Prog)] [numeric](10, 2) NULL,
	[ConssucotmutArt12] [numeric](10, 2) NULL,
	[ConssucentgyAPArt12] [numeric](10, 2) NULL,
	[ConssucotrosArt12] [numeric](10, 2) NULL,
	[Conssucnoapant] [numeric](10, 2) NULL,
	[SesrehabotmutArt12] [numeric](10, 2) NULL,
	[SesrehabentgyAPArt12] [numeric](10, 2) NULL,
	[SesrehabotrosArt12] [numeric](10, 2) NULL,
	[Sesrehabnoapant] [numeric](10, 2) NULL,
	[PradotmutArt12(Radio)] [numeric](10, 2) NULL,
	[PradentgyAPArt12(Radio)] [numeric](10, 2) NULL,
	[PradotrosArt12(Radio)] [numeric](10, 2) NULL,
	[Pradnoapant(Radio)] [numeric](10, 2) NULL,
	[IquirotmutArt12] [numeric](10, 2) NULL,
	[IquirentgyAPArt12] [numeric](10, 2) NULL,
	[IquirotrosArt12] [numeric](10, 2) NULL,
	[Iquirnoapant] [numeric](10, 2) NULL,
	[OppractotmutArt12] [numeric](10, 2) NULL,
	[OppractentgyAPArt12] [numeric](10, 2) NULL,
	[OppractotrosArt12] [numeric](10, 2) NULL,
	[Oppractnoapant] [numeric](10, 2) NULL,
	[PItrmutHOS] [numeric](10, 2) NULL,
	[EsttrmutHOS] [numeric](10, 2) NULL,
	[SesrehabtrmutHOS] [numeric](10, 2) NULL,
	[PradtrmutHOS(Radio)] [numeric](10, 2) NULL,
	[IquirtrmutHOS] [numeric](10, 2) NULL,
	[OppracttrmutHOS] [numeric](10, 2) NULL,
	[PAurnointrmutHOS] [numeric](10, 2) NULL,
	[PItrmutArt82HOS] [numeric](10, 2) NULL,
	[EsttrmutArt82HOS] [numeric](10, 2) NULL,
	[PrmydtrmutArt82HOS] [numeric](10, 2) NULL,
	[OpptrmutArt82HOS] [numeric](10, 2) NULL,
	[SrehabtrmutArt82HOS] [numeric](10, 2) NULL,
	[IquirtrmutArt82HOS] [numeric](10, 2) NULL,
	[PIotrmutArt12HOS] [numeric](10, 2) NULL,
	[PIEGYAPArt12HOS] [numeric](10, 2) NULL,
	[PIotrosArt12HOS] [numeric](10, 2) NULL,
	[Piotrnoapant] [numeric](10, 2) NULL,
	[EstotrmutArt12HOS] [numeric](10, 2) NULL,
	[EstEGYAPArt12HOS] [numeric](10, 2) NULL,
	[EstotrosArt12HOS] [numeric](10, 2) NULL,
	[Estotrnoapant] [numeric](10, 2) NULL,
	[SrehabotrmutArt12HOS] [numeric](10, 2) NULL,
	[SrehabEGYAPArt12HOS] [numeric](10, 2) NULL,
	[SrehabotrosArt12HOS] [numeric](10, 2) NULL,
	[SrehabnoapantHOS] [numeric](10, 2) NULL,
	[PradotrmutArt12HOS(Radio)] [numeric](10, 2) NULL,
	[PradEGYAPArt12HOS(Radio)] [numeric](10, 2) NULL,
	[PradotrosArt12HOS(Radio)] [numeric](10, 2) NULL,
	[PradnoapantHOS(Radio)] [numeric](10, 2) NULL,
	[IquirotrmutArt12HOS] [numeric](10, 2) NULL,
	[IquirEGYAPArt12HOS] [numeric](10, 2) NULL,
	[IquirotrosArt12HOS] [numeric](10, 2) NULL,
	[IquirnoapantHOS] [numeric](10, 2) NULL,
	[OppotrmutArt12HOS] [numeric](10, 2) NULL,
	[OppEGYAPArt12HOS] [numeric](10, 2) NULL,
	[OppotrosArt12HOS] [numeric](10, 2) NULL,
	[OppnoapantHOS] [numeric](10, 2) NULL,
	[PAurniotrmutArt12HOS] [numeric](10, 2) NULL,
	[PAurniEGYAPArt12HOS] [numeric](10, 2) NULL,
	[PAurniotrosArt12HOS] [numeric](10, 2) NULL,
	[PAurninoapantHOS] [numeric](10, 2) NULL,
	[Nfincreg] [numeric](10, 2) NULL,
	[SuptotConst] [numeric](10, 2) NULL,
	[Fautocom] [datetime] NULL,
	[Fpufuncio] [datetime] NULL,
	[Fcalisuf] [datetime] NULL,
	[Numcamas] [nvarchar](max) NULL,
	[Numquirof] [nvarchar](max) NULL,
	[Hormande] [nvarchar](max) NULL,
	[Hormanha] [nvarchar](max) NULL,
	[Hortardes] [nvarchar](max) NULL,
	[Hortarhas] [nvarchar](max) NULL,
	[Numdiano] [nvarchar](max) NULL,
	[Numdcierre] [nvarchar](max) NULL,
	[Traslado] [nvarchar](max) NULL,
	[TraslNdirec] [nvarchar](max) NULL,
	[Pobpr25kmAD] [numeric](10, 2) NULL,
	[Pobpr50kmAD] [numeric](10, 2) NULL,
	[Pobprmas50AD] [numeric](10, 2) NULL,
	[Obs25kmAD] [nvarchar](max) NULL,
	[Obs50kmAD] [nvarchar](max) NULL,
	[Obsmas50kmAD] [nvarchar](max) NULL,
	[Pobpr25kmCP] [numeric](10, 0) NULL,
	[Pobpr50kmCP] [numeric](10, 0) NULL,
	[Pobprmas50CP] [numeric](10, 0) NULL,
	[Pobpr25kmITCC] [numeric](10, 0) NULL,
	[Pobpr50kmITCC] [numeric](10, 0) NULL,
	[Pobprmas50ITCC] [numeric](10, 0) NULL,
	[Obs25km] [nvarchar](max) NULL,
	[Obs50km] [nvarchar](max) NULL,
	[Obsmas50km] [nvarchar](max) NULL,
	[Directcentro(med)num] [int] NULL,
	[Directcentro(med)coste] [numeric](10, 2) NULL,
	[Dircentro(med)horASCP] [numeric](10, 2) NULL,
	[Dircentro(med)horASCC] [numeric](10, 2) NULL,
	[Dircentro(med)horCIT] [numeric](10, 2) NULL,
	[Dircentro(med)horPSS] [numeric](10, 2) NULL,
	[Dircentro(nomed)horASCP] [numeric](10, 2) NULL,
	[Dircentro(nomed)horASCC] [numeric](10, 2) NULL,
	[Dircentro(nomed)horCIT] [numeric](10, 2) NULL,
	[Dircentro(nomed)horPSS] [numeric](10, 2) NULL,
	[Dircentro(med)horAG] [numeric](10, 2) NULL,
	[Medmedtrabnum] [int] NULL,
	[Medmedtrabcoste] [numeric](10, 2) NULL,
	[MedmedtrabhorASCP] [numeric](10, 0) NULL,
	[MedmedtrabhorPSS] [numeric](10, 0) NULL,
	[Medespnum] [numeric](10, 0) NULL,
	[Medespcoste] [numeric](10, 2) NULL,
	[MedesphorASCP] [numeric](10, 2) NULL,
	[MedesphorASCC] [numeric](10, 2) NULL,
	[Restofacnum] [numeric](10, 2) NULL,
	[Restofaccoste] [numeric](10, 2) NULL,
	[RestofachorASCP] [numeric](10, 2) NULL,
	[RestofachorASCC] [numeric](10, 2) NULL,
	[RestofachorCIT] [numeric](10, 2) NULL,
	[RestofachorPSS] [numeric](10, 2) NULL,
	[DUEyasnum] [numeric](10, 0) NULL,
	[DUEyascoste] [numeric](10, 2) NULL,
	[DUEyashorASCP] [numeric](10, 2) NULL,
	[DUEyashorASCC] [numeric](10, 2) NULL,
	[DUEyashorPSS] [numeric](10, 0) NULL,
	[ATSyasnum] [numeric](10, 0) NULL,
	[ATSyascoste] [numeric](10, 2) NULL,
	[ATSyashorASCP] [numeric](10, 2) NULL,
	[ATSyashorASCC] [numeric](10, 2) NULL,
	[ATSyashorPSS] [numeric](10, 2) NULL,
	[Auxclnum] [numeric](10, 2) NULL,
	[Auxclcoste] [numeric](10, 2) NULL,
	[AuxclhorASCP] [numeric](10, 2) NULL,
	[AuxclhorASCC] [numeric](10, 2) NULL,
	[Operssannum] [numeric](10, 0) NULL,
	[Opersancoste] [numeric](10, 2) NULL,
	[OpersanhorASCP] [numeric](10, 2) NULL,
	[OpersanhorASCC] [numeric](10, 2) NULL,
	[TPrevSnum] [numeric](10, 0) NULL,
	[TPrevScoste] [numeric](10, 2) NULL,
	[TPrevShorPSS] [numeric](10, 2) NULL,
	[TPrevMnum] [numeric](10, 0) NULL,
	[TPrevMcoste] [numeric](10, 2) NULL,
	[TPrevMhorPSS] [numeric](10, 0) NULL,
	[TPrevBnum] [numeric](10, 0) NULL,
	[TPrevBcoste] [numeric](10, 2) NULL,
	[TPrevBhorPSS] [numeric](10, 0) NULL,
	[Directcentro(nomed)num] [numeric](10, 2) NULL,
	[Directcentro(nomed)coste] [numeric](10, 2) NULL,
	[Dircentro(nomed)horAG] [numeric](10, 2) NULL,
	[PeradnoAGnum] [numeric](10, 0) NULL,
	[PeradnoAGcoste] [numeric](10, 2) NULL,
	[PeradnoAGhorASCP] [numeric](10, 2) NULL,
	[PeradnoAGhorASCC] [numeric](10, 2) NULL,
	[PeradnoAGhorCIT] [numeric](10, 2) NULL,
	[PeradnoAGhorPSS] [numeric](10, 2) NULL,
	[PeradAGnum] [numeric](10, 0) NULL,
	[PeradAGcoste] [numeric](10, 2) NULL,
	[PeradAGhorCIT] [numeric](10, 0) NULL,
	[PeradAGhorAG] [numeric](10, 2) NULL,
	[PeradcompAGnum] [numeric](10, 0) NULL,
	[PeradcompAGcoste] [numeric](10, 2) NULL,
	[PeradcompAGhorASCP] [numeric](10, 2) NULL,
	[PeradcompAGhorASCC] [numeric](10, 2) NULL,
	[PeradcompAGhorCIT] [numeric](10, 2) NULL,
	[PeradcompAGhorPSS] [numeric](10, 2) NULL,
	[PeradcompAGhorAG] [numeric](10, 2) NULL,
	[Opersnosantitnum] [numeric](10, 0) NULL,
	[Opersnosantitcoste] [numeric](10, 2) NULL,
	[OpersnosantithorASCP] [numeric](10, 2) NULL,
	[OpersnosantithorASCC] [numeric](10, 2) NULL,
	[OpersnosantithorCIT] [numeric](10, 2) NULL,
	[OpersnosantithorPSS] [numeric](10, 2) NULL,
	[OpersnosantithorAG] [numeric](10, 2) NULL,
	[Opersnosannotitnum] [numeric](10, 0) NULL,
	[Opersnosannotitcoste] [numeric](10, 2) NULL,
	[OpersnosannotithorASCP] [numeric](10, 2) NULL,
	[OpersnosannotithorASCC] [numeric](10, 2) NULL,
	[OpersnosannotithorCIT] [numeric](10, 2) NULL,
	[OpersnosannotithorPSS] [numeric](10, 2) NULL,
	[OpersnosannotithorAG] [numeric](10, 2) NULL,
	[Medactmednum] [numeric](10, 2) NULL,
	[Medactmedcoste] [numeric](10, 2) NULL,
	[GasbienescysASCP] [numeric](10, 2) NULL,
	[GasbienescysASCC] [numeric](10, 2) NULL,
	[GasbienescysCIT] [numeric](10, 2) NULL,
	[GasbienescysPSS] [numeric](10, 2) NULL,
	[GasbienescysAG] [numeric](10, 2) NULL,
	[AmortizASCP] [numeric](10, 2) NULL,
	[AmortizASCC] [numeric](10, 2) NULL,
	[AmortizCIT] [numeric](10, 2) NULL,
	[AmortizPSS] [numeric](10, 2) NULL,
	[AmortizAG] [numeric](10, 2) NULL,
	[Inversnue] [numeric](10, 2) NULL,
	[Inversrep] [numeric](10, 2) NULL,
	[Factejerc] [numeric](10, 2) NULL,
	[Factpendcobro] [numeric](10, 2) NULL,
	[Otras Observac] [nvarchar](max) NULL,
	[NumPersAtendTotalTraMut] [numeric](10, 2) NULL,
	[Fechaciere] [datetime] NULL,
	[Sesrehabtrmut] [nvarchar](max) NULL,
	[Factejercresto] [numeric](10, 2) NULL,
	[Factejercsist] [numeric](10, 2) NULL,
	[FactejerotrmutuasCC] [numeric](10, 2) NULL,
	[Inversnue2] [numeric](10, 2) NULL,
	[Inversrep2] [numeric](10, 2) NULL,
	[InversionesNuevas] [numeric](10, 2) NULL,
	[InversionesReposicion] [numeric](10, 2) NULL,
	[Validado] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioAlta_id] [int] NULL,
	[UsuarioModificacion_id] [int] NULL,
	[Horas_Medico_Descuento] [decimal](18, 2) NULL,
	[Observaciones] [nvarchar](max) NULL,
	[Directcentronum] [numeric](10, 0) NULL,
	[Directcentrocoste] [numeric](10, 2) NULL,
	[DircentrohorASCP] [numeric](10, 0) NULL,
	[DircentrohorASCC] [numeric](10, 0) NULL,
	[DircentrohorCIT] [numeric](10, 0) NULL,
	[DircentrohorPSS] [numeric](10, 0) NULL,
	[DircentrohorAG] [numeric](10, 0) NULL,
	[Dircentroperssust] [numeric](10, 0) NULL,
	[Dircentrogastsust] [numeric](10, 2) NULL,
	[Perssanit(art6)perssust] [numeric](10, 0) NULL,
	[Perssanit(art6)gastsust] [numeric](10, 0) NULL,
	[Restperssanit(art6)num] [numeric](10, 0) NULL,
	[Restperssanit(art6)coste] [numeric](10, 0) NULL,
	[Restperssanit(art6)horASCP] [numeric](10, 0) NULL,
	[Restperssanit(art6)horASCC] [numeric](10, 0) NULL,
	[Restperssanit(art6)horCIT] [numeric](10, 0) NULL,
	[Restperssanit(art6)horPSS] [numeric](10, 0) NULL,
	[Restperssanit(art6)horAG] [numeric](10, 0) NULL,
	[Restperssanit(art6)perssust] [numeric](10, 0) NULL,
	[Restperssanit(art6)gastsust] [numeric](10, 2) NULL,
	[Restperssanit(art6)horassust] [numeric](10, 2) NULL,
	[Perssanit(art7)num] [numeric](10, 0) NULL,
	[Perssanit(art7)coste] [numeric](10, 2) NULL,
	[Perssanit(art7)horASCP] [numeric](10, 0) NULL,
	[Perssanit(art7)horASCC] [numeric](10, 0) NULL,
	[Perssanit(art7)horCIT] [numeric](10, 0) NULL,
	[Perssanit(art7)horPSS] [numeric](10, 0) NULL,
	[Perssanit(art7)horAG] [numeric](10, 0) NULL,
	[Perssanit(art7)perssust] [numeric](10, 0) NULL,
	[Perssanit(art7)gastsust] [numeric](10, 2) NULL,
	[Perssanit(GradSup)num] [numeric](10, 0) NULL,
	[Perssanit(GradSup)coste] [numeric](10, 2) NULL,
	[Perssanit(GradSup)horASCP] [numeric](10, 0) NULL,
	[Perssanit(GradSup)horASCC] [numeric](10, 0) NULL,
	[Perssanit(GradSup)horCIT] [numeric](10, 0) NULL,
	[Perssanit(GradSup)horPSS] [numeric](10, 0) NULL,
	[Perssanit(GradSup)horAG] [numeric](10, 0) NULL,
	[Perssanit(GradSup)perssust] [numeric](10, 0) NULL,
	[Perssanit(GradSup)gastsust] [numeric](10, 2) NULL,
	[Perssanit(GradMed)num] [numeric](10, 0) NULL,
	[Perssanit(GradMed)coste] [numeric](10, 2) NULL,
	[Perssanit(GradMed)horASCP] [numeric](10, 0) NULL,
	[Perssanit(GradMed)horASCC] [numeric](10, 0) NULL,
	[Perssanit(GradMed)horCIT] [numeric](10, 0) NULL,
	[Perssanit(GradMed)horPSS] [numeric](10, 0) NULL,
	[Perssanit(GradMed)horAG] [numeric](10, 0) NULL,
	[Perssanit(GradMed)perssust] [numeric](10, 0) NULL,
	[Perssanit(GradMed)gastsust] [numeric](10, 2) NULL,
	[RestoPers(Admin)num] [numeric](10, 0) NULL,
	[RestoPers(Admin)coste] [numeric](10, 2) NULL,
	[RestoPers(Admin)horASCP] [numeric](10, 0) NULL,
	[RestoPers(Admin)horASCC] [numeric](10, 0) NULL,
	[RestoPers(Admin)horCIT] [numeric](10, 0) NULL,
	[RestoPers(Admin)horPSS] [numeric](10, 0) NULL,
	[RestoPers(Admin)horAG] [numeric](10, 0) NULL,
	[RestoPers(Admin)perssust] [numeric](10, 0) NULL,
	[RestoPers(Admin)gastsust] [numeric](10, 2) NULL,
	[RestoPers(NoAdmin)num] [numeric](10, 0) NULL,
	[RestoPers(NoAdmin)coste] [numeric](10, 2) NULL,
	[RestoPers(NoAdmin)horASCP] [numeric](10, 0) NULL,
	[RestoPers(NoAdmin)horASCC] [numeric](10, 0) NULL,
	[RestoPers(NoAdmin)horCIT] [numeric](10, 0) NULL,
	[RestoPers(NoAdmin)horPSS] [numeric](10, 0) NULL,
	[RestoPers(NoAdmin)horAG] [numeric](10, 0) NULL,
	[RestoPers(NoAdmin)perssust] [numeric](10, 0) NULL,
	[RestoPers(NoAdmin)gastsust] [numeric](10, 2) NULL,
	[PrimCons(ProgVideo)25km] [nvarchar](max) NULL,
	[PrimCons(ProgVideo)50km] [nvarchar](max) NULL,
	[PrimCons(ProgVideo)+50km] [nvarchar](max) NULL,
	[PrimCons(NoProg)25km] [numeric](10, 0) NULL,
	[PrimCons(NoProg)50km] [numeric](10, 0) NULL,
	[PrimCons(NoProg)+50km] [numeric](10, 0) NULL,
	[PrimCons(NoProgVideo)25km] [numeric](10, 0) NULL,
	[PrimCons(NoProgVideo)50km] [numeric](10, 0) NULL,
	[PrimCons(NoProgVideo)+50km] [numeric](10, 0) NULL,
	[Conssuc25km(Video)] [nvarchar](max) NULL,
	[Conssuc50km(Video)] [nvarchar](max) NULL,
	[Conssuc+50km(Video)] [nvarchar](max) NULL,
	[ConsEnftrmut] [numeric](10, 0) NULL,
	[Pradtrmut(RM)] [numeric](10, 0) NULL,
	[Pradtrmut(Eco)] [numeric](10, 0) NULL,
	[Pradtrmut(TAC)] [numeric](10, 0) NULL,
	[PruBiomtrmut] [numeric](10, 0) NULL,
	[PrimConsArt82(ProgVideo)] [numeric](10, 0) NULL,
	[PrimConsArt82(NoProg)] [numeric](10, 0) NULL,
	[PrimConsArt82(NoProgVideo)] [numeric](10, 0) NULL,
	[ConssucArt82] [numeric](10, 0) NULL,
	[ConssucArt82(Video)] [numeric](10, 0) NULL,
	[ConsEnfArt82] [numeric](10, 0) NULL,
	[PradArt82(RM)] [numeric](10, 0) NULL,
	[PradArt82(Eco)] [numeric](10, 0) NULL,
	[PradArt82(TAC)] [numeric](10, 0) NULL,
	[PruBiomArt82] [numeric](10, 0) NULL,
	[PrimConsotmutArt12(ProgVideo)] [numeric](10, 0) NULL,
	[PrimConentgyAPArt12(ProgVideo)] [numeric](10, 0) NULL,
	[PrimConotrosArt12(ProgVideo)] [numeric](10, 0) NULL,
	[PrimConotmutArt12(NoProg)] [numeric](10, 0) NULL,
	[PrimConentgyAPArt12(NoProg)] [numeric](10, 0) NULL,
	[PrimConotrosArt12(NoProg)] [numeric](10, 0) NULL,
	[PrimConotmutArt12(NoProgVideo)] [numeric](10, 0) NULL,
	[PrimConentgyAPArt12(NoProgVideo)] [numeric](10, 0) NULL,
	[PrimConotrosArt12(NoProgVideo)] [numeric](10, 0) NULL,
	[ConsEnfotmutArt12] [numeric](10, 0) NULL,
	[ConsEnfentgyAPArt12] [numeric](10, 0) NULL,
	[ConsEnfotrosArt12] [numeric](10, 0) NULL,
	[PradotmutArt12(RM)] [numeric](10, 0) NULL,
	[PradentgyAPArt12(RM)] [numeric](10, 0) NULL,
	[PradotrosArt12(RM)] [numeric](10, 0) NULL,
	[PradotmutArt12(Eco)] [numeric](10, 0) NULL,
	[PradentgyAPArt12(Eco)] [numeric](10, 0) NULL,
	[PradotrosArt12(Eco)] [numeric](10, 0) NULL,
	[PradotmutArt12(TAC)] [numeric](10, 0) NULL,
	[PradentgyAPArt12(TAC)] [numeric](10, 0) NULL,
	[PradotrosArt12(TAC)] [numeric](10, 0) NULL,
	[PruBiomotmutArt12] [numeric](10, 0) NULL,
	[PruBiomentgyAPArt12] [numeric](10, 0) NULL,
	[PruBiomotrosArt12] [numeric](10, 0) NULL,
	[PrimConsnoapant(ProgVideo)] [numeric](10, 0) NULL,
	[PrimConsnoapant(NoProg)] [numeric](10, 0) NULL,
	[PrimConsnoapant(NoProgVideo)] [numeric](10, 0) NULL,
	[Conssucnoapant(Video)] [numeric](10, 0) NULL,
	[ConsEnfnoapant] [numeric](10, 0) NULL,
	[Pradnoapant(RM)] [numeric](10, 0) NULL,
	[Pradnoapant(Eco)] [numeric](10, 0) NULL,
	[Pradnoapant(TAC)] [numeric](10, 0) NULL,
	[PruBiomnoapant] [numeric](10, 0) NULL,
	[PAcenConvSectBilMult] [numeric](10, 0) NULL,
	[PrimConsConvSectBilMult(Prog)] [numeric](10, 0) NULL,
	[PrimConsConvSectBilMult(ProgVideo)] [numeric](10, 0) NULL,
	[PrimConsConvSectBilMult(NoProg)] [numeric](10, 0) NULL,
	[PrimConsConvSectBilMult(NoProgVideo)] [numeric](10, 0) NULL,
	[ConssucConvSectBilMult] [numeric](10, 0) NULL,
	[ConssucConvSectBilMult(Video)] [numeric](10, 0) NULL,
	[SesrehabConvSectBilMult] [numeric](10, 0) NULL,
	[ConsEnfConvSectBilMult] [numeric](10, 0) NULL,
	[PradConvSectBilMult(RM)] [numeric](10, 0) NULL,
	[PradConvSectBilMult(Eco)] [numeric](10, 0) NULL,
	[PradConvSectBilMult(TAC)] [numeric](10, 0) NULL,
	[PradConvSectBilMult(Radio)] [numeric](10, 0) NULL,
	[IquircenConvSectBilMult] [numeric](10, 0) NULL,
	[OppractConvSectBilMult] [numeric](10, 0) NULL,
	[PruBiomConvSectBilMult] [numeric](10, 0) NULL,
	[PrimConsHOS(Prog)] [numeric](10, 0) NULL,
	[PrimConsHOS(ProgVideo)] [numeric](10, 0) NULL,
	[PrimConsHOS(NoProg)] [numeric](10, 0) NULL,
	[PrimConsHOS(NoProgVideo)] [numeric](10, 0) NULL,
	[ConssucHOS] [numeric](10, 0) NULL,
	[ConssucHOS(Video)] [numeric](10, 0) NULL,
	[ConsEnfHOS] [numeric](10, 0) NULL,
	[PradtrmutHOS(RM)] [numeric](10, 0) NULL,
	[PradtrmutHOS(Eco)] [numeric](10, 0) NULL,
	[PradtrmutHOS(TAC)] [numeric](10, 0) NULL,
	[PruBiomHOS] [numeric](10, 0) NULL,
	[PrimConsArt82HOS(Prog)] [numeric](10, 0) NULL,
	[PrimConsArt82HOS(ProgVideo)] [numeric](10, 0) NULL,
	[PrimConsArt82HOS(NoProg)] [numeric](10, 0) NULL,
	[PrimConsArt82HOS(NoProgVideo)] [numeric](10, 0) NULL,
	[ConssucArt82HOS] [numeric](10, 0) NULL,
	[ConssucArt82HOS(Video)] [numeric](10, 0) NULL,
	[ConsEnfArt82HOS] [numeric](10, 0) NULL,
	[PrmydtrmutArt82HOS(RM)] [numeric](10, 0) NULL,
	[PrmydtrmutArt82HOS(Eco)] [numeric](10, 0) NULL,
	[PrmydtrmutArt82HOS(TAC)] [numeric](10, 0) NULL,
	[PrmydtrmutArt82HOS(Radio)] [numeric](10, 0) NULL,
	[PrueBiomArt82HOS] [numeric](10, 0) NULL,
	[PAUrgNoIngrArt82(HOS)] [numeric](10, 0) NULL,
	[PrimConsotrmutArt12HOS(Prog)] [numeric](10, 0) NULL,
	[PrimConsEGYAPArt12HOS(Prog)] [numeric](10, 0) NULL,
	[PrimConsotrosArt12HOS(Prog)] [numeric](10, 0) NULL,
	[PrimConsotrmutArt12HOS(ProgVideo)] [numeric](10, 0) NULL,
	[PrimConsEGYAPArt12HOS(ProgVideo)] [numeric](10, 0) NULL,
	[PrimConsotrosArt12HOS(ProgVideo)] [numeric](10, 0) NULL,
	[PrimConsotrmutArt12HOS(NoProg)] [numeric](10, 0) NULL,
	[PrimConsEGYAPArt12HOS(NoProg)] [numeric](10, 0) NULL,
	[PrimConsotrosArt12HOS(NoProg)] [numeric](10, 0) NULL,
	[PrimConsotrmutArt12HOS(NoProgVideo)] [numeric](10, 0) NULL,
	[PrimConsEGYAPArt12HOS(NoProgVideo)] [numeric](10, 0) NULL,
	[PrimConsotrosArt12HOS(NoProgVideo)] [numeric](10, 0) NULL,
	[ConssucotrmutArt12HOS] [numeric](10, 0) NULL,
	[ConssucEGYAPArt12HOS] [numeric](10, 0) NULL,
	[ConssucotrosArt12HOS] [numeric](10, 0) NULL,
	[ConssucotrmutArt12HOS(Video)] [numeric](10, 0) NULL,
	[ConssucEGYAPArt12HOS(Video)] [numeric](10, 0) NULL,
	[ConssucotrosArt12HOS(Video)] [numeric](10, 0) NULL,
	[ConsEnfotrmutArt12HOS] [numeric](10, 0) NULL,
	[ConsEnfEGYAPArt12HOS] [numeric](10, 0) NULL,
	[ConsEnfotrosArt12HOS] [numeric](10, 0) NULL,
	[PradotrmutArt12HOS(RM)] [numeric](10, 0) NULL,
	[PradEGYAPArt12HOS(RM)] [numeric](10, 0) NULL,
	[PradotrosArt12HOS(RM)] [numeric](10, 0) NULL,
	[PradotrmutArt12HOS(Eco)] [numeric](10, 0) NULL,
	[PradEGYAPArt12HOS(Eco)] [numeric](10, 0) NULL,
	[PradotrosArt12HOS(Eco)] [numeric](10, 0) NULL,
	[PradotrmutArt12HOS(TAC)] [numeric](10, 0) NULL,
	[PradEGYAPArt12HOS(TAC)] [numeric](10, 0) NULL,
	[PradotrosArt12HOS(TAC)] [numeric](10, 0) NULL,
	[PruBiomotrmutArt12HOS] [numeric](10, 0) NULL,
	[PruBiomEGYAPArt12HOS] [numeric](10, 0) NULL,
	[PruBiomotrosArt12HOS] [numeric](10, 0) NULL,
	[PrimConsotrnoapant(Prog)] [numeric](10, 0) NULL,
	[PrimConsotrnoapant(ProgVideo)] [numeric](10, 0) NULL,
	[PrimConsotrnoapant(NoProg)] [numeric](10, 0) NULL,
	[PrimConsotrnoapant(NoProgVideo)] [numeric](10, 0) NULL,
	[Conssucotrnoapant] [numeric](10, 0) NULL,
	[Conssucotrnoapant(Video)] [numeric](10, 0) NULL,
	[ConsEnfnoapantHOS] [numeric](10, 0) NULL,
	[PradnoapantHOS(RM)] [numeric](10, 0) NULL,
	[PradnoapantHOS(Eco)] [numeric](10, 0) NULL,
	[PradnoapantHOS(TAC)] [numeric](10, 0) NULL,
	[PruBiomnoapantHOS] [numeric](10, 0) NULL,
	[PItrmutConvSecBilMultHOS] [numeric](10, 0) NULL,
	[EsttrmutConvSecBilMultHOS] [numeric](10, 0) NULL,
	[PrimConsConvSecBilMultHOS(Prog)] [numeric](10, 0) NULL,
	[PrimConsConvSecBilMultHOS(ProgVideo)] [numeric](10, 0) NULL,
	[PrimConsConvSecBilMultHOS(NoProg)] [numeric](10, 0) NULL,
	[PrimConsConvSecBilMultHOS(NoProgVideo)] [numeric](10, 0) NULL,
	[ConssucConvSecBilMultHOS] [numeric](10, 0) NULL,
	[ConssucConvSecBilMultHOS(Video)] [numeric](10, 0) NULL,
	[SrehabtrmutConvSecBilMultHOS] [numeric](10, 0) NULL,
	[ConsEnfConvSecBilMultHOS] [numeric](10, 0) NULL,
	[PrmydtrmutConvSecBilMultHOS(RM)] [numeric](10, 0) NULL,
	[PrmydtrmutConvSecBilMultHOS(Eco)] [numeric](10, 0) NULL,
	[PrmydtrmutConvSecBilMultHOS(TAC)] [numeric](10, 0) NULL,
	[PrmydtrmutConvSecBilMultHOS(Radio)] [numeric](10, 0) NULL,
	[IquirtrmutConvSecBilMultHOS] [numeric](10, 0) NULL,
	[OpptrmutConvSecBilMultHOS] [numeric](10, 0) NULL,
	[PrueBiomConvSecBilMultHOS] [numeric](10, 0) NULL,
	[PAUrgNoIngrConvSecBilMult(HOS)] [numeric](10, 0) NULL,
	[HorarioA] [nvarchar](max) NULL,
	[HorarioDe] [nvarchar](max) NULL,
	[TipoHorario] [int] NULL,
	[Perssanit(art6)num] [numeric](10, 0) NULL,
	[Perssanit(art6)coste] [numeric](10, 0) NULL,
	[Perssanit(art6)horASCP] [numeric](10, 0) NULL,
	[Perssanit(art6)horASCC] [numeric](10, 0) NULL,
	[Perssanit(art6)horCIT] [numeric](10, 0) NULL,
	[Perssanit(art6)horPSS] [numeric](10, 0) NULL,
	[Perssanit(art6)horAG] [numeric](10, 0) NULL,
	[FactejerotrmutuasCP] [numeric](10, 2) NULL,
	[ConssucotmutArt12(Video)] [numeric](10, 0) NULL,
	[ConssucentgyAPArt12(Video)] [numeric](10, 0) NULL,
	[ConssucotrosArt12(Video)] [numeric](10, 0) NULL,
	[MutuaActosQuirurgicas] [numeric](10, 0) NULL,
	[MutuaActosPracticadas] [numeric](10, 0) NULL,
	[PersSanitMedArt6NumPers] [numeric](10, 2) NULL,
	[PersSanitMedArt6GastPers] [numeric](10, 2) NULL,
	[PersSanitMedArt6HorasCP] [numeric](10, 2) NULL,
	[PersSanitMedArt6HorasCC] [numeric](10, 2) NULL,
	[PersSanitMedArt6HorasIT] [numeric](10, 2) NULL,
	[PersSanitMedArt6HorasATEP] [numeric](10, 2) NULL,
	[PersSanitMedArt6HorasAGM] [numeric](10, 2) NULL,
	[PersSanitMedArt6NumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedArt6GastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedArt6HorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6NumPers] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6GastPers] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6HorasCP] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6HorasCC] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6HorasIT] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6HorasATEP] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6HorasAGM] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6NumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6GastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6HorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6NumPers] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6GastPers] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6HorasCP] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6HorasCC] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6HorasIT] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6HorasATEP] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6HorasAGM] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6NumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6GastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6HorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7DUENumPers] [numeric](10, 2) NULL,
	[PersSanitArt7DUEGastPers] [numeric](10, 2) NULL,
	[PersSanitArt7DUEHorasCP] [numeric](10, 2) NULL,
	[PersSanitArt7DUEHorasCC] [numeric](10, 2) NULL,
	[PersSanitArt7DUEHorasIT] [numeric](10, 2) NULL,
	[PersSanitArt7DUEHorasATEP] [numeric](10, 2) NULL,
	[PersSanitArt7DUEHorasAGM] [numeric](10, 2) NULL,
	[PersSanitArt7DUENumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7DUEGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7DUEHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7FisNumPers] [numeric](10, 2) NULL,
	[PersSanitArt7FisGastPers] [numeric](10, 2) NULL,
	[PersSanitArt7FisHorasCP] [numeric](10, 2) NULL,
	[PersSanitArt7FisHorasCC] [numeric](10, 2) NULL,
	[PersSanitArt7FisHorasIT] [numeric](10, 2) NULL,
	[PersSanitArt7FisHorasATEP] [numeric](10, 2) NULL,
	[PersSanitArt7FisHorasAGM] [numeric](10, 2) NULL,
	[PersSanitArt7FisNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7FisGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7FisHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoNumPers] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoGastPers] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoHorasCP] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoHorasCC] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoHorasIT] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoHorasATEP] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoHorasAGM] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocNumPers] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocGastPers] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocHorasCP] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocHorasCC] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocHorasIT] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocHorasATEP] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocHorasAGM] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuNumPers] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuGastPers] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuHorasCP] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuHorasCC] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuHorasIT] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuHorasATEP] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuHorasAGM] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXNumPers] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXGastPers] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXHorasCP] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXHorasCC] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXHorasIT] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXHorasATEP] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXHorasAGM] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7RestNumPers] [numeric](10, 2) NULL,
	[PersSanitArt7RestGastPers] [numeric](10, 2) NULL,
	[PersSanitArt7RestHorasCP] [numeric](10, 2) NULL,
	[PersSanitArt7RestHorasCC] [numeric](10, 2) NULL,
	[PersSanitArt7RestHorasIT] [numeric](10, 2) NULL,
	[PersSanitArt7RestHorasATEP] [numeric](10, 2) NULL,
	[PersSanitArt7RestHorasAGM] [numeric](10, 2) NULL,
	[PersSanitArt7RestNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7RestGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7RestHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradSupNumPers] [numeric](10, 2) NULL,
	[PersSanitGradSupGastPers] [numeric](10, 2) NULL,
	[PersSanitGradSupHorasCP] [numeric](10, 2) NULL,
	[PersSanitGradSupHorasCC] [numeric](10, 2) NULL,
	[PersSanitGradSupHorasIT] [numeric](10, 2) NULL,
	[PersSanitGradSupHorasATEP] [numeric](10, 2) NULL,
	[PersSanitGradSupHorasAGM] [numeric](10, 2) NULL,
	[PersSanitGradSupNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradSupGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradSupHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfNumPers] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfGastPers] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfHorasCP] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfHorasCC] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfHorasIT] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfHorasATEP] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfHorasAGM] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradMedRestNumPers] [numeric](10, 2) NULL,
	[PersSanitGradMedRestGastPers] [numeric](10, 2) NULL,
	[PersSanitGradMedRestHorasCP] [numeric](10, 2) NULL,
	[PersSanitGradMedRestHorasCC] [numeric](10, 2) NULL,
	[PersSanitGradMedRestHorasIT] [numeric](10, 2) NULL,
	[PersSanitGradMedRestHorasATEP] [numeric](10, 2) NULL,
	[PersSanitGradMedRestHorasAGM] [numeric](10, 2) NULL,
	[PersSanitGradMedRestNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradMedRestGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradMedRestHorasPersSustInt] [numeric](10, 2) NULL,
	[RestPersSanitNumPers] [numeric](10, 2) NULL,
	[RestPersSanitGastPers] [numeric](10, 2) NULL,
	[RestPersSanitHorasCP] [numeric](10, 2) NULL,
	[RestPersSanitHorasCC] [numeric](10, 2) NULL,
	[RestPersSanitHorasIT] [numeric](10, 2) NULL,
	[RestPersSanitHorasATEP] [numeric](10, 2) NULL,
	[RestPersSanitHorasAGM] [numeric](10, 2) NULL,
	[RestPersSanitNumPersSustInt] [numeric](10, 2) NULL,
	[RestPersSanitGastPersSustInt] [numeric](10, 2) NULL,
	[RestPersSanitHorasPersSustInt] [numeric](10, 2) NULL,
	[PersDirCenNumPers] [numeric](10, 2) NULL,
	[PersDirCenGastPers] [numeric](10, 2) NULL,
	[PersDirCenHorasCP] [numeric](10, 2) NULL,
	[PersDirCenHorasCC] [numeric](10, 2) NULL,
	[PersDirCenHorasIT] [numeric](10, 2) NULL,
	[PersDirCenHorasATEP] [numeric](10, 2) NULL,
	[PersDirCenHorasAGM] [numeric](10, 2) NULL,
	[PersDirCenNumPersSustInt] [numeric](10, 2) NULL,
	[PersDirCenGastPersSustInt] [numeric](10, 2) NULL,
	[PersDirCenHorasPersSustInt] [numeric](10, 2) NULL,
	[PersAdminNumPers] [numeric](10, 2) NULL,
	[PersAdminGastPers] [numeric](10, 2) NULL,
	[PersAdminHorasCP] [numeric](10, 2) NULL,
	[PersAdminHorasCC] [numeric](10, 2) NULL,
	[PersAdminHorasIT] [numeric](10, 2) NULL,
	[PersAdminHorasATEP] [numeric](10, 2) NULL,
	[PersAdminHorasAGM] [numeric](10, 2) NULL,
	[PersAdminNumPersSustInt] [numeric](10, 2) NULL,
	[PersAdminGastPersSustInt] [numeric](10, 2) NULL,
	[PersAdminHorasPersSustInt] [numeric](10, 2) NULL,
	[PersTecPreNumPers] [numeric](10, 2) NULL,
	[PersTecPreGastPers] [numeric](10, 2) NULL,
	[PersTecPreHorasCP] [numeric](10, 2) NULL,
	[PersTecPreHorasCC] [numeric](10, 2) NULL,
	[PersTecPreHorasIT] [numeric](10, 2) NULL,
	[PersTecPreHorasATEP] [numeric](10, 2) NULL,
	[PersTecPreHorasAGM] [numeric](10, 2) NULL,
	[PersTecPreNumPersSustInt] [numeric](10, 2) NULL,
	[PersTecPreGastPersSustInt] [numeric](10, 2) NULL,
	[PersTecPreHorasPersSustInt] [numeric](10, 2) NULL,
	[PersNoAdminNumPers] [numeric](10, 2) NULL,
	[PersNoAdminGastPers] [numeric](10, 2) NULL,
	[PersNoAdminHorasCP] [numeric](10, 2) NULL,
	[PersNoAdminHorasCC] [numeric](10, 2) NULL,
	[PersNoAdminHorasIT] [numeric](10, 2) NULL,
	[PersNoAdminHorasATEP] [numeric](10, 2) NULL,
	[PersNoAdminHorasAGM] [numeric](10, 2) NULL,
	[PersNoAdminNumPersSustInt] [numeric](10, 2) NULL,
	[PersNoAdminGastPersSustInt] [numeric](10, 2) NULL,
	[PersNoAdminHorasPersSustInt] [numeric](10, 2) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  View [dbo].[vw_Propios_Validados]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


create view [dbo].[vw_Propios_Validados]  as 
SELECT     dbo.ICG06.Año, dbo.CentrosPropios.Mutua_id, COUNT(dbo.ICG06.Centro_id) AS Centro_id
FROM         dbo.ICG06 INNER JOIN
                      dbo.CentrosPropios ON dbo.ICG06.Centro_id = dbo.CentrosPropios.Centro_id
WHERE     (dbo.ICG06.Validado = 1) 
GROUP BY dbo.CentrosPropios.Mutua_id, dbo.ICG06.Año
GO
/****** Object:  Table [dbo].[CentrosPropiosEspecialidades]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CentrosPropiosEspecialidades')
BEGIN
CREATE TABLE [dbo].[CentrosPropiosEspecialidades](
	[CentroPropioEspecialidad_id] [int] IDENTITY(7975,1) NOT NULL,
	[Centro_id] [int] NOT NULL,
	[Año] [int] NOT NULL,
	[Especialidad_id] [int] NOT NULL,
	[Servicio] [nvarchar](150) NOT NULL,
	[Cantidad] [int] NULL,
	[ImporteConIVA] [float] NULL,
	[Servicio_id] [bigint] NULL,
	[FechaAlta] [datetime] NULL,
	[FechaBaja] [datetime] NULL,
	[Disponibilidad] [int] NULL,
	[Plazo] [int] NULL,
	[ActualizarDisponibilidad] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[FechaActualizarDisponibilidad] [datetime] NULL,
	[FechaGeneracionAcreditacion] [datetime] NULL,
 CONSTRAINT [PK_CentrosPropiosEspecialidades_1] PRIMARY KEY CLUSTERED 
(
	[CentroPropioEspecialidad_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  View [dbo].[vw_DisponibilidadCentro]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create view [dbo].[vw_DisponibilidadCentro] as 
Select 
Año, Centro_id, Especialidad_id, Servicio_id, ActualizarDisponibilidad, FechaModificacion, FechaActualizarDisponibilidad, Enero,Febrero, Marzo, Abril, Mayo, Junio, Julio, Agosto, Septiembre, Octubre, Noviembre, Diciembre, Total from (
 SELECT Año, Centro_id, Especialidad_id, Servicio_id, ActualizarDisponibilidad, FechaModificacion, FechaActualizarDisponibilidad, 
 	isnull([1],0) as Enero, isnull([2],0) AS Febrero, isnull([3],0) as Marzo, isnull([4],0) as Abril, 
    isnull([5],0) AS Mayo, isnull([6],0) as Junio, isnull([7],0) as Julio, isnull([8],0) as Agosto, 
    isnull([9],0) as Septiembre, isnull([10],0) as Octubre, isnull([11],0) as Noviembre, isnull([12],0) as Diciembre, 
    isnull([1],0) + isnull([2],0) + isnull([3],0) + isnull([4],0) + 
    isnull([5],0) + isnull([6],0) + isnull([7],0) + isnull([8],0) + 
    isnull([9],0) + isnull([10],0) + isnull([11],0) + isnull([12],0) as Total 
    from (
            Select a.Cantidad, mes, a.Año, a.Centro_id, a.Servicio_id, a.Especialidad_id, b.ActualizarDisponibilidad, b.FechaModificacion, b.FechaActualizarDisponibilidad from DisponibilidadCentrosPropios a
			left join CentrosPropiosEspecialidades b on a.Centro_id=b.Centro_id and a.Especialidad_id=b.Especialidad_id and a.Servicio_id = b.Servicio_id and a.Año=b.Año  ) as tb1
         PIVOT
            (Sum(Cantidad)
            FOR Mes IN ([1],[2],[3],[4],[5],[6],[7],[8],[9],[10],[11],[12]) 
         ) as PivotTable
 ) as Disponibilidad 
GO
/****** Object:  View [dbo].[vw_Propios_NoValidados]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER VIEW [dbo].[vw_Propios_NoValidados] AS
SELECT     dbo.ICG06.Año, dbo.CentrosPropios.Mutua_id, COUNT(dbo.ICG06.Centro_id) AS Centro_id
FROM         dbo.ICG06 INNER JOIN
                      dbo.CentrosPropios ON dbo.ICG06.Centro_id = dbo.CentrosPropios.Centro_id
WHERE     (dbo.ICG06.Validado = 0 OR
                      dbo.ICG06.Validado IS NULL) 
GROUP BY dbo.CentrosPropios.Mutua_id, dbo.ICG06.Año
GO
/****** Object:  Table [dbo].[Conciertos]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Conciertos')
BEGIN
CREATE TABLE [dbo].[Conciertos](
	[Concierto_id] [int] IDENTITY(49110,1) NOT NULL,
	[Mutua_id] [int] NOT NULL,
	[Centro_id] [int] NOT NULL,
	[CodigoCASA] [nvarchar](50) NULL,
	[CodigoMZ] [nvarchar](50) NULL,
	[CentroAsociado_id] [int] NULL,
	[Localizador] [nvarchar](50) NULL,
	[TipoAsistencia_id] [int] NULL,
	[AmbitoCobertura] [int] NULL,
	[Muniambito] [nvarchar](255) NULL,
	[Autorizado] [bit] NULL,
	[FechaAutorizacion] [datetime] NULL,
	[UsuarioAutorizacion_id] [int] NULL,
	[FechaSuscripcion] [datetime] NULL,
	[FechaResolucion] [datetime] NULL,
	[FechaVigencia] [datetime] NULL,
	[FechaProrroga] [datetime] NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioAlta_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificacion_id] [int] NULL,
	[FechaBaja] [datetime] NULL,
	[UsuarioBaja_id] [int] NULL,
	[Adhesion] [int] NULL,
	[ClaveAcces] [int] NULL,
 CONSTRAINT [PK_Conciertos_1] PRIMARY KEY CLUSTERED 
(
	[Concierto_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[ICG07]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ICG07')
BEGIN
CREATE TABLE [dbo].[ICG07](
	[Id_ICG] [int] IDENTITY(1,1) NOT NULL,
	[Año] [int] NOT NULL,
	[Concierto_id] [int] NOT NULL,
	[Especialid] [nvarchar](max) NULL,
	[Fautorizacion] [datetime] NULL,
	[Fsuscrip] [nvarchar](max) NULL,
	[Fresoluc] [nvarchar](max) NULL,
	[Fprorroga] [nvarchar](max) NULL,
	[FinVigencia] [nvarchar](max) NULL,
	[Muniambito] [nvarchar](max) NULL,
	[Costeassan] [numeric](10, 2) NULL,
	[CosteIT] [numeric](10, 2) NULL,
	[CostePRL] [nvarchar](max) NULL,
	[TipConciert] [int] NULL,
	[Provincia] [nvarchar](max) NULL,
	[Localid] [nvarchar](max) NULL,
	[CP] [nvarchar](max) NULL,
	[Ubicac] [nvarchar](max) NULL,
	[PAsinurg] [int] NULL,
	[PAurgencias] [int] NULL,
	[Pingresadas] [int] NULL,
	[ASAMprimconsProg] [int] NULL,
	[ASAMconssuc] [int] NULL,
	[ASAMsesrehab] [int] NULL,
	[ASAMplacrad(RADIO)] [int] NULL,
	[ASAMintquir] [int] NULL,
	[ASAMintquirmp] [int] NULL,
	[ASAMotrasprueb] [int] NULL,
	[ASHNprimconsProg] [int] NULL,
	[ASHNconssuc] [int] NULL,
	[ASHNestcaus] [int] NULL,
	[ASHNsesrehab] [int] NULL,
	[ASHNplacrad(RADIO)] [int] NULL,
	[ASHNintquir] [int] NULL,
	[ASHNintquirmp] [int] NULL,
	[ASHNotrasprueb] [int] NULL,
	[CITnºconsesp] [int] NULL,
	[CITnºsesrehab] [int] NULL,
	[CITnºintquir] [int] NULL,
	[CITnºotrpru] [int] NULL,
	[Dista25km] [int] NULL,
	[Dista25-50km] [int] NULL,
	[Masde50km] [int] NULL,
	[Persfisica] [int] NULL,
	[Persjurpriv] [int] NULL,
	[Persjursist] [int] NULL,
	[PersjurOSP] [int] NULL,
	[PersjurOmutua] [int] NULL,
	[Art2581] [numeric](10, 2) NULL,
	[Art2582] [numeric](10, 2) NULL,
	[RestoArticulo25SCon] [numeric](10, 2) NULL,
	[GastoCentroNoConcert] [numeric](10, 2) NULL,
	[Validado] [bit] NULL,
	[UsuarioAlta_id] [int] NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioModificacion_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[ICG07_2014] [int] NULL,
	[Agrupacion_id] [int] NULL,
	[ASAMprimconsProg(Video)] [int] NULL,
	[ASAMprimconsNoProg] [int] NULL,
	[ASAMprimconsNoProg(Video)] [int] NULL,
	[ASAMconssuc(Video)] [int] NULL,
	[ASAMconseenf] [int] NULL,
	[ASAMestcaus] [int] NULL,
	[ASAMplacrad(RM)] [int] NULL,
	[ASAMplacrad(Eco)] [int] NULL,
	[ASAMplacrad(TAC)] [int] NULL,
	[ASHNprimconsProg(video)] [int] NULL,
	[ASHNprimconsNoProg] [int] NULL,
	[ASHNprimconsNoProg(video)] [int] NULL,
	[ASHNconssuc(video)] [int] NULL,
	[ASHNplacrad(RM)] [int] NULL,
	[ASHNplacrad(Eco)] [int] NULL,
	[ASHNplacrad(TAC)] [int] NULL,
	[ASAMBiomec] [int] NULL,
	[ASHNBiomec] [int] NULL,
	[CITNIntervencionesQuirurjicas] [int] NULL,
	[CITNOtrasPruebasControl] [int] NULL,
	[ASHNConsultasEnfermeria] [int] NULL,
	[GastoTransporte] [float] NULL,
 CONSTRAINT [PK_ICG07_1] PRIMARY KEY CLUSTERED 
(
	[Id_ICG] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[CentrosConcertados]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CentrosConcertados')
BEGIN
CREATE TABLE [dbo].[CentrosConcertados](
	[Centro_id] [int] IDENTITY(89809,1) NOT NULL,
	[Centro] [nvarchar](150) NULL,
	[Validado] [bit] NULL,
	[Localizador] [nvarchar](50) NULL,
	[Proveedor_id] [int] NULL,
	[Delegacion_id] [int] NULL,
	[CIFNIF] [char](15) NULL,
	[Direccion] [varchar](100) NULL,
	[Numero] [nvarchar](50) NULL,
	[DireccionGIS] [varchar](100) NULL,
	[Poblacion_id] [int] NULL,
	[CP] [char](5) NULL,
	[Telefono] [char](15) NULL,
	[Fax] [char](15) NULL,
	[DireccionElectronica] [varchar](100) NULL,
	[PersonaContacto] [varchar](100) NULL,
	[ServiciosEspeciales] [int] NULL,
	[AsistenciaHospitalaria] [bit] NULL,
	[AsistenciaAmbulatoria] [bit] NULL,
	[Rehabilitacion] [bit] NULL,
	[IncapacidadTransitoria] [bit] NULL,
	[Prevencion] [bit] NULL,
	[Administracion] [bit] NULL,
	[OtrasActividades] [bit] NULL,
	[AsistenciaSanitaria] [bit] NULL,
	[MediosAjenos] [bit] NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioAlta_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificacion_id] [int] NULL,
	[FechaBaja] [datetime] NULL,
	[UsuarioBaja_id] [int] NULL,
	[MotivoBaja] [nvarchar](500) NULL,
	[TipoCentro] [int] NULL,
	[TipoCentroAnt] [int] NULL,
	[Observaciones] [varchar](500) NULL,
	[TipoVia_id] [nvarchar](10) NULL,
	[Piso] [nvarchar](15) NULL,
	[Puerta] [nvarchar](15) NULL,
	[OtrosDatos] [nvarchar](255) NULL,
	[Traslado] [bit] NULL,
	[Centro_idNuevo] [int] NULL,
	[Fautocom] [datetime] NULL,
	[Fpufuncio] [datetime] NULL,
	[Fcalisuf] [datetime] NULL,
	[FechaCarga] [datetime] NULL,
	[MapaValidado] [bit] NULL,
	[Latitud] [nvarchar](50) NULL,
	[Longitud] [nvarchar](50) NULL,
	[CodigoMZ] [nvarchar](50) NULL,
	[id_ICG072013] [int] NULL,
	[CIFNIFValido] [bit] NULL,
	[NumRegistroSanitario] [bigint] NULL,
 CONSTRAINT [PK_CentrosConcertados] PRIMARY KEY CLUSTERED 
(
	[Centro_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  View [dbo].[vw_Concertados_Validados]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER VIEW [dbo].[vw_Concertados_Validados] AS
SELECT     dbo.ICG07.Año, dbo.Conciertos.Concierto_id, dbo.Conciertos.Mutua_id, COUNT(dbo.Conciertos.Centro_id) AS Centro_id
FROM         dbo.Conciertos INNER JOIN
                      dbo.CentrosConcertados ON dbo.Conciertos.Centro_id = dbo.CentrosConcertados.Centro_id INNER JOIN
                      dbo.ICG07 ON dbo.Conciertos.Concierto_id = dbo.ICG07.Concierto_id
WHERE     (dbo.ICG07.Validado = 1) 
GROUP BY dbo.Conciertos.Mutua_id, dbo.ICG07.Año, dbo.Conciertos.Concierto_id
GO
/****** Object:  View [dbo].[vw_Concertados_NoValidados]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER VIEW [dbo].[vw_Concertados_NoValidados] AS
SELECT     dbo.ICG07.Año, dbo.Conciertos.Concierto_id, dbo.Conciertos.Mutua_id, COUNT(dbo.Conciertos.Centro_id) AS Centro_id
FROM         dbo.Conciertos INNER JOIN
                      dbo.CentrosConcertados ON dbo.Conciertos.Centro_id = dbo.CentrosConcertados.Centro_id INNER JOIN
                      dbo.ICG07 ON dbo.Conciertos.Concierto_id = dbo.ICG07.Concierto_id
WHERE     (dbo.ICG07.Validado = 0 OR
                      dbo.ICG07.Validado IS NULL) 
GROUP BY dbo.Conciertos.Mutua_id, dbo.ICG07.Año, dbo.Conciertos.Concierto_id
GO
/****** Object:  Table [dbo].[ConciertosEspecialidades]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ConciertosEspecialidades')
BEGIN
CREATE TABLE [dbo].[ConciertosEspecialidades](
	[ConciertoEspecialidad_id] [int] IDENTITY(1,1) NOT NULL,
	[Concierto_id] [int] NOT NULL,
	[Año] [int] NOT NULL,
	[Especialidad_id] [int] NOT NULL,
	[Servicio_id] [int] NULL,
	[Cantidad] [int] NULL,
	[ImporteConIVA] [float] NULL
) ON [PRIMARY]
END
GO
/****** Object:  View [dbo].[vw_especialidadesConciertos]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER VIEW [dbo].[vw_especialidadesConciertos]
AS
SELECT        TOP (100) PERCENT dbo.ConciertosEspecialidades.ConciertoEspecialidad_id, dbo.ConciertosEspecialidades.Año, dbo.Conciertos.Concierto_id, dbo.Conciertos.Centro_id, dbo.Conciertos.Mutua_id, 
                         dbo.Aux_Especialidades.Especialidad_id, dbo.Aux_Especialidades.Especialidad, dbo.ConciertosEspecialidades.Cantidad, dbo.CentrosConcertados.Centro, dbo.CentrosConcertados.Localizador, 
                         dbo.Conciertos.CodigoCASA, dbo.Aux_Servicios.Servicio
FROM            dbo.Aux_Especialidades INNER JOIN
                         dbo.ConciertosEspecialidades ON dbo.Aux_Especialidades.Especialidad_id = dbo.ConciertosEspecialidades.Especialidad_id INNER JOIN
                         dbo.Conciertos ON dbo.ConciertosEspecialidades.Concierto_id = dbo.Conciertos.Concierto_id INNER JOIN
                         dbo.CentrosConcertados ON dbo.Conciertos.Centro_id = dbo.CentrosConcertados.Centro_id INNER JOIN
                         dbo.Aux_Servicios ON dbo.ConciertosEspecialidades.Servicio_id = dbo.Aux_Servicios.Servicio_id
ORDER BY dbo.ConciertosEspecialidades.Año DESC, dbo.Aux_Especialidades.Especialidad
GO
/****** Object:  View [dbo].[vw_Propios_Capitulo1]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER VIEW [dbo].[vw_Propios_Capitulo1]
AS
SELECT DISTINCT 
                         TOP (100) PERCENT SUM(ISNULL(dbo.ICG06.PersSanitMedArt6GastPers, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitMedArt6GastPersSustInt, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitMedEspArt6GastPers, 0)) 
                         + SUM(ISNULL(dbo.ICG06.PersSanitMedEspArt6GastPersSustInt, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitMedGesArt6GastPers, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitMedGesArt6GastPersSustInt, 0)) 
                         + SUM(ISNULL(dbo.ICG06.PersSanitArt7DUEGastPers, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitArt7DUEGastPersSustInt, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitArt7FisGastPers, 0)) 
                         + SUM(ISNULL(dbo.ICG06.PersSanitArt7FisGastPersSustInt, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitArt7PsicoGastPers, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitArt7PsicoGastPersSustInt, 0)) 
                         + SUM(ISNULL(dbo.ICG06.PersSanitArt7TrSocGastPers, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitArt7TrSocGastPersSustInt, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitArt7TerOcuGastPers, 0)) 
                         + SUM(ISNULL(dbo.ICG06.PersSanitArt7TerOcuGastPersSustInt, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitArt7TecRXGastPers, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitArt7TecRXGastPersSustInt, 0)) 
                         + SUM(ISNULL(dbo.ICG06.PersSanitArt7RestGastPers, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitArt7RestGastPersSustInt, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitGradSupGastPers, 0)) 
                         + SUM(ISNULL(dbo.ICG06.PersSanitGradSupGastPersSustInt, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitGradMedAuxEnfGastPers, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitGradMedAuxEnfGastPersSustInt, 0)) 
                         + SUM(ISNULL(dbo.ICG06.PersSanitGradMedRestGastPers, 0)) + SUM(ISNULL(dbo.ICG06.PersSanitGradMedRestGastPersSustInt, 0)) + SUM(ISNULL(dbo.ICG06.RestPersSanitGastPers, 0)) 
                         + SUM(ISNULL(dbo.ICG06.RestPersSanitGastPersSustInt, 0)) + SUM(ISNULL(dbo.ICG06.PersDirCenGastPers, 0)) + SUM(ISNULL(dbo.ICG06.PersDirCenGastPersSustInt, 0)) + SUM(ISNULL(dbo.ICG06.PersAdminGastPers, 0)) 
                         + SUM(ISNULL(dbo.ICG06.PersAdminGastPersSustInt, 0)) + SUM(ISNULL(dbo.ICG06.PersTecPreGastPers, 0)) + SUM(ISNULL(dbo.ICG06.PersTecPreGastPersSustInt, 0)) + SUM(ISNULL(dbo.ICG06.PersNoAdminGastPers, 0)) 
                         + SUM(ISNULL(dbo.ICG06.PersNoAdminGastPersSustInt, 0)) AS Respuesta, dbo.ICG06.Centro_id, dbo.CentrosPropios.Centro, dbo.ICG06.Año, dbo.CentrosPropios.Mutua_id
FROM            dbo.ICG06 INNER JOIN
                         dbo.CentrosPropios ON dbo.ICG06.Centro_id = dbo.CentrosPropios.Centro_id
GROUP BY dbo.ICG06.Año, dbo.ICG06.Centro_id, dbo.CentrosPropios.Centro, dbo.CentrosPropios.Mutua_id
GO
/****** Object:  View [dbo].[vw_Propios_Capitulo2]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER VIEW [dbo].[vw_Propios_Capitulo2]
AS
SELECT DISTINCT 
                      TOP (100) PERCENT SUM(ISNULL(dbo.ICG06.GasbienescysCIT, 0)) + SUM(ISNULL(dbo.ICG06.GasbienescysPSS, 0)) + SUM(ISNULL(dbo.ICG06.GasbienescysAG, 0)) 
                      + SUM(ISNULL(dbo.ICG06.GasbienescysASCP, 0)) + SUM(ISNULL(dbo.ICG06.GasbienescysASCC, 0)) AS Respuesta, dbo.ICG06.Centro_id, dbo.CentrosPropios.Centro, 
                      dbo.ICG06.Año, dbo.CentrosPropios.Mutua_id
FROM         dbo.ICG06 INNER JOIN
                      dbo.CentrosPropios ON dbo.ICG06.Centro_id = dbo.CentrosPropios.Centro_id
GROUP BY dbo.ICG06.Año, dbo.ICG06.Centro_id, dbo.CentrosPropios.Centro, dbo.CentrosPropios.Mutua_id
GO
/****** Object:  View [dbo].[vw_Propios_Cuenta68]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create view [dbo].[vw_Propios_Cuenta68] AS
SELECT DISTINCT  TOP (100) PERCENT 
(sum(isnull(AmortizASCC,0)) +
sum(isnull(AmortizCIT,0)) +
sum(isnull(AmortizPSS,0)) +
sum(isnull(AmortizAG,0)) +
sum(isnull(AmortizASCP,0))) as Respuesta,
ICG06.Centro_id, 
CentrosPropios.Centro, 
ICG06.Año, 
CentrosPropios.Mutua_id 
FROM  ICG06   
INNER JOIN CentrosPropios on ICG06.Centro_id = CentrosPropios.Centro_id 
GROUP BY Año, ICG06.Centro_id, Centro,Mutua_id
GO
/****** Object:  View [dbo].[vw_Propios_Articulo62]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create view [dbo].[vw_Propios_Articulo62] AS
SELECT DISTINCT  TOP (100) PERCENT 
(sum(isnull(Inversrep,0))) as Respuesta,
ICG06.Centro_id, 
CentrosPropios.Centro, 
ICG06.Año, 
CentrosPropios.Mutua_id 
FROM  ICG06   
INNER JOIN CentrosPropios on ICG06.Centro_id = CentrosPropios.Centro_id 
GROUP BY Año, ICG06.Centro_id, Centro,Mutua_id
GO
/****** Object:  View [dbo].[vw_Propios_Articulo63]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create view [dbo].[vw_Propios_Articulo63] AS
SELECT DISTINCT  TOP (100) PERCENT 
(sum(isnull(Inversnue,0))) as Respuesta,
ICG06.Centro_id, 
CentrosPropios.Centro, 
ICG06.Año, 
CentrosPropios.Mutua_id 
FROM  ICG06   
INNER JOIN CentrosPropios on ICG06.Centro_id = CentrosPropios.Centro_id 
GROUP BY Año, ICG06.Centro_id, Centro,Mutua_id
GO
/****** Object:  View [dbo].[vw_Propios_Articulo32]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER VIEW [dbo].[vw_Propios_Articulo32]
AS
SELECT DISTINCT 
                         TOP (100) PERCENT SUM(ISNULL(dbo.ICG06.Factejercresto, 0)) + SUM(ISNULL(dbo.ICG06.Factejercsist, 0)) + SUM(ISNULL(dbo.ICG06.FactejerotrmutuasCC, 0)) + SUM(ISNULL(dbo.ICG06.FactejerotrmutuasCP, 0)) AS Respuesta, 
                         dbo.ICG06.Centro_id, dbo.CentrosPropios.Centro, dbo.ICG06.Año, dbo.CentrosPropios.Mutua_id
FROM            dbo.ICG06 INNER JOIN
                         dbo.CentrosPropios ON dbo.ICG06.Centro_id = dbo.CentrosPropios.Centro_id
GROUP BY dbo.ICG06.Año, dbo.ICG06.Centro_id, dbo.CentrosPropios.Centro, dbo.CentrosPropios.Mutua_id
GO
/****** Object:  View [dbo].[vw_ListadoPropiosICG]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER VIEW [dbo].[vw_ListadoPropiosICG] AS
SELECT     dbo.ICG06.Año, dbo.CentrosPropios.Mutua_id, dbo.CentrosPropios.Centro_id, SUM(DISTINCT ISNULL(dbo.vw_Propios_Capitulo1.Respuesta, 0)) AS Capitulo1, 
                      SUM(DISTINCT ISNULL(dbo.vw_Propios_Capitulo2.Respuesta, 0)) AS Capitulo2, SUM(DISTINCT ISNULL(dbo.vw_Propios_Cuenta68.Respuesta, 0)) AS Cuenta68, 
                      SUM(DISTINCT ISNULL(dbo.vw_Propios_Articulo62.Respuesta, 0)) AS Articulo62, SUM(DISTINCT ISNULL(dbo.vw_Propios_Articulo63.Respuesta, 0)) AS Articulo63, 
                      SUM(DISTINCT ISNULL(dbo.vw_Propios_Articulo32.Respuesta, 0)) AS Articulo32, dbo.ICG06.Validado AS Estado, dbo.CentrosPropios.Poblacion_id, 
                      ISNULL(dbo.vw_Propios_Financieros.Respuesta, 0) AS GastosFinancieros
FROM         dbo.vw_Propios_Cuenta68 RIGHT OUTER JOIN
                      dbo.CentrosPropios INNER JOIN
                      dbo.ICG06 ON dbo.CentrosPropios.Centro_id = dbo.ICG06.Centro_id LEFT OUTER JOIN
                      dbo.vw_Propios_Financieros ON dbo.CentrosPropios.Centro_id = dbo.vw_Propios_Financieros.Centro_id AND dbo.ICG06.Año = dbo.vw_Propios_Financieros.Año AND 
                      dbo.CentrosPropios.Mutua_id = dbo.vw_Propios_Financieros.Mutua_id LEFT OUTER JOIN
                      dbo.vw_Propios_Articulo62 ON dbo.ICG06.Centro_id = dbo.vw_Propios_Articulo62.Centro_id AND dbo.ICG06.Año = dbo.vw_Propios_Articulo62.Año LEFT OUTER JOIN
                      dbo.vw_Propios_Articulo63 ON dbo.ICG06.Año = dbo.vw_Propios_Articulo63.Año AND dbo.ICG06.Centro_id = dbo.vw_Propios_Articulo63.Centro_id ON 
                      dbo.vw_Propios_Cuenta68.Año = dbo.ICG06.Año AND dbo.vw_Propios_Cuenta68.Centro_id = dbo.ICG06.Centro_id LEFT OUTER JOIN
                      dbo.vw_Propios_Articulo32 ON dbo.ICG06.Centro_id = dbo.vw_Propios_Articulo32.Centro_id AND dbo.ICG06.Año = dbo.vw_Propios_Articulo32.Año LEFT OUTER JOIN
                      dbo.vw_Propios_Capitulo2 ON dbo.ICG06.Centro_id = dbo.vw_Propios_Capitulo2.Centro_id AND dbo.ICG06.Año = dbo.vw_Propios_Capitulo2.Año LEFT OUTER JOIN
                      dbo.vw_Propios_Capitulo1 ON dbo.ICG06.Año = dbo.vw_Propios_Capitulo1.Año AND dbo.ICG06.Centro_id = dbo.vw_Propios_Capitulo1.Centro_id
     
GROUP BY dbo.ICG06.Año, dbo.CentrosPropios.Mutua_id, dbo.ICG06.Validado, dbo.CentrosPropios.Centro_id, dbo.CentrosPropios.Poblacion_id, 
                      ISNULL(dbo.vw_Propios_Financieros.Respuesta, 0)
                      
GO
/****** Object:  View [dbo].[vw_Conciertos_Articulo258_1]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create view [dbo].[vw_Conciertos_Articulo258_1] AS
SELECT DISTINCT 
TOP (100) PERCENT Año, dbo.Conciertos.Concierto_id, dbo.Conciertos.Mutua_id, dbo.CentrosConcertados.Centro_id, 'Conciertos' as [CapituloCM], 
'Costes' as [ConceptoCM], dbo.CentrosConcertados.Centro, sum(isnull(Art2581,0)) AS Respuesta
                      
FROM  ICG07  
INNER JOIN dbo.Conciertos ON dbo.ICG07.Concierto_id = dbo.Conciertos.Concierto_id 
INNER JOIN dbo.CentrosConcertados ON dbo.Conciertos.Centro_id = dbo.CentrosConcertados.Centro_id

GROUP BY dbo.CentrosConcertados.Centro_id, Año,
dbo.CentrosConcertados.Centro, dbo.Conciertos.Mutua_id, dbo.Conciertos.Concierto_id
GO
/****** Object:  View [dbo].[vw_Conciertos_Articulo258_2]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create view [dbo].[vw_Conciertos_Articulo258_2] AS
SELECT DISTINCT 
TOP (100) PERCENT Año, dbo.Conciertos.Concierto_id, dbo.Conciertos.Mutua_id, dbo.CentrosConcertados.Centro_id, 'Conciertos' as [CapituloCM], 
'Costes' as [ConceptoCM], dbo.CentrosConcertados.Centro, sum(isnull(Art2582,0)) AS Respuesta
                      
FROM  ICG07  
INNER JOIN dbo.Conciertos ON dbo.ICG07.Concierto_id = dbo.Conciertos.Concierto_id 
INNER JOIN dbo.CentrosConcertados ON dbo.Conciertos.Centro_id = dbo.CentrosConcertados.Centro_id

GROUP BY dbo.CentrosConcertados.Centro_id, Año,
dbo.CentrosConcertados.Centro, dbo.Conciertos.Mutua_id, dbo.Conciertos.Concierto_id
GO
/****** Object:  View [dbo].[vw_Conciertos_Articulo25_Resto]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create view [dbo].[vw_Conciertos_Articulo25_Resto] AS
SELECT DISTINCT 
TOP (100) PERCENT Año, dbo.Conciertos.Concierto_id, dbo.Conciertos.Mutua_id, dbo.CentrosConcertados.Centro_id, 'Conciertos' as [CapituloCM], 
'Costes' as [ConceptoCM], dbo.CentrosConcertados.Centro, sum(isnull(RestoArticulo25SCon,0)) AS Respuesta
                      
FROM  ICG07  
INNER JOIN dbo.Conciertos ON dbo.ICG07.Concierto_id = dbo.Conciertos.Concierto_id 
INNER JOIN dbo.CentrosConcertados ON dbo.Conciertos.Centro_id = dbo.CentrosConcertados.Centro_id

GROUP BY dbo.CentrosConcertados.Centro_id, Año,
dbo.CentrosConcertados.Centro, dbo.Conciertos.Mutua_id, dbo.Conciertos.Concierto_id
GO
/****** Object:  View [dbo].[vw_ListadoConciertosICG]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO





CREATE OR ALTER VIEW [dbo].[vw_ListadoConciertosICG] AS 
SELECT    Id_ICG, dbo.ICG07.Año, dbo.Conciertos.Concierto_id, dbo.Mutuas.Mutua_id, dbo.Mutuas.NumeroMutua, dbo.Mutuas.Mutua, dbo.CentrosConcertados.Centro_id, 
                      dbo.CentrosConcertados.Centro,   dbo.ICG07.Costeassan AS AsistenciaSanitaria, 
                      ISNULL(dbo.ICG07.CosteIT, 0) AS IncapacidadTemporal, ISNULL(dbo.ICG07.GastoCentroNoConcert, 0) AS Gastos, 
                      ISNULL(dbo.ICG07.Art2581, 0) + ISNULL(dbo.ICG07.Art2582, 0) + ISNULL(dbo.ICG07.RestoArticulo25SCon, 0) AS Articulo25, 
					  ISNULL(dbo.vw_Conciertos_AsistenciaSanitaria.Respuesta, 0) 
                      + ISNULL(dbo.ICG07.CosteIT, 0) + ISNULL(dbo.ICG07.GastoCentroNoConcert, 0) 
                      + ISNULL(dbo.ICG07.Art2581, 0) + ISNULL(dbo.ICG07.Art2582, 0) 
                      + ISNULL(dbo.ICG07.RestoArticulo25SCon, 0) AS Total, dbo.ICG07.Validado AS Estado, dbo.Conciertos.CodigoMZ, dbo.Conciertos.CodigoCASA, 
                      dbo.CentrosConcertados.Poblacion_id, dbo.Aux_Poblaciones.Poblacion, dbo.Aux_Provincias.Provincia
FROM         dbo.vw_Conciertos_IncapacidadTemporal RIGHT OUTER JOIN
                      dbo.vw_Conciertos_Articulo25_Resto RIGHT OUTER JOIN
                      dbo.Conciertos INNER JOIN
                      dbo.ICG07 ON dbo.Conciertos.Concierto_id = dbo.ICG07.Concierto_id INNER JOIN
                      dbo.CentrosConcertados ON dbo.Conciertos.Centro_id = dbo.CentrosConcertados.Centro_id INNER JOIN
                      dbo.Mutuas ON dbo.Conciertos.Mutua_id = dbo.Mutuas.Mutua_id LEFT OUTER JOIN
                      dbo.Aux_Provincias INNER JOIN
                      dbo.Aux_Poblaciones ON dbo.Aux_Provincias.Provincia_id = dbo.Aux_Poblaciones.Provincia_id ON 
                      dbo.CentrosConcertados.Poblacion_id = dbo.Aux_Poblaciones.Poblacion_id LEFT OUTER JOIN
                      dbo.vw_Conciertos_Articulo258_2 ON dbo.ICG07.Año = dbo.vw_Conciertos_Articulo258_2.Año AND 
                      dbo.ICG07.Concierto_id = dbo.vw_Conciertos_Articulo258_2.Concierto_id LEFT OUTER JOIN
                      dbo.vw_Conciertos_Articulo258_1 ON dbo.ICG07.Año = dbo.vw_Conciertos_Articulo258_1.Año AND 
                      dbo.ICG07.Concierto_id = dbo.vw_Conciertos_Articulo258_1.Concierto_id ON dbo.vw_Conciertos_Articulo25_Resto.Año = dbo.ICG07.Año AND 
                      dbo.vw_Conciertos_Articulo25_Resto.Concierto_id = dbo.ICG07.Concierto_id ON dbo.vw_Conciertos_IncapacidadTemporal.Año = dbo.ICG07.Año AND 
                      dbo.vw_Conciertos_IncapacidadTemporal.Concierto_id = dbo.ICG07.Concierto_id LEFT OUTER JOIN
                      dbo.vw_Conciertos_AsistenciaSanitaria ON dbo.ICG07.Año = dbo.vw_Conciertos_AsistenciaSanitaria.Año AND 
                      dbo.ICG07.Concierto_id = dbo.vw_Conciertos_AsistenciaSanitaria.Concierto_id LEFT OUTER JOIN
                      dbo.vw_Conciertos_Gastos ON dbo.ICG07.Concierto_id = dbo.vw_Conciertos_Gastos.Concierto_id AND dbo.ICG07.Año = dbo.vw_Conciertos_Gastos.Año

GROUP BY dbo.ICG07.Año, dbo.CentrosConcertados.Centro_id, ISNULL(dbo.vw_Conciertos_AsistenciaSanitaria.Respuesta, 0) 
                      + ISNULL(dbo.vw_Conciertos_IncapacidadTemporal.Respuesta, 0) + ISNULL(dbo.ICG07.GastoCentroNoConcert, 0) 
                      + ISNULL(dbo.ICG07.Art2581, 0) + ISNULL(dbo.ICG07.Art2582, 0) 
                      + ISNULL(dbo.ICG07.RestoArticulo25SCon, 0), dbo.ICG07.Validado, dbo.Conciertos.CodigoMZ, dbo.Conciertos.CodigoCASA, 
                      dbo.Mutuas.NumeroMutua, dbo.Mutuas.Mutua, dbo.CentrosConcertados.Poblacion_id, dbo.CentrosConcertados.Centro, 
                      CAST(dbo.CentrosConcertados.Centro_id AS varchar(5)) + CAST(dbo.Mutuas.Mutua_id AS varchar(10)), CAST(dbo.CentrosConcertados.Centro_id AS varchar(10)) 
                      + CAST(dbo.Mutuas.Mutua_id AS varchar(10)), dbo.Mutuas.Mutua_id, dbo.Aux_Poblaciones.Poblacion, dbo.Aux_Provincias.Provincia, dbo.Conciertos.Concierto_id
					  , dbo.ICG07.Id_ICG
					  ,dbo.vw_Conciertos_AsistenciaSanitaria.Respuesta
					  ,dbo.ICG07.Costeassan
					  ,dbo.ICG07.Art2581
					  ,dbo.ICG07.Art2582
					  ,dbo.ICG07.RestoArticulo25SCon
					  ,dbo.ICG07.GastoCentroNoConcert
					  ,dbo.ICG07.CosteIT
                      
GO
/****** Object:  View [dbo].[vw_Propios_Capitulo3]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create view [dbo].[vw_Propios_Capitulo3] AS
SELECT DISTINCT  TOP (100) PERCENT 
(sum(isnull(GasfinASCP,0)) +
sum(isnull(GasfinASCC,0)) +
sum(isnull(GasfinCIT,0)) +
sum(isnull(GasfinPSS,0)) +
sum(isnull(GasfinAG,0))) as Respuesta,
ICG06.Centro_id, 
CentrosPropios.Centro, 
ICG06.Año, 
CentrosPropios.Mutua_id 
FROM  ICG06   
INNER JOIN CentrosPropios on ICG06.Centro_id = CentrosPropios.Centro_id 
GROUP BY Año, ICG06.Centro_id, Centro,Mutua_id
GO
/****** Object:  View [dbo].[vw_EspecialidadesPropios]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create view [dbo].[vw_EspecialidadesPropios] AS
SELECT     TOP (100) PERCENT dbo.CentrosPropiosEspecialidades.Año, dbo.CentrosPropiosEspecialidades.CentroPropioEspecialidad_id, 
                      dbo.CentrosPropiosEspecialidades.Centro_id, dbo.CentrosPropios.Mutua_id, dbo.Aux_Especialidades.Especialidad_id, dbo.Aux_Especialidades.Especialidad, 
                      dbo.CentrosPropiosEspecialidades.Servicio, dbo.CentrosPropiosEspecialidades.Cantidad, dbo.CentrosPropios.Centro, dbo.CentrosPropios.Localizador
FROM         dbo.Aux_Especialidades INNER JOIN
                      dbo.CentrosPropiosEspecialidades ON dbo.Aux_Especialidades.Especialidad_id = dbo.CentrosPropiosEspecialidades.Especialidad_id INNER JOIN
                      dbo.CentrosPropios ON dbo.CentrosPropiosEspecialidades.Centro_id = dbo.CentrosPropios.Centro_id
ORDER BY dbo.CentrosPropiosEspecialidades.Año DESC, dbo.CentrosPropiosEspecialidades.Servicio, dbo.Aux_Especialidades.Especialidad

GO
/****** Object:  View [dbo].[vw_Conciertos_Articulo25]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER VIEW [dbo].[vw_Conciertos_Articulo25]
AS
SELECT DISTINCT 
                      TOP (100) PERCENT dbo.ICG07.Año, dbo.Conciertos.Concierto_id, dbo.Conciertos.Mutua_id, dbo.CentrosConcertados.Centro_id, 'Conciertos' AS CapituloCM, 
                      'Costes' AS ConceptoCM, dbo.CentrosConcertados.Centro, SUM(ISNULL(dbo.ICG07.Costeassan, 0)) + SUM(ISNULL(dbo.ICG07.CosteIT, 0)) 
                      + SUM(ISNULL(dbo.ICG07.GastoCentroNoConcert, 0)) AS Respuesta
FROM         dbo.ICG07 INNER JOIN
                      dbo.Conciertos ON dbo.ICG07.Concierto_id = dbo.Conciertos.Concierto_id INNER JOIN
                      dbo.CentrosConcertados ON dbo.Conciertos.Centro_id = dbo.CentrosConcertados.Centro_id
GROUP BY dbo.CentrosConcertados.Centro_id, dbo.ICG07.Año, dbo.CentrosConcertados.Centro, dbo.Conciertos.Mutua_id, dbo.Conciertos.Concierto_id
GO
/****** Object:  View [dbo].[vw_Propios_Capitulo1_Anterior]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER VIEW [dbo].[vw_Propios_Capitulo1_Anterior]
AS
SELECT DISTINCT 
                         TOP (100) PERCENT SUM(ISNULL(dbo.ICG06.[Directcentro(med)coste], 0)) 
						 + SUM(ISNULL(dbo.ICG06.Medmedtrabcoste, 0))                                              
                         + SUM(ISNULL(dbo.ICG06.Medespcoste, 0)) 
						 + SUM(ISNULL(dbo.ICG06.Restofaccoste, 0)) 
						 + SUM(ISNULL(dbo.ICG06.DUEyascoste, 0)) 
						 + SUM(ISNULL(dbo.ICG06.ATSyascoste, 0))
						 + SUM(ISNULL(dbo.ICG06.Auxclcoste, 0))
						 + SUM(ISNULL(dbo.ICG06.Opersancoste, 0))
						 + SUM(ISNULL(dbo.ICG06.TPrevScoste, 0))
						 + SUM(ISNULL(dbo.ICG06.TPrevMcoste, 0))
						 + SUM(ISNULL(dbo.ICG06.TPrevBcoste, 0))
						 + SUM(ISNULL(dbo.ICG06.[Directcentro(nomed)coste], 0))
						 + SUM(ISNULL(dbo.ICG06.PeradAGcoste, 0))
						 + SUM(ISNULL(dbo.ICG06.PeradnoAGcoste, 0))
						 + SUM(ISNULL(dbo.ICG06.PeradcompAGcoste, 0))
						 + SUM(ISNULL(dbo.ICG06.Opersnosantitcoste, 0))
						 + SUM(ISNULL(dbo.ICG06.Opersnosannotitcoste, 0))
						 + SUM(ISNULL(dbo.ICG06.Medactmedcoste, 0))
						 AS Respuesta, 
						 dbo.ICG06.Centro_id, 
						 dbo.CentrosPropios.Centro, dbo.ICG06.Año, dbo.CentrosPropios.Mutua_id
FROM dbo.ICG06 
INNER JOIN dbo.CentrosPropios ON dbo.ICG06.Centro_id = dbo.CentrosPropios.Centro_id
GROUP BY dbo.ICG06.Año, dbo.ICG06.Centro_id, dbo.CentrosPropios.Centro, dbo.CentrosPropios.Mutua_id
GO
/****** Object:  Table [dbo].[AccesosUsuarios]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AccesosUsuarios')
BEGIN
CREATE TABLE [dbo].[AccesosUsuarios](
	[AccesoUsuario_id] [int] IDENTITY(1,1) NOT NULL,
	[Perfil_id] [int] NULL,
	[Ficha_id] [int] NULL,
	[UsuarioModificacion] [int] NULL,
	[FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_AccesosUsuarios] PRIMARY KEY CLUSTERED 
(
	[AccesoUsuario_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Access_ActividadAsistencial_A]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Access_ActividadAsistencial_A')
BEGIN
CREATE TABLE [dbo].[Access_ActividadAsistencial_A](
	[Idcentro] [nvarchar](max) NULL,
	[Ejerc] [int] NULL,
	[Mutua_id] [int] NULL,
	[Direccion] [nvarchar](max) NULL,
	[Numero] [nvarchar](max) NULL,
	[Piso] [nvarchar](max) NULL,
	[Puerta] [nvarchar](max) NULL,
	[Actidesde] [datetime] NULL,
	[Actihasta] [datetime] NULL,
	[Sesrehabtrmut] [numeric](10, 2) NULL,
	[ConsEnftrmut] [numeric](10, 2) NULL,
	[PradtrmutRM] [numeric](10, 2) NULL,
	[PradtrmutEco] [numeric](10, 2) NULL,
	[PradtrmutTAC] [numeric](10, 2) NULL,
	[PradtrmutRadio] [numeric](10, 2) NULL,
	[Iquirtrmut] [numeric](10, 2) NULL,
	[Otrpptrmut] [numeric](10, 2) NULL,
	[PruBiomtrmut] [numeric](10, 2) NULL,
	[PAcen25km] [numeric](10, 2) NULL,
	[PrimConsProg25km] [numeric](10, 2) NULL,
	[PrimConsProgVideo25km] [numeric](10, 2) NULL,
	[PrimConsNoProg25km] [numeric](10, 2) NULL,
	[PrimConsNoProgVideo25km] [numeric](10, 2) NULL,
	[Conssuc25km] [numeric](10, 2) NULL,
	[Conssuc25kmVideo] [numeric](10, 2) NULL,
	[PAcen50km] [numeric](10, 2) NULL,
	[PrimConsProg50km] [numeric](10, 2) NULL,
	[PrimConsProgVideo50km] [numeric](10, 2) NULL,
	[PrimConsNoProg50km] [numeric](10, 2) NULL,
	[PrimConsNoProgVideo50km] [numeric](10, 2) NULL,
	[Conssuc50km] [numeric](10, 2) NULL,
	[Conssuc50kmVideo] [numeric](10, 2) NULL,
	[PAcenmas50km] [numeric](10, 2) NULL,
	[PrimConsProgmas50km] [numeric](10, 2) NULL,
	[PrimConsProgVideomas50km] [numeric](10, 2) NULL,
	[PrimConsNoProgmas50km] [numeric](10, 2) NULL,
	[PrimConsNoProgVideomas50km] [numeric](10, 2) NULL,
	[Conssucmas50km] [numeric](10, 2) NULL,
	[Conssucmas50kmVideo] [numeric](10, 2) NULL,
	[PAcenArt82] [numeric](10, 2) NULL,
	[PrimConsArt82Prog] [numeric](10, 2) NULL,
	[PrimConsArt82ProgVideo] [numeric](10, 2) NULL,
	[PrimConsArt82NoProg] [numeric](10, 2) NULL,
	[PrimConsArt82NoProgVideo] [numeric](10, 2) NULL,
	[ConssucArt82] [numeric](10, 2) NULL,
	[ConssucArt82Video] [numeric](10, 2) NULL,
	[ConsEnfArt82] [numeric](10, 2) NULL,
	[PradArt82RM] [numeric](10, 2) NULL,
	[PradArt82Eco] [numeric](10, 2) NULL,
	[PradArt82TAC] [numeric](10, 2) NULL,
	[PradArt82Radio] [numeric](10, 2) NULL,
	[OppractArt82] [numeric](10, 2) NULL,
	[SesrehabArt82] [numeric](10, 2) NULL,
	[IquircenArt82] [numeric](10, 2) NULL,
	[PruBiomArt82] [numeric](10, 2) NULL,
	[PAotmutArt12] [numeric](10, 2) NULL,
	[PrimConsotmutArt12Prog] [numeric](10, 2) NULL,
	[PrimConsotmutArt12ProgVideo] [numeric](10, 2) NULL,
	[PrimConotmutArt12NoProg] [numeric](10, 2) NULL,
	[PrimConotmutArt12NoProgVideo] [numeric](10, 2) NULL,
	[ConssucotmutArt12] [numeric](10, 2) NULL,
	[ConssucotmutArt12Video] [numeric](10, 2) NULL,
	[SesrehabotmutArt12] [numeric](10, 2) NULL,
	[ConsEnfotmutArt12] [numeric](10, 2) NULL,
	[PradotmutArt12RM] [numeric](10, 2) NULL,
	[PradotmutArt12Eco] [numeric](10, 2) NULL,
	[PradotmutArt12TAC] [numeric](10, 2) NULL,
	[PradotmutArt12Radio] [numeric](10, 2) NULL,
	[IquirotmutArt12] [numeric](10, 2) NULL,
	[OppractotmutArt12] [numeric](10, 2) NULL,
	[PruBiomotmutArt12] [numeric](10, 2) NULL,
	[PAentgyAPArt12] [numeric](10, 2) NULL,
	[PrimConentgyAPArt12Prog] [numeric](10, 2) NULL,
	[PrimConentgyAPArt12ProgVideo] [numeric](10, 2) NULL,
	[PrimConentgyAPArt12NoProg] [numeric](10, 2) NULL,
	[PrimConentgyAPArt12NoProgVideo] [numeric](10, 2) NULL,
	[ConssucentgyAPArt12] [numeric](10, 2) NULL,
	[ConssucentgyAPArt12Video] [numeric](10, 2) NULL,
	[SesrehabentgyAPArt12] [numeric](10, 2) NULL,
	[ConsEnfentgyAPArt12] [numeric](10, 2) NULL,
	[PradentgyAPArt12RM] [numeric](10, 2) NULL,
	[PradentgyAPArt12Eco] [numeric](10, 2) NULL,
	[PradentgyAPArt12TAC] [numeric](10, 2) NULL,
	[PradentgyAPArt12Radio] [numeric](10, 2) NULL,
	[IquirentgyAPArt12] [numeric](10, 2) NULL,
	[OppractentgyAPArt12] [numeric](10, 2) NULL,
	[PruBiomentgyAPArt12] [numeric](10, 2) NULL,
	[PAotrosArt12] [numeric](10, 2) NULL,
	[PrimConotrosArt12Prog] [numeric](10, 2) NULL,
	[PrimConotrosArt12ProgVideo] [numeric](10, 2) NULL,
	[PrimConotrosArt12NoProg] [numeric](10, 2) NULL,
	[PrimConotrosArt12NoProgVideo] [numeric](10, 2) NULL,
	[ConssucotrosArt12Video] [numeric](10, 2) NULL,
	[ConssucotrosArt12] [numeric](10, 2) NULL,
	[SesrehabotrosArt12] [numeric](10, 2) NULL,
	[ConsEnfotrosArt12] [numeric](10, 2) NULL,
	[PradotrosArt12RM] [numeric](10, 2) NULL,
	[PradotrosArt12Eco] [numeric](10, 2) NULL,
	[PradotrosArt12TAC] [numeric](10, 2) NULL,
	[PradotrosArt12Radio] [numeric](10, 2) NULL,
	[IquirotrosArt12] [numeric](10, 2) NULL,
	[OppractotrosArt12] [numeric](10, 2) NULL,
	[PruBiomotrosArt12] [numeric](10, 2) NULL,
	[Panoapant] [numeric](10, 2) NULL,
	[PrimConsnoapantProg] [numeric](10, 2) NULL,
	[PrimConsnoapantProgVideo] [numeric](10, 2) NULL,
	[PrimConsnoapantNoProg] [numeric](10, 2) NULL,
	[PrimConsnoapantNoProgVideo] [numeric](10, 2) NULL,
	[Conssucnoapant] [numeric](10, 2) NULL,
	[ConssucnoapantVideo] [numeric](10, 2) NULL,
	[Sesrehabnoapant] [numeric](10, 2) NULL,
	[ConsEnfnoapant] [numeric](10, 2) NULL,
	[PradnoapantRM] [numeric](10, 2) NULL,
	[PradnoapantEco] [numeric](10, 2) NULL,
	[PradnoapantTAC] [numeric](10, 2) NULL,
	[PradnoapantRadio] [numeric](10, 2) NULL,
	[Iquirnoapant] [numeric](10, 2) NULL,
	[Oppractnoapant] [numeric](10, 2) NULL,
	[PruBiomnoapant] [numeric](10, 2) NULL,
	[PAcenConvSectBilMult] [numeric](10, 2) NULL,
	[PrimConsConvSectBilMultProg] [numeric](10, 2) NULL,
	[PrimConsConvSectBilMultProgVideo] [numeric](10, 2) NULL,
	[PrimConsConvSectBilMultNoProg] [numeric](10, 2) NULL,
	[PrimConsConvSectBilMultNoProgVideo] [numeric](10, 2) NULL,
	[ConssucConvSectBilMult] [numeric](10, 2) NULL,
	[ConssucConvSectBilMultVideo] [numeric](10, 2) NULL,
	[SesrehabConvSectBilMult] [numeric](10, 2) NULL,
	[ConsEnfConvSectBilMult] [numeric](10, 2) NULL,
	[PradConvSectBilMultRM] [numeric](10, 2) NULL,
	[PradConvSectBilMultTAC] [numeric](10, 2) NULL,
	[PradConvSectBilMultEco] [numeric](10, 2) NULL,
	[PradConvSectBilMultRadio] [numeric](10, 2) NULL,
	[IquircenConvSectBilMult] [numeric](10, 2) NULL,
	[OppractConvSectBilMult] [numeric](10, 2) NULL,
	[PruBiomConvSectBilMult] [numeric](10, 2) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Access_ActividadAsistencial_H]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Access_ActividadAsistencial_H')
BEGIN
CREATE TABLE [dbo].[Access_ActividadAsistencial_H](
	[Idcentro] [nvarchar](max) NULL,
	[Ejerc] [nvarchar](max) NULL,
	[Mutua_id] [nvarchar](max) NULL,
	[Direccion] [nvarchar](max) NULL,
	[Numero] [nvarchar](max) NULL,
	[Piso] [nvarchar](max) NULL,
	[Puerta] [nvarchar](max) NULL,
	[PItrmutHOS] [numeric](10, 2) NULL,
	[EsttrmutHOS] [numeric](10, 2) NULL,
	[PrimConsHOSProg] [numeric](10, 2) NULL,
	[PrimConsHOSProgVideo] [numeric](10, 2) NULL,
	[PrimConsHOSNoProg] [numeric](10, 2) NULL,
	[PrimConsHOSNoProgVideo] [numeric](10, 2) NULL,
	[ConssucHOS] [numeric](10, 2) NULL,
	[ConssucHOSVideo] [numeric](10, 2) NULL,
	[SesrehabtrmutHOS] [numeric](10, 2) NULL,
	[ConsEnfHOS] [numeric](10, 2) NULL,
	[PradtrmutHOSRM] [numeric](10, 2) NULL,
	[PradtrmutHOSEco] [numeric](10, 2) NULL,
	[PradtrmutHOSTAC] [numeric](10, 2) NULL,
	[PradtrmutHOSRadio] [numeric](10, 2) NULL,
	[IquirtrmutHOS] [numeric](10, 2) NULL,
	[OppracttrmutHOS] [numeric](10, 2) NULL,
	[PruBiomHOS] [numeric](10, 2) NULL,
	[PAurnointrmutHOS] [numeric](10, 2) NULL,
	[PItrmutArt82HOS] [numeric](10, 2) NULL,
	[EsttrmutArt82HOS] [numeric](10, 2) NULL,
	[PrimConsArt82HOSProg] [numeric](10, 2) NULL,
	[PrimConsArt82HOSProgVideo] [numeric](10, 2) NULL,
	[PrimConsArt82HOSNoProg] [numeric](10, 2) NULL,
	[PrimConsArt82HOSNoProgVideo] [numeric](10, 2) NULL,
	[ConssucArt82HOS] [numeric](10, 2) NULL,
	[ConssucArt82HOSVideo] [numeric](10, 2) NULL,
	[SrehabtrmutArt82HOS] [numeric](10, 2) NULL,
	[ConsEnfArt82HOS] [numeric](10, 2) NULL,
	[PrmydtrmutArt82HOSRM] [numeric](10, 2) NULL,
	[PrmydtrmutArt82HOSEco] [numeric](10, 2) NULL,
	[PrmydtrmutArt82HOSTAC] [numeric](10, 2) NULL,
	[PrmydtrmutArt82HOSRadio] [numeric](10, 2) NULL,
	[IquirtrmutArt82HOS] [numeric](10, 2) NULL,
	[OpptrmutArt82HOS] [numeric](10, 2) NULL,
	[PrueBiomArt82HOS] [numeric](10, 2) NULL,
	[PAUrgNoIngrArt82HOS] [numeric](10, 2) NULL,
	[PIotrmutArt12HOS] [numeric](10, 2) NULL,
	[EstotrmutArt12HOS] [numeric](10, 2) NULL,
	[PrimConsotrmutArt12HOSProg] [numeric](10, 2) NULL,
	[PrimConsotrmutArt12HOSProgVideo] [numeric](10, 2) NULL,
	[PrimConsotrmutArt12HOSNoProg] [numeric](10, 2) NULL,
	[PrimConsotrmutArt12HOSNoProgVideo] [numeric](10, 2) NULL,
	[ConssucotrmutArt12HOS] [numeric](10, 2) NULL,
	[ConssucotrmutArt12HOSVideo] [numeric](10, 2) NULL,
	[SrehabotrmutArt12HOS] [numeric](10, 2) NULL,
	[ConsEnfotrmutArt12HOS] [numeric](10, 2) NULL,
	[PradotrmutArt12HOSRM] [numeric](10, 2) NULL,
	[PradotrmutArt12HOSEco] [numeric](10, 2) NULL,
	[PradotrmutArt12HOSTAC] [numeric](10, 2) NULL,
	[PradotrmutArt12HOSRadio] [numeric](10, 2) NULL,
	[IquirotrmutArt12HOS] [numeric](10, 2) NULL,
	[OppotrmutArt12HOS] [numeric](10, 2) NULL,
	[PruBiomotrmutArt12HOS] [numeric](10, 2) NULL,
	[PAurniotrmutArt12HOS] [numeric](10, 2) NULL,
	[PIEGYAPArt12HOS] [numeric](10, 2) NULL,
	[EstEGYAPArt12HOS] [numeric](10, 2) NULL,
	[PrimConsEGYAPArt12HOSProg] [numeric](10, 2) NULL,
	[PrimConsEGYAPArt12HOSProgVideo] [numeric](10, 2) NULL,
	[PrimConsEGYAPArt12HOSNoProg] [numeric](10, 2) NULL,
	[PrimConsEGYAPArt12HOSNoProgVideo] [numeric](10, 2) NULL,
	[ConssucEGYAPArt12HOS] [numeric](10, 2) NULL,
	[ConssucEGYAPArt12HOSVideo] [numeric](10, 2) NULL,
	[SrehabEGYAPArt12HOS] [numeric](10, 2) NULL,
	[ConsEnfEGYAPArt12HOS] [numeric](10, 2) NULL,
	[PradEGYAPArt12HOSRM] [numeric](10, 2) NULL,
	[PradEGYAPArt12HOSEco] [numeric](10, 2) NULL,
	[PradEGYAPArt12HOSTAC] [numeric](10, 2) NULL,
	[PradEGYAPArt12HOSRadio] [numeric](10, 2) NULL,
	[IquirEGYAPArt12HOS] [numeric](10, 2) NULL,
	[OppEGYAPArt12HOS] [numeric](10, 2) NULL,
	[PruBiomEGYAPArt12HOS] [numeric](10, 2) NULL,
	[PAurniEGYAPArt12HOS] [numeric](10, 2) NULL,
	[PIotrosArt12HOS] [numeric](10, 2) NULL,
	[EstotrosArt12HOS] [numeric](10, 2) NULL,
	[PrimConsotrosArt12HOSProg] [numeric](10, 2) NULL,
	[PrimConsotrosArt12HOSProgVideo] [numeric](10, 2) NULL,
	[PrimConsotrosArt12HOSNoProg] [numeric](10, 2) NULL,
	[PrimConsotrosArt12HOSNoProgVideo] [numeric](10, 2) NULL,
	[ConssucotrosArt12HOS] [numeric](10, 2) NULL,
	[ConssucotrosArt12HOSVideo] [numeric](10, 2) NULL,
	[SrehabotrosArt12HOS] [numeric](10, 2) NULL,
	[ConsEnfotrosArt12HOS] [numeric](10, 2) NULL,
	[PradotrosArt12HOSRM] [numeric](10, 2) NULL,
	[PradotrosArt12HOSEco] [numeric](10, 2) NULL,
	[PradotrosArt12HOSTAC] [numeric](10, 2) NULL,
	[PradotrosArt12HOSRadio] [numeric](10, 2) NULL,
	[IquirotrosArt12HOS] [numeric](10, 2) NULL,
	[OppotrosArt12HOS] [numeric](10, 2) NULL,
	[PruBiomotrosArt12HOS] [numeric](10, 2) NULL,
	[PAurniotrosArt12HOS] [numeric](10, 2) NULL,
	[Piotrnoapant] [numeric](10, 2) NULL,
	[Estotrnoapant] [numeric](10, 2) NULL,
	[PrimConsotrnoapantProg] [numeric](10, 2) NULL,
	[PrimConsotrnoapantProgVideo] [numeric](10, 2) NULL,
	[PrimConsotrnoapantNoProg] [numeric](10, 2) NULL,
	[PrimConsotrnoapantNoProgVideo] [numeric](10, 2) NULL,
	[Conssucotrnoapant] [numeric](10, 2) NULL,
	[ConssucotrnoapantVideo] [numeric](10, 2) NULL,
	[SrehabnoapantHOS] [numeric](10, 2) NULL,
	[ConsEnfnoapantHOS] [numeric](10, 2) NULL,
	[PradnoapantHOSRM] [numeric](10, 2) NULL,
	[PradnoapantHOSEco] [numeric](10, 2) NULL,
	[PradnoapantHOSTAC] [numeric](10, 2) NULL,
	[PradnoapantHOSRadio] [numeric](10, 2) NULL,
	[PruBiomnoapantHOS] [numeric](10, 2) NULL,
	[IquirnoapantHOS] [numeric](10, 2) NULL,
	[OppnoapantHOS] [numeric](10, 2) NULL,
	[PAurninoapantHOS] [numeric](10, 2) NULL,
	[PItrmutConvSecBilMultHOS] [numeric](10, 2) NULL,
	[EsttrmutConvSecBilMultHOS] [numeric](10, 2) NULL,
	[PrimConsConvSecBilMultHOSProg] [numeric](10, 2) NULL,
	[PrimConsConvSecBilMultHOSProgVideo] [numeric](10, 2) NULL,
	[PrimConsConvSecBilMultHOSNoProg] [numeric](10, 2) NULL,
	[PrimConsConvSecBilMultHOSNoProgVideo] [numeric](10, 2) NULL,
	[ConssucConvSecBilMultHOS] [numeric](10, 2) NULL,
	[ConssucConvSecBilMultHOSVideo] [numeric](10, 2) NULL,
	[SrehabtrmutConvSecBilMultHOS] [numeric](10, 2) NULL,
	[ConsEnfConvSecBilMultHOS] [numeric](10, 2) NULL,
	[PrmydtrmutConvSecBilMultHOSRM] [numeric](10, 2) NULL,
	[PrmydtrmutConvSecBilMultHOSEco] [numeric](10, 2) NULL,
	[PrmydtrmutConvSecBilMultHOSTAC] [numeric](10, 2) NULL,
	[PrmydtrmutConvSecBilMultHOSRadio] [numeric](10, 2) NULL,
	[IquirtrmutConvSecBilMultHOS] [numeric](10, 2) NULL,
	[OpptrmutConvSecBilMultHOS] [numeric](10, 2) NULL,
	[PrueBiomConvSecBilMultHOS] [numeric](10, 2) NULL,
	[PAUrgNoIngrConvSecBilMultHOS] [numeric](10, 2) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Access_Conciertos_NC]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Access_Conciertos_NC')
BEGIN
CREATE TABLE [dbo].[Access_Conciertos_NC](
	[Idcentro] [nvarchar](max) NULL,
	[Ejerc] [int] NULL,
	[Numidentconc] [nvarchar](max) NULL,
	[Denosuje] [nvarchar](max) NULL,
	[direcpost] [nvarchar](max) NULL,
	[Localidres] [nvarchar](max) NULL,
	[Provinciacon] [nvarchar](max) NULL,
	[CPcon] [nvarchar](max) NULL,
	[TipConciert] [int] NULL,
	[Persfisica] [int] NULL,
	[Persjurpriv] [int] NULL,
	[Persjursist] [int] NULL,
	[PersjurOSP] [int] NULL,
	[PersjurOmutua] [int] NULL,
	[Especialid] [nvarchar](max) NULL,
	[Fautorizacion] [datetime] NULL,
	[Fsuscrip] [nvarchar](max) NULL,
	[Fprorroga] [nvarchar](max) NULL,
	[FinVigencia] [nvarchar](max) NULL,
	[Muniambito] [nvarchar](max) NULL,
	[Dista25km] [int] NULL,
	[Dista2550km] [int] NULL,
	[Masde50km] [int] NULL,
	[Costeassan] [numeric](10, 2) NULL,
	[CosteIT] [numeric](10, 2) NULL,
	[NuMut] [int] NULL,
	[NombreMutua] [nvarchar](max) NULL,
	[VíaPública] [nvarchar](max) NULL,
	[Ubicac] [nvarchar](max) NULL,
	[Localid] [nvarchar](max) NULL,
	[CP] [nvarchar](max) NULL,
	[Provincia] [nvarchar](max) NULL,
	[PAsinurg] [int] NULL,
	[PAurgencias] [int] NULL,
	[Pingresadas] [int] NULL,
	[ASAMprimcons] [int] NULL,
	[ASAMprimconsProgVideo] [int] NULL,
	[ASAMprimconsNoProg] [int] NULL,
	[ASAMprimconsNoProgVideo] [int] NULL,
	[ASAMconssuc] [int] NULL,
	[ASAMconssucVideo] [int] NULL,
	[ASAMconseenf] [int] NULL,
	[ASAMestcaus] [int] NULL,
	[ASAMsesrehab] [int] NULL,
	[ASAMplacradRM] [int] NULL,
	[ASAMplacradEco] [int] NULL,
	[ASAMplacradTAC] [int] NULL,
	[ASAMplacrad] [int] NULL,
	[ASAMintquir] [int] NULL,
	[ASAMBiomec] [int] NULL,
	[ASAMintquirmp] [int] NULL,
	[ASAMotrasprueb] [int] NULL,
	[ASHNprimcons] [int] NULL,
	[ASHNprimconsProgvideo] [int] NULL,
	[ASHNprimconsNoProg] [int] NULL,
	[ASHNprimconsNoProgvideo] [int] NULL,
	[ASHNconssuc] [int] NULL,
	[ASHNconssucvideo] [int] NULL,
	[ASHNconsenf] [int] NULL,
	[ASHNestcaus] [int] NULL,
	[ASHNsesrehab] [int] NULL,
	[ASHNplacradRM] [int] NULL,
	[ASHNplacradEco] [int] NULL,
	[ASHNplacradTAC] [int] NULL,
	[ASHNplacrad] [int] NULL,
	[ASHNintquir] [int] NULL,
	[ASHNBiomec] [int] NULL,
	[ASHNintquirmp] [int] NULL,
	[ASHNotrasprueb] [int] NULL,
	[CITnºconsesp] [int] NULL,
	[CITnºintquir] [int] NULL,
	[CITnºsesrehab] [int] NULL,
	[CITnºotrpru] [int] NULL,
	[Mutua_id] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Access_Conciertos_NV]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Access_Conciertos_NV')
BEGIN
CREATE TABLE [dbo].[Access_Conciertos_NV](
	[Idcentro] [nvarchar](max) NULL,
	[Ejerc] [int] NULL,
	[Numidentconc] [nvarchar](max) NULL,
	[Denosuje] [nvarchar](max) NULL,
	[direcpost] [nvarchar](max) NULL,
	[Localidres] [nvarchar](max) NULL,
	[Provinciacon] [nvarchar](max) NULL,
	[CPcon] [nvarchar](max) NULL,
	[TipConciert] [int] NULL,
	[Persfisica] [int] NULL,
	[Persjurpriv] [int] NULL,
	[Persjursist] [int] NULL,
	[PersjurOSP] [int] NULL,
	[PersjurOmutua] [int] NULL,
	[Especialid] [nvarchar](max) NULL,
	[Fautorizacion] [datetime] NULL,
	[Fsuscrip] [nvarchar](max) NULL,
	[Fprorroga] [nvarchar](max) NULL,
	[FinVigencia] [nvarchar](max) NULL,
	[Muniambito] [nvarchar](max) NULL,
	[Dista25km] [int] NULL,
	[Dista2550km] [int] NULL,
	[Masde50km] [int] NULL,
	[Costeassan] [numeric](10, 2) NULL,
	[CosteIT] [numeric](10, 2) NULL,
	[NuMut] [int] NULL,
	[NombreMutua] [nvarchar](max) NULL,
	[VíaPública] [nvarchar](max) NULL,
	[Ubicac] [nvarchar](max) NULL,
	[Localid] [nvarchar](max) NULL,
	[CP] [nvarchar](max) NULL,
	[Provincia] [nvarchar](max) NULL,
	[PAsinurg] [int] NULL,
	[PAurgencias] [int] NULL,
	[Pingresadas] [int] NULL,
	[ASAMprimcons] [int] NULL,
	[ASAMprimconsProgVideo] [int] NULL,
	[ASAMprimconsNoProg] [int] NULL,
	[ASAMprimconsNoProgVideo] [int] NULL,
	[ASAMconssuc] [int] NULL,
	[ASAMconssucVideo] [int] NULL,
	[ASAMconseenf] [int] NULL,
	[ASAMestcaus] [int] NULL,
	[ASAMsesrehab] [int] NULL,
	[ASAMplacradRM] [int] NULL,
	[ASAMplacradEco] [int] NULL,
	[ASAMplacradTAC] [int] NULL,
	[ASAMplacrad] [int] NULL,
	[ASAMintquir] [int] NULL,
	[ASAMBiomec] [int] NULL,
	[ASAMintquirmp] [int] NULL,
	[ASAMotrasprueb] [int] NULL,
	[ASHNprimcons] [int] NULL,
	[ASHNprimconsProgvideo] [int] NULL,
	[ASHNprimconsNoProg] [int] NULL,
	[ASHNprimconsNoProgvideo] [int] NULL,
	[ASHNconssuc] [int] NULL,
	[ASHNconssucvideo] [int] NULL,
	[ASHNconsenf] [int] NULL,
	[ASHNestcaus] [int] NULL,
	[ASHNsesrehab] [int] NULL,
	[ASHNplacradRM] [int] NULL,
	[ASHNplacradEco] [int] NULL,
	[ASHNplacradTAC] [int] NULL,
	[ASHNplacrad] [int] NULL,
	[ASHNintquir] [int] NULL,
	[ASHNBiomec] [int] NULL,
	[ASHNintquirmp] [int] NULL,
	[ASHNotrasprueb] [int] NULL,
	[CITnºconsesp] [int] NULL,
	[CITnºintquir] [int] NULL,
	[CITnºsesrehab] [int] NULL,
	[CITnºotrpru] [int] NULL,
	[Mutua_id] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Access_Conciertos_V]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Access_Conciertos_V')
BEGIN
CREATE TABLE [dbo].[Access_Conciertos_V](
	[Idcentro] [nvarchar](max) NULL,
	[Ejerc] [int] NULL,
	[Numidentconc] [nvarchar](max) NULL,
	[Denosuje] [nvarchar](max) NULL,
	[direcpost] [nvarchar](max) NULL,
	[Localidres] [nvarchar](max) NULL,
	[Provinciacon] [nvarchar](max) NULL,
	[CPcon] [nvarchar](max) NULL,
	[TipConciert] [int] NULL,
	[Persfisica] [int] NULL,
	[Persjurpriv] [int] NULL,
	[Persjursist] [int] NULL,
	[PersjurOSP] [int] NULL,
	[PersjurOmutua] [int] NULL,
	[Especialid] [nvarchar](max) NULL,
	[Fautorizacion] [datetime] NULL,
	[Fsuscrip] [nvarchar](max) NULL,
	[Fprorroga] [nvarchar](max) NULL,
	[FinVigencia] [nvarchar](max) NULL,
	[Muniambito] [nvarchar](max) NULL,
	[Dista25km] [int] NULL,
	[Dista2550km] [int] NULL,
	[Masde50km] [int] NULL,
	[Costeassan] [numeric](10, 2) NULL,
	[CosteIT] [numeric](10, 2) NULL,
	[NuMut] [int] NULL,
	[NombreMutua] [nvarchar](max) NULL,
	[VíaPública] [nvarchar](max) NULL,
	[Ubicac] [nvarchar](max) NULL,
	[Localid] [nvarchar](max) NULL,
	[CP] [nvarchar](max) NULL,
	[Provincia] [nvarchar](max) NULL,
	[PAsinurg] [int] NULL,
	[PAurgencias] [int] NULL,
	[Pingresadas] [int] NULL,
	[ASAMprimcons] [int] NULL,
	[ASAMprimconsProgVideo] [int] NULL,
	[ASAMprimconsNoProg] [int] NULL,
	[ASAMprimconsNoProgVideo] [int] NULL,
	[ASAMconssuc] [int] NULL,
	[ASAMconssucVideo] [int] NULL,
	[ASAMconseenf] [int] NULL,
	[ASAMestcaus] [int] NULL,
	[ASAMsesrehab] [int] NULL,
	[ASAMplacradRM] [int] NULL,
	[ASAMplacradEco] [int] NULL,
	[ASAMplacradTAC] [int] NULL,
	[ASAMplacrad] [int] NULL,
	[ASAMintquir] [int] NULL,
	[ASAMBiomec] [int] NULL,
	[ASAMintquirmp] [int] NULL,
	[ASAMotrasprueb] [int] NULL,
	[ASHNprimcons] [int] NULL,
	[ASHNprimconsProgvideo] [int] NULL,
	[ASHNprimconsNoProg] [int] NULL,
	[ASHNprimconsNoProgvideo] [int] NULL,
	[ASHNconssuc] [int] NULL,
	[ASHNconssucvideo] [int] NULL,
	[ASHNconsenf] [int] NULL,
	[ASHNestcaus] [int] NULL,
	[ASHNsesrehab] [int] NULL,
	[ASHNplacradRM] [int] NULL,
	[ASHNplacradEco] [int] NULL,
	[ASHNplacradTAC] [int] NULL,
	[ASHNplacrad] [int] NULL,
	[ASHNintquir] [int] NULL,
	[ASHNBiomec] [int] NULL,
	[ASHNintquirmp] [int] NULL,
	[ASHNotrasprueb] [int] NULL,
	[CITnºconsesp] [int] NULL,
	[CITnºintquir] [int] NULL,
	[CITnºsesrehab] [int] NULL,
	[CITnºotrpru] [int] NULL,
	[Mutua_id] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Access_DatosGenerales]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Access_DatosGenerales')
BEGIN
CREATE TABLE [dbo].[Access_DatosGenerales](
	[Idcentro] [nvarchar](max) NULL,
	[Ejerc] [int] NULL,
	[Mutua_id] [int] NULL,
	[Pobpr25kmAD] [numeric](10, 2) NULL,
	[Pobpr50kmAD] [numeric](10, 2) NULL,
	[Pobprmas50AD] [numeric](10, 2) NULL,
	[Obs25kmAD] [nvarchar](max) NULL,
	[Obs50kmAD] [nvarchar](max) NULL,
	[Obsmas50kmAD] [nvarchar](max) NULL,
	[Pobpr25kmCP] [numeric](10, 2) NULL,
	[Pobpr50kmCP] [numeric](10, 2) NULL,
	[Pobprmas50CP] [numeric](10, 2) NULL,
	[Pobpr25kmITCC] [numeric](10, 2) NULL,
	[Pobpr50kmITCC] [numeric](10, 2) NULL,
	[Pobprmas50ITCC] [numeric](10, 2) NULL,
	[Obs25km] [nvarchar](max) NULL,
	[Obs50km] [nvarchar](max) NULL,
	[Obsmas50km] [nvarchar](max) NULL,
	[PersSanitMedArt6NumPers] [numeric](10, 2) NULL,
	[PersSanitMedArt6GastPers] [numeric](10, 2) NULL,
	[PersSanitMedArt6HorasCP] [numeric](10, 2) NULL,
	[PersSanitMedArt6HorasCC] [numeric](10, 2) NULL,
	[PersSanitMedArt6HorasIT] [numeric](10, 2) NULL,
	[PersSanitMedArt6HorasATEP] [numeric](10, 2) NULL,
	[PersSanitMedArt6HorasAGM] [numeric](10, 2) NULL,
	[PersSanitMedArt6NumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedArt6GastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedArt6HorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6NumPers] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6GastPers] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6HorasCP] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6HorasCC] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6HorasIT] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6HorasATEP] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6HorasAGM] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6NumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6GastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedEspArt6HorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6NumPers] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6GastPers] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6HorasCP] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6HorasCC] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6HorasIT] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6HorasATEP] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6HorasAGM] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6NumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6GastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitMedGesArt6HorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7DUENumPers] [numeric](10, 2) NULL,
	[PersSanitArt7DUEGastPers] [numeric](10, 2) NULL,
	[PersSanitArt7DUEHorasCP] [numeric](10, 2) NULL,
	[PersSanitArt7DUEHorasCC] [numeric](10, 2) NULL,
	[PersSanitArt7DUEHorasIT] [numeric](10, 2) NULL,
	[PersSanitArt7DUEHorasATEP] [numeric](10, 2) NULL,
	[PersSanitArt7DUEHorasAGM] [numeric](10, 2) NULL,
	[PersSanitArt7DUENumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7DUEGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7DUEHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7FisNumPers] [numeric](10, 2) NULL,
	[PersSanitArt7FisGastPers] [numeric](10, 2) NULL,
	[PersSanitArt7FisHorasCP] [numeric](10, 2) NULL,
	[PersSanitArt7FisHorasCC] [numeric](10, 2) NULL,
	[PersSanitArt7FisHorasIT] [numeric](10, 2) NULL,
	[PersSanitArt7FisHorasATEP] [numeric](10, 2) NULL,
	[PersSanitArt7FisHorasAGM] [numeric](10, 2) NULL,
	[PersSanitArt7FisNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7FisGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7FisHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoNumPers] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoGastPers] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoHorasCP] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoHorasCC] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoHorasIT] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoHorasATEP] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoHorasAGM] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7PsicoHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocNumPers] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocGastPers] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocHorasCP] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocHorasCC] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocHorasIT] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocHorasATEP] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocHorasAGM] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TrSocHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuNumPers] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuGastPers] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuHorasCP] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuHorasCC] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuHorasIT] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuHorasATEP] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuHorasAGM] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TerOcuHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXNumPers] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXGastPers] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXHorasCP] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXHorasCC] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXHorasIT] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXHorasATEP] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXHorasAGM] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7TecRXHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7RestNumPers] [numeric](10, 2) NULL,
	[PersSanitArt7RestGastPers] [numeric](10, 2) NULL,
	[PersSanitArt7RestHorasCP] [numeric](10, 2) NULL,
	[PersSanitArt7RestHorasCC] [numeric](10, 2) NULL,
	[PersSanitArt7RestHorasIT] [numeric](10, 2) NULL,
	[PersSanitArt7RestHorasATEP] [numeric](10, 2) NULL,
	[PersSanitArt7RestHorasAGM] [numeric](10, 2) NULL,
	[PersSanitArt7RestNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7RestGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitArt7RestHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradSupNumPers] [numeric](10, 2) NULL,
	[PersSanitGradSupGastPers] [numeric](10, 2) NULL,
	[PersSanitGradSupHorasCP] [numeric](10, 2) NULL,
	[PersSanitGradSupHorasCC] [numeric](10, 2) NULL,
	[PersSanitGradSupHorasIT] [numeric](10, 2) NULL,
	[PersSanitGradSupHorasATEP] [numeric](10, 2) NULL,
	[PersSanitGradSupHorasAGM] [numeric](10, 2) NULL,
	[PersSanitGradSupNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradSupGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradSupHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfNumPers] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfGastPers] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfHorasCP] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfHorasCC] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfHorasIT] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfHorasATEP] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfHorasAGM] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradMedAuxEnfHorasPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradMedRestNumPers] [numeric](10, 2) NULL,
	[PersSanitGradMedRestGastPers] [numeric](10, 2) NULL,
	[PersSanitGradMedRestHorasCP] [numeric](10, 2) NULL,
	[PersSanitGradMedRestHorasCC] [numeric](10, 2) NULL,
	[PersSanitGradMedRestHorasIT] [numeric](10, 2) NULL,
	[PersSanitGradMedRestHorasATEP] [numeric](10, 2) NULL,
	[PersSanitGradMedRestHorasAGM] [numeric](10, 2) NULL,
	[PersSanitGradMedRestNumPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradMedRestGastPersSustInt] [numeric](10, 2) NULL,
	[PersSanitGradMedRestHorasPersSustInt] [numeric](10, 2) NULL,
	[RestPersSanitNumPers] [numeric](10, 2) NULL,
	[RestPersSanitGastPers] [numeric](10, 2) NULL,
	[RestPersSanitHorasCP] [numeric](10, 2) NULL,
	[RestPersSanitHorasCC] [numeric](10, 2) NULL,
	[RestPersSanitHorasIT] [numeric](10, 2) NULL,
	[RestPersSanitHorasATEP] [numeric](10, 2) NULL,
	[RestPersSanitHorasAGM] [numeric](10, 2) NULL,
	[RestPersSanitNumPersSustInt] [numeric](10, 2) NULL,
	[RestPersSanitGastPersSustInt] [numeric](10, 2) NULL,
	[RestPersSanitHorasPersSustInt] [numeric](10, 2) NULL,
	[PersDirCenNumPers] [numeric](10, 2) NULL,
	[PersDirCenGastPers] [numeric](10, 2) NULL,
	[PersDirCenHorasCP] [numeric](10, 2) NULL,
	[PersDirCenHorasCC] [numeric](10, 2) NULL,
	[PersDirCenHorasIT] [numeric](10, 2) NULL,
	[PersDirCenHorasATEP] [numeric](10, 2) NULL,
	[PersDirCenHorasAGM] [numeric](10, 2) NULL,
	[PersDirCenNumPersSustInt] [numeric](10, 2) NULL,
	[PersDirCenGastPersSustInt] [numeric](10, 2) NULL,
	[PersDirCenHorasPersSustInt] [numeric](10, 2) NULL,
	[PersAdminNumPers] [numeric](10, 2) NULL,
	[PersAdminGastPers] [numeric](10, 2) NULL,
	[PersAdminHorasCP] [numeric](10, 2) NULL,
	[PersAdminHorasCC] [numeric](10, 2) NULL,
	[PersAdminHorasIT] [numeric](10, 2) NULL,
	[PersAdminHorasATEP] [numeric](10, 2) NULL,
	[PersAdminHorasAGM] [numeric](10, 2) NULL,
	[PersAdminNumPersSustInt] [numeric](10, 2) NULL,
	[PersAdminGastPersSustInt] [numeric](10, 2) NULL,
	[PersAdminHorasPersSustInt] [numeric](10, 2) NULL,
	[PersTecPreNumPers] [numeric](10, 2) NULL,
	[PersTecPreGastPers] [numeric](10, 2) NULL,
	[PersTecPreHorasCP] [numeric](10, 2) NULL,
	[PersTecPreHorasCC] [numeric](10, 2) NULL,
	[PersTecPreHorasIT] [numeric](10, 2) NULL,
	[PersTecPreHorasATEP] [numeric](10, 2) NULL,
	[PersTecPreHorasAGM] [numeric](10, 2) NULL,
	[PersTecPreNumPersSustInt] [numeric](10, 2) NULL,
	[PersTecPreGastPersSustInt] [numeric](10, 2) NULL,
	[PersTecPreHorasPersSustInt] [numeric](10, 2) NULL,
	[PersNoAdminNumPers] [numeric](10, 2) NULL,
	[PersNoAdminGastPers] [numeric](10, 2) NULL,
	[PersNoAdminHorasCP] [numeric](10, 2) NULL,
	[PersNoAdminHorasCC] [numeric](10, 2) NULL,
	[PersNoAdminHorasIT] [numeric](10, 2) NULL,
	[PersNoAdminHorasATEP] [numeric](10, 2) NULL,
	[PersNoAdminHorasAGM] [numeric](10, 2) NULL,
	[PersNoAdminNumPersSustInt] [numeric](10, 2) NULL,
	[PersNoAdminGastPersSustInt] [numeric](10, 2) NULL,
	[PersNoAdminHorasPersSustInt] [numeric](10, 2) NULL,
	[GasbienescysASCP] [numeric](10, 2) NULL,
	[GasbienescysASCC] [numeric](10, 2) NULL,
	[GasbienescysCIT] [numeric](10, 2) NULL,
	[GasbienescysPSS] [numeric](10, 2) NULL,
	[GasbienescysAG] [numeric](10, 2) NULL,
	[GasfinAG] [numeric](10, 2) NULL,
	[GasfinASCC] [numeric](10, 2) NULL,
	[GasfinASCP] [numeric](10, 2) NULL,
	[GasfinCIT] [numeric](10, 2) NULL,
	[GasfinPSS] [numeric](10, 2) NULL,
	[AmortizASCP] [numeric](10, 2) NULL,
	[AmortizASCC] [numeric](10, 2) NULL,
	[AmortizCIT] [numeric](10, 2) NULL,
	[AmortizPSS] [numeric](10, 2) NULL,
	[AmortizAG] [numeric](10, 2) NULL,
	[Inversnue] [numeric](10, 2) NULL,
	[Inversrep] [numeric](10, 2) NULL,
	[Factpendcobro] [numeric](10, 2) NULL,
	[Factejercresto] [numeric](10, 2) NULL,
	[Factejercsist] [numeric](10, 2) NULL,
	[FactejerotrmutuasCC] [numeric](10, 2) NULL,
	[FactejerotrmutuasCP] [numeric](10, 2) NULL,
	[OtrasObservac] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Access_FincasRegistrales]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Access_FincasRegistrales')
BEGIN
CREATE TABLE [dbo].[Access_FincasRegistrales](
	[Idcentro] [nvarchar](max) NULL,
	[Ejerc] [int] NULL,
	[ViaPublica] [nvarchar](max) NULL,
	[NombreVia] [nvarchar](max) NULL,
	[NumVia] [nvarchar](max) NULL,
	[Piso] [nvarchar](max) NULL,
	[Puerta] [nvarchar](max) NULL,
	[Otrosdatos] [nvarchar](max) NULL,
	[SupConst] [numeric](10, 2) NULL,
	[Costealq] [numeric](10, 2) NULL,
	[Titinmueble] [nvarchar](max) NULL,
	[Fadqoarr] [datetime] NULL,
	[Finscreg] [datetime] NULL,
	[Utilizacion] [nvarchar](max) NULL,
	[ReferenciaCatastral] [nvarchar](max) NULL,
	[Mutua_id] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Access_IdentificacionCentros]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Access_IdentificacionCentros')
BEGIN
CREATE TABLE [dbo].[Access_IdentificacionCentros](
	[Idcentro] [nvarchar](max) NULL,
	[NuMut] [int] NULL,
	[Denomin] [nvarchar](max) NULL,
	[Ejerc] [int] NULL,
	[VíaPública] [nvarchar](max) NULL,
	[Nombrevia] [nvarchar](max) NULL,
	[Numvia] [nvarchar](max) NULL,
	[Piso] [nvarchar](max) NULL,
	[Puerta] [nvarchar](max) NULL,
	[OtrosDatos] [nvarchar](max) NULL,
	[Localid] [nvarchar](max) NULL,
	[Provincia] [nvarchar](max) NULL,
	[CP] [nvarchar](max) NULL,
	[Numident] [nvarchar](max) NULL,
	[Numutcesion] [nvarchar](max) NULL,
	[Denom_Mut_Cesion] [nvarchar](max) NULL,
	[Telefono] [int] NULL,
	[Nfincreg] [numeric](10, 2) NULL,
	[Servesp] [nvarchar](max) NULL,
	[Ahospit] [nvarchar](max) NULL,
	[Asanmb] [nvarchar](max) NULL,
	[Rehab] [nvarchar](max) NULL,
	[ContradIT] [nvarchar](max) NULL,
	[PrevrlabSSOC] [nvarchar](max) NULL,
	[AdmgralMut] [nvarchar](max) NULL,
	[Otrasact] [nvarchar](max) NULL,
	[Tipcent] [nvarchar](max) NULL,
	[SuptotConst] [numeric](10, 2) NULL,
	[Fautocom] [datetime] NULL,
	[Fpufuncio] [datetime] NULL,
	[Fcalisuf] [datetime] NULL,
	[Numcamas] [numeric](10, 2) NULL,
	[Numquirof] [numeric](10, 2) NULL,
	[Hormande] [nvarchar](max) NULL,
	[Hormanha] [nvarchar](max) NULL,
	[Hortardes] [nvarchar](max) NULL,
	[Hortarhas] [nvarchar](max) NULL,
	[Numdiano] [numeric](10, 2) NULL,
	[Numdcierre] [numeric](10, 2) NULL,
	[Fechaciere] [datetime] NULL,
	[Traslado] [nvarchar](max) NULL,
	[TraslNdirec] [nvarchar](max) NULL,
	[Mutua_id] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_AgrupacionConciertos]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_AgrupacionConciertos')
BEGIN
CREATE TABLE [dbo].[Aux_AgrupacionConciertos](
	[Agrupacion_id] [int] IDENTITY(4,1) NOT NULL,
	[Agrupacion] [nvarchar](50) NULL,
 CONSTRAINT [PK_Aux_AgrupacionConciertos] PRIMARY KEY CLUSTERED 
(
	[Agrupacion_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_AmbitosCobertura]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_AmbitosCobertura')
BEGIN
CREATE TABLE [dbo].[Aux_AmbitosCobertura](
	[Ambito_id] [bigint] IDENTITY(1,1) NOT NULL,
	[Ambito] [nvarchar](100) NULL,
 CONSTRAINT [PK_Aux_AmbitosCobertura] PRIMARY KEY CLUSTERED 
(
	[Ambito_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_Areas]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_Areas')
BEGIN
CREATE TABLE [dbo].[Aux_Areas](
	[Area_id] [int] IDENTITY(1,1) NOT NULL,
	[Area] [varchar](50) NULL,
 CONSTRAINT [PK_Areas] PRIMARY KEY CLUSTERED 
(
	[Area_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_DescripcionesSeguimiento]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_DescripcionesSeguimiento')
BEGIN
CREATE TABLE [dbo].[Aux_DescripcionesSeguimiento](
	[DescripcionAccion_id] [bigint] NOT NULL,
	[DescripcionAccion] [nvarchar](200) NULL,
	[UsuarioModificacion_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Aux_Aux_DescripcionesSeguimiento] PRIMARY KEY CLUSTERED 
(
	[DescripcionAccion_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_Estados_Demanda]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_Estados_Demanda')
BEGIN
CREATE TABLE [dbo].[Aux_Estados_Demanda](
	[Estado_id] [int] IDENTITY(1,1) NOT NULL,
	[Estado] [nvarchar](200) NULL,
	[UsuarioModificacion_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Aux_Estados_Demanda] PRIMARY KEY CLUSTERED 
(
	[Estado_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_EstadosInformesICG]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_EstadosInformesICG')
BEGIN
CREATE TABLE [dbo].[Aux_EstadosInformesICG](
	[EstadoInforme_id] [int] IDENTITY(1,1) NOT NULL,
	[EstadoInforme] [varchar](50) NULL,
 CONSTRAINT [PK_Aux_EstadosInformesICG06] PRIMARY KEY CLUSTERED 
(
	[EstadoInforme_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_FichasSistema]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_FichasSistema')
BEGIN
CREATE TABLE [dbo].[Aux_FichasSistema](
	[Ficha_id] [int] IDENTITY(58,1) NOT NULL,
	[Ficha] [nvarchar](max) NULL,
	[UsuarioModificacion] [int] NULL,
	[FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Aux_FichasSistema] PRIMARY KEY CLUSTERED 
(
	[Ficha_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_IconosMutuas]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_IconosMutuas')
BEGIN
CREATE TABLE [dbo].[Aux_IconosMutuas](
	[Icono_id] [int] IDENTITY(1,1) NOT NULL,
	[Mutua_id] [int] NULL,
	[Icono] [nvarchar](300) NULL,
 CONSTRAINT [PK_Aux_IconosMutuas] PRIMARY KEY CLUSTERED 
(
	[Icono_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_Informes_Acuerdos]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_Informes_Acuerdos')
BEGIN
CREATE TABLE [dbo].[Aux_Informes_Acuerdos](
	[Tipo_acuerdo_id] [nchar](10) NOT NULL,
	[Tipo_acuerdo] [nchar](100) NOT NULL,
 CONSTRAINT [PK_Informes_Acuerdos_Aux] PRIMARY KEY CLUSTERED 
(
	[Tipo_acuerdo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_Meses]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_Meses')
BEGIN
CREATE TABLE [dbo].[Aux_Meses](
	[Mes_id] [int] IDENTITY(1,1) NOT NULL,
	[Mes] [nvarchar](100) NULL,
 CONSTRAINT [PK_Aux_Meses] PRIMARY KEY CLUSTERED 
(
	[Mes_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_Poblaciones_Cod_Postales]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_Poblaciones_Cod_Postales')
BEGIN
CREATE TABLE [dbo].[Aux_Poblaciones_Cod_Postales](
	[Registro_id] [int] IDENTITY(1,1) NOT NULL,
	[Poblacion_id] [int] NOT NULL,
	[CP] [nvarchar](5) NOT NULL,
 CONSTRAINT [PK_Aux_Poblaciones_Cod_Postales] PRIMARY KEY CLUSTERED 
(
	[Registro_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_SesionUsuario]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_SesionUsuario')
BEGIN
CREATE TABLE [dbo].[Aux_SesionUsuario](
	[Usuario] [varchar](30) NULL,
	[Contrasena] [nvarchar](max) NULL,
	[Intentos] [int] NOT NULL,
	[FechaIntento] [datetime] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_TipoAnulacion]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_TipoAnulacion')
BEGIN
CREATE TABLE [dbo].[Aux_TipoAnulacion](
	[TipoAnulacion_id] [int] NOT NULL,
	[Motivo] [nvarchar](50) NULL,
 CONSTRAINT [PK_Aux_TipoAnulacion] PRIMARY KEY CLUSTERED 
(
	[TipoAnulacion_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_TipoFinca]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_TipoFinca')
BEGIN
CREATE TABLE [dbo].[Aux_TipoFinca](
	[TipoFinca_ID] [int] NULL,
	[TipoFinca] [nvarchar](50) NULL
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_TipoRechazo]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_TipoRechazo')
BEGIN
CREATE TABLE [dbo].[Aux_TipoRechazo](
	[TipoRechazo_id] [int] IDENTITY(1,1) NOT NULL,
	[Rechazo] [nvarchar](50) NULL,
 CONSTRAINT [PK_Aux_TipoRechazo] PRIMARY KEY CLUSTERED 
(
	[TipoRechazo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_TiposAcreditacion]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_TiposAcreditacion')
BEGIN
CREATE TABLE [dbo].[Aux_TiposAcreditacion](
	[TipoAcreditacion_id] [int] IDENTITY(1,1) NOT NULL,
	[TipoAcreditacion] [nvarchar](300) NULL,
	[UsuarioModificacion_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Aux_TiposAcreditacion] PRIMARY KEY CLUSTERED 
(
	[TipoAcreditacion_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_TiposDemanda]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_TiposDemanda')
BEGIN
CREATE TABLE [dbo].[Aux_TiposDemanda](
	[Tipo_id] [int] IDENTITY(1,1) NOT NULL,
	[Tipo] [nvarchar](300) NULL,
	[Usuario_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Aux_TiposDemanda] PRIMARY KEY CLUSTERED 
(
	[Tipo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_TipoServicio]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_TipoServicio')
BEGIN
CREATE TABLE [dbo].[Aux_TipoServicio](
	[TipoServicio_id] [int] IDENTITY(1,1) NOT NULL,
	[TipoServicio] [nvarchar](100) NULL,
	[TipoServicio_nan] [nchar](2) NULL,
PRIMARY KEY CLUSTERED 
(
	[TipoServicio_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Aux_TiposSeguimiento]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Aux_TiposSeguimiento')
BEGIN
CREATE TABLE [dbo].[Aux_TiposSeguimiento](
	[TipoAccion_id] [bigint] NOT NULL,
	[TipoAccion] [nvarchar](200) NULL,
	[UsuarioModificacion_id] [bigint] NULL,
	[FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Aux_TiposSeguimiento] PRIMARY KEY CLUSTERED 
(
	[TipoAccion_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[CentrosEspecialidades]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CentrosEspecialidades')
BEGIN
CREATE TABLE [dbo].[CentrosEspecialidades](
	[CentroEspecialidad_id] [int] IDENTITY(1,1) NOT NULL,
	[Centro_id] [int] NOT NULL,
	[Mutua_id] [int] NOT NULL,
	[Año] [int] NOT NULL,
	[Especialidad_id] [int] NOT NULL,
	[Servicio] [nvarchar](150) NOT NULL,
	[Cantidad] [int] NULL,
	[ImporteConIVA] [float] NULL,
	[Servicio_id] [int] NULL,
 CONSTRAINT [PK_CentrosEspecialidades] PRIMARY KEY CLUSTERED 
(
	[Centro_id] ASC,
	[Mutua_id] ASC,
	[Año] ASC,
	[Especialidad_id] ASC,
	[Servicio] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[CentrosPropiosCatalogoServicios]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CentrosPropiosCatalogoServicios')
BEGIN
CREATE TABLE [dbo].[CentrosPropiosCatalogoServicios](
	[CentroPropioCatalogoServicios_id] [int] IDENTITY(1,1) NOT NULL,
	[Centro_id] [int] NOT NULL,
	[Servicio_id] [int] NOT NULL,
	[Especialidad_id] [int] NOT NULL,
	[Año] [int] NOT NULL,
	[Disponibilidad] [int] NOT NULL,
	[UsuarioAlta_id] [int] NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioBaja_id] [int] NULL,
	[FechaBaja] [datetime] NULL,
 CONSTRAINT [PK_CentrosPropiosCatalogoServicios] PRIMARY KEY CLUSTERED 
(
	[CentroPropioCatalogoServicios_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[CitacionDocumentacion]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CitacionDocumentacion')
BEGIN
CREATE TABLE [dbo].[CitacionDocumentacion](
	[Doc_id] [bigint] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](max) NULL,
	[Nombre_fisico_servidor] [nvarchar](max) NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioAlta] [int] NULL,
	[Mutua_id] [int] NULL,
	[Citacion_id] [int] NULL,
	[Demanda_id] [int] NULL,
 CONSTRAINT [PK_Documentacion] PRIMARY KEY CLUSTERED 
(
	[Doc_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[CodigosCIEP]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CodigosCIEP')
BEGIN
CREATE TABLE [dbo].[CodigosCIEP](
	[CIEP_id] [int] IDENTITY(1,1) NOT NULL,
	[CIEP] [nvarchar](50) NOT NULL,
	[Especialidad_id] [int] NOT NULL,
 CONSTRAINT [PK_CodigosCIEP] PRIMARY KEY CLUSTERED 
(
	[CIEP_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[ConciertosAmbitoCobertura]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ConciertosAmbitoCobertura')
BEGIN
CREATE TABLE [dbo].[ConciertosAmbitoCobertura](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Concierto_id] [int] NOT NULL,
	[Ambito_id] [int] NOT NULL,
	[Poblacion_id] [int] NOT NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioAlta_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificacion_id] [int] NULL,
	[CP] [char](5) NULL,
 CONSTRAINT [PK_ConciertosAmbitoCobertura] PRIMARY KEY CLUSTERED 
(
	[Concierto_id] ASC,
	[Ambito_id] ASC,
	[Poblacion_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[ConciertosDocumentos]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ConciertosDocumentos')
BEGIN
CREATE TABLE [dbo].[ConciertosDocumentos](
	[Concierto_id] [int] NULL,
	[Documento_id] [int] IDENTITY(1,1) NOT NULL,
	[Documento] [nvarchar](100) NULL,
	[Titulo] [nvarchar](100) NULL,
	[FechaVigencia] [datetime] NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioAlta_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificacion_id] [int] NULL,
	[Observaciones] [nvarchar](500) NULL,
 CONSTRAINT [PK_ConciertosDocumentos] PRIMARY KEY CLUSTERED 
(
	[Documento_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Configuracion_Administracion]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Configuracion_Administracion')
BEGIN
CREATE TABLE [dbo].[Configuracion_Administracion](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[FechaBloqueoDesde] [date] NOT NULL,
	[FechaBloqueoHasta] [date] NOT NULL,
	[MinimoServicios] [int] NOT NULL,
	[RatioServicios] [float] NOT NULL,
	[UsuarioModificacion_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[PlazoRespuestaDemandasAnuales] [int] NOT NULL,
	[PlazoRespuestaDemandaAnualTrasAviso] [int] NOT NULL,
	[PlazoContestacionRespuestaRecibida] [int] NOT NULL,
	[PlazoEjecucionProcesosAutomaticos] [int] NOT NULL,
 CONSTRAINT [PK_Configuracion_Administracion] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Delegaciones]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Delegaciones')
BEGIN
CREATE TABLE [dbo].[Delegaciones](
	[Delegacion_id] [int] IDENTITY(1,1) NOT NULL,
	[Proveedor_id] [int] NOT NULL,
	[Delegacion] [nvarchar](100) NULL,
	[CodigoCuenta] [nvarchar](50) NULL,
	[Poblacion_id] [int] NULL,
	[CP] [char](5) NULL,
 CONSTRAINT [PK_Delegaciones] PRIMARY KEY CLUSTERED 
(
	[Delegacion_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[DemandasDocumentacion]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DemandasDocumentacion')
BEGIN
CREATE TABLE [dbo].[DemandasDocumentacion](
	[Documento_id] [int] IDENTITY(1,1) NOT NULL,
	[NombreDocumento] [nvarchar](max) NULL,
	[Nombre] [nvarchar](max) NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioAlta] [int] NULL,
	[Mutua_id] [int] NULL,
	[Demanda_id] [int] NULL,
 CONSTRAINT [PK_DemandasDocumentacion] PRIMARY KEY CLUSTERED 
(
	[Documento_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Descuadres]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Descuadres')
BEGIN
CREATE TABLE [dbo].[Descuadres](
	[Usuario_id] [int] NOT NULL,
	[Mutua_id] [int] NOT NULL,
	[GastoPersonal] [numeric](18, 2) NULL,
	[Amortizacion] [numeric](18, 2) NULL,
	[InversionNueva] [numeric](18, 2) NULL,
	[InversionReposicion] [numeric](18, 2) NULL,
	[OtrosIngresos] [numeric](18, 2) NULL,
	[MediosAjenos] [numeric](18, 2) NULL,
	[Aplicacion2581] [numeric](18, 2) NULL,
	[Aplicacion2582] [numeric](18, 2) NULL,
	[Resto25] [numeric](18, 2) NULL,
	[RegPropiosValidados] [int] NULL,
	[RegPropiosSinValidar] [int] NULL,
	[RegConcertadosValidados] [int] NULL,
	[RegConcertadosSinValidar] [int] NULL,
	[GastoCorrientes] [numeric](18, 2) NULL,
	[GastosFinancieros] [numeric](18, 2) NULL,
 CONSTRAINT [PK_Descuadres1] PRIMARY KEY CLUSTERED 
(
	[Usuario_id] ASC,
	[Mutua_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Ejercicios]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Ejercicios')
BEGIN
CREATE TABLE [dbo].[Ejercicios](
	[Año] [int] NOT NULL,
	[FechaApertura] [datetime] NULL,
	[FechaCierre] [datetime] NULL,
 CONSTRAINT [PK_Ejercicios] PRIMARY KEY CLUSTERED 
(
	[Año] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Ficheros]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Ficheros')
BEGIN
CREATE TABLE [dbo].[Ficheros](
	[Fichero_Id] [int] IDENTITY(1,1) NOT NULL,
	[Fichero] [nvarchar](200) NULL,
	[Descripción] [nvarchar](1000) NULL,
	[Usuario_id] [int] NULL,
	[Fecha] [datetime] NULL,
	[Area_id] [int] NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioAlta_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificacion_id] [int] NULL,
 CONSTRAINT [PK_Ficheros] PRIMARY KEY CLUSTERED 
(
	[Fichero_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[FicherosAcreditaciones_Informes]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'FicherosAcreditaciones_Informes')
BEGIN
CREATE TABLE [dbo].[FicherosAcreditaciones_Informes](
	[Fichero_id] [int] IDENTITY(13800,1) NOT NULL,
	[Fichero] [nvarchar](max) NULL,
	[TipoAcreditacion_id] [int] NULL,
	[Demanda_id] [int] NULL,
	[Servicio] [nvarchar](max) NULL,
	[Especialidad] [nvarchar](max) NULL,
	[Poblacion] [nvarchar](max) NULL,
	[Provincia] [nvarchar](max) NULL,
	[Mutua_id] [int] NOT NULL,
	[NombreFichero] [nvarchar](max) NULL,
	[FechaAlta] [date] NULL,
	[Visible] [int] NULL,
	[Activo_id] [int] NULL,
 CONSTRAINT [PK_FicherosAcreditaciones_Informes] PRIMARY KEY CLUSTERED 
(
	[Fichero_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[FicherosGenerados]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'FicherosGenerados')
BEGIN
CREATE TABLE [dbo].[FicherosGenerados](
	[FicheroGenerado_id] [int] IDENTITY(1,1) NOT NULL,
	[Mutua_id] [nchar](10) NULL,
	[Año] [int] NULL,
	[FicheroGenerado] [nvarchar](200) NULL,
	[UsuarioAlta_id] [int] NULL,
	[FechaAlta] [datetime] NULL,
	[Estado_id] [int] NULL,
	[TipoCentro_id] [int] NULL,
	[TipoConcierto_id] [int] NULL,
 CONSTRAINT [PK_FicherosGenerados] PRIMARY KEY CLUSTERED 
(
	[FicheroGenerado_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[FincasRegistrales]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'FincasRegistrales')
BEGIN
CREATE TABLE [dbo].[FincasRegistrales](
	[Finca_id] [int] IDENTITY(1,1) NOT NULL,
	[Centro_id] [int] NULL,
	[NombreVia] [nvarchar](250) NULL,
	[Numero] [nvarchar](50) NULL,
	[TipoVia_id] [nvarchar](10) NULL,
	[Piso] [nvarchar](50) NULL,
	[Puerta] [nvarchar](50) NULL,
	[Otros Datos] [nvarchar](100) NULL,
	[Superficie] [float] NULL,
	[Coste] [float] NULL,
	[Titinmueble] [nvarchar](150) NULL,
	[Fadqoarr] [datetime] NULL,
	[Finscreg] [datetime] NULL,
	[Utilizacion] [nvarchar](50) NULL,
	[Localizador] [nvarchar](50) NULL,
	[FechaBaja] [datetime] NULL,
	[id_Finca_ICG_Access] [int] NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioAlta_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[Referencia Catastral] [nvarchar](max) NULL,
	[TipoFinca] [int] NULL,
	[DireccionElectronica] [varchar](100) NULL,
	[PersonaContacto] [varchar](100) NULL,
 CONSTRAINT [PK_FincasRegistrales] PRIMARY KEY CLUSTERED 
(
	[Finca_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[FincasRegistrales_CostesPorAño]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'FincasRegistrales_CostesPorAño')
BEGIN
CREATE TABLE [dbo].[FincasRegistrales_CostesPorAño](
	[Finca_id] [int] NOT NULL,
	[Localizador] [nvarchar](50) NULL,
	[Año] [int] NOT NULL,
	[Coste] [float] NULL,
	[ID] [int] IDENTITY(1,1) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Historico_CatalogoCompletoServicios]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Historico_CatalogoCompletoServicios')
BEGIN
CREATE TABLE [dbo].[Historico_CatalogoCompletoServicios](
	[HistoricoCatalogoCompletoServicios_id] [int] IDENTITY(1,1) NOT NULL,
	[Centro_id] [int] NOT NULL,
	[Servicio_id] [int] NOT NULL,
	[Disponibilidad] [int] NOT NULL,
	[Año] [int] NOT NULL,
	[Usuario_id] [int] NULL,
	[FechaModificacion] [datetime] NULL
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Historico_CentrosPropiosEspecialidades]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Historico_CentrosPropiosEspecialidades')
BEGIN
CREATE TABLE [dbo].[Historico_CentrosPropiosEspecialidades](
	[HistoricoCentroPropioEspecialidad_id] [int] IDENTITY(1,1) NOT NULL,
	[Centro_id] [int] NULL,
	[Año] [int] NULL,
	[Especialidad_id] [int] NULL,
	[Servicio_id] [bigint] NULL,
	[FechaAlta] [datetime] NULL,
	[FechaBaja] [datetime] NULL,
	[Disponibilidad] [int] NULL,
	[Ene] [int] NULL,
	[Feb] [int] NULL,
	[Mar] [int] NULL,
	[Abr] [int] NULL,
	[May] [int] NULL,
	[Jun] [int] NULL,
	[Jul] [int] NULL,
	[Ago] [int] NULL,
	[Sep] [int] NULL,
	[Oct] [int] NULL,
	[Nov] [int] NULL,
	[Dic] [int] NULL,
	[UsuarioModificacion_id] [int] NULL,
 CONSTRAINT [PK_Historico_CentrosPropiosEspecialidades] PRIMARY KEY CLUSTERED 
(
	[HistoricoCentroPropioEspecialidad_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Informes]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Informes')
BEGIN
CREATE TABLE [dbo].[Informes](
	[Informe_id] [int] IDENTITY(1,1) NOT NULL,
	[Tipo] [nvarchar](50) NULL,
	[Informe] [nvarchar](100) NOT NULL,
	[Pagina] [nvarchar](100) NULL,
 CONSTRAINT [PK_Informes] PRIMARY KEY CLUSTERED 
(
	[Informe_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Informes_Acuerdos]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Informes_Acuerdos')
BEGIN
CREATE TABLE [dbo].[Informes_Acuerdos](
	[Informes_id] [int] IDENTITY(1,1) NOT NULL,
	[Informe] [nchar](250) NULL,
	[Mutua_id] [int] NULL,
	[Año] [int] NULL,
	[Mes] [int] NULL,
	[EstadoInforme_id] [int] NULL,
	[TipoAcuerdo] [nchar](10) NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificacion] [int] NULL,
 CONSTRAINT [PK_Informes_Acuerdos] PRIMARY KEY CLUSTERED 
(
	[Informes_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Informes_Direccion_Agrupados]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Informes_Direccion_Agrupados')
BEGIN
CREATE TABLE [dbo].[Informes_Direccion_Agrupados](
	[Informe_id] [int] IDENTITY(1,1) NOT NULL,
	[Informe] [nvarchar](max) NULL,
	[Mutua_id] [int] NULL,
	[Año] [int] NULL,
	[Mes] [int] NULL,
	[Activo] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificacion] [int] NULL,
 CONSTRAINT [PK_Informes_Direccion_Agrupados] PRIMARY KEY CLUSTERED 
(
	[Informe_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Informes_ICG]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Informes_ICG')
BEGIN
CREATE TABLE [dbo].[Informes_ICG](
	[Informe_id] [int] IDENTITY(1,1) NOT NULL,
	[Informe] [nvarchar](max) NULL,
	[ResultadoInforme] [nvarchar](max) NULL,
	[Mutua_id] [int] NULL,
	[Año] [int] NULL,
	[Mes] [int] NULL,
	[EstadoInforme_id] [int] NULL,
	[TipoICG] [nvarchar](10) NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificación] [int] NULL,
 CONSTRAINT [PK_Informes_ICG06] PRIMARY KEY CLUSTERED 
(
	[Informe_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Motivos]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Motivos')
BEGIN
CREATE TABLE [dbo].[Motivos](
	[Motivo_id] [int] IDENTITY(1,1) NOT NULL,
	[Motivo] [char](10) NULL,
 CONSTRAINT [PK_Motivos] PRIMARY KEY CLUSTERED 
(
	[Motivo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Mutuas_bm]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Mutuas_bm')
BEGIN
CREATE TABLE [dbo].[Mutuas_bm](
	[Mutua_id] [int] IDENTITY(1,1) NOT NULL,
	[NumeroMutua] [varchar](3) NULL,
	[Mutua] [varchar](100) NULL,
	[RazonSocial] [varchar](100) NULL,
	[Direccion] [varchar](100) NULL,
	[CP] [char](5) NULL,
	[Poblacion_id] [int] NULL,
	[Telefono] [char](15) NULL,
	[Fax] [char](15) NULL,
	[DireccionElectronica] [varchar](100) NULL,
	[PersonaContacto] [varchar](250) NULL,
	[Logotipo] [varchar](100) NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioAlta_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificacion_id] [int] NULL,
	[FechaBaja] [datetime] NULL,
	[UsuarioBaja_id] [int] NULL,
 CONSTRAINT [PK_Mutuas_bm] PRIMARY KEY CLUSTERED 
(
	[Mutua_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[MutuasPresupuesto]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MutuasPresupuesto')
BEGIN
CREATE TABLE [dbo].[MutuasPresupuesto](
	[Id_Presupuesto] [int] IDENTITY(1,1) NOT NULL,
	[Año] [char](4) NOT NULL,
	[Mutua_id] [int] NOT NULL,
	[PresupuestoCapitulo1Propio] [float] NULL,
	[PresupuestoCapitulo2Propio] [float] NULL,
	[PresupuestoCapitulo3Propio] [float] NULL,
	[PresupuestoCapitulo4Propio] [float] NULL,
	[PresupuestoCapitulo5Propio] [float] NULL,
	[PresupuestoCapitulo6Propio] [float] NULL,
	[PresupuestoCapitulo1Concertado] [float] NULL,
	[PresupuestoCapitulo2Concertado] [float] NULL,
	[PresupuestoArticulo2581] [float] NULL,
	[PresupuestoArticulo2582] [float] NULL,
	[PresupuestoArticulo25Resto] [float] NULL,
	[PresupuestoGastosFinancieros] [float] NULL,
 CONSTRAINT [PK_MutuasPresupuesto] PRIMARY KEY CLUSTERED 
(
	[Id_Presupuesto] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Perfiles]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Perfiles')
BEGIN
CREATE TABLE [dbo].[Perfiles](
	[Perfil_id] [int] IDENTITY(1,1) NOT NULL,
	[Perfil] [varchar](50) NULL,
 CONSTRAINT [PK_TipoAcceso] PRIMARY KEY CLUSTERED 
(
	[Perfil_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Proveedores]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Proveedores')
BEGIN
CREATE TABLE [dbo].[Proveedores](
	[Proveedor_id] [int] IDENTITY(1,1) NOT NULL,
	[TipoProveedor_id] [int] NULL,
	[CIFNIF] [nvarchar](15) NULL,
	[CodigoCuenta] [nvarchar](50) NULL,
	[Proveedor] [nvarchar](150) NULL,
	[Poblacion_id] [int] NULL,
	[CP] [char](5) NULL,
 CONSTRAINT [PK_Proveedores] PRIMARY KEY CLUSTERED 
(
	[Proveedor_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[PS_AcuerdosBI_MultilateralesMutuas_Demanda]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PS_AcuerdosBI_MultilateralesMutuas_Demanda')
BEGIN
CREATE TABLE [dbo].[PS_AcuerdosBI_MultilateralesMutuas_Demanda](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[IDMutuaAnio] [nvarchar](15) NULL,
	[MutuaOfertante_id] [int] NULL,
	[MutuaDemandante_id] [int] NULL,
	[NumServicios] [int] NULL,
	[ContraprestacionEconomica] [numeric](18, 2) NULL,
	[Anio] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[PS_AcuerdosBI_MultilateralesMutuas_Oferta]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PS_AcuerdosBI_MultilateralesMutuas_Oferta')
BEGIN
CREATE TABLE [dbo].[PS_AcuerdosBI_MultilateralesMutuas_Oferta](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[IDMutuaAnio] [nvarchar](15) NULL,
	[MutuaOfertante_id] [int] NULL,
	[MutuaDemandante_id] [int] NULL,
	[NumServicios] [int] NULL,
	[ContraprestacionEconomica] [numeric](18, 2) NULL,
	[Anio] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[PS_AcuerdosBI_MultilateralesMutuasProvincias_Demanda]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PS_AcuerdosBI_MultilateralesMutuasProvincias_Demanda')
BEGIN
CREATE TABLE [dbo].[PS_AcuerdosBI_MultilateralesMutuasProvincias_Demanda](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[IDMutuaAnio] [nvarchar](15) NULL,
	[MutuaDemandante_id] [int] NULL,
	[Provincia_id] [int] NULL,
	[NumServiciosBI] [int] NULL,
	[ContraprestacionEconomicaBI] [numeric](18, 2) NULL,
	[NumServiciosTerceros] [int] NULL,
	[ContraprestacionEconomicaTerceros] [numeric](18, 2) NULL,
	[Anio] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[PS_AcuerdosBI_MultilateralesMutuasProvincias_Oferta]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PS_AcuerdosBI_MultilateralesMutuasProvincias_Oferta')
BEGIN
CREATE TABLE [dbo].[PS_AcuerdosBI_MultilateralesMutuasProvincias_Oferta](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[IDMutuaAnio] [nvarchar](15) NULL,
	[MutuaOfertante_id] [int] NULL,
	[Provincia_id] [int] NULL,
	[NumServiciosBI] [int] NULL,
	[ContraprestacionEconomicaBI] [numeric](18, 2) NULL,
	[NumServiciosTerceros] [int] NULL,
	[ContraprestacionEconomicaTerceros] [numeric](18, 2) NULL,
	[Anio] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[PS_AcuerdosBI_MultilateralesMutuasTipoServicio_Demanda]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PS_AcuerdosBI_MultilateralesMutuasTipoServicio_Demanda')
BEGIN
CREATE TABLE [dbo].[PS_AcuerdosBI_MultilateralesMutuasTipoServicio_Demanda](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[IDMutuaAnio] [nvarchar](15) NULL,
	[MutuaDemandante_id] [int] NULL,
	[TipoServicio_id] [int] NULL,
	[NumTipoServicio] [nvarchar](2) NULL,
	[NumServiciosBI] [int] NULL,
	[ContraprestacionEconomicaBI] [numeric](18, 2) NULL,
	[NumServiciosTerceros] [int] NULL,
	[ContraprestacionEconomicaTerceros] [numeric](18, 2) NULL,
	[Anio] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[PS_AcuerdosBI_MultilateralesMutuasTipoServicio_Oferta]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PS_AcuerdosBI_MultilateralesMutuasTipoServicio_Oferta')
BEGIN
CREATE TABLE [dbo].[PS_AcuerdosBI_MultilateralesMutuasTipoServicio_Oferta](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[IDMutuaAnio] [nvarchar](15) NULL,
	[MutuaOfertante_id] [int] NULL,
	[TipoServicio_id] [int] NULL,
	[NumTipoServicio] [nvarchar](2) NULL,
	[NumServiciosBI] [int] NULL,
	[ContraprestacionEconomicaBI] [numeric](18, 2) NULL,
	[NumServiciosTerceros] [int] NULL,
	[ContraprestacionEconomicaTerceros] [numeric](18, 2) NULL,
	[Anio] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Registro_Errores]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Registro_Errores')
BEGIN
CREATE TABLE [dbo].[Registro_Errores](
	[Error_id] [int] IDENTITY(1,1) NOT NULL,
	[Usuario_id] [int] NULL,
	[FechaError] [datetime] NULL,
	[Descripcion] [nvarchar](2000) NULL,
	[FicheroLog] [nvarchar](200) NULL,
	[Estado_Id] [int] NULL,
	[FechaResolucion] [datetime] NULL,
	[FechaCierre] [datetime] NULL,
	[Comentarios] [nvarchar](2000) NULL,
 CONSTRAINT [PK_REGISTRO_ERRORES] PRIMARY KEY CLUSTERED 
(
	[Error_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[RegistroActividad]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RegistroActividad')
BEGIN
CREATE TABLE [dbo].[RegistroActividad](
	[Registro_id] [int] IDENTITY(5000,1) NOT NULL,
	[Usuario_id] [int] NULL,
	[Fecha] [datetime] NULL,
	[Accion] [nvarchar](250) NULL,
	[Sql] [text] NULL,
 CONSTRAINT [PK_RegistroActividad] PRIMARY KEY CLUSTERED 
(
	[Registro_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[SeguimientoOD]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SeguimientoOD')
BEGIN
CREATE TABLE [dbo].[SeguimientoOD](
	[Gestion_id] [bigint] IDENTITY(1,1) NOT NULL,
	[Usuario_id] [bigint] NULL,
	[FechaAlta] [datetime] NULL,
	[TipoAccion_id] [bigint] NULL,
	[DescripcionAccion_id] [bigint] NULL,
	[OfertaDemanda_id] [bigint] NULL,
	[Estado_id] [bigint] NULL,
	[Nota] [nvarchar](max) NULL,
	[Estado_Linea] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificacion_id] [bigint] NULL,
 CONSTRAINT [PK_SeguimientoOD] PRIMARY KEY CLUSTERED 
(
	[Gestion_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[ServiciosEspecialidades_Comparacion2]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ServiciosEspecialidades_Comparacion2')
BEGIN
CREATE TABLE [dbo].[ServiciosEspecialidades_Comparacion2](
	[Provincia_id] [nvarchar](50) NULL,
	[Poblacion] [nvarchar](max) NULL,
	[Especialidad] [nvarchar](max) NULL,
	[Servicio] [nvarchar](max) NULL,
	[Año] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Subgrupos]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Subgrupos')
BEGIN
CREATE TABLE [dbo].[Subgrupos](
	[Subgrupo_id] [varchar](6) NOT NULL,
	[Subgrupo] [varchar](100) NULL,
	[Grupo_id] [varchar](4) NOT NULL,
	[FechaAlta] [datetime] NULL,
	[UsuarioAlta_id] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificacion_id] [int] NULL,
 CONSTRAINT [PK_Subgrupos] PRIMARY KEY CLUSTERED 
(
	[Subgrupo_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Tarifas]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tarifas')
BEGIN
CREATE TABLE [dbo].[Tarifas](
	[Tarifa_id] [int] IDENTITY(17,1) NOT NULL,
	[Tarifa] [nvarchar](250) NOT NULL,
	[Año] [nvarchar](4) NOT NULL,
	[Porcentaje] [float] NULL,
	[Activo] [int] NULL,
 CONSTRAINT [PK_Tarifas_1] PRIMARY KEY CLUSTERED 
(
	[Tarifa_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[TarifasDetalle]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TarifasDetalle')
BEGIN
CREATE TABLE [dbo].[TarifasDetalle](
	[TarifaDetalle_id] [int] IDENTITY(1,1) NOT NULL,
	[Tarifa_id] [int] NOT NULL,
	[Servicio] [nvarchar](150) NULL,
	[Importe] [float] NULL,
	[Especialidad_id] [int] NULL,
	[CIEP_id] [int] NULL,
	[Observaciones] [ntext] NULL,
	[Servicio_id] [bigint] NULL,
	[AltaTec] [bit] NULL,
 CONSTRAINT [PK_TarifasDetalle_1] PRIMARY KEY CLUSTERED 
(
	[TarifaDetalle_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[TiposAsistencia]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TiposAsistencia')
BEGIN
CREATE TABLE [dbo].[TiposAsistencia](
	[Registro_id] [bigint] IDENTITY(1,1) NOT NULL,
	[TipoAsistencia_id] [int] NOT NULL,
	[TipoAsistencia] [varchar](100) NOT NULL,
	[Año] [int] NOT NULL,
 CONSTRAINT [PK_TiposConcierto] PRIMARY KEY CLUSTERED 
(
	[Registro_id] ASC,
	[TipoAsistencia_id] ASC,
	[Año] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[TiposDemanda]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TiposDemanda')
BEGIN
CREATE TABLE [dbo].[TiposDemanda](
	[TipoDemanda_id] [int] IDENTITY(1,1) NOT NULL,
	[Año] [int] NOT NULL,
	[TipoDemanda] [nvarchar](250) NOT NULL,
	[PeriodoDesde] [date] NOT NULL,
	[PeriodoHasta] [date] NOT NULL,
	[Activa_id] [int] NULL,
	[Tipo_id] [int] NULL,
	[GeneracionAcreditacion] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificacion_id] [int] NULL,
 CONSTRAINT [PK_TiposDemanda] PRIMARY KEY CLUSTERED 
(
	[TipoDemanda_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[TiposVia]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TiposVia')
BEGIN
CREATE TABLE [dbo].[TiposVia](
	[TipoVia_id] [int] IDENTITY(1,1) NOT NULL,
	[TipoVia] [nvarchar](50) NOT NULL,
	[TipoVia_Abreviada] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_TiposVia] PRIMARY KEY CLUSTERED 
(
	[TipoVia_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Usuarios]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Usuarios')
BEGIN
CREATE TABLE [dbo].[Usuarios](
	[Usuario_id] [int] IDENTITY(1,1) NOT NULL,
	[Perfil_id] [int] NULL,
	[Mutua_id] [int] NULL,
	[Centro_id] [int] NULL,
	[Usuario] [nvarchar](50) NULL,
	[DireccionElectronica] [nvarchar](150) NULL,
	[PreguntaRecordatorio] [nvarchar](150) NULL,
	[RespuestaRecordatorio] [nvarchar](150) NULL,
	[DGOSSRecibeCorreo] [bit] NULL,
	[Password] [varchar](max) NULL,
	[CorreoElectronico] [varchar](max) NULL,
	[Contraseña] [nchar](10) NULL,
	[FechaBaja] [datetime] NULL,
	[FechaPassword] [datetime] NULL,
	[CambioPassword] [bit] NULL,
	[RecibirNotificaciones] [bit] NULL,
	[Nombre] [nvarchar](50) NULL,
	[Apellidos] [nvarchar](150) NULL,
	[LimiteCorreos] [int] NULL,
	[Pass_TMP] [nvarchar](100) NULL,
	[UltimoLogin] [datetime] NULL,
	[PermisoQlikSense] [bit] NOT NULL,
 CONSTRAINT [PK_Usuarios] PRIMARY KEY CLUSTERED 
(
	[Usuario_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Usuarios_web]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Usuarios_web')
BEGIN
CREATE TABLE [dbo].[Usuarios_web](
	[Usuario_id] [int] IDENTITY(1,1) NOT NULL,
	[Usuario_id_app] [int] NULL,
	[Password] [nvarchar](max) NULL,
	[Token] [nvarchar](max) NULL,
	[CaducidadToken] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[UsuariosPorPerfilesModificar]    Script Date: 27/03/2026 8:16:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UsuariosPorPerfilesModificar')
BEGIN
CREATE TABLE [dbo].[UsuariosPorPerfilesModificar](
	[AccesoUsuario_id] [int] IDENTITY(1,1) NOT NULL,
	[Perfil_id] [int] NULL,
	[PerfilModificar_id] [int] NULL,
	[FechaModificacion] [date] NULL,
	[UsuarioModificacion] [int] NULL,
 CONSTRAINT [PK_UsuariosPorPerfilesModificar] PRIMARY KEY CLUSTERED 
(
	[AccesoUsuario_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
ALTER TABLE [dbo].[CentrosEspecialidades] ADD  CONSTRAINT [DF_CentrosEspecialidades_Cantidad]  DEFAULT ((0)) FOR [Cantidad]
GO
ALTER TABLE [dbo].[CentrosEspecialidades] ADD  CONSTRAINT [DF_CentrosEspecialidades_ImporteConIVA_1]  DEFAULT ((0)) FOR [ImporteConIVA]
GO
ALTER TABLE [dbo].[CentrosPropios] ADD  DEFAULT ((0)) FOR [Desactivado]
GO
ALTER TABLE [dbo].[CentrosPropiosEspecialidades] ADD  CONSTRAINT [DF_CentrosPropiosEspecialidades_Cantidad]  DEFAULT ((0)) FOR [Cantidad]
GO
ALTER TABLE [dbo].[CentrosPropiosEspecialidades] ADD  CONSTRAINT [DF_CentrosPropiosEspecialidades_ImporteConIVA_1]  DEFAULT ((0)) FOR [ImporteConIVA]
GO
ALTER TABLE [dbo].[ConciertosEspecialidades] ADD  CONSTRAINT [DF_ConciertosEspecialidades_Cantidad]  DEFAULT ((0)) FOR [Cantidad]
GO
ALTER TABLE [dbo].[ConciertosEspecialidades] ADD  CONSTRAINT [DF_ConciertosEspecialidades_ImporteConIVA_1]  DEFAULT ((0)) FOR [ImporteConIVA]
GO
ALTER TABLE [dbo].[Delegaciones] ADD  CONSTRAINT [DF_Delegaciones_Poblacion_id]  DEFAULT ((0)) FOR [Poblacion_id]
GO
ALTER TABLE [dbo].[FicherosAcreditaciones_Informes] ADD  CONSTRAINT [DF_FicherosAcreditaciones_Informes_Activo_id_1]  DEFAULT ((0)) FOR [Activo_id]
GO
ALTER TABLE [dbo].[MutuasPresupuesto] ADD  CONSTRAINT [DF_MutuasPresupuesto_PresupuestoGastosFinancieros_1]  DEFAULT ((0)) FOR [PresupuestoGastosFinancieros]
GO
ALTER TABLE [dbo].[Usuarios] ADD  CONSTRAINT [DF_Usuarios_LimiteCorreos]  DEFAULT ((0)) FOR [LimiteCorreos]
GO
ALTER TABLE [dbo].[Usuarios] ADD  DEFAULT ((0)) FOR [PermisoQlikSense]
GO
ALTER TABLE [dbo].[Aux_Poblaciones]  WITH CHECK ADD  CONSTRAINT [FK_Aux_Poblaciones_Aux_Provincias] FOREIGN KEY([Provincia_id])
REFERENCES [dbo].[Aux_Provincias] ([Provincia_id])
GO
ALTER TABLE [dbo].[Aux_Poblaciones] CHECK CONSTRAINT [FK_Aux_Poblaciones_Aux_Provincias]
GO
ALTER TABLE [dbo].[Aux_Poblaciones_Cod_Postales]  WITH CHECK ADD  CONSTRAINT [FK_Aux_Poblaciones_Cod_Postales_Aux_Poblaciones] FOREIGN KEY([Poblacion_id])
REFERENCES [dbo].[Aux_Poblaciones] ([Poblacion_id])
GO
ALTER TABLE [dbo].[Aux_Poblaciones_Cod_Postales] CHECK CONSTRAINT [FK_Aux_Poblaciones_Cod_Postales_Aux_Poblaciones]
GO
ALTER TABLE [dbo].[Aux_Provincias]  WITH CHECK ADD  CONSTRAINT [FK_Aux_Provincias_CCAA] FOREIGN KEY([CCAA_id])
REFERENCES [dbo].[CCAA] ([CCAA_id])
GO
ALTER TABLE [dbo].[Aux_Provincias] CHECK CONSTRAINT [FK_Aux_Provincias_CCAA]
GO
ALTER TABLE [dbo].[FincasRegistrales_CostesPorAño]  WITH NOCHECK ADD  CONSTRAINT [FK_FincasRegistrales_CostesPorAño_FincasRegistrales] FOREIGN KEY([Finca_id])
REFERENCES [dbo].[FincasRegistrales] ([Finca_id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[FincasRegistrales_CostesPorAño] CHECK CONSTRAINT [FK_FincasRegistrales_CostesPorAño_FincasRegistrales]
GO
ALTER TABLE [dbo].[TarifasDetalle]  WITH CHECK ADD  CONSTRAINT [FK_TarifasDetalle_Tarifas] FOREIGN KEY([Tarifa_id])
REFERENCES [dbo].[Tarifas] ([Tarifa_id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[TarifasDetalle] CHECK CONSTRAINT [FK_TarifasDetalle_Tarifas]
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
END TRY BEGIN CATCH END CATCH
GO
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "ICG07"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 125
               Right = 255
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "Conciertos"
            Begin Extent = 
               Top = 126
               Left = 38
               Bottom = 245
               Right = 252
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "CentrosConcertados"
            Begin Extent = 
               Top = 246
               Left = 38
               Bottom = 365
               Right = 252
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 12
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vw_Conciertos_Articulo25'
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vw_Conciertos_Articulo25'
END TRY BEGIN CATCH END CATCH
GO
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
END TRY BEGIN CATCH END CATCH
GO
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = -96
         Left = 0
      End
      Begin Tables = 
         Begin Table = "Aux_Especialidades"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 102
               Right = 247
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "ConciertosEspecialidades"
            Begin Extent = 
               Top = 102
               Left = 38
               Bottom = 232
               Right = 259
            End
            DisplayFlags = 280
            TopColumn = 3
         End
         Begin Table = "Conciertos"
            Begin Extent = 
               Top = 234
               Left = 38
               Bottom = 364
               Right = 252
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "CentrosConcertados"
            Begin Extent = 
               Top = 366
               Left = 38
               Bottom = 496
               Right = 252
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "Aux_Servicios"
            Begin Extent = 
               Top = 118
               Left = 362
               Bottom = 214
               Right = 571
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 9
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
    ' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vw_especialidadesConciertos'
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane2', @value=N'     Column = 1440
END TRY BEGIN CATCH END CATCH
GO
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vw_especialidadesConciertos'
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=2 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vw_especialidadesConciertos'
END TRY BEGIN CATCH END CATCH
GO
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
END TRY BEGIN CATCH END CATCH
GO
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "ICG06"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 136
               Right = 382
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "CentrosPropios"
            Begin Extent = 
               Top = 138
               Left = 38
               Bottom = 268
               Right = 268
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 12
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vw_Propios_Articulo32'
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vw_Propios_Articulo32'
END TRY BEGIN CATCH END CATCH
GO
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
END TRY BEGIN CATCH END CATCH
GO
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[29] 4[9] 2[42] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "ICG06"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 125
               Right = 270
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "CentrosPropios"
            Begin Extent = 
               Top = 126
               Left = 38
               Bottom = 245
               Right = 252
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 9
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 12
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vw_Propios_Capitulo1'
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vw_Propios_Capitulo1'
END TRY BEGIN CATCH END CATCH
GO
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
END TRY BEGIN CATCH END CATCH
GO
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "AccesosUsuarios"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 136
               Right = 237
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vw_Propios_Capitulo1_Anterior'
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vw_Propios_Capitulo1_Anterior'
END TRY BEGIN CATCH END CATCH
GO
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
END TRY BEGIN CATCH END CATCH
GO
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "ICG06"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 125
               Right = 270
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "CentrosPropios"
            Begin Extent = 
               Top = 126
               Left = 38
               Bottom = 245
               Right = 252
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 12
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vw_Propios_Capitulo2'
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vw_Propios_Capitulo2'
END TRY BEGIN CATCH END CATCH
GO
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
END TRY BEGIN CATCH END CATCH
GO
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4[30] 2[40] 3) )"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2[66] 3) )"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 5
   End
   Begin DiagramPane = 
      PaneHidden = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "c"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 136
               Right = 255
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "mo"
            Begin Extent = 
               Top = 138
               Left = 38
               Bottom = 268
               Right = 252
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "ms"
            Begin Extent = 
               Top = 270
               Left = 38
               Bottom = 400
               Right = 252
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "p"
            Begin Extent = 
               Top = 6
               Left = 293
               Bottom = 119
               Right = 463
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "pob"
            Begin Extent = 
               Top = 120
               Left = 293
               Bottom = 233
               Right = 463
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "mov"
            Begin Extent = 
               Top = 234
               Left = 290
               Bottom = 330
               Right = 460
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "cp"
            Begin Extent = 
               Top = 402
               Left = 38
               Bottom = 532
               Right = 252
            End
            DisplayFlags = 280
            Top' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vwCitaciones'
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane2', @value=N'Column = 0
END TRY BEGIN CATCH END CATCH
GO
         End
         Begin Table = "esp"
            Begin Extent = 
               Top = 330
               Left = 290
               Bottom = 426
               Right = 460
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "serv"
            Begin Extent = 
               Top = 426
               Left = 290
               Bottom = 522
               Right = 460
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "ofe"
            Begin Extent = 
               Top = 534
               Left = 38
               Bottom = 664
               Right = 252
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "ec"
            Begin Extent = 
               Top = 666
               Left = 38
               Bottom = 796
               Right = 252
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 9
         Width = 284
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
         Width = 1500
      End
   End
   Begin CriteriaPane = 
      PaneHidden = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vwCitaciones'
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=2 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vwCitaciones'
END TRY BEGIN CATCH END CATCH
GO
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
END TRY BEGIN CATCH END CATCH
GO
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4[30] 2[40] 3) )"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2[66] 3) )"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2) )"
      End
      ActivePaneConfig = 14
   End
   Begin DiagramPane = 
      PaneHidden = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "GestionDemanda"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 136
               Right = 244
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      PaneHidden = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      PaneHidden = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vwDemandas_Citaciones'
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vwDemandas_Citaciones'
END TRY BEGIN CATCH END CATCH
GO
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
END TRY BEGIN CATCH END CATCH
GO
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[26] 4[3] 2[52] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "GestionDemanda"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 136
               Right = 244
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vwDemandas_Citaciones_SinAgrupar'
GO
BEGIN TRY
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'vwDemandas_Citaciones_SinAgrupar'
END TRY BEGIN CATCH END CATCH
GO
GO
