using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class DemandasSubSol
{
    public int DemandasSubSolId { get; set; }

    public int? DemandaId { get; set; }

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

    public int UsuarioAltaId { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? EstadoId { get; set; }

    public int? OfertaId { get; set; }

    public bool? Doc { get; set; }
}
