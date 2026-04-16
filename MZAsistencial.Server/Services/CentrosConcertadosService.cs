using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.Models;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface ICentrosConcertadosService
    {
        Task<IEnumerable<CentroConcertadoCabeceraDTO>> GetCabecerasAsync();
    }

    public class CentrosConcertadosService : ICentrosConcertadosService
    {
        private readonly MZAsistencialContext _context;

        public CentrosConcertadosService(MZAsistencialContext context)
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
                    Provincia = "Por definir", 
                    FechaAlta = c.FechaAlta,
                    Latitud = c.Latitud,
                    Longitud = c.Longitud,
                    MapaValidado = c.MapaValidado
                })
                .ToListAsync();
        }
    }
}