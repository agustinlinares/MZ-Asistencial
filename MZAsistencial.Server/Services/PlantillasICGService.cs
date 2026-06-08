using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

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

    public async Task<List<PlantillasICGDTO>> GetInformesAsync(int? mutuaId, int? anio)
    {
        try
        {
            var query = _context.InformesIcgs.AsQueryable();

            if (anio.HasValue)
            {
                query = query.Where(i => i.Año == anio.Value);
            }

            // Mock lookup lists for demonstration. Ideally these come from joins.
            var mutuas = await _context.Mutuas.ToDictionaryAsync(m => m.MutuaId, m => m.Mutua1);
            var estados = await _context.AuxEstadosInformesIcgs.ToDictionaryAsync(e => e.EstadoInformeId, e => e.EstadoInforme);
            var usuarios = await _context.Usuarios.ToDictionaryAsync(u => u.UsuarioId, u => u.Usuario1);

            var result = await query.ToListAsync();
            
            var dtos = result.Select(i => new PlantillasICGDTO
            {
                Id = i.InformeId,
                Informe = i.Informe,
                ResultadoInforme = i.ResultadoInforme,
                EstadoInforme = i.EstadoInformeId.HasValue && estados.ContainsKey(i.EstadoInformeId.Value) ? estados[i.EstadoInformeId.Value] : "Pendiente",
                TipoICG = i.TipoIcg,
                Mutua = i.MutuaId.HasValue && mutuas.ContainsKey(i.MutuaId.Value) ? mutuas[i.MutuaId.Value] : "",
                Anio = i.Año,
                Mes = i.Mes,
                Usuario = i.UsuarioModificación.HasValue && usuarios.ContainsKey(i.UsuarioModificación.Value) ? usuarios[i.UsuarioModificación.Value] : "Sistema",
                FechaAlta = i.FechaModificacion
            }).ToList();

            if (mutuaId.HasValue)
            {
                dtos = dtos.Where(d => d.Mutua != null && mutuas.ContainsKey(mutuaId.Value) && d.Mutua.Equals(mutuas[mutuaId.Value], StringComparison.OrdinalIgnoreCase)).ToList();
            }

            return dtos;
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Plantillas ICG - GetInformesAsync");
            throw;
        }
    }

    public async Task<byte[]> GenerarPlantillaAsync(int? mutuaId, int? anio, string tipo, string formato)
    {
        try
        {
            // Mock generation. In a real scenario, this would query DB, build CSV/XML bytes.
            var content = $"Plantilla Tipo: {tipo}, Año: {anio}, MutuaId: {mutuaId}\nCol1,Col2,Col3\nVal1,Val2,Val3";
            if (formato.ToUpper() == "XML")
            {
                content = $"<xml><tipo>{tipo}</tipo><anio>{anio}</anio></xml>";
            }
            
            // Registrar la generación en base de datos
            var nuevoInforme = new InformesIcg
            {
                Informe = $"Plantilla_{tipo}_{anio}.{formato.ToLower()}",
                ResultadoInforme = "Generado Correctamente",
                Año = anio,
                MutuaId = mutuaId,
                TipoIcg = tipo,
                FechaModificacion = DateTime.Now,
                EstadoInformeId = 1 // 1: Por ejemplo, "Generado"
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

    public async Task<PlantillasICGDTO> SubirPlantillaAsync(IFormFile fichero, int? mutuaId, int? anio, string tipoICG)
    {
        try
        {
            // Mock upload logic. Save file to disk or blob storage.
            var nuevoInforme = new InformesIcg
            {
                Informe = fichero.FileName,
                ResultadoInforme = "Subido con éxito",
                Año = anio,
                MutuaId = mutuaId,
                TipoIcg = tipoICG,
                FechaModificacion = DateTime.Now,
                EstadoInformeId = 2 // 2: "Pendiente de procesar"
            };
            
            _context.InformesIcgs.Add(nuevoInforme);
            await _context.SaveChangesAsync();

            return new PlantillasICGDTO
            {
                Id = nuevoInforme.InformeId,
                Informe = nuevoInforme.Informe,
                ResultadoInforme = nuevoInforme.ResultadoInforme,
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

    public async Task<int> ProcesarPlantillasAsync()
    {
        try
        {
            // Mock logic to process pending templates
            var pendientes = await _context.InformesIcgs.Where(i => i.EstadoInformeId == 2).ToListAsync();
            foreach (var p in pendientes)
            {
                p.EstadoInformeId = 3; // "Procesado"
                p.ResultadoInforme = "Procesado OK";
                p.FechaModificacion = DateTime.Now;
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
        try
        {
            var mutuas = await _context.Mutuas
                .Select(m => new { id = m.MutuaId, nombre = m.Mutua1 })
                .OrderBy(m => m.nombre)
                .ToListAsync();

            var anioActual = DateTime.Now.Year;
            var anios = Enumerable.Range(2022, (anioActual - 2022) + 1).Select(a => a.ToString()).ToList();
            var tipos = new List<string> { "ICG06", "ICG07", "FINCAS", "CENTROS CONCERTADOS", "CONCIERTOS" };
            var plantillas = new List<string> { "CSV", "XML" };

            return new { mutuas, anios, tipos, plantillas };
        }
        catch (Exception ex)
        {
            await _registroErroresService.LogErrorAsync(ex, "Plantillas ICG - GetDatosInicialesAsync");
            throw;
        }
    }
    public async Task<bool> EliminarPlantillaAsync(int id)
    {
        try
        {
            var plantilla = await _context.InformesIcgs.FindAsync(id);
            if (plantilla == null) return false;
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
