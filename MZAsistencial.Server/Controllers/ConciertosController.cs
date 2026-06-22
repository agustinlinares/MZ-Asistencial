using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Services;
using MZAsistencial.Server.Helpers;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace MZAsistencial.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConciertosController : ControllerBase
    {
        private readonly IConciertosService _service;

        public ConciertosController(IConciertosService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ConciertoResponseDTO>>> Get([FromQuery] int? mutuaId = null)
        {
            try
            {
                var perfilIdStr = HttpContext.User.FindFirst("perfilId")?.Value;
                int? mutuaIdFiltro = mutuaId;

                // Perfil 2 (bloqueo de mutua) siempre se filtra por su propia mutua, ignorando lo que mande el frontend
                if (perfilIdStr == "2")
                {
                    var mutuaIdStr = HttpContext.User.FindFirst("mutuaId")?.Value;
                    if (int.TryParse(mutuaIdStr, out int mutuaIdUsuario))
                    {
                        mutuaIdFiltro = mutuaIdUsuario;
                    }
                }

                var conciertos = await _service.GetAllAsync(mutuaIdFiltro);
                return Ok(conciertos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor al recuperar los conciertos: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ConciertoResponseDTO>> GetById(int id)
        {
            try
            {
                var concierto = await _service.GetByIdAsync(id);
                if (concierto == null)
                {
                    return NotFound($"No se encontró el concierto con ID {id}");
                }

                var (tieneAcceso, _) = await ValidarAccesoConciertoAsync(concierto.MutuaId, concierto.CentroId);
                if (!tieneAcceso)
                {
                    return Forbid();
                }

                return Ok(concierto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al recuperar el concierto: {ex.Message}");
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ConciertoResponseDTO>> Post([FromBody] ConciertoCreateDTO dto)
        {
            try
            {
                var perfilIdStr = HttpContext.User.FindFirst("perfilId")?.Value;
                if (perfilIdStr == "2")
                {
                    var mutuaIdStr = HttpContext.User.FindFirst("mutuaId")?.Value;
                    if (int.TryParse(mutuaIdStr, out int mutuaIdUsuario))
                    {
                        dto.MutuaId = mutuaIdUsuario; // Fuerza la mutua del usuario, ignora lo que venga del frontend
                    }
                }

                var nuevoConcierto = await _service.CreateAsync(dto);
                // Retorna 201 Created apuntando al GetById para seguir buenas prácticas REST 
                return CreatedAtAction(nameof(GetById), new { id = nuevoConcierto.ConciertoId }, nuevoConcierto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Put(int id, [FromBody] ConciertoUpdateDTO dto)
        {
            if (id != dto.ConciertoId) return BadRequest("El ID no coincide.");

            // Lee el perfil del token
            var perfilIdStr = HttpContext.User.FindFirst("perfilId")?.Value;

            // Si no es 1 ni 4, se le anula cualquier intento de autorizar
            if (perfilIdStr != "1" && perfilIdStr != "4")
            {
                dto.Autorizado = null; 
                dto.FechaAutorizacion = null;
                dto.UsuarioAutorizacionId = null;
            }

            try
            {
                // Verifica que el concierto existe y que el usuario (perfil 2) tiene acceso a su mutua/centro
                var conciertoExistente = await _service.GetByIdAsync(id);
                if (conciertoExistente == null) return NotFound($"No se encontró el concierto {id}");

                var (tieneAcceso, _) = await ValidarAccesoConciertoAsync(conciertoExistente.MutuaId, conciertoExistente.CentroId);
                if (!tieneAcceso)
                {
                    return Forbid();
                }

                // Si el perfil 2 intenta cambiar el concierto a otra mutua distinta de la suya, también se bloquea
                if (perfilIdStr == "2")
                {
                    var mutuaIdStr = HttpContext.User.FindFirst("mutuaId")?.Value;
                    if (int.TryParse(mutuaIdStr, out int mutuaIdUsuario) && dto.MutuaId != mutuaIdUsuario)
                    {
                        return Forbid();
                    }
                }

                var actualizado = await _service.UpdateAsync(id, dto);
                if (!actualizado) return NotFound($"No se encontró el concierto {id}");
                
                return NoContent(); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var usuarioId = ObtenerUsuarioIdActual();

                var exito = await _service.EliminarConciertoCompletoAsync(id, usuarioId);
                
                if (!exito)
                {
                    return NotFound(new { message = "No se encontró el concierto a eliminar." });
                }

                return NoContent(); // Regresa HTTP 204
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error crítico al eliminar el concierto y sus dependencias.", details = ex.Message });
            }
        }

        // Subrecursos asociados (Endpoints Anidados)
        [HttpGet("{id}/Ambitos")]
        public async Task<ActionResult<IEnumerable<ConciertosAmbitoCoberturaDTO>>> GetAmbitos(int id)
        {
            try
            {
                var ambitos = await _service.GetAmbitosByConciertoAsync(id);
                return Ok(ambitos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los ámbitos territoriales: {ex.Message}");
            }
        }

        [HttpGet("{id}/Especialidades")]
        public async Task<ActionResult<IEnumerable<ConciertosEspecialidadDTO>>> GetEspecialidades(int id)
        {
            try
            {
                var especialidades = await _service.GetEspecialidadesByConciertoAsync(id);
                return Ok(especialidades);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al procesar el listado de especialidades: {ex.Message}");
            }
        }

        [HttpGet("{id}/Documentos")]
        public async Task<ActionResult<IEnumerable<ConciertosDocumentoDTO>>> GetDocumentos(int id)
        {
            try
            {
                var documentos = await _service.GetDocumentosByConciertoAsync(id);
                return Ok(documentos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los metadatos de documentos: {ex.Message}");
            }
        }

        // Subida física mediante multipart/form-data
        [HttpPost("{id}/Documentos/Upload")]
        [Authorize]
        public async Task<ActionResult<ConciertosDocumentoDTO>> UploadDocumento(int id, [FromForm] DocumentoUploadRequest request)
        {
            // Validación de nulidad
            if (request.File == null || request.File.Length == 0)
            {
                return BadRequest("No se ha enviado ningún fichero físico válido para adjuntar.");
            }

            // Validación de seguridad estricta (Firmas, Extensiones y Magic Numbers)
            var (isValid, errorMessage) = await FileValidator.ValidateAsync(request.File);
            if (!isValid)
            {
                return BadRequest(errorMessage);
            }

            try
            {
                var usuarioId = ObtenerUsuarioIdActual();

                // Procesamiento en el servicio
                using (var stream = request.File.OpenReadStream())
                {
                    var dtoDocumento = await _service.UploadDocumentoAsync(
                        id, 
                        request.Titulo ?? string.Empty, 
                        request.Observaciones ?? string.Empty, 
                        request.File.FileName, 
                        stream,
                        usuarioId
                    );
                    
                    return Ok(dtoDocumento);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error en el proceso de almacenamiento del fichero en disco: {ex.Message}");
            }
        }

        [HttpDelete("Documentos/{documentoId}")]
        [Authorize]
        public async Task<IActionResult> DeleteDocumento(int documentoId)
        {
            try
            {
                var usuarioId = ObtenerUsuarioIdActual();

                var eliminado = await _service.DeleteDocumentoAsync(documentoId, usuarioId);
                if (!eliminado)
                {
                    return NotFound($"No se encontró el registro documental indexado con el ID {documentoId}.");
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Fallo crítico al eliminar el fichero del servidor técnico: {ex.Message}");
            }
        }

        [HttpPut("{id}/Documentos/{docId}")]
        [Authorize]
        public async Task<IActionResult> UpdateDocumento(int id, int docId, [FromBody] ConciertosDocumentoUpdateDTO dto)
        {
            try
            {
                // Valida usando la ruta PUT /api/Conciertos/{id}/documentos/{docId} 
                var actualizado = await _service.UpdateDocumentoAsync(docId, dto);
                
                if (!actualizado) return NotFound($"No se localizó el documento ID {docId}");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar los metadatos del documento: {ex.Message}");
            }
        }

        [HttpGet("sin-autorizar")]
        [Authorize] // Obliga a que la petición traiga un token válido
        public async Task<ActionResult<IEnumerable<ConciertoResponseDTO>>> GetSinAutorizar()
        {
            try
            {
                // Lee el perfil exacto con el nombre de claim que definido en AuthController
                var perfilIdStr = HttpContext.User.FindFirst("perfilId")?.Value;
                int? usuarioIdPerfil3 = null;

                // Si es perfil 3, lee el ID del usuario (Claim 'Sub' o 'NameIdentifier')
                if (perfilIdStr == "3")
                {
                    var userIdStr = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                ?? HttpContext.User.FindFirst("sub")?.Value; // Fallback por si la constante difiere
                    
                    if (int.TryParse(userIdStr, out int uid))
                    {
                        usuarioIdPerfil3 = uid;
                    }
                }

                // Pasa el ID al servicio
                var conciertos = await _service.GetSinAutorizarAsync(usuarioIdPerfil3);
                return Ok(conciertos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los conciertos sin autorizar: {ex.Message}");
            }
        }

        // Pasamos el año por QueryString
        [HttpGet("tipos-asistencia")]
        public async Task<ActionResult<IEnumerable<TipoAsistenciaDTO>>> GetTiposAsistencia([FromQuery] int anio)
        {
            if (anio <= 0)
            {
                // Fuerza al frontend a mandar el año de su "sesión".
                return BadRequest("Debes especificar el año de sesión válido para filtrar la asistencia.");
            }

            try
            {
                var tipos = await _service.GetTiposAsistenciaAsync(anio);
                return Ok(tipos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al cargar los tipos de asistencia: {ex.Message}");
            }
        }

        [HttpGet("centros-adhesion")]
        public async Task<ActionResult<IEnumerable<CentroAdhesionDTO>>> GetCentrosAdhesion([FromQuery] int? excluirConciertoId = null)
        {
            try
            {
                var centros = await _service.GetCentrosAdhesionAsync(excluirConciertoId);
                return Ok(centros);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al cargar los centros de adhesión: {ex.Message}");
            }
        }

        [HttpPost("{id}/Ambitos")]
        [Authorize]
        public async Task<ActionResult<ConciertosAmbitoCoberturaDTO>> AddAmbito(int id, [FromBody] ConciertosAmbitoCoberturaCreateDTO dto)
        {
            try
            {
                var nuevoAmbito = await _service.AddAmbitoAsync(id, dto);
                
                // Retorna HTTP 201 Created devolviendo el recurso recién creado.
                return StatusCode(201, nuevoAmbito);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al registrar el nuevo ámbito de cobertura: {ex.Message}");
            }
        }

        [HttpDelete("{id}/Ambitos/{ambitoId}")]
        [Authorize]
        public async Task<IActionResult> DeleteAmbito(int id, int ambitoId)
        {
            try
            {
                var usuarioId = ObtenerUsuarioIdActual();

                var exito = await _service.DeleteAmbitoAsync(id, ambitoId, usuarioId);
                
                if (!exito)
                {
                    return NotFound($"No se localizó el ámbito ID {ambitoId} para el concierto indicado.");
                }

                // HTTP 204 No Content es la respuesta estándar a un DELETE que funciona correctamente
                return NoContent(); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Fallo crítico al intentar eliminar el ámbito: {ex.Message}");
            }
        }

        /// <summary>
        /// Lee el Id del usuario autenticado desde los claims del token (NameIdentifier o 'sub').
        /// Devuelve null si no se puede determinar (p.ej. token sin ese claim).
        /// </summary>
        private int? ObtenerUsuarioIdActual()
        {
            var userIdStr = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                            ?? HttpContext.User.FindFirst("sub")?.Value;

            return int.TryParse(userIdStr, out int usuarioId) ? usuarioId : (int?)null;
        }

        /// <summary>
        /// Valida si el usuario actual (perfil 2, mutua bloqueada) tiene acceso al concierto indicado.
        /// Devuelve true si tiene acceso o si su perfil no está sujeto a esta restricción.
        /// </summary>
        private async Task<(bool tieneAcceso, int? mutuaIdUsuario)> ValidarAccesoConciertoAsync(int? mutuaIdConcierto, int? centroIdConcierto)
        {
            var perfilIdStr = HttpContext.User.FindFirst("perfilId")?.Value;

            // Solo el perfil 2 está sujeto a bloqueo de mutua/centro
            if (perfilIdStr != "2")
            {
                return (true, null);
            }

            var mutuaIdStr = HttpContext.User.FindFirst("mutuaId")?.Value;
            if (!int.TryParse(mutuaIdStr, out int mutuaIdUsuario))
            {
                return (false, null); // Sin mutuaId en el token, no puede tener acceso a nada
            }

            if (mutuaIdConcierto.HasValue && mutuaIdConcierto.Value != mutuaIdUsuario)
            {
                return (false, mutuaIdUsuario);
            }

            // Restricción adicional por centro asignado al usuario, igual que en GetSinAutorizarAsync
            if (centroIdConcierto.HasValue)
            {
                var userIdStr = HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                                ?? HttpContext.User.FindFirst("sub")?.Value;

                if (int.TryParse(userIdStr, out int userId))
                {
                    var tieneCentroAsignado = await _service.UsuarioTieneAccesoCentroAsync(userId, centroIdConcierto.Value);
                    if (!tieneCentroAsignado)
                    {
                        return (false, mutuaIdUsuario);
                    }
                }
            }

            return (true, mutuaIdUsuario);
        }
    }
}