using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class VwEspecialidadesConcierto
{
    public int ConciertoEspecialidadId { get; set; }

    public int Año { get; set; }

    public int ConciertoId { get; set; }

    public int CentroId { get; set; }

    public int MutuaId { get; set; }

    public int EspecialidadId { get; set; }

    public string? Especialidad { get; set; }

    public int? Cantidad { get; set; }

    public string? Centro { get; set; }

    public string? Localizador { get; set; }

    public string? CodigoCasa { get; set; }

    public string? Servicio { get; set; }
}
