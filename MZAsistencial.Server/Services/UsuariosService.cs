using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MZAsistencial.Server.Services
{
    public class UsuariosService : IUsuariosService
    {
        private readonly MZAsistencialContext _context;

        public UsuariosService(MZAsistencialContext context)
        {
            _context = context;
        }

        private static string CreateMD5(string input)
        {
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);
                return Convert.ToHexString(hashBytes);
            }
        }

        private int GetUserPerfilId(ClaimsPrincipal user)
        {
            var claim = user.Claims.FirstOrDefault(c => c.Type == "perfilId");
            return claim != null && int.TryParse(claim.Value, out var id) ? id : 0;
        }

        private int GetUserMutuaId(ClaimsPrincipal user)
        {
            var claim = user.Claims.FirstOrDefault(c => c.Type == "mutuaId");
            return claim != null && int.TryParse(claim.Value, out var id) ? id : 0;
        }

        private IQueryable<Usuario> FilterByRole(IQueryable<Usuario> query, ClaimsPrincipal user)
        {
            var perfilId = GetUserPerfilId(user);
            var mutuaId = GetUserMutuaId(user);

            if (perfilId == 1) // Admin ve todos
            {
                return query;
            }
            if (perfilId == 2) // Mutua admin ve perfiles 2, 6, 7 de su mutua
            {
                return query.Where(u => u.MutuaId == mutuaId && (u.PerfilId == 2 || u.PerfilId == 6 || u.PerfilId == 7));
            }
            if (perfilId == 4) // Perfil 4 solo ve usuarios de su mismo perfil (sin mutua obligatoria)
            {
                return query.Where(u => u.PerfilId == 4);
            }
            
            // El resto ve usuarios de su propia mutua y mismo perfil
            return query.Where(u => u.MutuaId == mutuaId && u.PerfilId == perfilId);
        }

        public async Task<IEnumerable<UsuarioDTO>> GetUsuariosAsync(ClaimsPrincipal user)
        {
            var query = _context.Usuarios.AsQueryable();
            query = FilterByRole(query, user);

            var list = await query.ToListAsync();
            var perfiles = await _context.Perfiles.ToDictionaryAsync(p => p.PerfilId, p => p.Perfil);
            var mutuas = await _context.Mutuas.ToDictionaryAsync(m => m.MutuaId, m => m.Mutua1);
            var centros = await _context.CentrosPropios.ToDictionaryAsync(c => c.CentroId, c => c.Centro ?? "");

            return list.Select(u => new UsuarioDTO
            {
                UsuarioId = u.UsuarioId,
                Login = u.Usuario1 ?? "",
                Nombre = u.Nombre,
                Apellidos = u.Apellidos,
                DireccionElectronica = u.DireccionElectronica,
                PerfilId = u.PerfilId,
                PerfilNombre = u.PerfilId.HasValue && perfiles.ContainsKey(u.PerfilId.Value) ? perfiles[u.PerfilId.Value] : null,
                MutuaId = u.MutuaId,
                MutuaNombre = u.MutuaId.HasValue && mutuas.ContainsKey(u.MutuaId.Value) ? mutuas[u.MutuaId.Value] : null,
                CentroId = u.CentroId,
                CentroNombre = u.CentroId.HasValue && centros.ContainsKey(u.CentroId.Value) ? centros[u.CentroId.Value] : null,
                PermisoQlikSense = u.PermisoQlikSense,
                DgossrecibeCorreo = u.DgossrecibeCorreo,
                RecibirNotificaciones = u.RecibirNotificaciones,
                UltimoLogin = u.UltimoLogin,
                FechaBaja = u.FechaBaja
            });
        }

        public async Task<UsuarioDTO?> GetUsuarioByIdAsync(int id, ClaimsPrincipal user)
        {
            var query = _context.Usuarios.Where(u => u.UsuarioId == id);
            query = FilterByRole(query, user);
            var u = await query.FirstOrDefaultAsync();

            if (u == null) return null;

            string? perfilNombre = null;
            if (u.PerfilId.HasValue)
                perfilNombre = await _context.Perfiles.Where(p => p.PerfilId == u.PerfilId).Select(p => p.Perfil).FirstOrDefaultAsync();
            
            string? mutuaNombre = null;
            if (u.MutuaId.HasValue)
                mutuaNombre = await _context.Mutuas.Where(m => m.MutuaId == u.MutuaId).Select(m => m.Mutua1).FirstOrDefaultAsync();

            string? centroNombre = null;
            if (u.CentroId.HasValue)
                centroNombre = await _context.CentrosPropios.Where(c => c.CentroId == u.CentroId).Select(c => c.Centro).FirstOrDefaultAsync();

            return new UsuarioDTO
            {
                UsuarioId = u.UsuarioId,
                Login = u.Usuario1 ?? "",
                Nombre = u.Nombre,
                Apellidos = u.Apellidos,
                DireccionElectronica = u.DireccionElectronica,
                PerfilId = u.PerfilId,
                PerfilNombre = perfilNombre,
                MutuaId = u.MutuaId,
                MutuaNombre = mutuaNombre,
                CentroId = u.CentroId,
                CentroNombre = centroNombre,
                PermisoQlikSense = u.PermisoQlikSense,
                DgossrecibeCorreo = u.DgossrecibeCorreo,
                RecibirNotificaciones = u.RecibirNotificaciones,
                UltimoLogin = u.UltimoLogin,
                FechaBaja = u.FechaBaja
            };
        }

        public async Task<UsuarioDTO> CreateUsuarioAsync(UsuarioCreateDTO dto, ClaimsPrincipal user)
        {
            if (await _context.Usuarios.AnyAsync(u => u.Usuario1 == dto.Login))
                throw new Exception("Ya existe un usuario con ese login.");

            var sessionPerfil = GetUserPerfilId(user);
            var sessionMutua = GetUserMutuaId(user);

            var nuevo = new Usuario
            {
                Usuario1 = dto.Login,
                Nombre = dto.Nombre,
                Apellidos = dto.Apellidos,
                DireccionElectronica = dto.DireccionElectronica,
                DgossrecibeCorreo = dto.DgossrecibeCorreo,
                RecibirNotificaciones = dto.RecibirNotificaciones,
                Password = CreateMD5(dto.Password),
                FechaPassword = DateTime.Now,
                CambioPassword = true, // Obliga a cambiar al entrar por primera vez
                CentroId = dto.CentroId
            };

            if (sessionPerfil == 1)
            {
                nuevo.PerfilId = dto.PerfilId;
                nuevo.MutuaId = (dto.PerfilId == 1 || dto.PerfilId == 4) ? null : dto.MutuaId;
                nuevo.PermisoQlikSense = dto.PermisoQlikSense;
            }
            else
            {
                nuevo.PermisoQlikSense = false;

                if (sessionPerfil == 2)
                {
                    nuevo.MutuaId = sessionMutua > 0 ? (int?)sessionMutua : null;
                    if (dto.PerfilId == 2 || dto.PerfilId == 6 || dto.PerfilId == 7)
                        nuevo.PerfilId = dto.PerfilId;
                    else
                        nuevo.PerfilId = 2; // Fallback
                }
                else
                {
                    nuevo.PerfilId = sessionPerfil;
                    nuevo.MutuaId = (sessionPerfil == 4 || sessionMutua <= 0) ? null : (int?)sessionMutua;
                }
            }

            _context.Usuarios.Add(nuevo);
            await _context.SaveChangesAsync();

            return await GetUsuarioByIdAsync(nuevo.UsuarioId, user) ?? throw new Exception("Error al obtener el usuario creado.");
        }

        public async Task<bool> UpdateUsuarioAsync(int id, UsuarioUpdateDTO dto, ClaimsPrincipal user)
        {
            var query = _context.Usuarios.Where(u => u.UsuarioId == id);
            query = FilterByRole(query, user);
            var actual = await query.FirstOrDefaultAsync();

            if (actual == null) return false;

            var sessionPerfil = GetUserPerfilId(user);
            var currentUserIdStr = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            int.TryParse(currentUserIdStr, out int sessionUserId);

            // Regla: si se está editando a un usuario de perfil 1 y el logueado NO es él mismo -> no se puede
            if (actual.PerfilId == 1 && sessionUserId != actual.UsuarioId)
            {
                throw new UnauthorizedAccessException("No puedes modificar a otro Administrador.");
            }

            // Comprobar si cambia login que no colisione
            if (actual.Usuario1 != dto.Login && await _context.Usuarios.AnyAsync(u => u.Usuario1 == dto.Login && u.UsuarioId != id))
                throw new Exception("El nuevo login ya está en uso.");

            actual.Usuario1 = dto.Login;
            actual.Nombre = dto.Nombre;
            actual.Apellidos = dto.Apellidos;
            actual.DireccionElectronica = dto.DireccionElectronica;
            actual.DgossrecibeCorreo = dto.DgossrecibeCorreo;
            actual.RecibirNotificaciones = dto.RecibirNotificaciones;
            actual.CentroId = dto.CentroId;

            if (sessionPerfil == 1)
            {
                actual.PerfilId = dto.PerfilId;
                actual.MutuaId = (dto.PerfilId == 1 || dto.PerfilId == 4) ? null : dto.MutuaId;
                actual.PermisoQlikSense = dto.PermisoQlikSense;
            }
            else if (sessionPerfil == 2)
            {
                if (dto.PerfilId == 2 || dto.PerfilId == 6 || dto.PerfilId == 7)
                {
                    actual.PerfilId = dto.PerfilId;
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteUsuarioAsync(int id, ClaimsPrincipal user)
        {
            var query = _context.Usuarios.Where(u => u.UsuarioId == id);
            query = FilterByRole(query, user);
            var actual = await query.FirstOrDefaultAsync();

            if (actual == null) return false;

            var currentUserIdStr = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            int.TryParse(currentUserIdStr, out int sessionUserId);

            if (actual.PerfilId == 1 && sessionUserId != actual.UsuarioId)
            {
                throw new UnauthorizedAccessException("No puedes dar de baja a otro Administrador.");
            }

            // Baja Lógica
            actual.FechaBaja = DateTime.Now;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ChangePasswordAsync(int id, CambioPasswordDTO dto, ClaimsPrincipal user)
        {
            var query = _context.Usuarios.Where(u => u.UsuarioId == id);
            // Comprobamos permisos igual para saber si puede acceder
            query = FilterByRole(query, user);
            var actual = await query.FirstOrDefaultAsync();

            if (actual == null) return false;

            var currentUserIdStr = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            int.TryParse(currentUserIdStr, out int sessionUserId);

            if (actual.PerfilId == 1 && sessionUserId != actual.UsuarioId)
            {
                throw new UnauthorizedAccessException("No puedes modificar a otro Administrador.");
            }

            actual.Password = CreateMD5(dto.NuevaPassword);
            actual.FechaPassword = DateTime.Now;
            actual.CambioPassword = false;
            actual.LimiteCorreos = 0;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
