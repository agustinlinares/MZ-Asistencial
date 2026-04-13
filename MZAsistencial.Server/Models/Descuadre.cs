using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Descuadre
{
    public int UsuarioId { get; set; }

    public int MutuaId { get; set; }

    public decimal? GastoPersonal { get; set; }

    public decimal? Amortizacion { get; set; }

    public decimal? InversionNueva { get; set; }

    public decimal? InversionReposicion { get; set; }

    public decimal? OtrosIngresos { get; set; }

    public decimal? MediosAjenos { get; set; }

    public decimal? Aplicacion2581 { get; set; }

    public decimal? Aplicacion2582 { get; set; }

    public decimal? Resto25 { get; set; }

    public int? RegPropiosValidados { get; set; }

    public int? RegPropiosSinValidar { get; set; }

    public int? RegConcertadosValidados { get; set; }

    public int? RegConcertadosSinValidar { get; set; }

    public decimal? GastoCorrientes { get; set; }

    public decimal? GastosFinancieros { get; set; }
}
