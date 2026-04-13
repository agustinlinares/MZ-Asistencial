using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class CentrosPropiosCatalogoServicio
{
    public int CentroPropioCatalogoServiciosId { get; set; }

    public int CentroId { get; set; }

    public int ServicioId { get; set; }

    public int EspecialidadId { get; set; }

    public int Año { get; set; }

    public int Disponibilidad { get; set; }

    public int? UsuarioAltaId { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? UsuarioBajaId { get; set; }

    public DateTime? FechaBaja { get; set; }
}
