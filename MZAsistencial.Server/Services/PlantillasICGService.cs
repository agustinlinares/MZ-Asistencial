using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using System.Security.Claims;

namespace MZAsistencial.Server.Services;

public class PlantillasICGService
{
    private readonly MZAsistencialContext _context;
    private readonly IRegistroErroresService _registroErroresService;

    public PlantillasICGService(MZAsistencialContext context, IRegistroErroresService registroErroresService)
    {
        _context = context;
        _registroErroresService = registroErroresService;
    }

    private int? ObtenerMutuaId(ClaimsPrincipal? user)
    {
        if (user == null) return null;
        var perfilClaim = user.Claims.FirstOrDefault(c => c.Type == "perfilId" || c.Type == "PerfilId");
        if (perfilClaim != null && int.TryParse(perfilClaim.Value, out int perfilId) && perfilId == 2)
        {
            var mutuaClaim = user.Claims.FirstOrDefault(c => c.Type == "mutuaId" || c.Type == "MutuaId");
            if (mutuaClaim != null && int.TryParse(mutuaClaim.Value, out int mutuaId))
                return mutuaId;
        }
        return null;
    }

    private int? ObtenerUsuarioId(ClaimsPrincipal? user)
    {
        if (user == null) return null;
        var claim = user.Claims.FirstOrDefault(c => c.Type == "usuarioId" || c.Type == "UsuarioId");
        if (claim != null && int.TryParse(claim.Value, out int uid)) return uid;
        return null;
    }

    public async Task<List<PlantillasICGDTO>> GetInformesAsync(int? mutuaId, int? anio, ClaimsPrincipal? user)
    {
        try
        {
            var userMutuaId = ObtenerMutuaId(user);
            int? finalMutuaId = userMutuaId.HasValue ? userMutuaId.Value : mutuaId;

            var result = await (from i in _context.InformesIcgs
                                join m in _context.Mutuas on i.MutuaId equals m.MutuaId into mGroup
                                from m in mGroup.DefaultIfEmpty()
                                join e in _context.AuxEstadosInformesIcgs on i.EstadoInformeId equals e.EstadoInformeId into eGroup
                                from e in eGroup.DefaultIfEmpty()
                                join u in _context.Usuarios on i.UsuarioModificación equals u.UsuarioId into uGroup
                                from u in uGroup.DefaultIfEmpty()
                                where (!anio.HasValue || i.Año == anio.Value)
                                   && (!finalMutuaId.HasValue || i.MutuaId == finalMutuaId.Value)
                                select new PlantillasICGDTO
                                {
                                    Id = i.InformeId,
                                    Informe = i.Informe,
                                    ResultadoInforme = i.ResultadoInforme,
                                    EstadoInforme = e != null ? e.EstadoInforme : "Pendiente",
                                    TipoICG = i.TipoIcg,
                                    Mutua = m != null ? m.Mutua1 : "",
                                    Anio = i.Año,
                                    Mes = i.Mes,
                                    Usuario = u != null ? u.Usuario1 : "Sistema",
                                    FechaAlta = i.FechaModificacion
                                }).ToListAsync();

            return result;
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Plantillas ICG - GetInformesAsync");
            throw;
        }
    }

    public async Task<byte[]> GenerarPlantillaAsync(int? mutuaId, int? anio, string tipo, string formato, ClaimsPrincipal? user)
    {
        try
        {
            var userMutuaId = ObtenerMutuaId(user);
            int? finalMutuaId = userMutuaId.HasValue ? userMutuaId.Value : mutuaId;

            // TODO: Replace with real data generation logic
            var content = $"Plantilla Tipo: {tipo}, Año: {anio}, MutuaId: {finalMutuaId}\nCol1,Col2,Col3\nVal1,Val2,Val3";
            if (formato.ToUpper() == "XML")
            {
                content = $"<xml><tipo>{tipo}</tipo><anio>{anio}</anio></xml>";
            }
            
            var nuevoInforme = new InformesIcg
            {
                Informe = $"Plantilla_{tipo}_{anio}.{formato.ToLower()}",
                ResultadoInforme = "Generado Correctamente",
                Año = anio,
                MutuaId = finalMutuaId,
                TipoIcg = tipo,
                FechaModificacion = DateTime.Now,
                EstadoInformeId = 1, // 1: "Generado"
                UsuarioModificación = ObtenerUsuarioId(user)
            };
            _context.InformesIcgs.Add(nuevoInforme);
            await _context.SaveChangesAsync();

            return System.Text.Encoding.UTF8.GetBytes(content);
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Plantillas ICG - GenerarPlantillaAsync");
            throw;
        }
    }

