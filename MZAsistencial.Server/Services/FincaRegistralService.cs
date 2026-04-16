using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public class FincaRegistralService
    {
        private readonly Data.MZAsistencialContext _context;

        public FincaRegistralService(Data.MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<List<FincaRegistralDTO>> ObtenerTodasLasFincas()
        {
            var listaFincas = await _context.FincasRegistrales
                .Select(fincaBd => new FincaRegistralDTO
                {
                    Finca_id = fincaBd.FincaId,
                    Centro_id = fincaBd.CentroId,
                    Localizador = fincaBd.Localizador,
                    Mutua = fincaBd.Mutua,
                    Centro = fincaBd.Centro,
                    Direccion = fincaBd.Direccion,
                    CP = fincaBd.Cp,
                    Provincia = fincaBd.Provincia,
                    Poblacion = fincaBd.Poblacion,
                    Superficie = fincaBd.Superficie,
                    Coste = fincaBd.Coste,
                    F_Alquiler = fincaBd.FAlquiler,
                    Referencia_Catastral = fincaBd.ReferenciaCatastral,
                    F_Inscripcion = fincaBd.FInscripcion,
                    F_Baja = fincaBd.FBaja,
                    Mapa = fincaBd.Mapa
                })
                .ToListAsync();

            return listaFincas;
        }
    }
}