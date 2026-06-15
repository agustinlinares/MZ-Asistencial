using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MZAsistencial.Server.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly MZAsistencialContext _context;
        private readonly IConfiguration _config;

        public AuthController(MZAsistencialContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
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

        private static string CreateMD5(string input)
        {
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);
                return Convert.ToHexString(hashBytes);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Usuario) || string.IsNullOrWhiteSpace(request.Contrasena))
                return BadRequest(new { message = "Usuario y contrasena son obligatorios." });

            var hashedPwd = CreateMD5(request.Contrasena);
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Usuario1 == request.Usuario && u.Password == hashedPwd);

            // Permitimos también que entren con texto plano si aún no han sido migrados
            if (usuario == null)
            {
                usuario = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.Usuario1 == request.Usuario && u.Password == request.Contrasena);
                
                // Opcional: si entró con texto plano, podríamos actualizarle a MD5 aquí.
            }

            if (usuario == null)
                return Unauthorized(new { message = "Usuario o contrasena incorrectos." });

            if (usuario.FechaBaja.HasValue && usuario.FechaBaja.Value <= DateTime.Now)
                return Unauthorized(new { message = "El usuario se encuentra dado de baja." });

            // Verificar si necesita cambio de contraseña
            bool requiresPasswordChange = false;
            if (usuario.CambioPassword == true)
            {
                requiresPasswordChange = true;
            }
            else if (usuario.FechaPassword.HasValue)
            {
                var days = (DateTime.Now - usuario.FechaPassword.Value).TotalDays;
                if (days > 180) requiresPasswordChange = true;
            }
            else
            {
                requiresPasswordChange = true; // Si no tiene fecha, le obligamos.
            }

            var anio = DateTime.Now.Year;
            var token = GenerarToken(usuario);

            return Ok(new
            {
                usuarioId = usuario.UsuarioId,
                usuario = usuario.Usuario1,
                perfilId = usuario.PerfilId,
                mutuaId = usuario.MutuaId,
                nombre = usuario.Nombre,
                apellidos = usuario.Apellidos,
                anio = anio,
                token = token,
                requiresPasswordChange = requiresPasswordChange
            });
        }

        private string GenerarToken(MZAsistencial.Server.Models.Usuario usuario)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddHours(double.Parse(_config["Jwt:ExpiresInHours"] ?? "8"));

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,  usuario.UsuarioId.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, usuario.Usuario1 ?? ""),
                new Claim("perfilId",                   usuario.PerfilId?.ToString() ?? ""),
                new Claim("mutuaId",                    usuario.MutuaId?.ToString() ?? ""),
                new Claim(JwtRegisteredClaimNames.Jti,  Guid.NewGuid().ToString())
            };

            var tokenJwt = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenJwt);
        }
    }

    public class LoginRequest
    {
        public string Usuario { get; set; } = "";
        public string Contrasena { get; set; } = "";
    }
}