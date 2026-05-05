using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Usuario
{
    public int UsuarioId { get; set; }

    public int? PerfilId { get; set; }

    public int? MutuaId { get; set; }

    public int? CentroId { get; set; }

    public string? Usuario1 { get; set; }

    public string? DireccionElectronica { get; set; }

    public string? PreguntaRecordatorio { get; set; }

    public string? RespuestaRecordatorio { get; set; }

    public bool? DgossrecibeCorreo { get; set; }

    public string? Password { get; set; }

    public string? CorreoElectronico { get; set; }

    public DateTime? FechaBaja { get; set; }

    public DateTime? FechaPassword { get; set; }

    public bool? CambioPassword { get; set; }

    public bool? RecibirNotificaciones { get; set; }

    public string? Nombre { get; set; }

    public string? Apellidos { get; set; }

    public int? LimiteCorreos { get; set; }

    public string? PassTmp { get; set; }

    public DateTime? UltimoLogin { get; set; }

    public bool PermisoQlikSense { get; set; }
}
