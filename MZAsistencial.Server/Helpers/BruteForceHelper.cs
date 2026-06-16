using Microsoft.Data.SqlClient;

namespace MZAsistencial.Server.Helpers
{
    public class BruteForceHelper
    {
        private readonly string _connectionString;

        private const int MaxIntentos = 5;
        private const int MinutosBloqueo = 5;
        private const int IntentosParaCaptcha = 2;

        public BruteForceHelper(string connectionString)
        {
            _connectionString = connectionString;
        }

        /// <summary>
        /// Comprueba si el usuario está bloqueado.
        /// Devuelve true si debe bloquearse el acceso.
        /// También resetea los intentos si han pasado más de 5 minutos.
        /// </summary>
        public async Task<bool> ComprobarBloqueoAsync(string usuario)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            var query = "SELECT Intentos, FechaIntento FROM Aux_SesionUsuario WHERE Usuario = @usuario";
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@usuario", usuario);

            using var reader = await cmd.ExecuteReaderAsync();

            if (!reader.HasRows)
                return false; // No existe registro → no bloqueado

            await reader.ReadAsync();
            int intentos = reader.GetInt32(0);
            DateTime fechaIntento = reader.GetDateTime(1);
            reader.Close();

            // Si han pasado más de 5 minutos → resetear
            if ((DateTime.Now - fechaIntento).TotalMinutes > MinutosBloqueo)
            {
                await ResetearIntentosAsync(usuario, conn);
                return false;
            }

            // Si tiene 5 o más intentos y sigue en ventana → bloqueado
            return intentos >= MaxIntentos;
        }

        /// <summary>
        /// Registra un intento fallido. Inserta o actualiza el registro.
        /// </summary>
        public async Task RegistrarIntentoFallidoAsync(string usuario)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            // Comprobamos si ya existe registro
            var checkQuery = "SELECT COUNT(1) FROM Aux_SesionUsuario WHERE Usuario = @usuario";
            using var checkCmd = new SqlCommand(checkQuery, conn);
            checkCmd.Parameters.AddWithValue("@usuario", usuario);
            int existe = Convert.ToInt32(await checkCmd.ExecuteScalarAsync());

            if (existe == 0)
            {
                // Insertar nuevo registro
                var insertQuery = @"INSERT INTO Aux_SesionUsuario (Usuario, Intentos, FechaIntento)
                                    VALUES (@usuario, 1, @fecha)";
                using var insertCmd = new SqlCommand(insertQuery, conn);
                insertCmd.Parameters.AddWithValue("@usuario", usuario);
                insertCmd.Parameters.AddWithValue("@fecha", DateTime.Now);
                await insertCmd.ExecuteNonQueryAsync();
            }
            else
            {
                // Incrementar intentos existentes
                var updateQuery = @"UPDATE Aux_SesionUsuario
                                    SET Intentos = Intentos + 1, FechaIntento = @fecha
                                    WHERE Usuario = @usuario";
                using var updateCmd = new SqlCommand(updateQuery, conn);
                updateCmd.Parameters.AddWithValue("@usuario", usuario);
                updateCmd.Parameters.AddWithValue("@fecha", DateTime.Now);
                await updateCmd.ExecuteNonQueryAsync();
            }
        }

        /// <summary>
        /// Resetea los intentos a 0 tras un login exitoso o tras expirar el bloqueo.
        /// </summary>
        public async Task ResetearIntentosAsync(string usuario)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();
            await ResetearIntentosAsync(usuario, conn);
        }

        // Sobrecarga interna que reutiliza conexión abierta
        private async Task ResetearIntentosAsync(string usuario, SqlConnection conn)
        {
            var query = @"UPDATE Aux_SesionUsuario
                          SET Intentos = 0, FechaIntento = @fecha
                          WHERE Usuario = @usuario";
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@usuario", usuario);
            cmd.Parameters.AddWithValue("@fecha", DateTime.Now);
            await cmd.ExecuteNonQueryAsync();
        }

        /// <summary>
        /// Devuelve el número de intentos fallidos actuales del usuario.
        /// Útil para que el AuthController sepa si debe pedir captcha.
        /// </summary>
        public async Task<int> ObtenerIntentosAsync(string usuario)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            var query = "SELECT Intentos FROM Aux_SesionUsuario WHERE Usuario = @usuario";
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@usuario", usuario);

            var result = await cmd.ExecuteScalarAsync();
            return result is DBNull or null ? 0 : Convert.ToInt32(result);
        }

        /// <summary>
        /// Indica si el usuario debe ver el captcha (2 o más intentos fallidos).
        /// </summary>
        public static bool RequiereCaptcha(int intentos) => intentos >= IntentosParaCaptcha;
    }
}