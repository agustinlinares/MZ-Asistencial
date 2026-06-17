IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260504102331_RenameContrasenaToPassword', N'10.0.5');

COMMIT;
GO

BEGIN TRANSACTION;
DECLARE @var nvarchar(max);
SELECT @var = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CentrosPropios]') AND [c].[name] = N'Rehabilitacion');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [CentrosPropios] DROP CONSTRAINT ' + @var + ';');
ALTER TABLE [CentrosPropios] ALTER COLUMN [Rehabilitacion] bit NULL;

DECLARE @var1 nvarchar(max);
SELECT @var1 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CentrosPropios]') AND [c].[name] = N'Prevencion');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [CentrosPropios] DROP CONSTRAINT ' + @var1 + ';');
ALTER TABLE [CentrosPropios] ALTER COLUMN [Prevencion] bit NULL;

DECLARE @var2 nvarchar(max);
SELECT @var2 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CentrosPropios]') AND [c].[name] = N'OtrasActividades');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [CentrosPropios] DROP CONSTRAINT ' + @var2 + ';');
ALTER TABLE [CentrosPropios] ALTER COLUMN [OtrasActividades] bit NULL;

DECLARE @var3 nvarchar(max);
SELECT @var3 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CentrosPropios]') AND [c].[name] = N'IncapacidadTransitoria');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [CentrosPropios] DROP CONSTRAINT ' + @var3 + ';');
ALTER TABLE [CentrosPropios] ALTER COLUMN [IncapacidadTransitoria] bit NULL;

DECLARE @var4 nvarchar(max);
SELECT @var4 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CentrosPropios]') AND [c].[name] = N'Desactivado');
IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [CentrosPropios] DROP CONSTRAINT ' + @var4 + ';');
ALTER TABLE [CentrosPropios] ALTER COLUMN [Desactivado] bit NULL;

DECLARE @var5 nvarchar(max);
SELECT @var5 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CentrosPropios]') AND [c].[name] = N'AsistenciaHospitalaria');
IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [CentrosPropios] DROP CONSTRAINT ' + @var5 + ';');
ALTER TABLE [CentrosPropios] ALTER COLUMN [AsistenciaHospitalaria] bit NULL;

DECLARE @var6 nvarchar(max);
SELECT @var6 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CentrosPropios]') AND [c].[name] = N'AsistenciaAmbulatoria');
IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [CentrosPropios] DROP CONSTRAINT ' + @var6 + ';');
ALTER TABLE [CentrosPropios] ALTER COLUMN [AsistenciaAmbulatoria] bit NULL;

DECLARE @var7 nvarchar(max);
SELECT @var7 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CentrosPropios]') AND [c].[name] = N'Administracion');
IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [CentrosPropios] DROP CONSTRAINT ' + @var7 + ';');
ALTER TABLE [CentrosPropios] ALTER COLUMN [Administracion] bit NULL;

ALTER TABLE [CentrosConcertados] ADD [Comentarios] nvarchar(max) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260513210958_CambioPasswordUsuario', N'10.0.5');

COMMIT;
GO

BEGIN TRANSACTION;
EXEC sp_rename N'[Citaciones].[Año]', N'Anio', 'COLUMN';

ALTER TABLE [ICG06] ADD CONSTRAINT [PK_ICG06] PRIMARY KEY ([Id_ICG]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260525072921_UpdateSchema', N'10.0.5');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [Registro_Errores] ADD [Nombre_Modulo] nvarchar(max) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260611150534_SincronizacionModelosActuales', N'10.0.5');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260615101018_AjusteModelosDescuadres', N'10.0.5');

COMMIT;
GO

BEGIN TRANSACTION;

                IF NOT EXISTS (
                    SELECT 1 FROM sys.columns 
                    WHERE object_id = OBJECT_ID('Mutuas') 
                    AND name = 'Mutua_id' 
                    AND is_identity = 1
                )
                BEGIN
                    ALTER TABLE [Mutuas] DROP CONSTRAINT [PK_Mutuas];
                    ALTER TABLE [Mutuas] ADD [Mutua_id_temp] INT IDENTITY(1,1) NOT NULL;
                    DBCC CHECKIDENT ('Mutuas', RESEED, 0);
                    EXEC sp_rename 'Mutuas.Mutua_id', 'Mutua_id_old', 'COLUMN';
                    EXEC sp_rename 'Mutuas.Mutua_id_temp', 'Mutua_id', 'COLUMN';
                    ALTER TABLE [Mutuas] DROP COLUMN [Mutua_id_old];
                    ALTER TABLE [Mutuas] ADD CONSTRAINT [PK_Mutuas] 
                        PRIMARY KEY CLUSTERED ([Mutua_id] ASC);
                    DECLARE @maxId INT = (SELECT ISNULL(MAX(Mutua_id), 0) FROM [Mutuas]);
                    IF @maxId > 0
                        DBCC CHECKIDENT ('Mutuas', RESEED, @maxId);
                END
            

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260615163939_AddIdentityMutuas', N'10.0.5');

COMMIT;
GO

