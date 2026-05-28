namespace MZAsistencial.Server.DTOs;

public class RegistroErrorDTO
{
    public int ErrorId { get; set; }
    public string? Usuario { get; set; }
    public string? Mutua { get; set; }
    public DateTime? FechaError { get; set; }
    public string? FicheroLog { get; set; }
    public string? Descripcion { get; set; }
    public string? Estado { get; set; }
}
