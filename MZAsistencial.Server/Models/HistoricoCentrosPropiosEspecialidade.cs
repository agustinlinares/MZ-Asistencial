using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class HistoricoCentrosPropiosEspecialidade
{
    public int HistoricoCentroPropioEspecialidadId { get; set; }

    public int? CentroId { get; set; }

    public int? Año { get; set; }

    public int? EspecialidadId { get; set; }

    public long? ServicioId { get; set; }

    public DateTime? FechaAlta { get; set; }

    public DateTime? FechaBaja { get; set; }

    public int? Disponibilidad { get; set; }

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

    public int? UsuarioModificacionId { get; set; }
}
