using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AuxFichasSistema
{
    public int FichaId { get; set; }

    public string? Ficha { get; set; }

    public int? UsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }
}
