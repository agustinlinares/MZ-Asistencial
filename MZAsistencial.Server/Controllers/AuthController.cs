using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly MZAsistencialContext _context;

        public AuthController(MZAsistencialContext context)
        {
            _context = context;
        }

        [HttpGet("ping")]
        public async Task<IActionResult> Ping()
        {
            try
            {
                var count = await _context.Usuarios.CountAsync();
                return Ok(new { ok = true, usuarios = count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { ok = false, error = ex.Message, inner = ex.InnerException?.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // 1. Validación de entrada básica
            if (string.IsNullOrWhiteSpace(request.Usuario) || string.IsNullOrWhiteSpace(request.Contrasena))
                return BadRequest(new { message = "Usuario y contraseña son obligatorios." });

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Usuario1 == request.Usuario && u.Password == request.Contrasena);

            if (usuario == null)
                return Unauthorized(new { message = "Usuario o contraseña incorrectos." });

            return Ok(new
            {
                usuarioId = usuario.UsuarioId,
                usuario = usuario.Usuario1,
                perfilId = usuario.PerfilId,
                nombre = usuario.Nombre,
                apellidos = usuario.Apellidos,
            });
        }
    }

    public class LoginRequest
    {
        public string Usuario { get; set; } = "";
        public string Contrasena { get; set; } = "";
    }
}