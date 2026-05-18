/* Script para añadir la columna Comentarios a la tabla CentrosConcertados.
   Autor: Carlos
   Fecha: 13/05/2026
*/
ALTER TABLE dbo.CentrosConcertados
ADD Comentarios NVARCHAR(MAX) NULL;