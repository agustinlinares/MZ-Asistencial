using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class PsAcuerdosBiMultilateralesMutuasTipoServicioOfertum
{
    public int Id { get; set; }

    public string? IdmutuaAnio { get; set; }

    public int? MutuaOfertanteId { get; set; }

    public int? TipoServicioId { get; set; }

    public string? NumTipoServicio { get; set; }

    public int? NumServiciosBi { get; set; }

    public decimal? ContraprestacionEconomicaBi { get; set; }

    public int? NumServiciosTerceros { get; set; }

    public decimal? ContraprestacionEconomicaTerceros { get; set; }

    public int? Anio { get; set; }
}
