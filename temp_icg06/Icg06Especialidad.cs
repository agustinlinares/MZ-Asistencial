using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Icg06Especialidad
{
    public int       Id                           { get; set; }  // CentrosPropioEspecialidad_id
    public int       CentroId                     { get; set; }  // Centro_id
    public int       Año                          { get; set; }
    public int       EspecialidadId               { get; set; }  // Especialidad_id
    public string    Servicio                     { get; set; } = null!;
    public int?      Cantidad                     { get; set; }
    public float?    ImporteConIva                { get; set; }
    public long?     ServicioId                   { get; set; }  // bigint
    public DateTime? FechaAlta                    { get; set; }
    public DateTime? FechaBaja                    { get; set; }
    public int?      Disponibilidad               { get; set; }
    public int?      Plazo                        { get; set; }
    public int?      ActualizarDisponibilidad     { get; set; }
    public DateTime? FechaModificacion            { get; set; }
    public DateTime? FechaActualizarDisponibilidad{ get; set; }
    public DateTime? FechaGeneracionAcreditacion  { get; set; }
}