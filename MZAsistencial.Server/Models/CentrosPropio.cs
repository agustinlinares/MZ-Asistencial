using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class CentrosPropio
{
    public int CentroId { get; set; }

    public int MutuaId { get; set; }

    public string? Centro { get; set; }

    public int? CentroCesionarioId { get; set; }

    public bool? Validado { get; set; }

    public string? Localizador { get; set; }

    public string? Cifnif { get; set; }

    public string? Direccion { get; set; }

    public string? Numero { get; set; }

    public string? DireccionGis { get; set; }

    public int? PoblacionId { get; set; }

    public string? Cp { get; set; }

    public string? Telefono { get; set; }

    public string? Fax { get; set; }

    public string? DireccionElectronica { get; set; }

    public string? PersonaContacto { get; set; }

    public int? ServiciosEspeciales { get; set; }

    public bool AsistenciaHospitalaria { get; set; }

    public bool AsistenciaAmbulatoria { get; set; }

    public bool Rehabilitacion { get; set; }

    public bool IncapacidadTransitoria { get; set; }

    public bool Prevencion { get; set; }

    public bool Administracion { get; set; }

    public bool OtrasActividades { get; set; }

    public bool? AsistenciaSanitaria { get; set; }

    public bool? MediosAjenos { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? UsuarioAltaId { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public int? UsuarioModificacionId { get; set; }

    public DateTime? FechaBaja { get; set; }

    public int? UsuarioBajaId { get; set; }

    public string? MotivoBaja { get; set; }

    public int? TipoCentro { get; set; }

    public int? TipoCentroAnt { get; set; }

    public string? Observaciones { get; set; }

    public int? TipoViaId { get; set; }

    public string? Piso { get; set; }

    public string? Puerta { get; set; }

    public string? OtrosDatos { get; set; }

    public bool? Traslado { get; set; }

    public int? CentroIdNuevo { get; set; }

    public DateTime? Fautocom { get; set; }

    public DateTime? Fpufuncio { get; set; }

    public DateTime? Fcalisuf { get; set; }

    public DateTime? FechaCarga { get; set; }

    public bool? MapaValidado { get; set; }

    public string? Latitud { get; set; }

    public string? Longitud { get; set; }

    public string? CodigoMz { get; set; }

    public int? MarcaCentro { get; set; }

    public DateOnly? FechaDesactivacion { get; set; }

    public int? UsuarioDesactivacion { get; set; }

    public bool Desactivado { get; set; }
}
