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
        private readonly IRegistrosActividadService _registroActividadService;

        public ConciertosService(MZAsistencialContext context, IConfiguration configuration, IRegistrosActividadService registroActividadService)
        {
            _context = context;
            // Se lee la ruta raíz de almacenamiento físico desde la configuración de la app (appsettings.json)
            _storagePath = configuration["FileStorage:ConciertosPath"] ?? Path.Combine(AppContext.BaseDirectory, "Uploads");
            _registroActividadService = registroActividadService;
        }

        public async Task<IEnumerable<ConciertoResponseDTO>> GetAllAsync(int? mutuaId = null)
        {
            // Campo Localizador Calculado combinando número de mutua + código postal + CIF del centro.
            // Joins con CentrosConcertados (datos del centro), Mutuas (nombre de mutua) y
            // Aux_Poblaciones/Aux_Provincias (Población y Provincia del centro, vía Poblacion_id)
            var baseQuery = from c in _context.Conciertos
                        join centro in _context.CentrosConcertados on c.CentroId equals centro.CentroId
                        join mutua in _context.Mutuas on c.MutuaId equals mutua.MutuaId into mutuaGroup
                        from mutua in mutuaGroup.DefaultIfEmpty()
                        join p in _context.AuxPoblaciones on centro.PoblacionId equals p.PoblacionId into pGroup
                        from p in pGroup.DefaultIfEmpty()
                        join pr in _context.AuxProvincias on p.ProvinciaId equals pr.ProvinciaId into prGroup
                        from pr in prGroup.DefaultIfEmpty()
                        where c.FechaBaja == null
                        select new { c, centro, mutua, p, pr };

            if (mutuaId.HasValue)
            {
                baseQuery = baseQuery.Where(x => x.c.MutuaId == mutuaId.Value);
            }

            var query = baseQuery.Select(x => new ConciertoResponseDTO
                        {
                            ConciertoId = x.c.ConciertoId,
                            MutuaId = x.c.MutuaId,
                            CentroId = x.c.CentroId,
                            CodigoCasa = x.c.CodigoCasa,
                            CodigoMz = x.c.CodigoMz,
                            CentroAsociadoId = x.c.CentroAsociadoId,
                            TipoAsistenciaId = x.c.TipoAsistenciaId,
                            AmbitoCobertura = x.c.AmbitoCobertura,
                            Muniambito = x.c.Muniambito,
                            Autorizado = x.c.Autorizado,
                            FechaAutorizacion = x.c.FechaAutorizacion,
                            UsuarioAutorizacionId = x.c.UsuarioAutorizacionId,
                            FechaSuscripcion = x.c.FechaSuscripcion,
                            FechaResolucion = x.c.FechaResolucion,
                            FechaVigencia = x.c.FechaVigencia,
                            FechaProrroga = x.c.FechaProrroga,
                            FechaAlta = x.c.FechaAlta,
                            UsuarioAltaId = x.c.UsuarioAltaId,
                            FechaModificacion = x.c.FechaModificacion,
                            UsuarioModificacionId = x.c.UsuarioModificacionId,
                            FechaBaja = x.c.FechaBaja,
                            UsuarioBajaId = x.c.UsuarioBajaId,
                            Adhesion = x.c.Adhesion,
                            ClaveAcces = x.c.ClaveAcces,
                            
                            CentroNombre = x.centro.Centro,
                            CentroCif = x.centro.Cifnif,
                            CentroCp = x.centro.Cp,
                            CentroPoblacion = (x.p != null && x.p.Poblacion != null) ? x.p.Poblacion.Trim() : null,
                            CentroProvincia = x.pr != null ? x.pr.Provincia.Trim() : null,
                            MutuaNombre = x.mutua != null ? x.mutua.Mutua1 : null,

                            // Concatenación normalizada aplicando ceros a la izquierda
                            Localizador = (x.c.MutuaId.ToString().PadLeft(3, '0') + 
                                        (x.centro.Cp ?? "").Trim().PadLeft(5, '0') + 
                                        (x.centro.Cifnif ?? "").Trim()).ToUpper()
                        });

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

            // Registro de actividad: alta de concierto (operación de escritura real)
            await _registroActividadService.InsertarRegistroActividad(
                $"INSERT INTO Conciertos (MutuaId, CentroId, CodigoCasa, CodigoMz) VALUES ({nuevoConcierto.MutuaId}, {nuevoConcierto.CentroId}, '{nuevoConcierto.CodigoCasa}', '{nuevoConcierto.CodigoMz}') -- Concierto_id={nuevoConcierto.ConciertoId}",
                dto.UsuarioAltaId ?? 0,
                $"ALTA Concierto {nuevoConcierto.ConciertoId}"
            );

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
            concierto.Adhesion = dto.Adhesion;
            concierto.ClaveAcces = dto.ClaveAcces;
            concierto.FechaModificacion = DateTime.Now;
            concierto.UsuarioModificacionId = dto.UsuarioModificacionId;

            await _context.SaveChangesAsync();

            // Registro de actividad: modificación de concierto (operación de escritura real)
            await _registroActividadService.InsertarRegistroActividad(
                $"UPDATE Conciertos SET CodigoCasa='{concierto.CodigoCasa}', Autorizado={concierto.Autorizado} WHERE Concierto_id={id}",
                dto.UsuarioModificacionId ?? 0,
                $"MODIFICACION Concierto {id}"
            );

            return true;
        }

        /* public async Task<bool> DeleteIcg07RecordAsync(int conciertoId)
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
        } */

        public async Task<bool> EliminarConciertoCompletoAsync(int conciertoId, int? usuarioId = null)
        {
            var concierto = await _context.Conciertos.FindAsync(conciertoId);
            if (concierto == null) return false;

            // Baja lógica: NO se borra el registro ni los documentos físicos asociados,
            // para conservar la trazabilidad y el histórico (decisión de José Manuel, 22/06).
            // Queda la puerta abierta a un borrado físico definitivo más adelante si se decide.
            concierto.FechaBaja = DateTime.Now;
            concierto.UsuarioBajaId = usuarioId;

            await _context.SaveChangesAsync();

            // Registro de actividad: baja lógica de concierto (operación de escritura real)
            await _registroActividadService.InsertarRegistroActividad(
                $"UPDATE Conciertos SET FechaBaja='{concierto.FechaBaja}' WHERE Concierto_id={conciertoId}",
                usuarioId ?? 0,
                $"BAJA Concierto {conciertoId}"
            );

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

        public async Task<ConciertosDocumentoDTO> UploadDocumentoAsync(int conciertoId, string titulo, string observaciones, string nombreOriginal, Stream archivoStream, int? usuarioId = null)
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

            // Registro de actividad: alta de documento (operación de escritura real)
            await _registroActividadService.InsertarRegistroActividad(
                $"INSERT INTO ConciertosDocumentos (ConciertoId, Titulo, Documento) VALUES ({nuevoDoc.ConciertoId}, '{nuevoDoc.Titulo}', '{nuevoDoc.Documento}') -- Documento_id={nuevoDoc.DocumentoId}",
                usuarioId ?? 0,
                $"ALTA Documento Concierto {conciertoId}"
            );

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

        public async Task<bool> DeleteDocumentoAsync(int documentoId, int? usuarioId = null)
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

            int? conciertoId = documento.ConciertoId;

            // Elimina el registro lógico de la base de datos de manera síncrona
            _context.ConciertosDocumentos.Remove(documento);
            await _context.SaveChangesAsync();

            // Registro de actividad: baja de documento (operación de escritura real)
            await _registroActividadService.InsertarRegistroActividad(
                $"DELETE FROM ConciertosDocumentos WHERE Documento_id={documentoId}",
                usuarioId ?? 0,
                $"BAJA Documento Concierto {conciertoId}"
            );

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

            // Registro de actividad: modificación de documento (operación de escritura real)
            await _registroActividadService.InsertarRegistroActividad(
                $"UPDATE ConciertosDocumentos SET Titulo='{documento.Titulo}' WHERE Documento_id={documentoId}",
                dto.UsuarioModificacionId ?? 0,
                $"MODIFICACION Documento Concierto {documento.ConciertoId}"
            );
            
            return true;
        }

        public async Task<IEnumerable<ConciertoResponseDTO>> GetSinAutorizarAsync(int? usuarioIdParaPerfil3 = null)
        {
            var query = _context.Conciertos
                .Where(c => (c.Autorizado == false || c.Autorizado == null) && c.FechaBaja == null);

            // Restricción adicional para perfil 3 (solo ve sus centros asignados)
            if (usuarioIdParaPerfil3.HasValue)
            {
                query = query.Where(c => _context.Usuarios
                            .Any(u => u.UsuarioId == usuarioIdParaPerfil3.Value && u.CentroId == c.CentroId));
            }

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

        public async Task<IEnumerable<CentroAdhesionDTO>> GetCentrosAdhesionAsync(int? excluirConciertoId = null)
        {
            // Muestra conciertos cuyo código CASA termina en "000".
            // Si se está editando un concierto, se excluye a sí mismo para evitar auto-adhesión.
            var query = from c in _context.Conciertos
                        join centro in _context.CentrosConcertados on c.CentroId equals centro.CentroId
                        join mutua in _context.Mutuas on c.MutuaId equals mutua.MutuaId
                        where c.CodigoCasa != null && c.CodigoCasa.EndsWith("000")
                        select new { c, centro, mutua };

            if (excluirConciertoId.HasValue)
            {
                query = query.Where(x => x.c.ConciertoId != excluirConciertoId.Value);
            }

            return await query
                .OrderBy(x => x.mutua.Mutua1).ThenBy(x => x.centro.Centro)
                .Select(x => new CentroAdhesionDTO
                {
                    ConciertoId = x.c.ConciertoId,
                    CodigoCasa = x.c.CodigoCasa,
                    CentroNombre = x.centro.Centro,
                    MutuaNombre = x.mutua.Mutua1
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

            // Registro de actividad: alta de ámbito de cobertura (operación de escritura real)
            await _registroActividadService.InsertarRegistroActividad(
                $"INSERT INTO ConciertosAmbitoCobertura (ConciertoId, AmbitoId, PoblacionId, Cp) VALUES ({conciertoId}, {nuevoAmbito.AmbitoId}, {nuevoAmbito.PoblacionId}, '{nuevoAmbito.Cp}') -- Id={nuevoAmbito.Id}",
                dto.UsuarioAltaId ?? 0,
                $"ALTA Ambito Concierto {conciertoId}"
            );

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

        public async Task<bool> DeleteAmbitoAsync(int conciertoId, int ambitoId, int? usuarioId = null)
        {
            // Restricción de seguridad: verifica ambas claves para evitar borrados cruzados
            var ambito = await _context.ConciertosAmbitoCoberturas
                .FirstOrDefaultAsync(a => a.Id == ambitoId && a.ConciertoId == conciertoId);

            if (ambito == null) return false;

            _context.ConciertosAmbitoCoberturas.Remove(ambito);
            await _context.SaveChangesAsync();

            // Registro de actividad: baja de ámbito de cobertura (operación de escritura real)
            await _registroActividadService.InsertarRegistroActividad(
                $"DELETE FROM ConciertosAmbitoCobertura WHERE Id={ambitoId} AND ConciertoId={conciertoId}",
                usuarioId ?? 0,
                $"BAJA Ambito Concierto {conciertoId}"
            );

            return true;
        }

        public async Task<bool> UsuarioTieneAccesoCentroAsync(int usuarioId, int centroId)
        {
            // Mismo criterio que ya usa GetSinAutorizarAsync para perfil 3:
            // el usuario tiene acceso si su CentroId coincide con el centro consultado.
            return await _context.Usuarios
                .AnyAsync(u => u.UsuarioId == usuarioId && u.CentroId == centroId);
        }
    }
}