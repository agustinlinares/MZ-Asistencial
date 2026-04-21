using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Icg06Especialidad
{
    public int     Id           { get; set; }
    public int     CentroId     { get; set; }
    public int     Año          { get; set; }
    public string? Servicio     { get; set; }
    public string? Especialidad { get; set; }
    public int?    Cantidad     { get; set; }
}
