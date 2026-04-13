using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class DisponibilidadCentrosPropio
{
    public int DisponibilidadCentroId { get; set; }

    public int? CentroId { get; set; }

    public int? ServicioId { get; set; }

    public int? EspecialidadId { get; set; }

    public int? Mes { get; set; }

    public int? Año { get; set; }

    public int? Cantidad { get; set; }
}
