using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class UsuariosWeb
{
    public int UsuarioId { get; set; }

    public int? UsuarioIdApp { get; set; }

    public string? Password { get; set; }

    public string? Token { get; set; }

    public DateTime? CaducidadToken { get; set; }
}