    public async Task<PlantillasICGDTO> SubirPlantillaAsync(IFormFile fichero, int? mutuaId, int? anio, string tipoICG, ClaimsPrincipal? user)
    {
        try
        {
            var userMutuaId = ObtenerMutuaId(user);
            int? finalMutuaId = userMutuaId.HasValue ? userMutuaId.Value : mutuaId;

            // Save file physical
            string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Plantillas");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            string uniqueFileName = $"{Guid.NewGuid()}_{fichero.FileName}";
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await fichero.CopyToAsync(fileStream);
            }

            var nuevoInforme = new InformesIcg
            {
                Informe = fichero.FileName,
                ResultadoInforme = uniqueFileName, // Usar ResultadoInforme para guardar la ruta real interna si es necesario
                Año = anio,
                MutuaId = finalMutuaId,
                TipoIcg = tipoICG,
                FechaModificacion = DateTime.Now,
                EstadoInformeId = 2, // 2: "Pendiente de procesar"
                UsuarioModificación = ObtenerUsuarioId(user)
            };
            
            _context.InformesIcgs.Add(nuevoInforme);
            await _context.SaveChangesAsync();

            return new PlantillasICGDTO
            {
                Id = nuevoInforme.InformeId,
                Informe = nuevoInforme.Informe,
                ResultadoInforme = "Subido con éxito",
                TipoICG = nuevoInforme.TipoIcg,
                Anio = nuevoInforme.Año,
                FechaAlta = nuevoInforme.FechaModificacion
            };
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Plantillas ICG - SubirPlantillaAsync");
            throw;
        }
    }

    public async Task<int> ProcesarPlantillasAsync(ClaimsPrincipal? user)
    {
        try
        {
            var pendientes = await _context.InformesIcgs.Where(i => i.EstadoInformeId == 2).ToListAsync();
            int uid = ObtenerUsuarioId(user) ?? 0;
            
            foreach (var p in pendientes)
            {
                // TODO: Leer el fichero fisico p.ResultadoInforme y procesarlo
                p.EstadoInformeId = 3; // "Procesado"
                p.ResultadoInforme = "Procesado OK";
                p.FechaModificacion = DateTime.Now;
                if (uid > 0) p.UsuarioModificación = uid;
            }
            
            await _context.SaveChangesAsync();
            return pendientes.Count;
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Plantillas ICG - ProcesarPlantillasAsync");
            throw;
        }
    }
    public async Task<object> GetDatosInicialesAsync()
    {
        var mutuas = await _context.Mutuas.Select(m => new { id = m.MutuaId, nombre = m.Mutua1 }).ToListAsync();
        var estados = await _context.AuxEstadosInformesIcgs.Select(e => new { e.EstadoInformeId, e.EstadoInforme }).ToListAsync();
        
        var tipos = new List<string> { "ICG06", "ICG07", "FINCAS", "OTROS" };
        var anios = Enumerable.Range(2022, 10).Select(a => a.ToString()).ToList();
        var plantillas = new List<string> { "CSV", "XML" };

        return new { mutuas, estados, tipos, anios, plantillas };
    }
    public async Task<bool> EliminarPlantillaAsync(int id)
    {
        try
        {
            var plantilla = await _context.InformesIcgs.FindAsync(id);
            if (plantilla == null) return false;

            // Eliminar fichero físico
            if (!string.IsNullOrEmpty(plantilla.ResultadoInforme) && plantilla.ResultadoInforme.Contains("_"))
            {
                string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Plantillas");
                string filePath = Path.Combine(uploadsFolder, plantilla.ResultadoInforme);
                if (File.Exists(filePath)) File.Delete(filePath);
            }

            _context.InformesIcgs.Remove(plantilla);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "PlantillasICG - EliminarPlantillaAsync");
            return false;
        }
    }
}
