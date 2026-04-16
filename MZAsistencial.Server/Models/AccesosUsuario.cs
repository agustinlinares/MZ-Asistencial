using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AccesosUsuario
{
    public int AccesoUsuarioId { get; set; }

    public int? PerfilId { get; set; }

    public int? FichaId { get; set; }

    public int? UsuarioModificacion { get; set; }

    public DateTime? FechaModificacion { get; set; }
}
