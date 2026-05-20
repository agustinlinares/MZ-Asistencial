namespace MZAsistencial.Server.DTOs;

public class ListaOfertasDTO
{
    public int OfertaId { get; set; }
    public int? Año { get; set; }
    public string? MutuaOferta { get; set; }      // nombre mutua (via Demanda.MutuaDemandaId → Mutua)
    public string? Centro { get; set; }            // CentrosConcertados.Centro
    public string? TipoLinea { get; set; }  // "Asignación" o "Demanda"
    public string? Provincia { get; set; }         // AuxProvincias.Provincia
    public string? Localidad { get; set; }         // AuxPoblaciones.Poblacion (nombre)
    public string? Especialidad { get; set; }      // AuxEspecialidades.Especialidad
    public string? TipoMovimiento { get; set; }    // AuxTiposDemanda.Tipo
    public string? Servicio { get; set; }          // AuxServicios.Servicio
    public int? NumeroPeticiones { get; set; }     // suma meses oferta
    public int? PeticionesPendientesAsignar { get; set; }
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
    public int? DemandaId { get; set; }
    public DateTime? FechaSolicitud { get; set; }  // Demanda.FechaAlta
    public DateTime? FechaAsignacion { get; set; }
    public DateTime? FechaConfirmacion { get; set; }
    public string? NecesidadesServicio { get; set; } // Demanda.Descripcion
    public string? ContestacionNecesidades { get; set; } // Oferta.NotaContestacion
    public string? RowKey { get; set; }  // ofertaId + "_" + TipoLinea
                                         // Disponibilidad real (declarada - comprometida)
    public int? DispEne { get; set; }
    public int? DispFeb { get; set; }
    public int? DispMar { get; set; }
    public int? DispAbr { get; set; }
    public int? DispMay { get; set; }
    public int? DispJun { get; set; }
    public int? DispJul { get; set; }
    public int? DispAgo { get; set; }
    public int? DispSep { get; set; }
    public int? DispOct { get; set; }
    public int? DispNov { get; set; }
    public int? DispDic { get; set; }
    public int? DispTotal { get; set; }
}