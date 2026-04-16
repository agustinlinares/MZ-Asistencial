using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class PsAcuerdosBiMultilateralesMutuasProvinciasOfertum
{
    public int Id { get; set; }

    public string? IdmutuaAnio { get; set; }

    public int? MutuaOfertanteId { get; set; }

    public int? ProvinciaId { get; set; }

    public int? NumServiciosBi { get; set; }

    public decimal? ContraprestacionEconomicaBi { get; set; }

    public int? NumServiciosTerceros { get; set; }

    public decimal? ContraprestacionEconomicaTerceros { get; set; }

    public int? Anio { get; set; }
}
