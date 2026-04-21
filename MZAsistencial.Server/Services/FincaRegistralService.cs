using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public class FincaRegistralService
    {
        private readonly MZAsistencialContext _context;

        public FincaRegistralService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<List<FincaRegistralDTO>> ObtenerTodasLasFincas()
        {
            return await _context.FincasRegistrales
                .Select(f => new FincaRegistralDTO
                {
                    Finca_id = f.FincaId,
                    Centro_id = f.CentroId ?? 0,
                    Localizador = f.Localizador,
                    Mutua = null,
                    Centro = null,
                    Direccion = (f.NombreVia ?? "")
                                + (f.Numero != null ? " " + f.Numero : "")
                                + (f.Piso != null ? ", " + f.Piso : "")
                                + (f.Puerta != null ? ", " + f.Puerta : "")
                                + (f.OtrosDatos != null ? ", " + f.OtrosDatos : ""),
                    CP = null,
                    Provincia = null,
                    Poblacion = null,
                    Superficie = f.Superficie == null ? (decimal?)null : (decimal?)f.Superficie,
                    Coste = f.Coste == null ? (decimal?)null : (decimal?)f.Coste,
                    F_Alquiler = f.Fadqoarr,
                    Referencia_Catastral = f.ReferenciaCatastral,
                    F_Inscripcion = f.Finscreg,
                    F_Baja = f.FechaBaja,
                    Mapa = null
                }).ToListAsync();
        }
    }
}