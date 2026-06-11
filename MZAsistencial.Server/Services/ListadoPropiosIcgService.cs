using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Services
{
    public class ListadoPropiosIcgService
    {
        private readonly MZAsistencialContext _context;

        public ListadoPropiosIcgService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<List<ListadoPropiosIcgDTO>> GetAllAsync(int? año = null, int? mutuaId = null)
        {
            var sql = @"
                SELECT
                    cp.Centro_id        AS CentroId,
                    cp.Localizador,
                    cp.Centro,
                    cp.Mutua_id         AS MutuaId,
                    icg.Año,
                    icg.Id_ICG          AS IdIcg,
                    icg.Validado        AS Validado,
                    ISNULL(c1.Respuesta,  0) AS Cap1_GastosPersonal,
                    ISNULL(c1a.Respuesta, 0) AS Cap1Anterior_GastosPersonal,
                    ISNULL(c2.Respuesta,  0) AS Cap2_GastosCorrientes,
                    ISNULL(c3.Respuesta,  0) AS Cap3_GastosFinancieros,
                    ISNULL(c68.Respuesta, 0) AS Cuenta68_Amortizaciones,
                    ISNULL(a32.Respuesta, 0) AS Art32_OtrosIngresos,
                    ISNULL(a62.Respuesta, 0) AS Art62_InversionNueva,
                    ISNULL(a63.Respuesta, 0) AS Art63_InversionReposicion,
                    ISNULL(c1.Respuesta,  0)
                        + ISNULL(c2.Respuesta,  0)
                        + ISNULL(c3.Respuesta,  0)
                        + ISNULL(c68.Respuesta, 0) AS TotalGastos,
                    ISNULL(a62.Respuesta, 0)
                        + ISNULL(a63.Respuesta, 0) AS TotalInversion
                FROM CentrosPropios cp
                INNER JOIN ICG06 icg ON icg.Centro_id = cp.Centro_id
                LEFT JOIN vw_Propios_Capitulo1          c1  ON c1.Centro_id  = cp.Centro_id AND c1.Año  = icg.Año
                LEFT JOIN vw_Propios_Capitulo1_Anterior c1a ON c1a.Centro_id = cp.Centro_id AND c1a.Año = icg.Año
                LEFT JOIN vw_Propios_Capitulo2          c2  ON c2.Centro_id  = cp.Centro_id AND c2.Año  = icg.Año
                LEFT JOIN vw_Propios_Capitulo3          c3  ON c3.Centro_id  = cp.Centro_id AND c3.Año  = icg.Año
                LEFT JOIN vw_Propios_Cuenta68           c68 ON c68.Centro_id = cp.Centro_id AND c68.Año = icg.Año
                LEFT JOIN vw_Propios_Articulo32         a32 ON a32.Centro_id = cp.Centro_id AND a32.Año = icg.Año
                LEFT JOIN vw_Propios_Articulo62         a62 ON a62.Centro_id = cp.Centro_id AND a62.Año = icg.Año
                LEFT JOIN vw_Propios_Articulo63         a63 ON a63.Centro_id = cp.Centro_id AND a63.Año = icg.Año
                WHERE 1=1";

            if (año.HasValue)
                sql += $" AND icg.Año = {año.Value}";

            if (mutuaId.HasValue)
                sql += $" AND cp.Mutua_id = {mutuaId.Value}";

            sql += " ORDER BY cp.Localizador, icg.Año DESC";

            var resultado = await _context.Database
                .SqlQueryRaw<ListadoPropiosIcgDTO>(sql)
                .ToListAsync();

            return resultado;
        }

        public async Task<ListadoPropiosIcgDTO?> GetByCentroYAñoAsync(int centroId, int año)
        {
            var sql = $@"
                SELECT
                    cp.Centro_id        AS CentroId,
                    cp.Localizador,
                    cp.Centro,
                    cp.Mutua_id         AS MutuaId,
                    icg.Año,
                    icg.Id_ICG          AS IdIcg,
                    icg.Validado        AS Validado,
                    ISNULL(c1.Respuesta,  0) AS Cap1_GastosPersonal,
                    ISNULL(c1a.Respuesta, 0) AS Cap1Anterior_GastosPersonal,
                    ISNULL(c2.Respuesta,  0) AS Cap2_GastosCorrientes,
                    ISNULL(c3.Respuesta,  0) AS Cap3_GastosFinancieros,
                    ISNULL(c68.Respuesta, 0) AS Cuenta68_Amortizaciones,
                    ISNULL(a32.Respuesta, 0) AS Art32_OtrosIngresos,
                    ISNULL(a62.Respuesta, 0) AS Art62_InversionNueva,
                    ISNULL(a63.Respuesta, 0) AS Art63_InversionReposicion,
                    ISNULL(c1.Respuesta,  0)
                        + ISNULL(c2.Respuesta,  0)
                        + ISNULL(c3.Respuesta,  0)
                        + ISNULL(c68.Respuesta, 0) AS TotalGastos,
                    ISNULL(a62.Respuesta, 0)
                        + ISNULL(a63.Respuesta, 0) AS TotalInversion
                FROM CentrosPropios cp
                INNER JOIN ICG06 icg ON icg.Centro_id = cp.Centro_id
                LEFT JOIN vw_Propios_Capitulo1          c1  ON c1.Centro_id  = cp.Centro_id AND c1.Año  = icg.Año
                LEFT JOIN vw_Propios_Capitulo1_Anterior c1a ON c1a.Centro_id = cp.Centro_id AND c1a.Año = icg.Año
                LEFT JOIN vw_Propios_Capitulo2          c2  ON c2.Centro_id  = cp.Centro_id AND c2.Año  = icg.Año
                LEFT JOIN vw_Propios_Capitulo3          c3  ON c3.Centro_id  = cp.Centro_id AND c3.Año  = icg.Año
                LEFT JOIN vw_Propios_Cuenta68           c68 ON c68.Centro_id = cp.Centro_id AND c68.Año = icg.Año
                LEFT JOIN vw_Propios_Articulo32         a32 ON a32.Centro_id = cp.Centro_id AND a32.Año = icg.Año
                LEFT JOIN vw_Propios_Articulo62         a62 ON a62.Centro_id = cp.Centro_id AND a62.Año = icg.Año
                LEFT JOIN vw_Propios_Articulo63         a63 ON a63.Centro_id = cp.Centro_id AND a63.Año = icg.Año
                WHERE cp.Centro_id = {centroId} AND icg.Año = {año}";

            var resultado = await _context.Database
                .SqlQueryRaw<ListadoPropiosIcgDTO>(sql)
                .ToListAsync();

            return resultado.FirstOrDefault();
        }
    }
}