using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MZAsistencial.Server.Services
{
    public class RegistrosActividadService : IRegistrosActividadService
    {
        private readonly MZAsistencialContext _context;

        public RegistrosActividadService(MZAsistencialContext context)
        {
            _context = context;
        }

        public async Task InsertarRegistroActividad(string sql, int usuarioId, string accion)
        {
            try
            {
                var registro = new RegistroActividad
                {
                    Sql = sql,
                    UsuarioId = usuarioId,
                    Accion = accion,
                    Fecha = DateTime.Now
                };

                _context.RegistroActividads.Add(registro);
                await _context.SaveChangesAsync();
            }
            catch
            {
                // El registro de auditoría no debe interrumpir el flujo principal
            }
        }

        public async Task InsertarHistoricoCentrosPropiosEspecialidades(int centroId, int especialidadId, long servicioId, int disponibilidad, int[] meses, int usuarioId, DateTime fecha)
        {
            try
            {
                var historico = new HistoricoCentrosPropiosEspecialidade
                {
                    CentroId = centroId,
                    EspecialidadId = especialidadId,
                    ServicioId = servicioId,
                    Disponibilidad = disponibilidad,
                    Ene = meses.Length > 0 ? meses[0] : 0,
                    Feb = meses.Length > 1 ? meses[1] : 0,
                    Mar = meses.Length > 2 ? meses[2] : 0,
                    Abr = meses.Length > 3 ? meses[3] : 0,
                    May = meses.Length > 4 ? meses[4] : 0,
                    Jun = meses.Length > 5 ? meses[5] : 0,
                    Jul = meses.Length > 6 ? meses[6] : 0,
                    Ago = meses.Length > 7 ? meses[7] : 0,
                    Sep = meses.Length > 8 ? meses[8] : 0,
                    Oct = meses.Length > 9 ? meses[9] : 0,
                    Nov = meses.Length > 10 ? meses[10] : 0,
                    Dic = meses.Length > 11 ? meses[11] : 0,
                    UsuarioModificacionId = usuarioId
                };

                if (disponibilidad == 1)
                {
                    historico.FechaAlta = fecha;
                }
                else
                {
                    historico.FechaBaja = fecha;
                }

                _context.HistoricoCentrosPropiosEspecialidades.Add(historico);
                await _context.SaveChangesAsync();
            }
            catch
            {
                // Auditoría no interrumpe el flujo principal
            }
        }

        public IQueryable<RegistroActividadDTO> ObtenerListadoRegistrosQuery(int? mutuaId = null)
        {
            var query = from r in _context.RegistroActividads
                        join u in _context.Usuarios on r.UsuarioId equals u.UsuarioId into gjU
                        from subU in gjU.DefaultIfEmpty()
                        join m in _context.Mutuas on subU.MutuaId equals m.MutuaId into gjM
                        from subM in gjM.DefaultIfEmpty()
                        where (!mutuaId.HasValue || subU.MutuaId == mutuaId.Value)
                        // Quitamos el orderby aquí para que DevExtreme decida el orden
                        select new RegistroActividadDTO
                        {
                            RegistroId = r.RegistroId,
                            Mutua = subM != null ? subM.Mutua1 : "ADMINISTRADOR",
                            Usuario = subU != null ? subU.Usuario1 : "Desconocido", 
                            Fecha = r.Fecha,
                            Accion = r.Accion,
                            Sql = r.Sql
                        };

            return query;
        }

        public async Task<List<RegistroActividad>> ObtenerUltimoRegistro(int usuarioId)
        {
            return await _context.RegistroActividads
                .Where(r => r.UsuarioId == usuarioId)
                .OrderByDescending(r => r.RegistroId)
                .Take(50)
                .ToListAsync();
        }
    }
}
