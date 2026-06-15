using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MZAsistencial.Server.Services
{
    public class ConciertosService : IConciertosService
    {
        private readonly MZAsistencialContext _context;
        private readonly string _storagePath;

        public ConciertosService(MZAsistencialContext context, IConfiguration configuration)
        {
            _context = context;
            // Se lee la ruta raíz de almacenamiento físico desde la configuración de la app (appsettings.json)
            _storagePath = configuration["FileStorage:ConciertosPath"] ?? Path.Combine(AppContext.BaseDirectory, "Uploads");
        }

        public async Task<IEnumerable<ConciertoResponseDTO>> GetAllAsync()
        {
            // Campo Localizador Calculado combinando número de mutua + código postal + CIF del centro.
            // Para resolverlo de forma segura ante datos inconsistentes, realizamos Joins con CentrosConcertados
            var query = from c in _context.Conciertos
                        join centro in _context.CentrosConcertados on c.CentroId equals centro.CentroId
                        
                        select new ConciertoResponseDTO
                        {
                            ConciertoId = c.ConciertoId,
                            MutuaId = c.MutuaId,
                            CentroId = c.CentroId,
                            CodigoCasa = c.CodigoCasa,
                            CodigoMz = c.CodigoMz,
                            CentroAsociadoId = c.CentroAsociadoId,
                            TipoAsistenciaId = c.TipoAsistenciaId,
                            AmbitoCobertura = c.AmbitoCobertura,
                            Muniambito = c.Muniambito,
                            Autorizado = c.Autorizado,
                            FechaAutorizacion = c.FechaAutorizacion,
                            UsuarioAutorizacionId = c.UsuarioAutorizacionId,
                            FechaSuscripcion = c.FechaSuscripcion,
                            FechaResolucion = c.FechaResolucion,
                            FechaVigencia = c.FechaVigencia,
                            FechaProrroga = c.FechaProrroga,
                            FechaAlta = c.FechaAlta,
                            UsuarioAltaId = c.UsuarioAltaId,
                            FechaModificacion = c.FechaModificacion,
                            UsuarioModificacionId = c.UsuarioModificacionId,
                            FechaBaja = c.FechaBaja,
                            UsuarioBajaId = c.UsuarioBajaId,
                            Adhesion = c.Adhesion,
                            ClaveAcces = c.ClaveAcces,
                            
                            CentroNombre = centro.Centro,
                            CentroCif = centro.Cifnif,
                            CentroCp = centro.Cp,

                            // Concatenación normalizada aplicando ceros a la izquierda
                            Localizador = (c.MutuaId.ToString().PadLeft(3, '0') + 
                                           (centro.Cp ?? "").Trim().PadLeft(5, '0') + 
                                           (centro.Cifnif ?? "").Trim()).ToUpper()
                        };

            return await query.ToListAsync();
        }

        public async Task<ConciertoResponseDTO?> GetByIdAsync(int id)
        {
            var c = await _context.Conciertos.FindAsync(id);
            if (c == null) return null;

            var centro = await _context.CentrosConcertados.AsNoTracking().FirstOrDefaultAsync(x => x.CentroId == c.CentroId);

            return new ConciertoResponseDTO
            {
                ConciertoId = c.ConciertoId,
                MutuaId = c.MutuaId,
                CentroId = c.CentroId,
                CodigoCasa = c.CodigoCasa,
                CodigoMz = c.CodigoMz,
                CentroAsociadoId = c.CentroAsociadoId,
                TipoAsistenciaId = c.TipoAsistenciaId,
                AmbitoCobertura = c.AmbitoCobertura,
                Muniambito = c.Muniambito,
                Autorizado = c.Autorizado,
                FechaAutorizacion = c.FechaAutorizacion,
                UsuarioAutorizacionId = c.UsuarioAutorizacionId,
                FechaSuscripcion = c.FechaSuscripcion,
                FechaResolucion = c.FechaResolucion,
                FechaVigencia = c.FechaVigencia,
                FechaAlta = c.FechaAlta,
                Localizador = centro != null 
                    ? (c.MutuaId.ToString().PadLeft(3, '0') + (centro.Cp ?? "").Trim().PadLeft(5, '0') + (centro.Cifnif ?? "").Trim()).ToUpper()
                    : null
            };
        }

        public async Task<ConciertoResponseDTO> CreateAsync(ConciertoCreateDTO dto)
        {
            // Calcula el código Mz concatenando el número de mutua con el código Mz del centro concertado
            var centro = await _context.CentrosConcertados.FindAsync(dto.CentroId);
            if (centro == null)
            {
                throw new Exception($"El Centro Concertado con ID {dto.CentroId} no existe en el sistema.");
            }

            string codigoMzCalculado = $"{dto.MutuaId}{centro.CodigoMz?.Trim()}";

            var nuevoConcierto = new Concierto
            {
                MutuaId = dto.MutuaId,
                CentroId = dto.CentroId,
                CodigoCasa = dto.CodigoCasa,
                CodigoMz = codigoMzCalculado, // Guardado Automático calculado por negocio
                CentroAsociadoId = dto.CentroAsociadoId,
                TipoAsistenciaId = dto.TipoAsistenciaId,
                AmbitoCobertura = dto.AmbitoCobertura,
                Muniambito = dto.Muniambito,
                FechaSuscripcion = dto.FechaSuscripcion,
                FechaResolucion = dto.FechaResolucion,
                FechaVigencia = dto.FechaVigencia,
                FechaAlta = DateTime.Now,
                UsuarioAltaId = dto.UsuarioAltaId,
                Autorizado = false // Por defecto inicia sin autorización
            };

            _context.Conciertos.Add(nuevoConcierto);
            await _context.SaveChangesAsync();

            // Mapeo a respuesta final devolviendo la ID generada e incluyendo el Localizador provisional
            return new ConciertoResponseDTO
            {
                ConciertoId = nuevoConcierto.ConciertoId,
                MutuaId = nuevoConcierto.MutuaId,
                CentroId = nuevoConcierto.CentroId,
                CodigoMz = nuevoConcierto.CodigoMz,
                CodigoCasa = nuevoConcierto.CodigoCasa,
                FechaAlta = nuevoConcierto.FechaAlta,
                Localizador = (nuevoConcierto.MutuaId.ToString().PadLeft(3, '0') + (centro.Cp ?? "").Trim().PadLeft(5, '0') + (centro.Cifnif ?? "").Trim()).ToUpper()
            };
        }

        public async Task<bool> UpdateAsync(int id, ConciertoUpdateDTO dto)
        {
            var concierto = await _context.Conciertos.FindAsync(id);
            if (concierto == null) return false;

            var centro = await _context.CentrosConcertados.FindAsync(dto.CentroId);
            if (centro == null) throw new Exception("Centro no válido.");

            // El código MZ se recalcula por si cambiaron de centro o mutua en la modificación
            concierto.MutuaId = dto.MutuaId;
            concierto.CentroId = dto.CentroId;
            concierto.CodigoCasa = dto.CodigoCasa;
            concierto.CodigoMz = $"{dto.MutuaId}{centro.CodigoMz?.Trim()}";
            concierto.CentroAsociadoId = dto.CentroAsociadoId;
            concierto.TipoAsistenciaId = dto.TipoAsistenciaId;
            concierto.AmbitoCobertura = dto.AmbitoCobertura;
            concierto.Muniambito = dto.Muniambito;
            concierto.Autorizado = dto.Autorizado;
            concierto.FechaAutorizacion = dto.FechaAutorizacion;
            concierto.UsuarioAutorizacionId = dto.UsuarioAutorizacionId;
            concierto.FechaSuscripcion = dto.FechaSuscripcion;
            concierto.FechaResolucion = dto.FechaResolucion;
            concierto.FechaVigencia = dto.FechaVigencia;
            concierto.FechaProrroga = dto.FechaProrroga;
            concierto.FechaModificacion = DateTime.Now;
            concierto.UsuarioModificacionId = dto.UsuarioModificacionId;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteIcg07RecordAsync(int conciertoId)
        {
            // No borra de la tabla Conciertos. Elimina únicamente el registro de control analítico/financiero ICG07 para el año en curso.
            int anyoActual = DateTime.Now.Year;

            // Dado que las especialidades y asignaciones anuales representan el desglose por ejercicio (tabla ICG07 del esquema),
            // busca y remueve el registro vinculado a este ejercicio.
            var registroIcg07 = await _context.ConciertosEspecialidades
                .FirstOrDefaultAsync(x => x.ConciertoId == conciertoId && x.Año == anyoActual);

            if (registroIcg07 == null)
            {
                return false; 
            }

            _context.ConciertosEspecialidades.Remove(registroIcg07);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ConciertosAmbitoCoberturaDTO>> GetAmbitosByConciertoAsync(int conciertoId)
        {
            return await _context.ConciertosAmbitoCoberturas
                .Where(x => x.ConciertoId == conciertoId)
                .Select(x => new ConciertosAmbitoCoberturaDTO { Id = x.Id, ConciertoId = x.ConciertoId, AmbitoId = x.AmbitoId, PoblacionId = x.PoblacionId, Cp = x.Cp })
                .ToListAsync();
        }

        public async Task<IEnumerable<ConciertosEspecialidadDTO>> GetEspecialidadesByConciertoAsync(int conciertoId)
        {
            return await _context.ConciertosEspecialidades
                .Where(x => x.ConciertoId == conciertoId)
                .Select(x => new ConciertosEspecialidadDTO { ConciertoEspecialidadId = x.ConciertoEspecialidadId, ConciertoId = x.ConciertoId, Año = x.Año, EspecialidadId = x.EspecialidadId, ServicioId = x.ServicioId, Cantidad = x.Cantidad, ImporteConIva = x.ImporteConIva })
                .ToListAsync();
        }

        public async Task<IEnumerable<ConciertosDocumentoDTO>> GetDocumentosByConciertoAsync(int conciertoId)
        {
            return await _context.ConciertosDocumentos
                .Where(x => x.ConciertoId == conciertoId)
                .Select(x => new ConciertosDocumentoDTO { DocumentoId = x.DocumentoId, ConciertoId = x.ConciertoId, Documento = x.Documento, Titulo = x.Titulo, FechaVigencia = x.FechaVigencia, FechaAlta = x.FechaAlta, Observaciones = x.Observaciones })
                .ToListAsync();
        }

        public async Task<ConciertosDocumentoDTO> UploadDocumentoAsync(int conciertoId, string titulo, string observaciones, string nombreOriginal, Stream archivoStream)
        {
            if (!Directory.Exists(_storagePath))
            {
                Directory.CreateDirectory(_storagePath);
            }

            // Fase Base de Datos: Inserta para obtener el ID secuencial de la base de datos de manera atómica
            var nuevoDoc = new ConciertosDocumento
            {
                ConciertoId = conciertoId,
                Titulo = titulo,
                Observaciones = observaciones,
                FechaAlta = DateTime.Now,
                Documento = "TEMP_HOLDER" // Valor temporal para evitar restricciones de campos no nulos
            };

            _context.ConciertosDocumentos.Add(nuevoDoc);
            await _context.SaveChangesAsync();

            // Fase de Almacenamiento 
            string nombreLimpio = Path.GetFileName(nombreOriginal).Replace(" ", "_");
            string nombreFinalFichero = $"{nuevoDoc.DocumentoId}_{nombreLimpio}";
            string rutaCompleta = Path.Combine(_storagePath, nombreFinalFichero);

            using (var fileStream = new FileStream(rutaCompleta, FileMode.Create, FileAccess.Write))
            {
                await archivoStream.CopyToAsync(fileStream);
            }

            // Fase de Sincronización: Actualiza la base de datos con el nombre real definitivo
            nuevoDoc.Documento = nombreFinalFichero;
            _context.ConciertosDocumentos.Update(nuevoDoc);
            await _context.SaveChangesAsync();

            return new ConciertosDocumentoDTO
            {
                DocumentoId = nuevoDoc.DocumentoId,
                ConciertoId = nuevoDoc.ConciertoId,
                Documento = nuevoDoc.Documento,
                Titulo = nuevoDoc.Titulo,
                FechaAlta = nuevoDoc.FechaAlta,
                Observaciones = nuevoDoc.Observaciones
            };
        }

        public async Task<bool> DeleteDocumentoAsync(int documentoId)
        {
            var documento = await _context.ConciertosDocumentos.FindAsync(documentoId);
            if (documento == null) return false;

            // Elimina el archivo físico en disco duro local/red remota
            if (!string.IsNullOrEmpty(documento.Documento))
            {
                string rutaCompleta = Path.Combine(_storagePath, documento.Documento);
                if (File.Exists(rutaCompleta))
                {
                    File.Delete(rutaCompleta);
                }
            }

            // Elimina el registro lógico de la base de datos de manera síncrona
            _context.ConciertosDocumentos.Remove(documento);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateDocumentoAsync(int documentoId, ConciertosDocumentoUpdateDTO dto)
        {
            var documento = await _context.ConciertosDocumentos.FindAsync(documentoId);
            if (documento == null) return false;

            // Modifica solo los metadatos; el fichero físico no se toca en este endpoint
            documento.Titulo = dto.Titulo;
            documento.FechaVigencia = dto.FechaVigencia;
            documento.Observaciones = dto.Observaciones;
            documento.FechaModificacion = DateTime.Now;
            documento.UsuarioModificacionId = dto.UsuarioModificacionId;

            _context.ConciertosDocumentos.Update(documento);
            await _context.SaveChangesAsync();
            
            return true;
        }

        public async Task<IEnumerable<ConciertoResponseDTO>> GetSinAutorizarAsync(int? usuarioIdParaPerfil3 = null)
        {
            // Listado de conciertos con Autorizado = 0 (o nulo) 
            var query = _context.Conciertos
                .Include(c => c.CentroId)
                .Where(c => c.Autorizado == false || c.Autorizado == null);

            // Restricción adicional para perfil 3 (solo ve sus centros asignados) 
            if (usuarioIdParaPerfil3.HasValue)
            {
                // Vincula directamente con la tabla Usuarios verificando que el centro coincida
                query = query.Where(c => _context.Usuarios
                            .Any(u => u.UsuarioId == usuarioIdParaPerfil3.Value && u.CentroId == c.CentroId));
            }

            // Reutiliza la proyección con el Localizador calculado igual que en el listado principal
            var resultados = await (from c in query
                                    join centro in _context.CentrosConcertados on c.CentroId equals centro.CentroId
                                    select new ConciertoResponseDTO
                                    {
                                        ConciertoId = c.ConciertoId,
                                        MutuaId = c.MutuaId,
                                        CentroId = c.CentroId,
                                        CodigoCasa = c.CodigoCasa,
                                        CodigoMz = c.CodigoMz,
                                        Autorizado = c.Autorizado,
                                        FechaAlta = c.FechaAlta,
                                        CentroNombre = centro.Centro,
                                        CentroCif = centro.Cifnif,
                                        CentroCp = centro.Cp,
                                        Localizador = (c.MutuaId.ToString().PadLeft(3, '0') + 
                                                    (centro.Cp ?? "").Trim().PadLeft(5, '0') + 
                                                    (centro.Cifnif ?? "").Trim()).ToUpper()
                                    }).ToListAsync();

            return resultados;
        }

        public async Task<IEnumerable<TipoAsistenciaDTO>> GetTiposAsistenciaAsync(int anioSesion)
        {
            // Consulta directa a la tabla
            return await _context.TiposAsistencia
                .Where(t => t.Año == anioSesion)
                .Select(t => new TipoAsistenciaDTO
                {
                    // Usa TipoAsistenciaId para mantener la coherencia con la FK de la tabla Conciertos
                    TipoAsistenciaId = t.TipoAsistenciaId, 
                    Descripcion = t.TipoAsistencia,
                    Año = t.Año
                })
                .OrderBy(t => t.Descripcion)
                .ToListAsync();
        }

        public async Task<IEnumerable<CentroAdhesionDTO>> GetCentrosAdhesionAsync()
        {
            // Muestra conciertos cuyo código CASA termina en "000" 
            return await (from c in _context.Conciertos
                        join centro in _context.CentrosConcertados on c.CentroId equals centro.CentroId
                        join mutua in _context.Mutuas on c.MutuaId equals mutua.MutuaId // Join extra para dar más contexto visual
                        where c.CodigoCasa != null && c.CodigoCasa.EndsWith("000")
                        orderby mutua.Mutua1, centro.Centro
                        select new CentroAdhesionDTO
                        {
                            ConciertoId = c.ConciertoId,
                            CodigoCasa = c.CodigoCasa,
                            CentroNombre = centro.Centro,
                            MutuaNombre = mutua.Mutua1
                        }).ToListAsync();
        }

        public async Task<ConciertosAmbitoCoberturaDTO> AddAmbitoAsync(int conciertoId, ConciertosAmbitoCoberturaCreateDTO dto)
        {
            // Valida integridad estructural (evita Foreign Key Exceptions en BD)
            var existeConcierto = await _context.Conciertos.AnyAsync(c => c.ConciertoId == conciertoId);
            if (!existeConcierto) 
            {
                throw new Exception($"El concierto principal con ID {conciertoId} no existe.");
            }

            var nuevoAmbito = new ConciertosAmbitoCobertura
            {
                ConciertoId = conciertoId,
                AmbitoId = dto.AmbitoId,
                PoblacionId = dto.PoblacionId,
                Cp = dto.Cp,
                FechaAlta = DateTime.Now,
                UsuarioAltaId = dto.UsuarioAltaId
            };

            _context.ConciertosAmbitoCoberturas.Add(nuevoAmbito);
            await _context.SaveChangesAsync();

            // Devuelve el DTO con el Id primario autogenerado
            return new ConciertosAmbitoCoberturaDTO
            {
                Id = nuevoAmbito.Id,
                ConciertoId = nuevoAmbito.ConciertoId,
                AmbitoId = nuevoAmbito.AmbitoId,
                PoblacionId = nuevoAmbito.PoblacionId,
                Cp = nuevoAmbito.Cp
            };
        }

        public async Task<bool> DeleteAmbitoAsync(int conciertoId, int ambitoId)
        {
            // Restricción de seguridad: verifica ambas claves para evitar borrados cruzados
            var ambito = await _context.ConciertosAmbitoCoberturas
                .FirstOrDefaultAsync(a => a.Id == ambitoId && a.ConciertoId == conciertoId);

            if (ambito == null) return false;

            _context.ConciertosAmbitoCoberturas.Remove(ambito);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}