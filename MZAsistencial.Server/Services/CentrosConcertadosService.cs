using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface ICentrosConcertadosService
    {
        Task<IEnumerable<CentrosConcertadoDTO>> GetCabecerasAsync();
    }

    public class CentrosConcertadosService : ICentrosConcertadosService
    {
        private readonly MZAsistencialContext _context;

        public CentrosConcertadosService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CentrosConcertadoDTO>> GetCabecerasAsync()
        {
            var query = from c in _context.CentrosConcertados
                        join p in _context.AuxPoblaciones on c.PoblacionId equals p.PoblacionId
                        join pr in _context.AuxProvincias on p.ProvinciaId equals pr.ProvinciaId
                        
                        select new CentrosConcertadoDTO
                        {
                            Ccn = c.CodigoMz,      
                            Cif = c.Cifnif,        
                            Centro_id = c.CentroId, 
                            Centro = c.Centro,
                            Direccion = c.Direccion,
                            CP = c.Cp,
                            
                            Poblacion = p.Poblacion, 
                            Provincia = pr.Provincia, 
                            
                            FechaAlta = c.FechaAlta,
                            Mapa = c.MapaValidado.ToString()
                        };

            return await query.ToListAsync();
        }
    }
}