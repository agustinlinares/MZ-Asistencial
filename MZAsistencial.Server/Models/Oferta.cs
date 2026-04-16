using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Oferta
{
    public int OfertaId { get; set; }

    public int? EspecialidadId { get; set; }

    public int? ServicioId { get; set; }

    public int? CentroId { get; set; }

    public int? Año { get; set; }

    public int? DemandaId { get; set; }

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

    public int? EstadoId { get; set; }

    public DateTime? FechaConfirmacion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public int? UsuarioModificacionId { get; set; }

    public string? NotaContestacion { get; set; }

    public DateTime? FechaAsignacion { get; set; }

    public int? UsuarioAltaId { get; set; }

    public string? ContestacionPlazos { get; set; }
}
