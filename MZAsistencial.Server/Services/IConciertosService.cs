using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface IConciertosService
    {
        Task<IEnumerable<ConciertoResponseDTO>> GetAllAsync(int? mutuaId = null);
        Task<ConciertoResponseDTO?> GetByIdAsync(int id);
        Task<ConciertoResponseDTO> CreateAsync(ConciertoCreateDTO dto);
        Task<bool> UpdateAsync(int id, ConciertoUpdateDTO dto);
        // Task<bool> DeleteIcg07RecordAsync(int conciertoId); 
        
        // Gestión de sub-recursos
        Task<IEnumerable<ConciertosAmbitoCoberturaDTO>> GetAmbitosByConciertoAsync(int conciertoId);
        Task<IEnumerable<ConciertosEspecialidadDTO>> GetEspecialidadesByConciertoAsync(int conciertoId);
        Task<IEnumerable<ConciertosDocumentoDTO>> GetDocumentosByConciertoAsync(int conciertoId);
        Task<IEnumerable<ConciertoResponseDTO>> GetSinAutorizarAsync(int? usuarioIdParaPerfil3 = null);
        Task<IEnumerable<TipoAsistenciaDTO>> GetTiposAsistenciaAsync(int anioSesion);
        Task<IEnumerable<CentroAdhesionDTO>> GetCentrosAdhesionAsync(int? excluirConciertoId = null);
        Task<ConciertosAmbitoCoberturaDTO> AddAmbitoAsync(int conciertoId, ConciertosAmbitoCoberturaCreateDTO dto);
        Task<bool> DeleteAmbitoAsync(int conciertoId, int ambitoId, int? usuarioId = null);
        Task<bool> UpdateDocumentoAsync(int documentoId, ConciertosDocumentoUpdateDTO dto);
        
        // Manejo físico y lógico de ficheros
        Task<ConciertosDocumentoDTO> UploadDocumentoAsync(int conciertoId, string titulo, string observaciones, string nombreOriginal, Stream archivoStream, int? usuarioId = null);
        Task<bool> DeleteDocumentoAsync(int documentoId, int? usuarioId = null);
        Task<bool> EliminarConciertoCompletoAsync(int id, int? usuarioId = null);
        Task<bool> UsuarioTieneAccesoCentroAsync(int usuarioId, int centroId);
    }
}