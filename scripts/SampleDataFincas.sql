-- =============================================
-- Script: SampleDataFincas.sql (VERSION ULTRA-DINÁMICA)
-- Descripción: Resuelve Nombres de Tabla y de Columna con errores de Ñ
-- =============================================

-- 1. PREPARAR MUTUA (Requerida por CentrosPropios)
IF NOT EXISTS (SELECT 1 FROM Mutuas WHERE Mutua_id = 1)
BEGIN
    SET IDENTITY_INSERT Mutuas ON;
    INSERT INTO Mutuas (Mutua_id, NumeroMutua, Mutua) VALUES (1, 1, 'Mutua General de Ejemplo');
    SET IDENTITY_INSERT Mutuas OFF;
END

-- 2. INSERTAR CENTROS DE EJEMPLO
SET IDENTITY_INSERT CentrosPropios ON;

IF NOT EXISTS (SELECT 1 FROM CentrosPropios WHERE Centro_id = 101)
INSERT INTO CentrosPropios (Centro_id, Centro, Localizador, Validado, Mutua_id) 
VALUES (101, 'Centro Medico Valverde', 'LOC-VAL-001', 1, 1);

IF NOT EXISTS (SELECT 1 FROM CentrosPropios WHERE Centro_id = 102)
INSERT INTO CentrosPropios (Centro_id, Centro, Localizador, Validado, Mutua_id) 
VALUES (102, 'Centro Medico Retiro', 'LOC-RET-002', 0, 1);

SET IDENTITY_INSERT CentrosPropios OFF;

-- 3. INSERTAR FINCAS
IF NOT EXISTS (SELECT 1 FROM FincasRegistrales WHERE Localizador = 'FIN-VAL-01')
INSERT INTO FincasRegistrales (Centro_id, Localizador, NombreVia, Numero, Superficie, Utilizacion, TipoFinca, Titinmueble, [Referencia Catastral], FechaAlta)
VALUES (101, 'FIN-VAL-01', 'Calle Salvador', '14', 850.50, 'Consultas medicas', 1, 'Patrimonio de la Seguridad Social', '8541201VK4784S0001MW', '2023-01-15');

IF NOT EXISTS (SELECT 1 FROM FincasRegistrales WHERE Localizador = 'FIN-VAL-02')
INSERT INTO FincasRegistrales (Centro_id, Localizador, NombreVia, Numero, Superficie, Utilizacion, TipoFinca, Titinmueble, [Referencia Catastral], FechaAlta)
VALUES (101, 'FIN-VAL-02', 'Calle Salvador', '16', 120.00, 'Almacen y Archivo', 5, 'Terceros distintos de los anteriores', '8541202VK4784S0001MW', '2023-02-10');

IF NOT EXISTS (SELECT 1 FROM FincasRegistrales WHERE Localizador = 'FIN-VAL-PK')
INSERT INTO FincasRegistrales (Centro_id, Localizador, NombreVia, Numero, Superficie, Utilizacion, TipoFinca, Titinmueble, [Referencia Catastral], FechaAlta)
VALUES (101, 'FIN-VAL-PK', 'Calle Salvador', '14 (Parking)', 12.50, 'Garaje / Aparcamiento', 4, 'Terceros distintos de los anteriores', '8541203VK4784S0001MW', '2023-05-20');

IF NOT EXISTS (SELECT 1 FROM FincasRegistrales WHERE Localizador = 'FIN-RET-01')
INSERT INTO FincasRegistrales (Centro_id, Localizador, NombreVia, Numero, Superficie, Utilizacion, TipoFinca, Titinmueble, [Referencia Catastral], FechaAlta)
VALUES (102, 'FIN-RET-01', 'Calle Martin', '74', 657.00, 'Oficinas y consultas', 1, 'Patrimonio de la Seguridad Social', '1234567VK4784S0001XY', '2022-11-05');

-- 4. INSERTAR COSTES USANDO SQL DINÁMICO (Detectando Tabla y Columna del Año)
DECLARE @TableName NVARCHAR(MAX);
DECLARE @YearCol NVARCHAR(MAX);

SELECT TOP 1 @TableName = TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE 'FincasRegistrales_Costes%';
SELECT TOP 1 @YearCol = COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @TableName AND (COLUMN_NAME LIKE 'A%o' OR COLUMN_NAME = 'Anio');

DECLARE @SQL NVARCHAR(MAX) = '
INSERT INTO [' + @TableName + '] (Finca_id, [' + @YearCol + '], Coste, Localizador)
SELECT Finca_id, 2024, 120000.00, Localizador FROM FincasRegistrales WHERE Localizador = ''FIN-VAL-01'';
INSERT INTO [' + @TableName + '] (Finca_id, [' + @YearCol + '], Coste, Localizador)
SELECT Finca_id, 2024, 15000.00, Localizador FROM FincasRegistrales WHERE Localizador = ''FIN-VAL-02'';
INSERT INTO [' + @TableName + '] (Finca_id, [' + @YearCol + '], Coste, Localizador)
SELECT Finca_id, 2024, 1200.00, Localizador FROM FincasRegistrales WHERE Localizador = ''FIN-VAL-PK'';
INSERT INTO [' + @TableName + '] (Finca_id, [' + @YearCol + '], Coste, Localizador)
SELECT Finca_id, 2024, 95000.00, Localizador FROM FincasRegistrales WHERE Localizador = ''FIN-RET-01'';
INSERT INTO [' + @TableName + '] (Finca_id, [' + @YearCol + '], Coste, Localizador)
SELECT Finca_id, 2025, 125000.00, Localizador FROM FincasRegistrales WHERE Localizador = ''FIN-VAL-01'';
INSERT INTO [' + @TableName + '] (Finca_id, [' + @YearCol + '], Coste, Localizador)
SELECT Finca_id, 2025, 1300.00, Localizador FROM FincasRegistrales WHERE Localizador = ' + '''FIN-VAL-PK'';
INSERT INTO [' + @TableName + '] (Finca_id, [' + @YearCol + '], Coste, Localizador)
SELECT Finca_id, 2025, 98500.00, Localizador FROM FincasRegistrales WHERE Localizador = ''FIN-RET-01'';
';

EXEC sp_executesql @SQL;
