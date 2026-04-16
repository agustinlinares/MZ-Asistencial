using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Demanda
{
    public int DemandaId { get; set; }

    public int? EspecialidadId { get; set; }

    public int? ServicioId { get; set; }

    public int? CentroId { get; set; }

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

    public int? Año { get; set; }

    public int? MutuaDemandaId { get; set; }

    public int UsuarioAltaId { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? EstadoId { get; set; }

    public string? Descripcion { get; set; }

    public int? TipoId { get; set; }

    public DateTime? FechaRevision { get; set; }

    public int? Localidad { get; set; }

    public string? Plazos { get; set; }

    public int? EnvioMail { get; set; }

    public string? MotivoRechazo { get; set; }

    public int? TipoRechazo { get; set; }

    public int? TipoAnulacion { get; set; }

    public string? MotivoAnulacion { get; set; }

    public int? UsuarioAnulacionId { get; set; }
}
