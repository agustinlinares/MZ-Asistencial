using System;

namespace MZAsistencial.Server.DTOs
{
    public class ConciertoResponseDTO
    {
        public int ConciertoId { get; set; }
        public int MutuaId { get; set; }
        public int CentroId { get; set; }
        public string? CodigoCasa { get; set; }
        public string? CodigoMz { get; set; }
        public int? CentroAsociadoId { get; set; }
        public string? Localizador { get; set; } 
        public int? TipoAsistenciaId { get; set; }
        public int? AmbitoCobertura { get; set; }
        public string? Muniambito { get; set; }
        public bool? Autorizado { get; set; }
        public DateTime? FechaAutorizacion { get; set; }
        public int? UsuarioAutorizacionId { get; set; }
        public DateTime? FechaSuscripcion { get; set; }
        public DateTime? FechaResolucion { get; set; }
        public DateTime? FechaVigencia { get; set; }
        public DateTime? FechaProrroga { get; set; }
        public DateTime? FechaAlta { get; set; }
        public int? UsuarioAltaId { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public int? UsuarioModificacionId { get; set; }
        public DateTime? FechaBaja { get; set; }
        public int? UsuarioBajaId { get; set; }
        public int? Adhesion { get; set; }
        public int? ClaveAcces { get; set; }
        
        // Datos extendidos opcionales para la vista de listado general
        public string? CentroNombre { get; set; }
        public string? CentroCif { get; set; }
        public string? CentroCp { get; set; }
        public string? CentroPoblacion { get; set; }
        public string? CentroProvincia { get; set; }
        public string? MutuaNombre { get; set; }
    }

    public class ConciertoCreateDTO
    {
        public int MutuaId { get; set; }
        public int CentroId { get; set; }
        public string? CodigoCasa { get; set; }
        public int? CentroAsociadoId { get; set; }
        public int? TipoAsistenciaId { get; set; }
        public int? AmbitoCobertura { get; set; }
        public string? Muniambito { get; set; }
        public DateTime? FechaSuscripcion { get; set; }
        public DateTime? FechaResolucion { get; set; }
        public DateTime? FechaVigencia { get; set; }
        public int? UsuarioAltaId { get; set; }
        public int? Adhesion { get; set; }
        public int? ClaveAcces { get; set; }
    }

    public class ConciertoUpdateDTO
    {
        public int ConciertoId { get; set; }
        public int MutuaId { get; set; }
        public int CentroId { get; set; }
        public string? CodigoCasa { get; set; }
        public string? CodigoMz { get; set; }
        public int? CentroAsociadoId { get; set; }
        public int? TipoAsistenciaId { get; set; }
        public int? AmbitoCobertura { get; set; }
        public string? Muniambito { get; set; }
        public bool? Autorizado { get; set; }
        public DateTime? FechaAutorizacion { get; set; }
        public int? UsuarioAutorizacionId { get; set; }
        public DateTime? FechaSuscripcion { get; set; }
        public DateTime? FechaResolucion { get; set; }
        public DateTime? FechaVigencia { get; set; }
        public DateTime? FechaProrroga { get; set; }
        public int? UsuarioModificacionId { get; set; }
        public int? Adhesion { get; set; }
        public int? ClaveAcces { get; set; }
    }

    public class ConciertosDocumentoDTO
    {
        public int DocumentoId { get; set; }
        public int? ConciertoId { get; set; }
        public string? Documento { get; set; }
        public string? Titulo { get; set; }
        public DateTime? FechaVigencia { get; set; }
        public DateTime? FechaAlta { get; set; }
        public int? UsuarioAltaId { get; set; }
        public string? Observaciones { get; set; }
    }

    public class ConciertosAmbitoCoberturaDTO
    {
        public int Id { get; set; }
        public int ConciertoId { get; set; }
        public int AmbitoId { get; set; }
        public int PoblacionId { get; set; }
        public string? Cp { get; set; }
    }

    public class ConciertosEspecialidadDTO
    {
        public int ConciertoEspecialidadId { get; set; }
        public int ConciertoId { get; set; }
        public int Año { get; set; }
        public int EspecialidadId { get; set; }
        public int? ServicioId { get; set; }
        public int? Cantidad { get; set; }
        public double? ImporteConIva { get; set; }
    }

    public class ConciertosDocumentoUpdateDTO
    {
        public string? Titulo { get; set; }
        public DateTime? FechaVigencia { get; set; }
        public string? Observaciones { get; set; }
        public int? UsuarioModificacionId { get; set; }
    }

    public class DocumentoUploadDTO
    {
        public IFormFile File { get; set; } = null!;
        public string? Titulo { get; set; }
        public string? Observaciones { get; set; }
    }

    public class DocumentoUploadRequest
    {
        public IFormFile? File { get; set; }
        public string? Titulo { get; set; }
        public string? Observaciones { get; set; }
    }

    public class ConciertosAmbitoCoberturaCreateDTO
    {
        public int AmbitoId { get; set; } 
        public int PoblacionId { get; set; }
        public string? Cp { get; set; }
        public int? UsuarioAltaId { get; set; }
    }

}