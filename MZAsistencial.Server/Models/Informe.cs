using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Informe
{
    public int InformeId { get; set; }

    public string? Tipo { get; set; }

    public string Informe1 { get; set; } = null!;

    public string? Pagina { get; set; }
}
