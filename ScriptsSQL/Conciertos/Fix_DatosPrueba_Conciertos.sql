/* Script para corregir datos huérfanos de prueba en la tabla Conciertos.
   Asigna el Concierto 1 a un centro válido (Clínica Condal, ID 101) para 
   permitir la visualización en la pestaña de Especialidades / Serv.
   Autor: Carlos
   Fecha: 13/05/2026
*/
UPDATE dbo.Conciertos 
SET Centro_id = 101 
WHERE Concierto_id = 1;