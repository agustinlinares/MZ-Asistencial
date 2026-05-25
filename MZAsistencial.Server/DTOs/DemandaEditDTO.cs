namespace MZAsistencial.Server.DTOs;

public class DemandaEditDTO
{
    // Datos principales
    public int DemandaId { get; set; }
    public int? EstadoId { get; set; }
    public string? Estado { get; set; }
    public int? TipoId { get; set; }

    // Campos descriptivos readonly
    public string? Especialidad { get; set; }
    public string? Servicio { get; set; }
    public string? Localidad { get; set; }
    public string? Provincia { get; set; }
    public string? MutuaSolicitante { get; set; }

    // Datos centro ofertante (ficha anual)
    public string? MutuaOfertante { get; set; }
    public string? Centro { get; set; }
    public string? DireccionCentro { get; set; }
    public string? Telefono { get; set; }

    // Fechas
    public DateTime? FechaSolicitud { get; set; }
    public DateTime? FechaConfirmacion { get; set; }
    public DateTime? FechaAsignacion { get; set; }

    // Campos editables
    public string? Descripcion { get; set; }  // Necesidades para el Servicio
    public string? Plazos { get; set; }

    // Meses demanda
    public int? Ene { get; set; }
    public int? Feb { get; set; }
    public int? Mar { get; set; }
    public int? Abr { get; set; }
    public int? May { get; set; }
    public int? Jun { get; set; }
    public int? Jul { get; set; }
    public int? Ago { get; set; }
    public int? Sep { get; set; }
    public int? Oct { get; set; }
    public int? Nov { get; set; }
    public int? Dic { get; set; }

    // Meses oferta confirmada (fila OFERTA OFRECIDA — ficha anual)
    public int? OfertaEne { get; set; }
    public int? OfertaFeb { get; set; }
    public int? OfertaMar { get; set; }
    public int? OfertaAbr { get; set; }
    public int? OfertaMay { get; set; }
    public int? OfertaJun { get; set; }
    public int? OfertaJul { get; set; }
    public int? OfertaAgo { get; set; }
    public int? OfertaSep { get; set; }
    public int? OfertaOct { get; set; }
    public int? OfertaNov { get; set; }
    public int? OfertaDic { get; set; }

    // Subsolicitudes (ficha individual)
    public List<SubSolicitudDemandaDTO> SubSolicitudes { get; set; } = new();

    // Documentos adjuntos
    public List<DocumentoDemandaDTO> Documentos { get; set; } = new();
}

public class SubSolicitudDemandaDTO
{
    public int SubSolId { get; set; }
    public string? MutuaOfertante { get; set; }
    public string? Centro { get; set; }
    public string? Contestacion { get; set; }
    public string? ContestacionPlazos { get; set; }
    public DateTime? FechaAsignacion { get; set; }
    public DateTime? FechaConfirmacion { get; set; }
    public int? Ene { get; set; }
    public int? Feb { get; set; }
    public int? Mar { get; set; }
    public int? Abr { get; set; }
    public int? May { get; set; }
    public int? Jun { get; set; }
    public int? Jul { get; set; }
    public int? Ago { get; set; }
    public int? Sep { get; set; }
    public int? Oct { get; set; }
    public int? Nov { get; set; }
    public int? Dic { get; set; }
    public int? Total { get; set; }
    public int? EstadoId { get; set; }
    public string? Estado { get; set; }
}

public class DocumentoDemandaDTO
{
    public int DocumentoId { get; set; }
    public string? NombreDocumento { get; set; }
    public string? Nombre { get; set; }
    public DateTime? FechaAlta { get; set; }
    public string? Mutua { get; set; }
    public string? Usuario { get; set; }
}