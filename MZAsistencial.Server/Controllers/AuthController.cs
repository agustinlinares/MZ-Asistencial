using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.Helpers;
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
        private readonly BruteForceHelper _bruteForce;
        private readonly CaptchaHelper _captcha;

        public AuthController(MZAsistencialContext context, IConfiguration config, BruteForceHelper bruteForce, CaptchaHelper captcha)
        {
            _context = context;
            _config = config;
            _bruteForce = bruteForce;
            _captcha = captcha;
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

            // 1. Comprobar bloqueo por fuerza bruta
            bool bloqueado = await _bruteForce.ComprobarBloqueoAsync(request.Usuario);
            if (bloqueado)
            {
                return StatusCode(429, new
                {
                    message = "Usuario bloqueado temporalmente. Inténtalo de nuevo en 5 minutos."
                });
            }

            // 2. Obtener intentos actuales para saber si se requiere captcha
            int intentos = await _bruteForce.ObtenerIntentosAsync(request.Usuario);
            bool requiereCaptcha = BruteForceHelper.RequiereCaptcha(intentos);

            // 3. Verificar captcha si corresponde
            if (requiereCaptcha)
            {
                if (string.IsNullOrEmpty(request.CaptchaId) || string.IsNullOrEmpty(request.CaptchaTexto))
                {
                    return BadRequest(new { message = "Se requiere captcha.", requiereCaptcha = true });
                }

                bool captchaValido = _captcha.ValidarCaptcha(request.CaptchaId, request.CaptchaTexto);
                if (!captchaValido)
                {
                    await _bruteForce.RegistrarIntentoFallidoAsync(request.Usuario);
                    var nuevoCaptcha = _captcha.GenerarCaptcha();
                    return Unauthorized(new
                    {
                        message = "Captcha incorrecto.",
                        requiereCaptcha = true,
                        captchaId = nuevoCaptcha.captchaId
                    });
                }
            }

            // 4. Validar credenciales (MD5 primero, texto plano como fallback para no migrados)
            var hashedPwd = CreateMD5(request.Contrasena);
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Usuario1 == request.Usuario && u.Password == hashedPwd);

            if (usuario == null)
            {
                usuario = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.Usuario1 == request.Usuario && u.Password == request.Contrasena);
            }

            if (usuario == null)
            {
                await _bruteForce.RegistrarIntentoFallidoAsync(request.Usuario);

                int intentosActuales = await _bruteForce.ObtenerIntentosAsync(request.Usuario);
                bool mostrarCaptcha = BruteForceHelper.RequiereCaptcha(intentosActuales);

                if (mostrarCaptcha)
                {
                    var nuevoCaptcha = _captcha.GenerarCaptcha();
                    return Unauthorized(new
                    {
                        message = "Usuario o contrasena incorrectos.",
                        requiereCaptcha = true,
                        captchaId = nuevoCaptcha.captchaId
                    });
                }

                return Unauthorized(new { message = "Usuario o contrasena incorrectos.", requiereCaptcha = false });
            }

            if (usuario.FechaBaja.HasValue && usuario.FechaBaja.Value <= DateTime.Now)
                return Unauthorized(new { message = "El usuario se encuentra dado de baja." });

            // 5. Login exitoso → resetear intentos
            await _bruteForce.ResetearIntentosAsync(request.Usuario);

            // Verificar si necesita cambio de contraseña
            bool requiresPasswordChange = usuario.CambioPassword == true;

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

        /// <summary>
        /// Endpoint para obtener la imagen del captcha como PNG.
        /// </summary>
        [HttpGet("captcha")]
        public IActionResult ObtenerCaptcha()
        {
            var (captchaId, imagenPng) = _captcha.GenerarCaptcha();

            Response.Headers.Append("X-Captcha-Id", captchaId);
            return File(imagenPng, "image/png");
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
        public string? CaptchaId { get; set; }
        public string? CaptchaTexto { get; set; }
    }
}