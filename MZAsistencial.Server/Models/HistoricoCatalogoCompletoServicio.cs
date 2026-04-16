using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class HistoricoCatalogoCompletoServicio
{
    public int HistoricoCatalogoCompletoServiciosId { get; set; }

    public int CentroId { get; set; }

    public int ServicioId { get; set; }

    public int Disponibilidad { get; set; }

    public int Año { get; set; }

    public int? UsuarioId { get; set; }

    public DateTime? FechaModificacion { get; set; }
}
