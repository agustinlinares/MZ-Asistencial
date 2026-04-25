namespace MZAsistencial.Server.DTOs
{
    public class CentrosPropiosDTO
    {
        public string? Localizador      { get; set; }
        public int     CentroId         { get; set; }
        public int     MutuaId          { get; set; }
        public string? Centro           { get; set; }
        public string? Cp               { get; set; }
        public int?    PoblacionId      { get; set; }
        public string? Telefono         { get; set; }
        public string? Latitud          { get; set; }
        public string? Longitud         { get; set; }
        public string? CodigoMz         { get; set; }
        public string? Direccion        { get; set; }
        public string? DireccionGoogle  { get; set; }
        public string? Email            { get; set; }
        public string? PersonaContacto  { get; set; }
        public bool    Desactivado      { get; set; }
    }
}