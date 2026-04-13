using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class TiposAsistencium
{
    public long RegistroId { get; set; }

    public int TipoAsistenciaId { get; set; }

    public string TipoAsistencia { get; set; } = null!;

    public int Año { get; set; }
}
