using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class CentrosPropiosEspecialidade
{
    public int CentroPropioEspecialidadId { get; set; }

    public int CentroId { get; set; }

    public int Año { get; set; }

    public int EspecialidadId { get; set; }

    public string Servicio { get; set; } = null!;

    public int? Cantidad { get; set; }

    public double? ImporteConIva { get; set; }

    public long? ServicioId { get; set; }

    public DateTime? FechaAlta { get; set; }

    public DateTime? FechaBaja { get; set; }

    public int? Disponibilidad { get; set; }

    public int? Plazo { get; set; }

    public int? ActualizarDisponibilidad { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public DateTime? FechaActualizarDisponibilidad { get; set; }

    public DateTime? FechaGeneracionAcreditacion { get; set; }
}
