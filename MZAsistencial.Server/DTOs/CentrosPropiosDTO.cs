namespace MZAsistencial.Server.DTOs
{
    public class CentrosPropiosDTO
    {
        public string?   Localizador          { get; set; }
        public int       CentroId             { get; set; }
        public int       MutuaId              { get; set; }
        public string?   Centro               { get; set; }
        public string?   Cp                   { get; set; }
        public int?      PoblacionId          { get; set; }
        public string?   Telefono             { get; set; }
        public string?   Latitud              { get; set; }
        public string?   Longitud             { get; set; }
        public string?   CodigoMz             { get; set; }
        public string?   Direccion            { get; set; }
        public string?   Numero               { get; set; }
        public string?   Piso                 { get; set; }
        public string?   Puerta               { get; set; }
        public string?   DireccionGoogle      { get; set; }
        public string?   Email                { get; set; }
        public string?   PersonaContacto      { get; set; }
        public string?   OtrosDatos           { get; set; }
        public string?   Provincia            { get; set; }
        public int?      ServiciosEspeciales  { get; set; }
        public bool      Desactivado          { get; set; }
        public bool?     Traslado             { get; set; }
        public string?   MotivoBaja           { get; set; }
        public DateTime? FechaBaja            { get; set; }
        public bool?     AsistenciaHospitalaria  { get; set; }
        public bool?     AsistenciaAmbulatoria   { get; set; }
        public bool?     Rehabilitacion          { get; set; }
        public bool?     IncapacidadTransitoria  { get; set; }
        public bool?     Prevencion              { get; set; }
        public bool?     Administracion          { get; set; }
        public bool?     OtrasActividades        { get; set; }
        public DateTime? Fautocom             { get; set; }
        public DateTime? Fpufuncio            { get; set; }
        public DateTime? Fcalisuf             { get; set; }
        public int?      TipoCentro           { get; set; }
        public bool?     MapaValidado         { get; set; }
        public int?      UsuarioId            { get; set; }
    }
}