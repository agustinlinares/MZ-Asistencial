using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class AuxSesionUsuario
{
    public string? Usuario { get; set; }

    public string? Contrasena { get; set; }

    public int Intentos { get; set; }

    public DateTime FechaIntento { get; set; }
}
