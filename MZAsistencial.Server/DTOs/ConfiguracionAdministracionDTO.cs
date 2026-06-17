namespace MZAsistencial.Server.DTOs
{
    public class ConfiguracionAdministracionDTO
    {
        public int      Id                                    { get; set; }
        public string   FechaBloqueoDesde                     { get; set; } = "";  // "yyyy-MM-dd"
        public string   FechaBloqueoHasta                     { get; set; } = "";  // "yyyy-MM-dd"
        public int      MinimoServicios                       { get; set; }
        public double   RatioServicios                        { get; set; }
        public int      PlazoRespuestaDemandasAnuales         { get; set; }
        public int      PlazoRespuestaDemandaAnualTrasAviso   { get; set; }
        public int      PlazoContestacionRespuestaRecibida    { get; set; }
        public int      PlazoEjecucionProcesosAutomaticos     { get; set; }
        public int?     UsuarioModificacionId                 { get; set; }
        public DateTime? FechaModificacion                    { get; set; }
    }
}
