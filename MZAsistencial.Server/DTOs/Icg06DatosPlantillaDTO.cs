namespace MZAsistencial.Server.DTOs
{
    public class Icg06DatosPlantillaDTO
    {
        public int  IdIcg    { get; set; }
        public int? CentroId { get; set; }
        public int? Año      { get; set; }

        // ─── Médicos Art.6 ───────────────────────────────────────────────────
        public decimal? PersSanitMedArt6NumPers          { get; set; }
        public decimal? PersSanitMedArt6GastPers         { get; set; }
        public decimal? PersSanitMedArt6HorasCp          { get; set; }
        public decimal? PersSanitMedArt6HorasCc          { get; set; }
        public decimal? PersSanitMedArt6HorasIt          { get; set; }
        public decimal? PersSanitMedArt6HorasAtep        { get; set; }
        public decimal? PersSanitMedArt6HorasAgm         { get; set; }
        public decimal? PersSanitMedArt6NumPersSustInt   { get; set; }
        public decimal? PersSanitMedArt6GastPersSustInt  { get; set; }
        public decimal? PersSanitMedArt6HorasPersSustInt { get; set; }

        // ─── Médicos Especialistas Art.6 ─────────────────────────────────────
        public decimal? PersSanitMedEspArt6NumPers          { get; set; }
        public decimal? PersSanitMedEspArt6GastPers         { get; set; }
        public decimal? PersSanitMedEspArt6HorasCp          { get; set; }
        public decimal? PersSanitMedEspArt6HorasCc          { get; set; }
        public decimal? PersSanitMedEspArt6HorasIt          { get; set; }
        public decimal? PersSanitMedEspArt6HorasAtep        { get; set; }
        public decimal? PersSanitMedEspArt6HorasAgm         { get; set; }
        public decimal? PersSanitMedEspArt6NumPersSustInt   { get; set; }
        public decimal? PersSanitMedEspArt6GastPersSustInt  { get; set; }
        public decimal? PersSanitMedEspArt6HorasPersSustInt { get; set; }

        // ─── Médicos Gestión Art.6 ────────────────────────────────────────────
        public decimal? PersSanitMedGesArt6NumPers          { get; set; }
        public decimal? PersSanitMedGesArt6GastPers         { get; set; }
        public decimal? PersSanitMedGesArt6HorasCp          { get; set; }
        public decimal? PersSanitMedGesArt6HorasCc          { get; set; }
        public decimal? PersSanitMedGesArt6HorasIt          { get; set; }
        public decimal? PersSanitMedGesArt6HorasAtep        { get; set; }
        public decimal? PersSanitMedGesArt6HorasAgm         { get; set; }
        public decimal? PersSanitMedGesArt6NumPersSustInt   { get; set; }
        public decimal? PersSanitMedGesArt6GastPersSustInt  { get; set; }
        public decimal? PersSanitMedGesArt6HorasPersSustInt { get; set; }

        // ─── DUE Art.7 ───────────────────────────────────────────────────────
        public decimal? PersSanitArt7DuenumPers          { get; set; }
        public decimal? PersSanitArt7DuegastPers         { get; set; }
        public decimal? PersSanitArt7DuehorasCp          { get; set; }
        public decimal? PersSanitArt7DuehorasCc          { get; set; }
        public decimal? PersSanitArt7DuehorasIt          { get; set; }
        public decimal? PersSanitArt7DuehorasAtep        { get; set; }
        public decimal? PersSanitArt7DuehorasAgm         { get; set; }
        public decimal? PersSanitArt7DuenumPersSustInt   { get; set; }
        public decimal? PersSanitArt7DuegastPersSustInt  { get; set; }
        public decimal? PersSanitArt7DuehorasPersSustInt { get; set; }

        // ─── Fisioterapeutas Art.7 ────────────────────────────────────────────
        public decimal? PersSanitArt7FisNumPers          { get; set; }
        public decimal? PersSanitArt7FisGastPers         { get; set; }
        public decimal? PersSanitArt7FisHorasCp          { get; set; }
        public decimal? PersSanitArt7FisHorasCc          { get; set; }
        public decimal? PersSanitArt7FisHorasIt          { get; set; }
        public decimal? PersSanitArt7FisHorasAtep        { get; set; }
        public decimal? PersSanitArt7FisHorasAgm         { get; set; }
        public decimal? PersSanitArt7FisNumPersSustInt   { get; set; }
        public decimal? PersSanitArt7FisGastPersSustInt  { get; set; }
        public decimal? PersSanitArt7FisHorasPersSustInt { get; set; }

        // ─── Psicólogos Art.7 ────────────────────────────────────────────────
        public decimal? PersSanitArt7PsicoNumPers          { get; set; }
        public decimal? PersSanitArt7PsicoGastPers         { get; set; }
        public decimal? PersSanitArt7PsicoHorasCp          { get; set; }
        public decimal? PersSanitArt7PsicoHorasCc          { get; set; }
        public decimal? PersSanitArt7PsicoHorasIt          { get; set; }
        public decimal? PersSanitArt7PsicoHorasAtep        { get; set; }
        public decimal? PersSanitArt7PsicoHorasAgm         { get; set; }
        public decimal? PersSanitArt7PsicoNumPersSustInt   { get; set; }
        public decimal? PersSanitArt7PsicoGastPersSustInt  { get; set; }
        public decimal? PersSanitArt7PsicoHorasPersSustInt { get; set; }

        // ─── Trabajadores Sociales Art.7 ─────────────────────────────────────
        public decimal? PersSanitArt7TrSocNumPers          { get; set; }
        public decimal? PersSanitArt7TrSocGastPers         { get; set; }
        public decimal? PersSanitArt7TrSocHorasCp          { get; set; }
        public decimal? PersSanitArt7TrSocHorasCc          { get; set; }
        public decimal? PersSanitArt7TrSocHorasIt          { get; set; }
        public decimal? PersSanitArt7TrSocHorasAtep        { get; set; }
        public decimal? PersSanitArt7TrSocHorasAgm         { get; set; }
        public decimal? PersSanitArt7TrSocNumPersSustInt   { get; set; }
        public decimal? PersSanitArt7TrSocGastPersSustInt  { get; set; }
        public decimal? PersSanitArt7TrSocHorasPersSustInt { get; set; }

        // ─── Terapeutas Ocupacionales Art.7 ──────────────────────────────────
        public decimal? PersSanitArt7TerOcuNumPers          { get; set; }
        public decimal? PersSanitArt7TerOcuGastPers         { get; set; }
        public decimal? PersSanitArt7TerOcuHorasCp          { get; set; }
        public decimal? PersSanitArt7TerOcuHorasCc          { get; set; }
        public decimal? PersSanitArt7TerOcuHorasIt          { get; set; }
        public decimal? PersSanitArt7TerOcuHorasAtep        { get; set; }
        public decimal? PersSanitArt7TerOcuHorasAgm         { get; set; }
        public decimal? PersSanitArt7TerOcuNumPersSustInt   { get; set; }
        public decimal? PersSanitArt7TerOcuGastPersSustInt  { get; set; }
        public decimal? PersSanitArt7TerOcuHorasPersSustInt { get; set; }

        // ─── Técnicos RX Art.7 ───────────────────────────────────────────────
        public decimal? PersSanitArt7TecRxnumPers          { get; set; }
        public decimal? PersSanitArt7TecRxgastPers         { get; set; }
        public decimal? PersSanitArt7TecRxhorasCp          { get; set; }
        public decimal? PersSanitArt7TecRxhorasCc          { get; set; }
        public decimal? PersSanitArt7TecRxhorasIt          { get; set; }
        public decimal? PersSanitArt7TecRxhorasAtep        { get; set; }
        public decimal? PersSanitArt7TecRxhorasAgm         { get; set; }
        public decimal? PersSanitArt7TecRxnumPersSustInt   { get; set; }
        public decimal? PersSanitArt7TecRxgastPersSustInt  { get; set; }
        public decimal? PersSanitArt7TecRxhorasPersSustInt { get; set; }

        // ─── Resto Personal Sanitario Art.7 ──────────────────────────────────
        public decimal? PersSanitArt7RestNumPers          { get; set; }
        public decimal? PersSanitArt7RestGastPers         { get; set; }
        public decimal? PersSanitArt7RestHorasCp          { get; set; }
        public decimal? PersSanitArt7RestHorasCc          { get; set; }
        public decimal? PersSanitArt7RestHorasIt          { get; set; }
        public decimal? PersSanitArt7RestHorasAtep        { get; set; }
        public decimal? PersSanitArt7RestHorasAgm         { get; set; }
        public decimal? PersSanitArt7RestNumPersSustInt   { get; set; }
        public decimal? PersSanitArt7RestGastPersSustInt  { get; set; }
        public decimal? PersSanitArt7RestHorasPersSustInt { get; set; }

        // ─── Grado Superior ──────────────────────────────────────────────────
        public decimal? PersSanitGradSupNumPers          { get; set; }
        public decimal? PersSanitGradSupGastPers         { get; set; }
        public decimal? PersSanitGradSupHorasCp          { get; set; }
        public decimal? PersSanitGradSupHorasCc          { get; set; }
        public decimal? PersSanitGradSupHorasIt          { get; set; }
        public decimal? PersSanitGradSupHorasAtep        { get; set; }
        public decimal? PersSanitGradSupHorasAgm         { get; set; }
        public decimal? PersSanitGradSupNumPersSustInt   { get; set; }
        public decimal? PersSanitGradSupGastPersSustInt  { get; set; }
        public decimal? PersSanitGradSupHorasPersSustInt { get; set; }

        // ─── Auxiliares Enfermería ────────────────────────────────────────────
        public decimal? PersSanitGradMedAuxEnfNumPers          { get; set; }
        public decimal? PersSanitGradMedAuxEnfGastPers         { get; set; }
        public decimal? PersSanitGradMedAuxEnfHorasCp          { get; set; }
        public decimal? PersSanitGradMedAuxEnfHorasCc          { get; set; }
        public decimal? PersSanitGradMedAuxEnfHorasIt          { get; set; }
        public decimal? PersSanitGradMedAuxEnfHorasAtep        { get; set; }
        public decimal? PersSanitGradMedAuxEnfHorasAgm         { get; set; }
        public decimal? PersSanitGradMedAuxEnfNumPersSustInt   { get; set; }
        public decimal? PersSanitGradMedAuxEnfGastPersSustInt  { get; set; }
        public decimal? PersSanitGradMedAuxEnfHorasPersSustInt { get; set; }

        // ─── Auxiliares Farmacia y Grado Medio ───────────────────────────────
        public decimal? PersSanitGradMedRestNumPers          { get; set; }
        public decimal? PersSanitGradMedRestGastPers         { get; set; }
        public decimal? PersSanitGradMedRestHorasCp          { get; set; }
        public decimal? PersSanitGradMedRestHorasCc          { get; set; }
        public decimal? PersSanitGradMedRestHorasIt          { get; set; }
        public decimal? PersSanitGradMedRestHorasAtep        { get; set; }
        public decimal? PersSanitGradMedRestHorasAgm         { get; set; }
        public decimal? PersSanitGradMedRestNumPersSustInt   { get; set; }
        public decimal? PersSanitGradMedRestGastPersSustInt  { get; set; }
        public decimal? PersSanitGradMedRestHorasPersSustInt { get; set; }

        // ─── Resto Personal Sanitario ─────────────────────────────────────────
        public decimal? RestPersSanitNumPers          { get; set; }
        public decimal? RestPersSanitGastPers         { get; set; }
        public decimal? RestPersSanitHorasCp          { get; set; }
        public decimal? RestPersSanitHorasCc          { get; set; }
        public decimal? RestPersSanitHorasIt          { get; set; }
        public decimal? RestPersSanitHorasAtep        { get; set; }
        public decimal? RestPersSanitHorasAgm         { get; set; }
        public decimal? RestPersSanitNumPersSustInt   { get; set; }
        public decimal? RestPersSanitGastPersSustInt  { get; set; }
        public decimal? RestPersSanitHorasPersSustInt { get; set; }

        // ─── Director de Centro ───────────────────────────────────────────────
        public decimal? PersDirCenNumPers          { get; set; }
        public decimal? PersDirCenGastPers         { get; set; }
        public decimal? PersDirCenHorasCp          { get; set; }
        public decimal? PersDirCenHorasCc          { get; set; }
        public decimal? PersDirCenHorasIt          { get; set; }
        public decimal? PersDirCenHorasAtep        { get; set; }
        public decimal? PersDirCenHorasAgm         { get; set; }
        public decimal? PersDirCenNumPersSustInt   { get; set; }
        public decimal? PersDirCenGastPersSustInt  { get; set; }
        public decimal? PersDirCenHorasPersSustInt { get; set; }

        // ─── Administración ───────────────────────────────────────────────────
        public decimal? PersAdminNumPers          { get; set; }
        public decimal? PersAdminGastPers         { get; set; }
        public decimal? PersAdminHorasCp          { get; set; }
        public decimal? PersAdminHorasCc          { get; set; }
        public decimal? PersAdminHorasIt          { get; set; }
        public decimal? PersAdminHorasAtep        { get; set; }
        public decimal? PersAdminHorasAgm         { get; set; }
        public decimal? PersAdminNumPersSustInt   { get; set; }
        public decimal? PersAdminGastPersSustInt  { get; set; }
        public decimal? PersAdminHorasPersSustInt { get; set; }

        // ─── Técnicos de Prevención ───────────────────────────────────────────
        public decimal? PersTecPreNumPers          { get; set; }
        public decimal? PersTecPreGastPers         { get; set; }
        public decimal? PersTecPreHorasCp          { get; set; }
        public decimal? PersTecPreHorasCc          { get; set; }
        public decimal? PersTecPreHorasIt          { get; set; }
        public decimal? PersTecPreHorasAtep        { get; set; }
        public decimal? PersTecPreHorasAgm         { get; set; }
        public decimal? PersTecPreNumPersSustInt   { get; set; }
        public decimal? PersTecPreGastPersSustInt  { get; set; }
        public decimal? PersTecPreHorasPersSustInt { get; set; }

        // ─── No Administración ────────────────────────────────────────────────
        public decimal? PersNoAdminNumPers          { get; set; }
        public decimal? PersNoAdminGastPers         { get; set; }
        public decimal? PersNoAdminHorasCp          { get; set; }
        public decimal? PersNoAdminHorasCc          { get; set; }
        public decimal? PersNoAdminHorasIt          { get; set; }
        public decimal? PersNoAdminHorasAtep        { get; set; }
        public decimal? PersNoAdminHorasAgm         { get; set; }
        public decimal? PersNoAdminNumPersSustInt   { get; set; }
        public decimal? PersNoAdminGastPersSustInt  { get; set; }
        public decimal? PersNoAdminHorasPersSustInt { get; set; }
    }
}
