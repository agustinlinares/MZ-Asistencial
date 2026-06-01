using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace MZAsistencial.Server.Models;

public partial class RegistroErrore
{
    public int ErrorId { get; set; }

    public int? UsuarioId { get; set; }

    public DateTime? FechaError { get; set; }

    public string? Descripcion { get; set; }

    public string? FicheroLog { get; set; }

    public int? EstadoId { get; set; }

    public DateTime? FechaResolucion { get; set; }

    public DateTime? FechaCierre { get; set; }

    public string? Comentarios { get; set; }

    [Column("Nombre_Modulo")] 
    public string? NombreModulo { get; set; }
}
