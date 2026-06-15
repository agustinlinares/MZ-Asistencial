using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using MZAsistencial.Server.DTOs;

namespace MZAsistencial.Server.Services
{
    public interface IUsuariosService
    {
        Task<IEnumerable<UsuarioDTO>> GetUsuariosAsync(ClaimsPrincipal user);
        Task<UsuarioDTO?> GetUsuarioByIdAsync(int id, ClaimsPrincipal user);
        Task<UsuarioDTO> CreateUsuarioAsync(UsuarioCreateDTO dto, ClaimsPrincipal user);
        Task<bool> UpdateUsuarioAsync(int id, UsuarioUpdateDTO dto, ClaimsPrincipal user);
        Task<bool> DeleteUsuarioAsync(int id, ClaimsPrincipal user);
        Task<bool> ChangePasswordAsync(int id, CambioPasswordDTO dto, ClaimsPrincipal user);
    }
}
