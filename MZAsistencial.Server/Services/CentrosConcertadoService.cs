using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Services
{
    public class CentrosConcertadoService : ICentrosConcertadosService
    {
        private readonly MZAsistencialContext _context;

        public CentrosConcertadoService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CentroConcertadoCabeceraDTO>> GetCabecerasAsync()
        {
            return await _context.CentrosConcertados
                .Select(c => new CentroConcertadoCabeceraDTO
                {
                    CodigoMZ = c.CodigoMz,
                    CIFNIF = c.Cifnif,
                    CentroId = c.CentroId,
                    Centro = c.Centro,
                    Direccion = c.Direccion,
                    Cp = c.Cp,
                    PoblacionId = c.PoblacionId,
                    Provincia = null,
                    FechaAlta = c.FechaAlta,
                    Latitud = c.Latitud,
                    Longitud = c.Longitud,
                    MapaValidado = c.MapaValidado
                }).ToListAsync();
        }
    }
}