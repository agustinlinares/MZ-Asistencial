using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MZAsistencial.Server.Services
{
    public interface IRegistrosActividadService
    {
        Task InsertarRegistroActividad(string sql, int usuarioId, string accion);
        Task InsertarHistoricoCentrosPropiosEspecialidades(int centroId, int especialidadId, long servicioId, int disponibilidad, int[] meses, int usuarioId, DateTime fecha);
        IQueryable<RegistroActividadDTO> ObtenerListadoRegistrosQuery();
        Task<List<RegistroActividad>> ObtenerUltimoRegistro(int usuarioId);
    }
}
