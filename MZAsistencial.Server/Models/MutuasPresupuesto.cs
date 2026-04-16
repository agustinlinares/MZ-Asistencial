using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class MutuasPresupuesto
{
    public int IdPresupuesto { get; set; }

    public string Año { get; set; } = null!;

    public int MutuaId { get; set; }

    public double? PresupuestoCapitulo1Propio { get; set; }

    public double? PresupuestoCapitulo2Propio { get; set; }

    public double? PresupuestoCapitulo3Propio { get; set; }

    public double? PresupuestoCapitulo4Propio { get; set; }

    public double? PresupuestoCapitulo5Propio { get; set; }

    public double? PresupuestoCapitulo6Propio { get; set; }

    public double? PresupuestoCapitulo1Concertado { get; set; }

    public double? PresupuestoCapitulo2Concertado { get; set; }

    public double? PresupuestoArticulo2581 { get; set; }

    public double? PresupuestoArticulo2582 { get; set; }

    public double? PresupuestoArticulo25Resto { get; set; }

    public double? PresupuestoGastosFinancieros { get; set; }
}
