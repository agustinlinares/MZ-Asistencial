using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Mutua
{
    public int MutuaId { get; set; }

    public string? NumeroMutua { get; set; }

    public string? Mutua1 { get; set; }

    public string? RazonSocial { get; set; }

    public string? Direccion { get; set; }

    public string? Cp { get; set; }

    public int? PoblacionId { get; set; }

    public string? Telefono { get; set; }

    public string? Fax { get; set; }

    public string? DireccionElectronica { get; set; }

    public string? PersonaContacto { get; set; }

    public string? Logotipo { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? UsuarioAltaId { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public int? UsuarioModificacionId { get; set; }

    public DateTime? FechaBaja { get; set; }

    public int? UsuarioBajaId { get; set; }

    public decimal? RatioConsultas { get; set; }

    public int? UsuarioId { get; set; }

    //Añadimos la navegacion
    public virtual AuxPoblacione? PoblacionNavigation { get; set; }

}
