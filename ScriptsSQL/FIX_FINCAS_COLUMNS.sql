/* 
   =============================================================================
   SCRIPT DE REPARACIÓN DE TABLA: FincasRegistrales
   =============================================================================
   Añade las columnas faltantes Latitud y Longitud para el funcionamiento del mapa.
   =============================================================================
*/

USE MZAsistencial;
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('FincasRegistrales') AND name = 'Latitud')
BEGIN
    PRINT 'Añadiendo columna Latitud a FincasRegistrales...';
    ALTER TABLE FincasRegistrales ADD Latitud NVARCHAR(50) NULL;
END
ELSE
BEGIN
    PRINT 'La columna Latitud ya existe.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('FincasRegistrales') AND name = 'Longitud')
BEGIN
    PRINT 'Añadiendo columna Longitud a FincasRegistrales...';
    ALTER TABLE FincasRegistrales ADD Longitud NVARCHAR(50) NULL;
END
ELSE
BEGIN
    PRINT 'La columna Longitud ya existe.';
END

PRINT '=============================================================================';
PRINT '¡COLUMNAS REPARADAS CON ÉXITO!';
PRINT '=============================================================================';
GO
