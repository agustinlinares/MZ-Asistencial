using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class VwDisponibilidad
{
    public int? Año { get; set; }

    public int? CentroId { get; set; }

    public int? EspecialidadId { get; set; }

    public int? ServicioId { get; set; }

    public int Enero { get; set; }

    public int Febrero { get; set; }

    public int Marzo { get; set; }

    public int Abril { get; set; }

    public int Mayo { get; set; }

    public int Junio { get; set; }

    public int Julio { get; set; }

    public int Agosto { get; set; }

    public int Septiembre { get; set; }

    public int Octubre { get; set; }

    public int Noviembre { get; set; }

    public int Diciembre { get; set; }

    public int? Total { get; set; }
}
