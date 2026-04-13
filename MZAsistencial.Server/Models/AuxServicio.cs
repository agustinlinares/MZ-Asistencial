using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AuxServicio
{
    public long ServicioId { get; set; }

    public string? Servicio { get; set; }

    public int? TipoServicioId { get; set; }
}
