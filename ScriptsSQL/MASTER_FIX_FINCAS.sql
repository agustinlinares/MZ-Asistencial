/* 
   =============================================================================
   SCRIPT MAESTRO DE LIMPIEZA Y CARGA: MÓDULO FINCAS (MZAsistencial)
   =============================================================================
   Este script realiza tres tareas principales:
   1. Corrige caracteres mal codificados en nombres de centros y fincas.
   2. Renombra tablas y columnas con caracteres especiales (ñ) para evitar errores 500.
   3. Carga datos reales de ejemplo y costes históricos.
   =============================================================================
*/

USE MZAsistencial;
GO

-- 1. CORRECCIÓN DE CODIFICACIÓN EN DATOS EXISTENTES
-- -----------------------------------------------------------------------------
PRINT 'Corrigiendo nombres de centros y datos de fincas...';

UPDATE CentrosPropios 
SET Centro = N'Centro Médico Retiro' 
WHERE Centro_id = 5;

UPDATE FincasRegistrales 
SET [Otros Datos] = N'Sede principal zona centro',
    Utilizacion = N'Consultas médicas y fisioterapia',
    [Referencia Catastral] = N'2893401VK4729S0001GF',
    PersonaContacto = N'Ignacio García - 600123456'
WHERE Finca_id = 1;

UPDATE FincasRegistrales 
SET NombreVia = N'Velázquez' 
WHERE Finca_id = 3;


-- 2. LIMPIEZA DE ESQUEMA (ELIMINACIÓN DE CARACTERES ESPECIALES EN NOMBRES)
-- -----------------------------------------------------------------------------
-- Renombramos la tabla de costes si aún tiene el nombre corrupto
IF EXISTS (SELECT * FROM sys.tables WHERE name LIKE 'FincasRegistrales_CostesPorA%o')
BEGIN
    PRINT 'Renombrando tabla de costes a FincasRegistrales_CostesPorAnio...';
    DECLARE @OldTableName NVARCHAR(MAX);
    SELECT TOP 1 @OldTableName = name FROM sys.tables WHERE name LIKE 'FincasRegistrales_CostesPorA%o';
    EXEC sp_rename @OldTableName, 'FincasRegistrales_CostesPorAnio';
END

-- Renombramos la columna Año si aún tiene el nombre corrupto
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('FincasRegistrales_CostesPorAnio') AND name LIKE 'A%o')
BEGIN
    PRINT 'Renombrando columna Año a Anio...';
    DECLARE @OldColName NVARCHAR(MAX);
    SELECT TOP 1 @OldColName = name FROM sys.columns WHERE object_id = OBJECT_ID('FincasRegistrales_CostesPorAnio') AND name LIKE 'A%o';
    DECLARE @FullColPath NVARCHAR(MAX) = 'FincasRegistrales_CostesPorAnio.[' + @OldColName + ']';
    EXEC sp_rename @FullColPath, 'Anio', 'COLUMN';
END


-- 3. CARGA DE DATOS DE EJEMPLO (COSTES HISTÓRICOS)
-- -----------------------------------------------------------------------------
PRINT 'Insertando costes históricos de ejemplo para la finca 1...';

DELETE FROM FincasRegistrales_CostesPorAnio WHERE Finca_id = 1;

INSERT INTO FincasRegistrales_CostesPorAnio (Finca_id, Anio, Coste, Localizador)
VALUES 
(1, 2022, 4200.50, 'LOC-VAL-001'),
(1, 2023, 4350.75, 'LOC-VAL-001'),
(1, 2024, 4545.00, 'LOC-VAL-001');

PRINT '=============================================================================';
PRINT '¡PROCESO COMPLETADO CON ÉXITO!';
PRINT '=============================================================================';
GO
