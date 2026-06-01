using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;

namespace MZAsistencial.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MutuasController : ControllerBase
{
    private readonly MZAsistencialContext _context;

    public MutuasController(MZAsistencialContext context)
    {
        _context = context;
    }

    // GET: api/mutuas
    // Devuelve la lista de mutuas filtrada por perfil del usuario
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MutuaDTO>>> GetMutuas([FromQuery] int? perfilId, [FromQuery] int? mutuaId)
    {
        var query  = _context.Mutuas
            .Include(m => m.PoblacionNavigation)
                .ThenInclude(p => p.Provincia) 
            .AsQueryable();

        // Si no es perfil 1 ni perfil 4 filtramos por su mutua
        if (perfilId != 1 && perfilId != 4 && mutuaId.HasValue)
        {
            query = query.Where(m => m.MutuaId == mutuaId.Value);
        }

        var mutuas = await query
            .Select(m => new MutuaDTO
            {
                NumeroId    = m.MutuaId,
                NumeroMutua = m.NumeroMutua ?? "", //Columna Extra
                Mutua     = m.Mutua1 ?? "", //Nombre
                Direccion = m.Direccion ?? "",
                CP = m.Cp ?? "",
                Poblacion = m.PoblacionNavigation != null
                            ? m.PoblacionNavigation.Poblacion ?? ""
                            : "",
                Provincia = m.PoblacionNavigation != null && m.PoblacionNavigation.Provincia != null
                            //? m.PoblacionNavigation.Provincia.Provincia1 ?? ""
                            ? m.PoblacionNavigation.Provincia.Provincia.Trim() ?? ""
                            : ""
            })
            .ToListAsync();

        return Ok(mutuas);
    }

    // GET: api/mutuas/5
    // Devuelve una sola mutua por id
    [HttpGet("{id}")]
    public async Task<ActionResult<MutuaDTO>> GetMutua(int id)
    {
        var mutua = await _context.Mutuas
            .Where(m => m.MutuaId == id)
            .Select(m => new MutuaDTO
            {
                NumeroId = m.MutuaId,
                Mutua = m.Mutua1 ?? "",
                Direccion = m.Direccion ?? "",
                CP = m.Cp ?? "",
                PoblacionId = m.PoblacionId, //
                Poblacion = m.PoblacionNavigation != null
                            ? m.PoblacionNavigation.Poblacion ?? ""
                            : "",
                Provincia = m.PoblacionNavigation != null && m.PoblacionNavigation.Provincia != null
                            ? m.PoblacionNavigation.Provincia.Provincia.Trim() ?? ""
                            : "",

                //CAMPOS EXTRA PARA LA FICHA
                NumeroMutua = m.NumeroMutua ?? "",
                RazonSocial = m.RazonSocial ?? "",
                Telefono = m.Telefono ?? "",
                Fax = m.Fax ?? "",
                DireccionElectronica = m.DireccionElectronica ?? "",
                PersonaContacto = m.PersonaContacto ?? ""
            })
            .FirstOrDefaultAsync();

        if (mutua == null)
            return NotFound();

        return Ok(mutua);
    }

    // POST: api/mutuas
    // Crea una nueva mutua recibiendo los campos del DTO
    [HttpPost]
    public async Task<ActionResult<MutuaDTO>> PostMutua(MutuaDTO dto)
    {
        try
        {
            var mutua = new Mutua
            {
                Mutua1 = dto.Mutua,
                RazonSocial = dto.RazonSocial,
                Direccion = dto.Direccion,
                Cp = dto.CP,
                Telefono = dto.Telefono,
                Fax = dto.Fax,
                // Email es opcional — se guarda null si viene vacío
                DireccionElectronica = string.IsNullOrWhiteSpace(dto.DireccionElectronica)
                    ? null
                    : dto.DireccionElectronica,
                PersonaContacto = dto.PersonaContacto,
                PoblacionId = dto.PoblacionId, // IMPORTANTE si se usa
                // Registramos fecha de alta y usuario desde la sesión
                FechaAlta = DateTime.Now,
                UsuarioAltaId = dto.UsuarioId
            };

            // 1. Guardamos primero para obtener el ID
            _context.Mutuas.Add(mutua);
            await _context.SaveChangesAsync();

            // 2. Generamos NumeroMutua automáticamente
            mutua.NumeroMutua = $"{mutua.MutuaId:D3}";

            // 3. Guardamos de nuevo
            await _context.SaveChangesAsync();

            // 4. Registramos la acción en RegistroActividad
            var registro = new RegistroActividad
                {
                    UsuarioId = dto.UsuarioId,
                    Fecha = DateTime.Now,
                    Accion = $"ALTA MUTUA: {mutua.Mutua1} ({mutua.NumeroMutua})",
                    Sql = $"INSERT Mutuas - MutuaId: {mutua.MutuaId}"
                };
            _context.RegistroActividads.Add(registro);
            await _context.SaveChangesAsync();

            return Ok(mutua);
        }
        catch (Exception ex)
        {
            // Muestra el error exacto en la terminal
            Console.WriteLine($"ERROR POST Mutua: {ex.Message}");
            Console.WriteLine($"Inner: {ex.InnerException?.Message}");
            return StatusCode(500, ex.Message);
        }
    }

