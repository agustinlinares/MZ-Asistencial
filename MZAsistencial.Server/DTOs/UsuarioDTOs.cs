using System;
using System.ComponentModel.DataAnnotations;

namespace MZAsistencial.Server.DTOs
{
    public class UsuarioDTO
    {
        public int UsuarioId { get; set; }
        public string Login { get; set; } = null!;
        public string? Nombre { get; set; }
        public string? Apellidos { get; set; }
        public string? DireccionElectronica { get; set; }
        public int? PerfilId { get; set; }
        public string? PerfilNombre { get; set; }
        public int? MutuaId { get; set; }
        public string? MutuaNombre { get; set; }
        public int? CentroId { get; set; }
        public string? CentroNombre { get; set; }
        public bool PermisoQlikSense { get; set; }
        public bool? DgossrecibeCorreo { get; set; }
        public bool? RecibirNotificaciones { get; set; }
        public DateTime? UltimoLogin { get; set; }
        public DateTime? FechaBaja { get; set; }
        public bool Activo => FechaBaja == null || FechaBaja > DateTime.Now;
    }

    public class UsuarioCreateDTO
    {
        [Required(ErrorMessage = "El nombre de usuario (login) es obligatorio.")]
        public string Login { get; set; } = null!;

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        public string Nombre { get; set; } = null!;

        [Required(ErrorMessage = "Los apellidos son obligatorios.")]
        public string Apellidos { get; set; } = null!;

        [Required(ErrorMessage = "La dirección electrónica es obligatoria.")]
        [EmailAddress(ErrorMessage = "Formato de email inválido.")]
        public string DireccionElectronica { get; set; } = null!;

        public int? PerfilId { get; set; }
        public int? MutuaId { get; set; }
        public int? CentroId { get; set; }
        public bool PermisoQlikSense { get; set; }
        public bool? DgossrecibeCorreo { get; set; }
        public bool? RecibirNotificaciones { get; set; }

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{7,20}$", 
            ErrorMessage = "La contraseña debe tener entre 7 y 20 caracteres, e incluir al menos una mayúscula, una minúscula y un número.")]
        public string Password { get; set; } = null!;
    }

    public class UsuarioUpdateDTO
    {
        [Required(ErrorMessage = "El nombre de usuario (login) es obligatorio.")]
        public string Login { get; set; } = null!;

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        public string Nombre { get; set; } = null!;

        [Required(ErrorMessage = "Los apellidos son obligatorios.")]
        public string Apellidos { get; set; } = null!;

        [Required(ErrorMessage = "La dirección electrónica es obligatoria.")]
        [EmailAddress(ErrorMessage = "Formato de email inválido.")]
        public string DireccionElectronica { get; set; } = null!;

        public int? PerfilId { get; set; }
        public int? MutuaId { get; set; }
        public int? CentroId { get; set; }
        public bool PermisoQlikSense { get; set; }
        public bool? DgossrecibeCorreo { get; set; }
        public bool? RecibirNotificaciones { get; set; }
    }

    public class CambioPasswordDTO
    {
        [Required(ErrorMessage = "La nueva contraseña es obligatoria.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{7,20}$", 
            ErrorMessage = "La contraseña debe tener entre 7 y 20 caracteres, e incluir al menos una mayúscula, una minúscula y un número.")]
        public string NuevaPassword { get; set; } = null!;
    }
}
