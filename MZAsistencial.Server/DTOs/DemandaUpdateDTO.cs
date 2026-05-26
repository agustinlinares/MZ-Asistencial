namespace MZAsistencial.Server.DTOs;

public class DemandaUpdateDTO
{
    public int? EstadoId { get; set; }
    public string? MotivoAnulacion { get; set; }
    public string? MotivoRechazo { get; set; }
}