    // PUT: api/mutuas/5
    // Actualiza una mutua existente
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMutua(int id, MutuaDTO dto)
    {

        try
        {    
                
            var mutua = await _context.Mutuas.FindAsync(id);
            if (mutua == null) return NotFound();
            if (id != dto?.NumeroId) return BadRequest();

            // Solo actualizamos los campos editables
            mutua.Mutua1 = dto.Mutua;
            mutua.Direccion = dto.Direccion;
            mutua.Cp = dto.CP;
            mutua.PoblacionId = dto.PoblacionId;//
            mutua.RazonSocial = dto.RazonSocial;
            mutua.Telefono = dto.Telefono;
            mutua.Fax = dto.Fax;
            mutua.DireccionElectronica = string.IsNullOrWhiteSpace(dto.DireccionElectronica)
                ? null
                : dto.DireccionElectronica;
            mutua.PersonaContacto = dto.PersonaContacto;
            //mutua.NumeroMutua = dto.NumeroMutua;

            // Guardamos cambios
            await _context.SaveChangesAsync();

            // Registro de actividad
            var registro = new RegistroActividad
            {
                UsuarioId = dto.UsuarioId,
                Fecha = DateTime.Now,
                Accion = $"MODIFICACIÓN MUTUA: {mutua.Mutua1} ({mutua.NumeroMutua})",
                Sql = $"UPDATE Mutuas - MutuaId: {mutua.MutuaId}"
            };

            _context.RegistroActividads.Add(registro);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR PUT Mutua: {ex.Message}");
            Console.WriteLine($"Inner: {ex.InnerException?.Message}");

            return StatusCode(500, ex.Message);
        }
    }

    // DELETE: api/mutuas/5
    // Elimina una mutua por id
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMutua(int id, [FromQuery] int usuarioId)
    {
        try
        {
            var mutua = await _context.Mutuas.FindAsync(id);
            if (mutua == null)
                return NotFound();

            // Guardamos datos antes de eliminar
            var nombreMutua = mutua.Mutua1;
            var numeroMutua = mutua.NumeroMutua;
            var mutuaId = mutua.MutuaId;

            // Eliminamos la mutua
            _context.Mutuas.Remove(mutua);
            await _context.SaveChangesAsync();

                    // Registro de actividad
            var registro = new RegistroActividad
            {
                UsuarioId = usuarioId,
                Fecha = DateTime.Now,
                Accion = $"ELIMINACIÓN MUTUA: {nombreMutua} ({numeroMutua})",
                Sql = $"DELETE Mutuas - MutuaId: {mutuaId}"
            };

            _context.RegistroActividads.Add(registro);
            await _context.SaveChangesAsync();

            return NoContent();

        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR DELETE Mutua: {ex.Message}");
            Console.WriteLine($"Inner: {ex.InnerException?.Message}");

            return StatusCode(500, ex.Message);
        }
    }

