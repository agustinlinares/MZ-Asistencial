using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Ejercicio
{
    public int Año { get; set; }

    public DateTime? FechaApertura { get; set; }

    public DateTime? FechaCierre { get; set; }
}
