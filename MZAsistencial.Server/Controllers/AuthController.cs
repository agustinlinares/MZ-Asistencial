using Microsoft.AspNetCore.Mvc;
using MZAsistencial.Server.Helpers;

namespace MZAsistencial.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly BruteForceHelper _bruteForce;
        private readonly CaptchaHelper _captcha;
        private readonly IConfiguration _config;

        public AuthController(BruteForceHelper bruteForce, CaptchaHelper captcha, IConfiguration config)
        {
            _bruteForce = bruteForce;
            _captcha = captcha;
            _config = config;
        }

        /// <summary>
        /// Endpoint principal de login.
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // 1. Comprobar bloqueo
            bool bloqueado = await _bruteForce.ComprobarBloqueoAsync(request.Usuario);
            if (bloqueado)
            {
                return StatusCode(429, new
                {
                    error = "Usuario bloqueado temporalmente. Inténtalo de nuevo en 5 minutos."
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
                    return BadRequest(new { error = "Se requiere captcha.", requiereCaptcha = true });
                }

                bool captchaValido = _captcha.ValidarCaptcha(request.CaptchaId, request.CaptchaTexto);
                if (!captchaValido)
                {
                    await _bruteForce.RegistrarIntentoFallidoAsync(request.Usuario);
                    var nuevoCaptcha = _captcha.GenerarCaptcha();
                    return Unauthorized(new
                    {
                        error = "Captcha incorrecto.",
                        requiereCaptcha = true,
                        captchaId = nuevoCaptcha.captchaId
                    });
                }
            }

            // 4. Validar credenciales contra la BD
            bool credencialesValidas = await ValidarCredencialesAsync(request.Usuario, request.Contrasena);

            if (!credencialesValidas)
            {
                await _bruteForce.RegistrarIntentoFallidoAsync(request.Usuario);

                // Recalcular intentos tras registrar el fallo
                int intentosActuales = await _bruteForce.ObtenerIntentosAsync(request.Usuario);
                bool mostrarCaptcha = BruteForceHelper.RequiereCaptcha(intentosActuales);

                if (mostrarCaptcha)
                {
                    var nuevoCaptcha = _captcha.GenerarCaptcha();
                    return Unauthorized(new
                    {
                        error = "Credenciales incorrectas.",
                        requiereCaptcha = true,
                        captchaId = nuevoCaptcha.captchaId
                    });
                }

                return Unauthorized(new
                {
                    error = "Credenciales incorrectas.",
                    requiereCaptcha = false
                });
            }

            // 5. Login exitoso → resetear intentos y generar JWT
            await _bruteForce.ResetearIntentosAsync(request.Usuario);

            var datosUsuario = await ObtenerDatosUsuarioAsync(request.Usuario);
            var token = GenerarToken(datosUsuario);

            return Ok(new
            {
                token,
                usuario = datosUsuario.Usuario,
                usuarioId = datosUsuario.UsuarioId,
                perfilId = datosUsuario.PerfilId
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

        // ── Privados ─────────────────────────────────────────────────────────────

        private async Task<bool> ValidarCredencialesAsync(string usuario, string contrasena)
        {
            var connectionString = _config.GetConnectionString("DefaultConnection")!;
            using var conn = new Microsoft.Data.SqlClient.SqlConnection(connectionString);
            await conn.OpenAsync();

            var query = "SELECT COUNT(1) FROM Usuarios WHERE Usuario = @usuario AND Password = @password";
            using var cmd = new Microsoft.Data.SqlClient.SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@usuario", usuario);
            cmd.Parameters.AddWithValue("@password", contrasena);

            int count = Convert.ToInt32(await cmd.ExecuteScalarAsync());
            return count > 0;
        }

        private async Task<DatosUsuario> ObtenerDatosUsuarioAsync(string usuario)
        {
            var connectionString = _config.GetConnectionString("DefaultConnection")!;
            using var conn = new Microsoft.Data.SqlClient.SqlConnection(connectionString);
            await conn.OpenAsync();

            var query = "SELECT Usuario_id, Usuario, Perfil_id FROM Usuarios WHERE Usuario = @usuario";
            using var cmd = new Microsoft.Data.SqlClient.SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@usuario", usuario);

            using var reader = await cmd.ExecuteReaderAsync();
            await reader.ReadAsync();

            return new DatosUsuario
            {
                UsuarioId = reader.GetInt32(0),
                Usuario = reader.GetString(1),
                PerfilId = reader.IsDBNull(2) ? null : reader.GetInt32(2)
            };
        }

        private string GenerarToken(DatosUsuario datos)
        {
            var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new Microsoft.IdentityModel.Tokens.SigningCredentials(
                key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new System.Security.Claims.Claim("usuarioId", datos.UsuarioId.ToString()),
                new System.Security.Claims.Claim("usuario", datos.Usuario),
                new System.Security.Claims.Claim("perfilId", datos.PerfilId?.ToString() ?? ""),
            };

            var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
        }

        private class DatosUsuario
        {
            public int UsuarioId { get; set; }
            public string Usuario { get; set; } = string.Empty;
            public int? PerfilId { get; set; }
        }
    }

    public class LoginRequest
    {
        public string Usuario { get; set; } = string.Empty;
        public string Contrasena { get; set; } = string.Empty;
        public string? CaptchaId { get; set; }
        public string? CaptchaTexto { get; set; }
    }
}