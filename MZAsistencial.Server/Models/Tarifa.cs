using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Tarifa
{
    public int TarifaId { get; set; }

    public string Tarifa1 { get; set; } = null!;

    public string Año { get; set; } = null!;

    public double? Porcentaje { get; set; }

    public int? Activo { get; set; }

    public virtual ICollection<TarifasDetalle> TarifasDetalles { get; set; } = new List<TarifasDetalle>();
}