    //---------------------PESTAÑAS--------------------------------------
    // GET: api/mutuas/5/centrosPropios
    // Devuelve los centros propios de una mutua
    [HttpGet("{id}/centrosPropios")]
    public async Task<ActionResult> GetCentrosPropios(int id)
    {
        var centros = await (
            from c in _context.CentrosPropios
            join p in _context.AuxPoblaciones on c.PoblacionId equals p.PoblacionId into poblacionesJoin
            from p in poblacionesJoin.DefaultIfEmpty()
            join pr in _context.AuxProvincias on p.ProvinciaId equals pr.ProvinciaId into provinciasJoin
            from pr in provinciasJoin.DefaultIfEmpty()
            where c.MutuaId == id
            select new {
                localizador = c.Localizador ?? "",
                centro = c.Centro ?? "",
                cp = c.Cp ?? "",
                poblacion = p != null ? p.Poblacion : "",
                provincia = pr != null ? pr.Provincia.Trim() : "",
                telefono = c.Telefono ?? "",
                contacto = c.PersonaContacto ?? "",
                email = c.DireccionElectronica ?? "",
                latitud = c.Latitud ?? "",
                longitud = c.Longitud ?? "",
                validado = c.Validado == true ? "Sí" : "No"
            }
        ).ToListAsync();

        return Ok(centros);
    }

    // GET: api/mutuas/5/conciertos
    // Devuelve los centros concertados de una mutua a través de la tabla Conciertos
    [HttpGet("{id}/conciertos")]
    public async Task<ActionResult> GetConciertos(int id)
    {
        var conciertos = await (
            from con in _context.Conciertos
            join cc in _context.CentrosConcertados on con.CentroId equals cc.CentroId into centrosJoin
            from cc in centrosJoin.DefaultIfEmpty()
            join p in _context.AuxPoblaciones on cc.PoblacionId equals p.PoblacionId into poblacionesJoin
            from p in poblacionesJoin.DefaultIfEmpty()
            join pr in _context.AuxProvincias on p.ProvinciaId equals pr.ProvinciaId into provinciasJoin
            from pr in provinciasJoin.DefaultIfEmpty()
            where con.MutuaId == id
            select new {
                //codMutua = con.CodigoMz ?? "",
                codMutua = con.MutuaId,
                //codCentro = cc != null ? cc.CodigoMz ?? "" : "",
                codCentro = cc != null ? cc.CentroId : (int?)null,
                centro = cc != null ? cc.Centro ?? "" : "",
                cifNif = cc != null ? cc.Cifnif ?? "" : "",
                cp = cc != null ? cc.Cp ?? "" : "",
                poblacion = p != null ? p.Poblacion ?? "" : "",
                provincia = pr != null ? pr.Provincia.Trim() ?? "" : "",
                contacto = cc != null ? cc.PersonaContacto ?? "" : "",
                email = cc != null ? cc.DireccionElectronica ?? "" : "",
                latitud = cc != null ? cc.Latitud ?? "" : "",
                longitud = cc != null ? cc.Longitud ?? "" : "",
                autorizado = con.Autorizado == true ? "Sí" : "No"
            }
        ).ToListAsync();

        return Ok(conciertos);
    }

    // GET: api/mutuas/5/especialidadesPropios
    // Devuelve las especialidades de los centros propios de una mutua
    [HttpGet("{id}/especialidadesPropios")]
    public async Task<ActionResult> GetEspecialidadesPropios(int id)
    {
        var especialidades = await _context.VwEspecialidadesPropios
            .Where(e => e.MutuaId == id)
            .Select(e => new {
                ano = e.Año,
                servicio = e.Servicio ?? "",
                especialidad = e.Especialidad ?? "",
                cantidad = e.Cantidad ?? 0
            })
            .ToListAsync();

        return Ok(especialidades);
    }

    // GET: api/mutuas/5/especialidadesConciertos
    // Devuelve las especialidades de los centros concertados de una mutua
    [HttpGet("{id}/especialidadesConciertos")]
    public async Task<ActionResult> GetEspecialidadesConciertos(int id)
    {
        var especialidades = await _context.VwEspecialidadesConciertos
            .Where(e => e.MutuaId == id)
            .Select(e => new {
                ano = e.Año,
                servicio = e.Servicio ?? "",
                especialidad = e.Especialidad ?? "",
                cantidad = e.Cantidad ?? 0
            })
            .ToListAsync();

        return Ok(especialidades);
    }


}