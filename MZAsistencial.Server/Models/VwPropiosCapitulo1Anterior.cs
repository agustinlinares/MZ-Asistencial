using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class VwPropiosCapitulo1Anterior
{
    public decimal? Respuesta { get; set; }

    public int CentroId { get; set; }

    public string? Centro { get; set; }

    public int Año { get; set; }

    public int MutuaId { get; set; }
}
