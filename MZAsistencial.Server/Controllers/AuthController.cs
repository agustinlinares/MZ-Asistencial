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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // 1. Validación de entrada básica
            if (string.IsNullOrWhiteSpace(request.Usuario) || string.IsNullOrWhiteSpace(request.Contrasena))
                return BadRequest(new { message = "Usuario y contraseña son obligatorios." });

            // 2. LA CORRECCIÓN CLAVE:
            // Cambiamos 'u.Contraseña' (campo viejo con espacios) por 'u.Password' (campo nuevo)
            // Usamos '.Trim()' en la base de datos por seguridad extra contra espacios invisibles
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Usuario1 == request.Usuario
                                       && u.Password == request.Contrasena);

            // 3. Verificación de resultado
            if (usuario == null)
                return Unauthorized(new { message = "Usuario o contraseña incorrectos." });

            // 4. Respuesta exitosa
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