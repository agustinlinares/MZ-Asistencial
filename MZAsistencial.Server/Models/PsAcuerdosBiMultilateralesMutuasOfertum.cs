using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class PsAcuerdosBiMultilateralesMutuasOfertum
{
    public int Id { get; set; }

    public string? IdmutuaAnio { get; set; }

    public int? MutuaOfertanteId { get; set; }

    public int? MutuaDemandanteId { get; set; }

    public int? NumServicios { get; set; }

    public decimal? ContraprestacionEconomica { get; set; }

    public int? Anio { get; set; }
}
