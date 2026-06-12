using System.Text;

namespace MZAsistencial.Server.Helpers
{
    public static class FileValidator
    {
        private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            "xlsx", "csv", "xml", "jpg", "jpeg", "png", "bmp",
            "pdf", "docx", "pptx", "odt", "msg", "zip", "rar", "tif", "tiff",
        };

        // Hex prefix of first 4 bytes → compatible extensions
        private static readonly Dictionary<string, HashSet<string>> Signatures = new(StringComparer.OrdinalIgnoreCase)
        {
            ["25504446"] = new() { "pdf" },
            ["FFD8FF"]   = new() { "jpg", "jpeg" },
            ["89504E47"] = new() { "png" },
            ["424D"]     = new() { "bmp" },
            ["504B0304"] = new() { "xlsx", "docx", "pptx", "odt", "zip" },
            ["52617221"] = new() { "rar" },
            ["49492A00"] = new() { "tif", "tiff" },
            ["4D4D002A"] = new() { "tif", "tiff" },
            ["D0CF11E0"] = new() { "msg" },
        };

        public static async Task<(bool IsValid, string? Error)> ValidateAsync(IFormFile file)
        {
            var ext = Path.GetExtension(file.FileName).TrimStart('.').ToLowerInvariant();

            if (!AllowedExtensions.Contains(ext))
                return (false, $"Tipo de fichero no permitido: .{ext}");

            if (ext == "csv")
                return await ValidateCsvAsync(file);

            if (ext == "xml")
                return await ValidateXmlAsync(file);

            var buffer = new byte[4];
            await using var stream = file.OpenReadStream();
            var read = await stream.ReadAsync(buffer.AsMemory(0, 4));

            if (read < 2)
                return (false, "El fichero está vacío o es demasiado pequeño.");

            var hex = BitConverter.ToString(buffer, 0, read).Replace("-", "").ToUpperInvariant();

            foreach (var (sig, extensions) in Signatures)
            {
                if (hex.StartsWith(sig, StringComparison.OrdinalIgnoreCase))
                {
                    return extensions.Contains(ext)
                        ? (true, null)
                        : (false, $"El contenido del fichero no coincide con la extensión .{ext}. Posible fichero malicioso.");
                }
            }

            return (false, $"No se reconoce la firma del fichero para la extensión .{ext}.");
        }

        private static async Task<(bool, string?)> ValidateCsvAsync(IFormFile file)
        {
            using var reader = new StreamReader(file.OpenReadStream(), Encoding.UTF8, detectEncodingFromByteOrderMarks: true);
            var firstLine = await reader.ReadLineAsync();
            if (string.IsNullOrEmpty(firstLine))
                return (false, "El fichero CSV está vacío.");

            return firstLine.Split(';').Length > 1
                ? (true, null)
                : (false, "El fichero CSV no tiene el formato esperado (separador ;).");
        }

        private static async Task<(bool, string?)> ValidateXmlAsync(IFormFile file)
        {
            using var reader = new StreamReader(file.OpenReadStream(), Encoding.UTF8, detectEncodingFromByteOrderMarks: true);
            var firstLine = await reader.ReadLineAsync();
            if (string.IsNullOrEmpty(firstLine))
                return (false, "El fichero XML está vacío.");

            var trimmed = firstLine.TrimStart();
            return (trimmed.StartsWith("<?xml", StringComparison.OrdinalIgnoreCase) || trimmed.StartsWith("<"))
                ? (true, null)
                : (false, "El contenido del fichero no corresponde a un XML válido.");
        }
    }
}
