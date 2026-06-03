using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using MZAsistencial.Server.Services;
using System;
using System.Text.Json;
using System.Threading.Tasks;
using System.Security.Claims;

namespace MZAsistencial.Server.Middlewares
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, IRegistroErroresService registroErroresService)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Excepción global capturada en el middleware.");

                int? usuarioId = null;
                var userIdClaim = context.User?.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int uid))
                {
                    usuarioId = uid;
                }

                await registroErroresService.LogErrorAsync(ex, "API Backend", usuarioId);

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 500;

                var result = JsonSerializer.Serialize(new { error = "Ocurrió un error interno en el servidor." });
                await context.Response.WriteAsync(result);
            }
        }
    }
}
