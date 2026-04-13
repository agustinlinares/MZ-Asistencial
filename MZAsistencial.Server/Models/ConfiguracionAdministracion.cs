using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class ConfiguracionAdministracion
{
    public int Id { get; set; }

    public DateOnly FechaBloqueoDesde { get; set; }

    public DateOnly FechaBloqueoHasta { get; set; }

    public int MinimoServicios { get; set; }

    public double RatioServicios { get; set; }

    public int? UsuarioModificacionId { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public int PlazoRespuestaDemandasAnuales { get; set; }

    public int PlazoRespuestaDemandaAnualTrasAviso { get; set; }

    public int PlazoContestacionRespuestaRecibida { get; set; }

    public int PlazoEjecucionProcesosAutomaticos { get; set; }
}
