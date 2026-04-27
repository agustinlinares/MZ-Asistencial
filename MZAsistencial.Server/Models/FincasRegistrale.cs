using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class FincasRegistrale
{
    public int FincaId { get; set; }

    public int? CentroId { get; set; }

    public string? NombreVia { get; set; }

    public string? Numero { get; set; }

    public string? TipoViaId { get; set; }

    public string? Piso { get; set; }

    public string? Puerta { get; set; }

    public string? OtrosDatos { get; set; }

    public double? Superficie { get; set; }

    public double? Coste { get; set; }

    public string? Titinmueble { get; set; }

    public DateTime? Fadqoarr { get; set; }

    public DateTime? Finscreg { get; set; }

    public string? Utilizacion { get; set; }

    public string? Localizador { get; set; }

    public DateTime? FechaBaja { get; set; }

    public int? IdFincaIcgAccess { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? UsuarioAltaId { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public string? ReferenciaCatastral { get; set; }

    public int? TipoFinca { get; set; }

    public string? DireccionElectronica { get; set; }

    public string? PersonaContacto { get; set; }

    public string? Latitud { get; set; }
    public string? Longitud { get; set; }

    public virtual ICollection<FincasRegistralesCostesPorAño> FincasRegistralesCostesPorAños { get; set; } = new List<FincasRegistralesCostesPorAño>();
}
