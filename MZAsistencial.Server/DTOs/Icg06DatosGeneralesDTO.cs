namespace MZAsistencial.Server.DTOs.ICG06;

public class Icg06DatosGeneralesDto
{
    public int      IdIcg         { get; set; }   // Id_ICG de la tabla ICG06
    public int      CentroId      { get; set; }   // Centro_id
    public int      Año           { get; set; }
    public int?     Nfincreg      { get; set; }
    public decimal? SuptotConst   { get; set; }
    public string?  OtrasObservac { get; set; }
}
