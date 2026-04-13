using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class ConciertosEspecialidade
{
    public int ConciertoEspecialidadId { get; set; }

    public int ConciertoId { get; set; }

    public int Año { get; set; }

    public int EspecialidadId { get; set; }

    public int? ServicioId { get; set; }

    public int? Cantidad { get; set; }

    public double? ImporteConIva { get; set; }
}
