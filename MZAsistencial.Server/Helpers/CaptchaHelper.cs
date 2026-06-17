using Microsoft.Extensions.Caching.Memory;
using SkiaSharp;

namespace MZAsistencial.Server.Helpers
{
    public class CaptchaHelper
    {
        private readonly IMemoryCache _cache;
        private const int ExpirationMinutes = 5;

        public CaptchaHelper(IMemoryCache cache)
        {
            _cache = cache;
        }

        /// <summary>
        /// Genera un captcha: devuelve el ID único y la imagen en bytes (PNG).
        /// El texto se guarda en caché durante 5 minutos asociado al ID.
        /// </summary>
        public (string captchaId, byte[] imagenPng) GenerarCaptcha()
        {
            string texto = GenerarTextoAleatorio(5);
            string captchaId = Guid.NewGuid().ToString();

            _cache.Set(captchaId, texto, TimeSpan.FromMinutes(ExpirationMinutes));

            byte[] imagen = GenerarImagen(texto);
            return (captchaId, imagen);
        }

        /// <summary>
        /// Valida si el texto introducido por el usuario coincide con el captcha almacenado.
        /// No distingue mayúsculas/minúsculas.
        /// Elimina el captcha de caché tras validarlo (válido una sola vez).
        /// </summary>
        public bool ValidarCaptcha(string captchaId, string textoUsuario)
        {
            if (!_cache.TryGetValue(captchaId, out string? textoReal))
                return false; // Expirado o no existe

            _cache.Remove(captchaId); // Uso único
            return string.Equals(textoReal, textoUsuario, StringComparison.OrdinalIgnoreCase);
        }

        // ── Privados ────────────────────────────────────────────────────────────

        private static string GenerarTextoAleatorio(int longitud)
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sin O,0,I,1 para evitar confusión
            var random = new Random();
            return new string(Enumerable.Range(0, longitud)
                .Select(_ => chars[random.Next(chars.Length)])
                .ToArray());
        }

        private static byte[] GenerarImagen(string texto)
        {
            const int width = 160;
            const int height = 50;

            using var bitmap = new SKBitmap(width, height);
            using var canvas = new SKCanvas(bitmap);

            // Fondo
            canvas.Clear(SKColors.WhiteSmoke);

            // Líneas de ruido
            using var noisePaint = new SKPaint
            {
                Color = SKColors.LightGray,
                StrokeWidth = 1,
                IsAntialias = true
            };
            var random = new Random();
            for (int i = 0; i < 8; i++)
            {
                canvas.DrawLine(
                    random.Next(width), random.Next(height),
                    random.Next(width), random.Next(height),
                    noisePaint);
            }

            // Texto
            using var font = new SKFont(SKTypeface.Default, 28);
            font.Embolden = true;

            using var textPaint = new SKPaint
            {
                Color = SKColors.DarkSlateBlue,
                IsAntialias = true
            };

            // Ligera inclinación aleatoria por letra
            float x = width / 2f - (texto.Length * 14f / 2f) + 7f;
            float y = height / 2f + 10f;

            for (int i = 0; i < texto.Length; i++)
            {
                canvas.Save();
                float offsetY = random.Next(-4, 5);
                float rotation = random.Next(-15, 16);
                canvas.RotateDegrees(rotation, x + i * 14f, y + offsetY);
                canvas.DrawText(texto[i].ToString(), x + i * 14f, y + offsetY, SKTextAlign.Center, font, textPaint);
                canvas.Restore();
            }

            // Puntos de ruido
            using var dotPaint = new SKPaint { Color = SKColors.Gray };
            for (int i = 0; i < 40; i++)
            {
                canvas.DrawCircle(random.Next(width), random.Next(height), 1, dotPaint);
            }

            using var image = SKImage.FromBitmap(bitmap);
            using var data = image.Encode(SKEncodedImageFormat.Png, 100);
            return data.ToArray();
        }
    }
}