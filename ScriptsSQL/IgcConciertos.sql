CREATE TABLE IcgConciertos (
    Id_Icg INT PRIMARY KEY IDENTITY(1,1),
    Localizador NVARCHAR(50) NOT NULL,
    Concierto_id INT NOT NULL,
    CodCasa NVARCHAR(20),
    Mutua NVARCHAR(100),
    Centro_id INT,
    Centro NVARCHAR(255),
    Poblacion NVARCHAR(100),
    Provincia NVARCHAR(100),
    AsistenciaSanitaria NVARCHAR(MAX),
    IncapacidadTemp NVARCHAR(MAX),
    Gastos DECIMAL(18, 2),
    Articulo25 NVARCHAR(50),
    Total DECIMAL(18, 2),
    Confirmar BIT DEFAULT 0
);