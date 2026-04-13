using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class RegistroActividad
{
    public int RegistroId { get; set; }

    public int? UsuarioId { get; set; }

    public DateTime? Fecha { get; set; }

    public string? Accion { get; set; }

    public string? Sql { get; set; }
}
