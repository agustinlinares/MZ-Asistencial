using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Services
{
    public class Icg06HosService
    {
        private readonly MZAsistencialContext _context;
        private readonly IRegistroErroresService _registroErroresService;

        public Icg06HosService(MZAsistencialContext context, IRegistroErroresService registroErroresService)
        {
            _context = context;
            _registroErroresService = registroErroresService;
        }

        public async Task<Icg06HosDTO?> GetByCentroYAñoAsync(int centroId, int año)
        {
            var e = await _context.Icg06s.FirstOrDefaultAsync(x => x.CentroId == centroId && x.Año == año);
            if (e is null) return null;
            return new Icg06HosDTO
            {
                IdIcg = e.IdIcg, Año = e.Año, CentroId = e.CentroId,
                PitrmutHos = e.PitrmutHos, EsttrmutHos = e.EsttrmutHos,
                PrimConsHosProg = e.PrimConsHosProg, PrimConsHosProgVideo = e.PrimConsHosProgVideo,
                PrimConsHosNoProg = e.PrimConsHosNoProg, PrimConsHosNoProgVideo = e.PrimConsHosNoProgVideo,
                ConssucHos = e.ConssucHos, ConssucHosVideo = e.ConssucHosVideo,
                SesrehabtrmutHos = e.SesrehabtrmutHos, ConsEnfHos = e.ConsEnfHos,
                PitrmutArt82Hos = e.PitrmutArt82Hos, EsttrmutArt82Hos = e.EsttrmutArt82Hos,
                PrimConsArt82HosProg = e.PrimConsArt82HosProg, PrimConsArt82HosProgVideo = e.PrimConsArt82HosProgVideo,
                PrimConsArt82HosNoProg = e.PrimConsArt82HosNoProg, PrimConsArt82HosNoProgVideo = e.PrimConsArt82HosNoProgVideo,
                ConssucArt82Hos = e.ConssucArt82Hos, ConssucArt82HosVideo = e.ConssucArt82HosVideo,
                SrehabtrmutArt82Hos = e.SrehabtrmutArt82Hos, ConsEnfArt82Hos = e.ConsEnfArt82Hos,
                PiotrmutArt12Hos = e.PiotrmutArt12Hos, EstotrmutArt12Hos = e.EstotrmutArt12Hos,
                PrimConsotrmutArt12HosProg = e.PrimConsotrmutArt12HosProg, PrimConsotrmutArt12HosProgVideo = e.PrimConsotrmutArt12HosProgVideo,
                PrimConsotrmutArt12HosNoProg = e.PrimConsotrmutArt12HosNoProg, PrimConsotrmutArt12HosNoProgVideo = e.PrimConsotrmutArt12HosNoProgVideo,
                ConssucotrmutArt12Hos = e.ConssucotrmutArt12Hos, ConssucotrmutArt12HosVideo = e.ConssucotrmutArt12HosVideo,
                SrehabotrmutArt12Hos = e.SrehabotrmutArt12Hos, ConsEnfotrmutArt12Hos = e.ConsEnfotrmutArt12Hos,
                PradtrmutHosRm = e.PradtrmutHosRm, PradtrmutHosEco = e.PradtrmutHosEco,
                PradtrmutHosTac = e.PradtrmutHosTac, PradtrmutHosRadio = e.PradtrmutHosRadio,
                IquirtrmutHos = e.IquirtrmutHos, OppracttrmutHos = e.OppracttrmutHos,
                PruBiomHos = e.PruBiomHos, PaurnointrmutHos = e.PaurnointrmutHos,
                PrmydtrmutArt82HosRm = e.PrmydtrmutArt82HosRm, PrmydtrmutArt82HosEco = e.PrmydtrmutArt82HosEco,
                PrmydtrmutArt82HosTac = e.PrmydtrmutArt82HosTac, PrmydtrmutArt82HosRadio = e.PrmydtrmutArt82HosRadio,
                IquirtrmutArt82Hos = e.IquirtrmutArt82Hos, OpptrmutArt82Hos = e.OpptrmutArt82Hos,
                PrueBiomArt82Hos = e.PrueBiomArt82Hos, PaurgNoIngrArt82Hos = e.PaurgNoIngrArt82Hos,
                PradotrmutArt12HosRm = e.PradotrmutArt12HosRm, PradotrmutArt12HosEco = e.PradotrmutArt12HosEco,
                PradotrmutArt12HosTac = e.PradotrmutArt12HosTac, PradotrmutArt12HosRadio = e.PradotrmutArt12HosRadio,
                IquirotrmutArt12Hos = e.IquirotrmutArt12Hos, OppotrmutArt12Hos = e.OppotrmutArt12Hos,
                PruBiomotrmutArt12Hos = e.PruBiomotrmutArt12Hos, PaurniotrmutArt12Hos = e.PaurniotrmutArt12Hos,
            };
        }

        public async Task<bool> UpdateAsync(int idIcg, Icg06HosDTO dto)
        {
            var e = await _context.Icg06s.FindAsync(idIcg);
            if (e is null) return false;
            e.PitrmutHos = dto.PitrmutHos; e.EsttrmutHos = dto.EsttrmutHos;
            e.PrimConsHosProg = dto.PrimConsHosProg; e.PrimConsHosProgVideo = dto.PrimConsHosProgVideo;
            e.PrimConsHosNoProg = dto.PrimConsHosNoProg; e.PrimConsHosNoProgVideo = dto.PrimConsHosNoProgVideo;
            e.ConssucHos = dto.ConssucHos; e.ConssucHosVideo = dto.ConssucHosVideo;
            e.SesrehabtrmutHos = dto.SesrehabtrmutHos; e.ConsEnfHos = dto.ConsEnfHos;
            e.PitrmutArt82Hos = dto.PitrmutArt82Hos; e.EsttrmutArt82Hos = dto.EsttrmutArt82Hos;
            e.PrimConsArt82HosProg = dto.PrimConsArt82HosProg; e.PrimConsArt82HosProgVideo = dto.PrimConsArt82HosProgVideo;
            e.PrimConsArt82HosNoProg = dto.PrimConsArt82HosNoProg; e.PrimConsArt82HosNoProgVideo = dto.PrimConsArt82HosNoProgVideo;
            e.ConssucArt82Hos = dto.ConssucArt82Hos; e.ConssucArt82HosVideo = dto.ConssucArt82HosVideo;
            e.SrehabtrmutArt82Hos = dto.SrehabtrmutArt82Hos; e.ConsEnfArt82Hos = dto.ConsEnfArt82Hos;
            e.PiotrmutArt12Hos = dto.PiotrmutArt12Hos; e.EstotrmutArt12Hos = dto.EstotrmutArt12Hos;
            e.PrimConsotrmutArt12HosProg = dto.PrimConsotrmutArt12HosProg; e.PrimConsotrmutArt12HosProgVideo = dto.PrimConsotrmutArt12HosProgVideo;
            e.PrimConsotrmutArt12HosNoProg = dto.PrimConsotrmutArt12HosNoProg; e.PrimConsotrmutArt12HosNoProgVideo = dto.PrimConsotrmutArt12HosNoProgVideo;
            e.ConssucotrmutArt12Hos = dto.ConssucotrmutArt12Hos; e.ConssucotrmutArt12HosVideo = dto.ConssucotrmutArt12HosVideo;
            e.SrehabotrmutArt12Hos = dto.SrehabotrmutArt12Hos; e.ConsEnfotrmutArt12Hos = dto.ConsEnfotrmutArt12Hos;
            e.PradtrmutHosRm = dto.PradtrmutHosRm; e.PradtrmutHosEco = dto.PradtrmutHosEco;
            e.PradtrmutHosTac = dto.PradtrmutHosTac; e.PradtrmutHosRadio = dto.PradtrmutHosRadio;
            e.IquirtrmutHos = dto.IquirtrmutHos; e.OppracttrmutHos = dto.OppracttrmutHos;
            e.PruBiomHos = dto.PruBiomHos; e.PaurnointrmutHos = dto.PaurnointrmutHos;
            e.PrmydtrmutArt82HosRm = dto.PrmydtrmutArt82HosRm; e.PrmydtrmutArt82HosEco = dto.PrmydtrmutArt82HosEco;
            e.PrmydtrmutArt82HosTac = dto.PrmydtrmutArt82HosTac; e.PrmydtrmutArt82HosRadio = dto.PrmydtrmutArt82HosRadio;
            e.IquirtrmutArt82Hos = dto.IquirtrmutArt82Hos; e.OpptrmutArt82Hos = dto.OpptrmutArt82Hos;
            e.PrueBiomArt82Hos = dto.PrueBiomArt82Hos; e.PaurgNoIngrArt82Hos = dto.PaurgNoIngrArt82Hos;
            e.PradotrmutArt12HosRm = dto.PradotrmutArt12HosRm; e.PradotrmutArt12HosEco = dto.PradotrmutArt12HosEco;
            e.PradotrmutArt12HosTac = dto.PradotrmutArt12HosTac; e.PradotrmutArt12HosRadio = dto.PradotrmutArt12HosRadio;
            e.IquirotrmutArt12Hos = dto.IquirotrmutArt12Hos; e.OppotrmutArt12Hos = dto.OppotrmutArt12Hos;
            e.PruBiomotrmutArt12Hos = dto.PruBiomotrmutArt12Hos; e.PaurniotrmutArt12Hos = dto.PaurniotrmutArt12Hos;
            e.FechaModificacion = DateTime.Now;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}