using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Icg07
{
    public int IdIcg { get; set; }

    public int Año { get; set; }

    public int ConciertoId { get; set; }

    public string? Especialid { get; set; }

    public DateTime? Fautorizacion { get; set; }

    public string? Fsuscrip { get; set; }

    public string? Fresoluc { get; set; }

    public string? Fprorroga { get; set; }

    public string? FinVigencia { get; set; }

    public string? Muniambito { get; set; }

    public decimal? Costeassan { get; set; }

    public decimal? CosteIt { get; set; }

    public string? CostePrl { get; set; }

    public int? TipConciert { get; set; }

    public string? Provincia { get; set; }

    public string? Localid { get; set; }

    public string? Cp { get; set; }

    public string? Ubicac { get; set; }

    public int? Pasinurg { get; set; }

    public int? Paurgencias { get; set; }

    public int? Pingresadas { get; set; }

    public int? AsamprimconsProg { get; set; }

    public int? Asamconssuc { get; set; }

    public int? Asamsesrehab { get; set; }

    public int? AsamplacradRadio { get; set; }

    public int? Asamintquir { get; set; }

    public int? Asamintquirmp { get; set; }

    public int? Asamotrasprueb { get; set; }

    public int? AshnprimconsProg { get; set; }

    public int? Ashnconssuc { get; set; }

    public int? Ashnestcaus { get; set; }

    public int? Ashnsesrehab { get; set; }

    public int? AshnplacradRadio { get; set; }

    public int? Ashnintquir { get; set; }

    public int? Ashnintquirmp { get; set; }

    public int? Ashnotrasprueb { get; set; }

    public int? Citnºconsesp { get; set; }

    public int? Citnºsesrehab { get; set; }

    public int? Citnºintquir { get; set; }

    public int? Citnºotrpru { get; set; }

    public int? Dista25km { get; set; }

    public int? Dista2550km { get; set; }

    public int? Masde50km { get; set; }

    public int? Persfisica { get; set; }

    public int? Persjurpriv { get; set; }

    public int? Persjursist { get; set; }

    public int? PersjurOsp { get; set; }

    public int? PersjurOmutua { get; set; }

    public decimal? Art2581 { get; set; }

    public decimal? Art2582 { get; set; }

    public decimal? RestoArticulo25Scon { get; set; }

    public decimal? GastoCentroNoConcert { get; set; }

    public bool? Validado { get; set; }

    public int? UsuarioAltaId { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? UsuarioModificacionId { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public int? Icg072014 { get; set; }

    public int? AgrupacionId { get; set; }

    public int? AsamprimconsProgVideo { get; set; }

    public int? AsamprimconsNoProg { get; set; }

    public int? AsamprimconsNoProgVideo { get; set; }

    public int? AsamconssucVideo { get; set; }

    public int? Asamconseenf { get; set; }

    public int? Asamestcaus { get; set; }

    public int? AsamplacradRm { get; set; }

    public int? AsamplacradEco { get; set; }

    public int? AsamplacradTac { get; set; }

    public int? AshnprimconsProgVideo { get; set; }

    public int? AshnprimconsNoProg { get; set; }

    public int? AshnprimconsNoProgVideo { get; set; }

    public int? AshnconssucVideo { get; set; }

    public int? AshnplacradRm { get; set; }

    public int? AshnplacradEco { get; set; }

    public int? AshnplacradTac { get; set; }

    public int? Asambiomec { get; set; }

    public int? Ashnbiomec { get; set; }

    public int? CitnintervencionesQuirurjicas { get; set; }

    public int? CitnotrasPruebasControl { get; set; }

    public int? AshnconsultasEnfermeria { get; set; }

    public double? GastoTransporte { get; set; }
}
