using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class VwConcertadosNoValidado
{
    public int Año { get; set; }

    public int ConciertoId { get; set; }

    public int MutuaId { get; set; }

    public int? CentroId { get; set; }
}
