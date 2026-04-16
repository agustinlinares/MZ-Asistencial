using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class CentrosEspecialidade
{
    public int CentroEspecialidadId { get; set; }

    public int CentroId { get; set; }

    public int MutuaId { get; set; }

    public int Año { get; set; }

    public int EspecialidadId { get; set; }

    public string Servicio { get; set; } = null!;

    public int? Cantidad { get; set; }

    public double? ImporteConIva { get; set; }

    public int? ServicioId { get; set; }
}
