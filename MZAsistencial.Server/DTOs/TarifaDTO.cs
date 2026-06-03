namespace MZAsistencial.Server.DTOs;

public class TarifaListDTO
{
    public int TarifaId { get; set; }
    public string Tarifa { get; set; } = "";
    public string Año { get; set; } = "";
    public double? Porcentaje { get; set; }
    public bool Activo { get; set; }
}

public class TarifaDetalleDTO
{
    public int TarifaDetalleId { get; set; }
    public int TarifaId { get; set; }
    public string? Servicio { get; set; }
    public double? Importe { get; set; }
    public int? EspecialidadId { get; set; }
    public string? Especialidad { get; set; }
    public int? CiepId { get; set; }
    public string? Ciep { get; set; }
    public string? Observaciones { get; set; }
    public long? ServicioId { get; set; }
    public bool? AltaTec { get; set; }
}

public class TarifaFichaDTO
{
    public int TarifaId { get; set; }
    public string Descripcion { get; set; } = "";
    public string Año { get; set; } = "";
    public double? Porcentaje { get; set; }
    public bool Activo { get; set; }
    public List<TarifaDetalleDTO> Detalles { get; set; } = new();
}

public class AuxEspecialidadDTO
{
    public int EspecialidadId { get; set; }
    public string Especialidad { get; set; } = "";
}

public class AuxCiepDTO
{
    public int? CiepId { get; set; }
    public string Ciep { get; set; } = "";
}

public class CopiarTarifaRequestDTO
{
    public int TarifaOrigenId { get; set; }
    public string NuevoAño { get; set; } = "";
    public string? NuevaDescripcion { get; set; }
    public double? AjustePorcentaje { get; set; }
}
