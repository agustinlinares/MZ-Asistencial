using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class VwEspecialidadesPropio
{
    public int Año { get; set; }

    public int CentroPropioEspecialidadId { get; set; }

    public int CentroId { get; set; }

    public int MutuaId { get; set; }

    public int EspecialidadId { get; set; }

    public string? Especialidad { get; set; }

    public string Servicio { get; set; } = null!;

    public int? Cantidad { get; set; }

    public string? Centro { get; set; }

    public string? Localizador { get; set; }
}
