using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class TarifasDetalle
{
    public int TarifaDetalleId { get; set; }

    public int TarifaId { get; set; }

    public string? Servicio { get; set; }

    public double? Importe { get; set; }

    public int? EspecialidadId { get; set; }

    public int? CiepId { get; set; }

    public string? Observaciones { get; set; }

    public long? ServicioId { get; set; }

    public bool? AltaTec { get; set; }

    public virtual Tarifa Tarifa { get; set; } = null!;
}
