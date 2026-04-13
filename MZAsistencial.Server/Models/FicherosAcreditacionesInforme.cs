using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class FicherosAcreditacionesInforme
{
    public int FicheroId { get; set; }

    public string? Fichero { get; set; }

    public int? TipoAcreditacionId { get; set; }

    public int? DemandaId { get; set; }

    public string? Servicio { get; set; }

    public string? Especialidad { get; set; }

    public string? Poblacion { get; set; }

    public string? Provincia { get; set; }

    public int MutuaId { get; set; }

    public string? NombreFichero { get; set; }

    public DateOnly? FechaAlta { get; set; }

    public int? Visible { get; set; }

    public int? ActivoId { get; set; }
}
