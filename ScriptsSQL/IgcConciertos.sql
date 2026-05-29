-- La pantalla ICG Conciertos lee de la tabla [dbo].[ICG07] unida a:
--   Conciertos, CentrosConcertados, Mutuas, Aux_Poblaciones y Aux_Provincias.
-- No hace falta crear la tabla IcgConciertos; los datos de prueba están en inserts_adicionales.sql (ICG07).

-- Ejemplo de consulta equivalente a la API /api/IcgConciertos:
/*
SELECT
    icg.Id_ICG,
    ISNULL(c.Localizador, cc.Localizador) AS Localizador,
    icg.Concierto_id,
    ISNULL(c.CodigoCASA, '') AS CodCASA,
    ISNULL(m.Mutua, '') AS Mutua,
    c.Centro_id,
    ISNULL(cc.Centro, '') AS Centro,
    ISNULL(pob.Poblacion, '') AS Poblacion,
    ISNULL(icg.Provincia, prov.Provincia) AS Provincia,
    ISNULL(icg.Costeassan, 0) AS AsistenciaSanitaria,
    ISNULL(icg.CosteIT, 0) AS IncapacidadTemp,
    ISNULL(icg.GastoCentroNoConcert, 0) AS Gastos,
    ISNULL(icg.Art2581, 0) + ISNULL(icg.Art2582, 0) + ISNULL(icg.RestoArticulo25SCon, 0) AS Articulo25,
    ISNULL(icg.Costeassan, 0) + ISNULL(icg.CosteIT, 0) + ISNULL(icg.GastoCentroNoConcert, 0) AS Total,
    ISNULL(icg.Validado, 0) AS Confirmar
FROM dbo.ICG07 icg
INNER JOIN dbo.Conciertos c ON icg.Concierto_id = c.Concierto_id
INNER JOIN dbo.CentrosConcertados cc ON c.Centro_id = cc.Centro_id
INNER JOIN dbo.Mutuas m ON c.Mutua_id = m.Mutua_id
LEFT JOIN dbo.Aux_Poblaciones pob ON cc.Poblacion_id = pob.Poblacion_id
LEFT JOIN dbo.Aux_Provincias prov ON pob.Provincia_id = prov.Provincia_id
ORDER BY icg.Id_ICG DESC;
*/
