using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class UsuariosPorPerfilesModificar
{
    public int AccesoUsuarioId { get; set; }

    public int? PerfilId { get; set; }

    public int? PerfilModificarId { get; set; }

    public DateOnly? FechaModificacion { get; set; }

    public int? UsuarioModificacion { get; set; }
}
