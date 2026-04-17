using System;
using System.Collections.Generic;

namespace MZAsistencial.Server.Models;

public partial class Icg06
{
    public int IdIcg { get; set; }

    public int Año { get; set; }

    public int CentroId { get; set; }

    public decimal? GasfinAg { get; set; }

    public decimal? GasfinAscc { get; set; }

    public decimal? GasfinAscp { get; set; }

    public decimal? GasfinCit { get; set; }

    public decimal? GasfinPss { get; set; }

    public DateTime? Actidesde { get; set; }

    public DateTime? Actihasta { get; set; }

    public string? Pacen25km { get; set; }

    public string? Pacen50km { get; set; }

    public string? Pacen50km1 { get; set; }

    public string? PrimConsProg25km { get; set; }

    public string? PrimConsProg50km { get; set; }

    public string? PrimConsProg50km1 { get; set; }

    public string? Conssuc25km { get; set; }

    public string? Conssuc50km { get; set; }

    public string? Conssuc50km1 { get; set; }

    public decimal? PradtrmutRadio { get; set; }

    public decimal? Iquirtrmut { get; set; }

    public decimal? Otrpptrmut { get; set; }

    public decimal? PacenArt82 { get; set; }

    public decimal? PrimConsArt82Prog { get; set; }

    public decimal? PradArt82Radio { get; set; }

    public decimal? OppractArt82 { get; set; }

    public decimal? SesrehabArt82 { get; set; }

    public decimal? IquircenArt82 { get; set; }

    public decimal? PaotmutArt12 { get; set; }

    public decimal? PaentgyApart12 { get; set; }

    public decimal? PaotrosArt12 { get; set; }

    public decimal? Panoapant { get; set; }

    public decimal? PrimConsotmutArt12Prog { get; set; }

    public decimal? PrimConentgyApart12Prog { get; set; }

    public decimal? PrimConotrosArt12Prog { get; set; }

    public decimal? PrimConsnoapantProg { get; set; }

    public decimal? ConssucotmutArt12 { get; set; }

    public decimal? ConssucentgyApart12 { get; set; }

    public decimal? ConssucotrosArt12 { get; set; }

    public decimal? Conssucnoapant { get; set; }

    public decimal? SesrehabotmutArt12 { get; set; }

    public decimal? SesrehabentgyApart12 { get; set; }

    public decimal? SesrehabotrosArt12 { get; set; }

    public decimal? Sesrehabnoapant { get; set; }

    public decimal? PradotmutArt12Radio { get; set; }

    public decimal? PradentgyApart12Radio { get; set; }

    public decimal? PradotrosArt12Radio { get; set; }

    public decimal? PradnoapantRadio { get; set; }

    public decimal? IquirotmutArt12 { get; set; }

    public decimal? IquirentgyApart12 { get; set; }

    public decimal? IquirotrosArt12 { get; set; }

    public decimal? Iquirnoapant { get; set; }

    public decimal? OppractotmutArt12 { get; set; }

    public decimal? OppractentgyApart12 { get; set; }

    public decimal? OppractotrosArt12 { get; set; }

    public decimal? Oppractnoapant { get; set; }

    public decimal? PitrmutHos { get; set; }

    public decimal? EsttrmutHos { get; set; }

    public decimal? SesrehabtrmutHos { get; set; }

    public decimal? PradtrmutHosRadio { get; set; }

    public decimal? IquirtrmutHos { get; set; }

    public decimal? OppracttrmutHos { get; set; }

    public decimal? PaurnointrmutHos { get; set; }

    public decimal? PitrmutArt82Hos { get; set; }

    public decimal? EsttrmutArt82Hos { get; set; }

    public decimal? PrmydtrmutArt82Hos { get; set; }

    public decimal? OpptrmutArt82Hos { get; set; }

    public decimal? SrehabtrmutArt82Hos { get; set; }

    public decimal? IquirtrmutArt82Hos { get; set; }

    public decimal? PiotrmutArt12Hos { get; set; }

    public decimal? Piegyapart12Hos { get; set; }

    public decimal? PiotrosArt12Hos { get; set; }

    public decimal? Piotrnoapant { get; set; }

    public decimal? EstotrmutArt12Hos { get; set; }

    public decimal? EstEgyapart12Hos { get; set; }

    public decimal? EstotrosArt12Hos { get; set; }

    public decimal? Estotrnoapant { get; set; }

    public decimal? SrehabotrmutArt12Hos { get; set; }

    public decimal? SrehabEgyapart12Hos { get; set; }

    public decimal? SrehabotrosArt12Hos { get; set; }

    public decimal? SrehabnoapantHos { get; set; }

    public decimal? PradotrmutArt12HosRadio { get; set; }

    public decimal? PradEgyapart12HosRadio { get; set; }

    public decimal? PradotrosArt12HosRadio { get; set; }

    public decimal? PradnoapantHosRadio { get; set; }

    public decimal? IquirotrmutArt12Hos { get; set; }

    public decimal? IquirEgyapart12Hos { get; set; }

    public decimal? IquirotrosArt12Hos { get; set; }

    public decimal? IquirnoapantHos { get; set; }

    public decimal? OppotrmutArt12Hos { get; set; }

    public decimal? OppEgyapart12Hos { get; set; }

    public decimal? OppotrosArt12Hos { get; set; }

    public decimal? OppnoapantHos { get; set; }

    public decimal? PaurniotrmutArt12Hos { get; set; }

    public decimal? PaurniEgyapart12Hos { get; set; }

    public decimal? PaurniotrosArt12Hos { get; set; }

    public decimal? PaurninoapantHos { get; set; }

    public decimal? Nfincreg { get; set; }

    public decimal? SuptotConst { get; set; }

    public DateTime? Fautocom { get; set; }

    public DateTime? Fpufuncio { get; set; }

    public DateTime? Fcalisuf { get; set; }

    public string? Numcamas { get; set; }

    public string? Numquirof { get; set; }

    public string? Hormande { get; set; }

    public string? Hormanha { get; set; }

    public string? Hortardes { get; set; }

    public string? Hortarhas { get; set; }

    public string? Numdiano { get; set; }

    public string? Numdcierre { get; set; }

    public string? Traslado { get; set; }

    public string? TraslNdirec { get; set; }

    public decimal? Pobpr25kmAd { get; set; }

    public decimal? Pobpr50kmAd { get; set; }

    public decimal? Pobprmas50Ad { get; set; }

    public string? Obs25kmAd { get; set; }

    public string? Obs50kmAd { get; set; }

    public string? Obsmas50kmAd { get; set; }

    public decimal? Pobpr25kmCp { get; set; }

    public decimal? Pobpr50kmCp { get; set; }

    public decimal? Pobprmas50Cp { get; set; }

    public decimal? Pobpr25kmItcc { get; set; }

    public decimal? Pobpr50kmItcc { get; set; }

    public decimal? Pobprmas50Itcc { get; set; }

    public string? Obs25km { get; set; }

    public string? Obs50km { get; set; }

    public string? Obsmas50km { get; set; }

    public int? DirectcentroMedNum { get; set; }

    public decimal? DirectcentroMedCoste { get; set; }

    public decimal? DircentroMedHorAscp { get; set; }

    public decimal? DircentroMedHorAscc { get; set; }

    public decimal? DircentroMedHorCit { get; set; }

    public decimal? DircentroMedHorPss { get; set; }

    public decimal? DircentroNomedHorAscp { get; set; }

    public decimal? DircentroNomedHorAscc { get; set; }

    public decimal? DircentroNomedHorCit { get; set; }

    public decimal? DircentroNomedHorPss { get; set; }

    public decimal? DircentroMedHorAg { get; set; }

    public int? Medmedtrabnum { get; set; }

    public decimal? Medmedtrabcoste { get; set; }

    public decimal? MedmedtrabhorAscp { get; set; }

    public decimal? MedmedtrabhorPss { get; set; }

    public decimal? Medespnum { get; set; }

    public decimal? Medespcoste { get; set; }

    public decimal? MedesphorAscp { get; set; }

    public decimal? MedesphorAscc { get; set; }

    public decimal? Restofacnum { get; set; }

    public decimal? Restofaccoste { get; set; }

    public decimal? RestofachorAscp { get; set; }

    public decimal? RestofachorAscc { get; set; }

    public decimal? RestofachorCit { get; set; }

    public decimal? RestofachorPss { get; set; }

    public decimal? Dueyasnum { get; set; }

    public decimal? Dueyascoste { get; set; }

    public decimal? DueyashorAscp { get; set; }

    public decimal? DueyashorAscc { get; set; }

    public decimal? DueyashorPss { get; set; }

    public decimal? Atsyasnum { get; set; }

    public decimal? Atsyascoste { get; set; }

    public decimal? AtsyashorAscp { get; set; }

    public decimal? AtsyashorAscc { get; set; }

    public decimal? AtsyashorPss { get; set; }

    public decimal? Auxclnum { get; set; }

    public decimal? Auxclcoste { get; set; }

    public decimal? AuxclhorAscp { get; set; }

    public decimal? AuxclhorAscc { get; set; }

    public decimal? Operssannum { get; set; }

    public decimal? Opersancoste { get; set; }

    public decimal? OpersanhorAscp { get; set; }

    public decimal? OpersanhorAscc { get; set; }

    public decimal? TprevSnum { get; set; }

    public decimal? TprevScoste { get; set; }

    public decimal? TprevShorPss { get; set; }

    public decimal? TprevMnum { get; set; }

    public decimal? TprevMcoste { get; set; }

    public decimal? TprevMhorPss { get; set; }

    public decimal? TprevBnum { get; set; }

    public decimal? TprevBcoste { get; set; }

    public decimal? TprevBhorPss { get; set; }

    public decimal? DirectcentroNomedNum { get; set; }

    public decimal? DirectcentroNomedCoste { get; set; }

    public decimal? DircentroNomedHorAg { get; set; }

    public decimal? PeradnoAgnum { get; set; }

    public decimal? PeradnoAgcoste { get; set; }

    public decimal? PeradnoAghorAscp { get; set; }

    public decimal? PeradnoAghorAscc { get; set; }

    public decimal? PeradnoAghorCit { get; set; }

    public decimal? PeradnoAghorPss { get; set; }

    public decimal? PeradAgnum { get; set; }

    public decimal? PeradAgcoste { get; set; }

    public decimal? PeradAghorCit { get; set; }

    public decimal? PeradAghorAg { get; set; }

    public decimal? PeradcompAgnum { get; set; }

    public decimal? PeradcompAgcoste { get; set; }

    public decimal? PeradcompAghorAscp { get; set; }

    public decimal? PeradcompAghorAscc { get; set; }

    public decimal? PeradcompAghorCit { get; set; }

    public decimal? PeradcompAghorPss { get; set; }

    public decimal? PeradcompAghorAg { get; set; }

    public decimal? Opersnosantitnum { get; set; }

    public decimal? Opersnosantitcoste { get; set; }

    public decimal? OpersnosantithorAscp { get; set; }

    public decimal? OpersnosantithorAscc { get; set; }

    public decimal? OpersnosantithorCit { get; set; }

    public decimal? OpersnosantithorPss { get; set; }

    public decimal? OpersnosantithorAg { get; set; }

    public decimal? Opersnosannotitnum { get; set; }

    public decimal? Opersnosannotitcoste { get; set; }

    public decimal? OpersnosannotithorAscp { get; set; }

    public decimal? OpersnosannotithorAscc { get; set; }

    public decimal? OpersnosannotithorCit { get; set; }

    public decimal? OpersnosannotithorPss { get; set; }

    public decimal? OpersnosannotithorAg { get; set; }

    public decimal? Medactmednum { get; set; }

    public decimal? Medactmedcoste { get; set; }

    public decimal? GasbienescysAscp { get; set; }

    public decimal? GasbienescysAscc { get; set; }

    public decimal? GasbienescysCit { get; set; }

    public decimal? GasbienescysPss { get; set; }

    public decimal? GasbienescysAg { get; set; }

    public decimal? AmortizAscp { get; set; }

    public decimal? AmortizAscc { get; set; }

    public decimal? AmortizCit { get; set; }

    public decimal? AmortizPss { get; set; }

    public decimal? AmortizAg { get; set; }

    public decimal? Inversnue { get; set; }

    public decimal? Inversrep { get; set; }

    public decimal? Factejerc { get; set; }

    public decimal? Factpendcobro { get; set; }

    public string? OtrasObservac { get; set; }

    public decimal? NumPersAtendTotalTraMut { get; set; }

    public DateTime? Fechaciere { get; set; }

    public string? Sesrehabtrmut { get; set; }

    public decimal? Factejercresto { get; set; }

    public decimal? Factejercsist { get; set; }

    public decimal? FactejerotrmutuasCc { get; set; }

    public decimal? Inversnue2 { get; set; }

    public decimal? Inversrep2 { get; set; }

    public decimal? InversionesNuevas { get; set; }

    public decimal? InversionesReposicion { get; set; }

    public int? Validado { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public DateTime? FechaAlta { get; set; }

    public int? UsuarioAltaId { get; set; }

    public int? UsuarioModificacionId { get; set; }

    public decimal? HorasMedicoDescuento { get; set; }

    public string? Observaciones { get; set; }

    public decimal? Directcentronum { get; set; }

    public decimal? Directcentrocoste { get; set; }

    public decimal? DircentrohorAscp { get; set; }

    public decimal? DircentrohorAscc { get; set; }

    public decimal? DircentrohorCit { get; set; }

    public decimal? DircentrohorPss { get; set; }

    public decimal? DircentrohorAg { get; set; }

    public decimal? Dircentroperssust { get; set; }

    public decimal? Dircentrogastsust { get; set; }

    public decimal? PerssanitArt6Perssust { get; set; }

    public decimal? PerssanitArt6Gastsust { get; set; }

    public decimal? RestperssanitArt6Num { get; set; }

    public decimal? RestperssanitArt6Coste { get; set; }

    public decimal? RestperssanitArt6HorAscp { get; set; }

    public decimal? RestperssanitArt6HorAscc { get; set; }

    public decimal? RestperssanitArt6HorCit { get; set; }

    public decimal? RestperssanitArt6HorPss { get; set; }

    public decimal? RestperssanitArt6HorAg { get; set; }

    public decimal? RestperssanitArt6Perssust { get; set; }

    public decimal? RestperssanitArt6Gastsust { get; set; }

    public decimal? RestperssanitArt6Horassust { get; set; }

    public decimal? PerssanitArt7Num { get; set; }

    public decimal? PerssanitArt7Coste { get; set; }

    public decimal? PerssanitArt7HorAscp { get; set; }

    public decimal? PerssanitArt7HorAscc { get; set; }

    public decimal? PerssanitArt7HorCit { get; set; }

    public decimal? PerssanitArt7HorPss { get; set; }

    public decimal? PerssanitArt7HorAg { get; set; }

    public decimal? PerssanitArt7Perssust { get; set; }

    public decimal? PerssanitArt7Gastsust { get; set; }

    public decimal? PerssanitGradSupNum { get; set; }

    public decimal? PerssanitGradSupCoste { get; set; }

    public decimal? PerssanitGradSupHorAscp { get; set; }

    public decimal? PerssanitGradSupHorAscc { get; set; }

    public decimal? PerssanitGradSupHorCit { get; set; }

    public decimal? PerssanitGradSupHorPss { get; set; }

    public decimal? PerssanitGradSupHorAg { get; set; }

    public decimal? PerssanitGradSupPerssust { get; set; }

    public decimal? PerssanitGradSupGastsust { get; set; }

    public decimal? PerssanitGradMedNum { get; set; }

    public decimal? PerssanitGradMedCoste { get; set; }

    public decimal? PerssanitGradMedHorAscp { get; set; }

    public decimal? PerssanitGradMedHorAscc { get; set; }

    public decimal? PerssanitGradMedHorCit { get; set; }

    public decimal? PerssanitGradMedHorPss { get; set; }

    public decimal? PerssanitGradMedHorAg { get; set; }

    public decimal? PerssanitGradMedPerssust { get; set; }

    public decimal? PerssanitGradMedGastsust { get; set; }

    public decimal? RestoPersAdminNum { get; set; }

    public decimal? RestoPersAdminCoste { get; set; }

    public decimal? RestoPersAdminHorAscp { get; set; }

    public decimal? RestoPersAdminHorAscc { get; set; }

    public decimal? RestoPersAdminHorCit { get; set; }

    public decimal? RestoPersAdminHorPss { get; set; }

    public decimal? RestoPersAdminHorAg { get; set; }

    public decimal? RestoPersAdminPerssust { get; set; }

    public decimal? RestoPersAdminGastsust { get; set; }

    public decimal? RestoPersNoAdminNum { get; set; }

    public decimal? RestoPersNoAdminCoste { get; set; }

    public decimal? RestoPersNoAdminHorAscp { get; set; }

    public decimal? RestoPersNoAdminHorAscc { get; set; }

    public decimal? RestoPersNoAdminHorCit { get; set; }

    public decimal? RestoPersNoAdminHorPss { get; set; }

    public decimal? RestoPersNoAdminHorAg { get; set; }

    public decimal? RestoPersNoAdminPerssust { get; set; }

    public decimal? RestoPersNoAdminGastsust { get; set; }

    public string? PrimConsProgVideo25km { get; set; }

    public string? PrimConsProgVideo50km { get; set; }

    public string? PrimConsProgVideo50km1 { get; set; }

    public decimal? PrimConsNoProg25km { get; set; }

    public decimal? PrimConsNoProg50km { get; set; }

    public decimal? PrimConsNoProg50km1 { get; set; }

    public decimal? PrimConsNoProgVideo25km { get; set; }

    public decimal? PrimConsNoProgVideo50km { get; set; }

    public decimal? PrimConsNoProgVideo50km1 { get; set; }

    public string? Conssuc25kmVideo { get; set; }

    public string? Conssuc50kmVideo { get; set; }

    public string? Conssuc50kmVideo1 { get; set; }

    public decimal? ConsEnftrmut { get; set; }

    public decimal? PradtrmutRm { get; set; }

    public decimal? PradtrmutEco { get; set; }

    public decimal? PradtrmutTac { get; set; }

    public decimal? PruBiomtrmut { get; set; }

    public decimal? PrimConsArt82ProgVideo { get; set; }

    public decimal? PrimConsArt82NoProg { get; set; }

    public decimal? PrimConsArt82NoProgVideo { get; set; }

    public decimal? ConssucArt82 { get; set; }

    public decimal? ConssucArt82Video { get; set; }

    public decimal? ConsEnfArt82 { get; set; }

    public decimal? PradArt82Rm { get; set; }

    public decimal? PradArt82Eco { get; set; }

    public decimal? PradArt82Tac { get; set; }

    public decimal? PruBiomArt82 { get; set; }

    public decimal? PrimConsotmutArt12ProgVideo { get; set; }

    public decimal? PrimConentgyApart12ProgVideo { get; set; }

    public decimal? PrimConotrosArt12ProgVideo { get; set; }

    public decimal? PrimConotmutArt12NoProg { get; set; }

    public decimal? PrimConentgyApart12NoProg { get; set; }

    public decimal? PrimConotrosArt12NoProg { get; set; }

    public decimal? PrimConotmutArt12NoProgVideo { get; set; }

    public decimal? PrimConentgyApart12NoProgVideo { get; set; }

    public decimal? PrimConotrosArt12NoProgVideo { get; set; }

    public decimal? ConsEnfotmutArt12 { get; set; }

    public decimal? ConsEnfentgyApart12 { get; set; }

    public decimal? ConsEnfotrosArt12 { get; set; }

    public decimal? PradotmutArt12Rm { get; set; }

    public decimal? PradentgyApart12Rm { get; set; }

    public decimal? PradotrosArt12Rm { get; set; }

    public decimal? PradotmutArt12Eco { get; set; }

    public decimal? PradentgyApart12Eco { get; set; }

    public decimal? PradotrosArt12Eco { get; set; }

    public decimal? PradotmutArt12Tac { get; set; }

    public decimal? PradentgyApart12Tac { get; set; }

    public decimal? PradotrosArt12Tac { get; set; }

    public decimal? PruBiomotmutArt12 { get; set; }

    public decimal? PruBiomentgyApart12 { get; set; }

    public decimal? PruBiomotrosArt12 { get; set; }

    public decimal? PrimConsnoapantProgVideo { get; set; }

    public decimal? PrimConsnoapantNoProg { get; set; }

    public decimal? PrimConsnoapantNoProgVideo { get; set; }

    public decimal? ConssucnoapantVideo { get; set; }

    public decimal? ConsEnfnoapant { get; set; }

    public decimal? PradnoapantRm { get; set; }

    public decimal? PradnoapantEco { get; set; }

    public decimal? PradnoapantTac { get; set; }

    public decimal? PruBiomnoapant { get; set; }

    public decimal? PacenConvSectBilMult { get; set; }

    public decimal? PrimConsConvSectBilMultProg { get; set; }

    public decimal? PrimConsConvSectBilMultProgVideo { get; set; }

    public decimal? PrimConsConvSectBilMultNoProg { get; set; }

    public decimal? PrimConsConvSectBilMultNoProgVideo { get; set; }

    public decimal? ConssucConvSectBilMult { get; set; }

    public decimal? ConssucConvSectBilMultVideo { get; set; }

    public decimal? SesrehabConvSectBilMult { get; set; }

    public decimal? ConsEnfConvSectBilMult { get; set; }

    public decimal? PradConvSectBilMultRm { get; set; }

    public decimal? PradConvSectBilMultEco { get; set; }

    public decimal? PradConvSectBilMultTac { get; set; }

    public decimal? PradConvSectBilMultRadio { get; set; }

    public decimal? IquircenConvSectBilMult { get; set; }

    public decimal? OppractConvSectBilMult { get; set; }

    public decimal? PruBiomConvSectBilMult { get; set; }

    public decimal? PrimConsHosProg { get; set; }

    public decimal? PrimConsHosProgVideo { get; set; }

    public decimal? PrimConsHosNoProg { get; set; }

    public decimal? PrimConsHosNoProgVideo { get; set; }

    public decimal? ConssucHos { get; set; }

    public decimal? ConssucHosVideo { get; set; }

    public decimal? ConsEnfHos { get; set; }

    public decimal? PradtrmutHosRm { get; set; }

    public decimal? PradtrmutHosEco { get; set; }

    public decimal? PradtrmutHosTac { get; set; }

    public decimal? PruBiomHos { get; set; }

    public decimal? PrimConsArt82HosProg { get; set; }

    public decimal? PrimConsArt82HosProgVideo { get; set; }

    public decimal? PrimConsArt82HosNoProg { get; set; }

    public decimal? PrimConsArt82HosNoProgVideo { get; set; }

    public decimal? ConssucArt82Hos { get; set; }

    public decimal? ConssucArt82HosVideo { get; set; }

    public decimal? ConsEnfArt82Hos { get; set; }

    public decimal? PrmydtrmutArt82HosRm { get; set; }

    public decimal? PrmydtrmutArt82HosEco { get; set; }

    public decimal? PrmydtrmutArt82HosTac { get; set; }

    public decimal? PrmydtrmutArt82HosRadio { get; set; }

    public decimal? PrueBiomArt82Hos { get; set; }

    public decimal? PaurgNoIngrArt82Hos { get; set; }

    public decimal? PrimConsotrmutArt12HosProg { get; set; }

    public decimal? PrimConsEgyapart12HosProg { get; set; }

    public decimal? PrimConsotrosArt12HosProg { get; set; }

    public decimal? PrimConsotrmutArt12HosProgVideo { get; set; }

    public decimal? PrimConsEgyapart12HosProgVideo { get; set; }

    public decimal? PrimConsotrosArt12HosProgVideo { get; set; }

    public decimal? PrimConsotrmutArt12HosNoProg { get; set; }

    public decimal? PrimConsEgyapart12HosNoProg { get; set; }

    public decimal? PrimConsotrosArt12HosNoProg { get; set; }

    public decimal? PrimConsotrmutArt12HosNoProgVideo { get; set; }

    public decimal? PrimConsEgyapart12HosNoProgVideo { get; set; }

    public decimal? PrimConsotrosArt12HosNoProgVideo { get; set; }

    public decimal? ConssucotrmutArt12Hos { get; set; }

    public decimal? ConssucEgyapart12Hos { get; set; }

    public decimal? ConssucotrosArt12Hos { get; set; }

    public decimal? ConssucotrmutArt12HosVideo { get; set; }

    public decimal? ConssucEgyapart12HosVideo { get; set; }

    public decimal? ConssucotrosArt12HosVideo { get; set; }

    public decimal? ConsEnfotrmutArt12Hos { get; set; }

    public decimal? ConsEnfEgyapart12Hos { get; set; }

    public decimal? ConsEnfotrosArt12Hos { get; set; }

    public decimal? PradotrmutArt12HosRm { get; set; }

    public decimal? PradEgyapart12HosRm { get; set; }

    public decimal? PradotrosArt12HosRm { get; set; }

    public decimal? PradotrmutArt12HosEco { get; set; }

    public decimal? PradEgyapart12HosEco { get; set; }

    public decimal? PradotrosArt12HosEco { get; set; }

    public decimal? PradotrmutArt12HosTac { get; set; }

    public decimal? PradEgyapart12HosTac { get; set; }

    public decimal? PradotrosArt12HosTac { get; set; }

    public decimal? PruBiomotrmutArt12Hos { get; set; }

    public decimal? PruBiomEgyapart12Hos { get; set; }

    public decimal? PruBiomotrosArt12Hos { get; set; }

    public decimal? PrimConsotrnoapantProg { get; set; }

    public decimal? PrimConsotrnoapantProgVideo { get; set; }

    public decimal? PrimConsotrnoapantNoProg { get; set; }

    public decimal? PrimConsotrnoapantNoProgVideo { get; set; }

    public decimal? Conssucotrnoapant { get; set; }

    public decimal? ConssucotrnoapantVideo { get; set; }

    public decimal? ConsEnfnoapantHos { get; set; }

    public decimal? PradnoapantHosRm { get; set; }

    public decimal? PradnoapantHosEco { get; set; }

    public decimal? PradnoapantHosTac { get; set; }

    public decimal? PruBiomnoapantHos { get; set; }

    public decimal? PitrmutConvSecBilMultHos { get; set; }

    public decimal? EsttrmutConvSecBilMultHos { get; set; }

    public decimal? PrimConsConvSecBilMultHosProg { get; set; }

    public decimal? PrimConsConvSecBilMultHosProgVideo { get; set; }

    public decimal? PrimConsConvSecBilMultHosNoProg { get; set; }

    public decimal? PrimConsConvSecBilMultHosNoProgVideo { get; set; }

    public decimal? ConssucConvSecBilMultHos { get; set; }

    public decimal? ConssucConvSecBilMultHosVideo { get; set; }

    public decimal? SrehabtrmutConvSecBilMultHos { get; set; }

    public decimal? ConsEnfConvSecBilMultHos { get; set; }

    public decimal? PrmydtrmutConvSecBilMultHosRm { get; set; }

    public decimal? PrmydtrmutConvSecBilMultHosEco { get; set; }

    public decimal? PrmydtrmutConvSecBilMultHosTac { get; set; }

    public decimal? PrmydtrmutConvSecBilMultHosRadio { get; set; }

    public decimal? IquirtrmutConvSecBilMultHos { get; set; }

    public decimal? OpptrmutConvSecBilMultHos { get; set; }

    public decimal? PrueBiomConvSecBilMultHos { get; set; }

    public decimal? PaurgNoIngrConvSecBilMultHos { get; set; }

    public string? HorarioA { get; set; }

    public string? HorarioDe { get; set; }

    public int? TipoHorario { get; set; }

    public decimal? PerssanitArt6Num { get; set; }

    public decimal? PerssanitArt6Coste { get; set; }

    public decimal? PerssanitArt6HorAscp { get; set; }

    public decimal? PerssanitArt6HorAscc { get; set; }

    public decimal? PerssanitArt6HorCit { get; set; }

    public decimal? PerssanitArt6HorPss { get; set; }

    public decimal? PerssanitArt6HorAg { get; set; }

    public decimal? FactejerotrmutuasCp { get; set; }

    public decimal? ConssucotmutArt12Video { get; set; }

    public decimal? ConssucentgyApart12Video { get; set; }

    public decimal? ConssucotrosArt12Video { get; set; }

    public decimal? MutuaActosQuirurgicas { get; set; }

    public decimal? MutuaActosPracticadas { get; set; }

    public decimal? PersSanitMedArt6NumPers { get; set; }

    public decimal? PersSanitMedArt6GastPers { get; set; }

    public decimal? PersSanitMedArt6HorasCp { get; set; }

    public decimal? PersSanitMedArt6HorasCc { get; set; }

    public decimal? PersSanitMedArt6HorasIt { get; set; }

    public decimal? PersSanitMedArt6HorasAtep { get; set; }

    public decimal? PersSanitMedArt6HorasAgm { get; set; }

    public decimal? PersSanitMedArt6NumPersSustInt { get; set; }

    public decimal? PersSanitMedArt6GastPersSustInt { get; set; }

    public decimal? PersSanitMedArt6HorasPersSustInt { get; set; }

    public decimal? PersSanitMedEspArt6NumPers { get; set; }

    public decimal? PersSanitMedEspArt6GastPers { get; set; }

    public decimal? PersSanitMedEspArt6HorasCp { get; set; }

    public decimal? PersSanitMedEspArt6HorasCc { get; set; }

    public decimal? PersSanitMedEspArt6HorasIt { get; set; }

    public decimal? PersSanitMedEspArt6HorasAtep { get; set; }

    public decimal? PersSanitMedEspArt6HorasAgm { get; set; }

    public decimal? PersSanitMedEspArt6NumPersSustInt { get; set; }

    public decimal? PersSanitMedEspArt6GastPersSustInt { get; set; }

    public decimal? PersSanitMedEspArt6HorasPersSustInt { get; set; }

    public decimal? PersSanitMedGesArt6NumPers { get; set; }

    public decimal? PersSanitMedGesArt6GastPers { get; set; }

    public decimal? PersSanitMedGesArt6HorasCp { get; set; }

    public decimal? PersSanitMedGesArt6HorasCc { get; set; }

    public decimal? PersSanitMedGesArt6HorasIt { get; set; }

    public decimal? PersSanitMedGesArt6HorasAtep { get; set; }

    public decimal? PersSanitMedGesArt6HorasAgm { get; set; }

    public decimal? PersSanitMedGesArt6NumPersSustInt { get; set; }

    public decimal? PersSanitMedGesArt6GastPersSustInt { get; set; }

    public decimal? PersSanitMedGesArt6HorasPersSustInt { get; set; }

    public decimal? PersSanitArt7DuenumPers { get; set; }

    public decimal? PersSanitArt7DuegastPers { get; set; }

    public decimal? PersSanitArt7DuehorasCp { get; set; }

    public decimal? PersSanitArt7DuehorasCc { get; set; }

    public decimal? PersSanitArt7DuehorasIt { get; set; }

    public decimal? PersSanitArt7DuehorasAtep { get; set; }

    public decimal? PersSanitArt7DuehorasAgm { get; set; }

    public decimal? PersSanitArt7DuenumPersSustInt { get; set; }

    public decimal? PersSanitArt7DuegastPersSustInt { get; set; }

    public decimal? PersSanitArt7DuehorasPersSustInt { get; set; }

    public decimal? PersSanitArt7FisNumPers { get; set; }

    public decimal? PersSanitArt7FisGastPers { get; set; }

    public decimal? PersSanitArt7FisHorasCp { get; set; }

    public decimal? PersSanitArt7FisHorasCc { get; set; }

    public decimal? PersSanitArt7FisHorasIt { get; set; }

    public decimal? PersSanitArt7FisHorasAtep { get; set; }

    public decimal? PersSanitArt7FisHorasAgm { get; set; }

    public decimal? PersSanitArt7FisNumPersSustInt { get; set; }

    public decimal? PersSanitArt7FisGastPersSustInt { get; set; }

    public decimal? PersSanitArt7FisHorasPersSustInt { get; set; }

    public decimal? PersSanitArt7PsicoNumPers { get; set; }

    public decimal? PersSanitArt7PsicoGastPers { get; set; }

    public decimal? PersSanitArt7PsicoHorasCp { get; set; }

    public decimal? PersSanitArt7PsicoHorasCc { get; set; }

    public decimal? PersSanitArt7PsicoHorasIt { get; set; }

    public decimal? PersSanitArt7PsicoHorasAtep { get; set; }

    public decimal? PersSanitArt7PsicoHorasAgm { get; set; }

    public decimal? PersSanitArt7PsicoNumPersSustInt { get; set; }

    public decimal? PersSanitArt7PsicoGastPersSustInt { get; set; }

    public decimal? PersSanitArt7PsicoHorasPersSustInt { get; set; }

    public decimal? PersSanitArt7TrSocNumPers { get; set; }

    public decimal? PersSanitArt7TrSocGastPers { get; set; }

    public decimal? PersSanitArt7TrSocHorasCp { get; set; }

    public decimal? PersSanitArt7TrSocHorasCc { get; set; }

    public decimal? PersSanitArt7TrSocHorasIt { get; set; }

    public decimal? PersSanitArt7TrSocHorasAtep { get; set; }

    public decimal? PersSanitArt7TrSocHorasAgm { get; set; }

    public decimal? PersSanitArt7TrSocNumPersSustInt { get; set; }

    public decimal? PersSanitArt7TrSocGastPersSustInt { get; set; }

    public decimal? PersSanitArt7TrSocHorasPersSustInt { get; set; }

    public decimal? PersSanitArt7TerOcuNumPers { get; set; }

    public decimal? PersSanitArt7TerOcuGastPers { get; set; }

    public decimal? PersSanitArt7TerOcuHorasCp { get; set; }

    public decimal? PersSanitArt7TerOcuHorasCc { get; set; }

    public decimal? PersSanitArt7TerOcuHorasIt { get; set; }

    public decimal? PersSanitArt7TerOcuHorasAtep { get; set; }

    public decimal? PersSanitArt7TerOcuHorasAgm { get; set; }

    public decimal? PersSanitArt7TerOcuNumPersSustInt { get; set; }

    public decimal? PersSanitArt7TerOcuGastPersSustInt { get; set; }

    public decimal? PersSanitArt7TerOcuHorasPersSustInt { get; set; }

    public decimal? PersSanitArt7TecRxnumPers { get; set; }

    public decimal? PersSanitArt7TecRxgastPers { get; set; }

    public decimal? PersSanitArt7TecRxhorasCp { get; set; }

    public decimal? PersSanitArt7TecRxhorasCc { get; set; }

    public decimal? PersSanitArt7TecRxhorasIt { get; set; }

    public decimal? PersSanitArt7TecRxhorasAtep { get; set; }

    public decimal? PersSanitArt7TecRxhorasAgm { get; set; }

    public decimal? PersSanitArt7TecRxnumPersSustInt { get; set; }

    public decimal? PersSanitArt7TecRxgastPersSustInt { get; set; }

    public decimal? PersSanitArt7TecRxhorasPersSustInt { get; set; }

    public decimal? PersSanitArt7RestNumPers { get; set; }

    public decimal? PersSanitArt7RestGastPers { get; set; }

    public decimal? PersSanitArt7RestHorasCp { get; set; }

    public decimal? PersSanitArt7RestHorasCc { get; set; }

    public decimal? PersSanitArt7RestHorasIt { get; set; }

    public decimal? PersSanitArt7RestHorasAtep { get; set; }

    public decimal? PersSanitArt7RestHorasAgm { get; set; }

    public decimal? PersSanitArt7RestNumPersSustInt { get; set; }

    public decimal? PersSanitArt7RestGastPersSustInt { get; set; }

    public decimal? PersSanitArt7RestHorasPersSustInt { get; set; }

    public decimal? PersSanitGradSupNumPers { get; set; }

    public decimal? PersSanitGradSupGastPers { get; set; }

    public decimal? PersSanitGradSupHorasCp { get; set; }

    public decimal? PersSanitGradSupHorasCc { get; set; }

    public decimal? PersSanitGradSupHorasIt { get; set; }

    public decimal? PersSanitGradSupHorasAtep { get; set; }

    public decimal? PersSanitGradSupHorasAgm { get; set; }

    public decimal? PersSanitGradSupNumPersSustInt { get; set; }

    public decimal? PersSanitGradSupGastPersSustInt { get; set; }

    public decimal? PersSanitGradSupHorasPersSustInt { get; set; }

    public decimal? PersSanitGradMedAuxEnfNumPers { get; set; }

    public decimal? PersSanitGradMedAuxEnfGastPers { get; set; }

    public decimal? PersSanitGradMedAuxEnfHorasCp { get; set; }

    public decimal? PersSanitGradMedAuxEnfHorasCc { get; set; }

    public decimal? PersSanitGradMedAuxEnfHorasIt { get; set; }

    public decimal? PersSanitGradMedAuxEnfHorasAtep { get; set; }

    public decimal? PersSanitGradMedAuxEnfHorasAgm { get; set; }

    public decimal? PersSanitGradMedAuxEnfNumPersSustInt { get; set; }

    public decimal? PersSanitGradMedAuxEnfGastPersSustInt { get; set; }

    public decimal? PersSanitGradMedAuxEnfHorasPersSustInt { get; set; }

    public decimal? PersSanitGradMedRestNumPers { get; set; }

    public decimal? PersSanitGradMedRestGastPers { get; set; }

    public decimal? PersSanitGradMedRestHorasCp { get; set; }

    public decimal? PersSanitGradMedRestHorasCc { get; set; }

    public decimal? PersSanitGradMedRestHorasIt { get; set; }

    public decimal? PersSanitGradMedRestHorasAtep { get; set; }

    public decimal? PersSanitGradMedRestHorasAgm { get; set; }

    public decimal? PersSanitGradMedRestNumPersSustInt { get; set; }

    public decimal? PersSanitGradMedRestGastPersSustInt { get; set; }

    public decimal? PersSanitGradMedRestHorasPersSustInt { get; set; }

    public decimal? RestPersSanitNumPers { get; set; }

    public decimal? RestPersSanitGastPers { get; set; }

    public decimal? RestPersSanitHorasCp { get; set; }

    public decimal? RestPersSanitHorasCc { get; set; }

    public decimal? RestPersSanitHorasIt { get; set; }

    public decimal? RestPersSanitHorasAtep { get; set; }

    public decimal? RestPersSanitHorasAgm { get; set; }

    public decimal? RestPersSanitNumPersSustInt { get; set; }

    public decimal? RestPersSanitGastPersSustInt { get; set; }

    public decimal? RestPersSanitHorasPersSustInt { get; set; }

    public decimal? PersDirCenNumPers { get; set; }

    public decimal? PersDirCenGastPers { get; set; }

    public decimal? PersDirCenHorasCp { get; set; }

    public decimal? PersDirCenHorasCc { get; set; }

    public decimal? PersDirCenHorasIt { get; set; }

    public decimal? PersDirCenHorasAtep { get; set; }

    public decimal? PersDirCenHorasAgm { get; set; }

    public decimal? PersDirCenNumPersSustInt { get; set; }

    public decimal? PersDirCenGastPersSustInt { get; set; }

    public decimal? PersDirCenHorasPersSustInt { get; set; }

    public decimal? PersAdminNumPers { get; set; }

    public decimal? PersAdminGastPers { get; set; }

    public decimal? PersAdminHorasCp { get; set; }

    public decimal? PersAdminHorasCc { get; set; }

    public decimal? PersAdminHorasIt { get; set; }

    public decimal? PersAdminHorasAtep { get; set; }

    public decimal? PersAdminHorasAgm { get; set; }

    public decimal? PersAdminNumPersSustInt { get; set; }

    public decimal? PersAdminGastPersSustInt { get; set; }

    public decimal? PersAdminHorasPersSustInt { get; set; }

    public decimal? PersTecPreNumPers { get; set; }

    public decimal? PersTecPreGastPers { get; set; }

    public decimal? PersTecPreHorasCp { get; set; }

    public decimal? PersTecPreHorasCc { get; set; }

    public decimal? PersTecPreHorasIt { get; set; }

    public decimal? PersTecPreHorasAtep { get; set; }

    public decimal? PersTecPreHorasAgm { get; set; }

    public decimal? PersTecPreNumPersSustInt { get; set; }

    public decimal? PersTecPreGastPersSustInt { get; set; }

    public decimal? PersTecPreHorasPersSustInt { get; set; }

    public decimal? PersNoAdminNumPers { get; set; }

    public decimal? PersNoAdminGastPers { get; set; }

    public decimal? PersNoAdminHorasCp { get; set; }

    public decimal? PersNoAdminHorasCc { get; set; }

    public decimal? PersNoAdminHorasIt { get; set; }

    public decimal? PersNoAdminHorasAtep { get; set; }

    public decimal? PersNoAdminHorasAgm { get; set; }

    public decimal? PersNoAdminNumPersSustInt { get; set; }

    public decimal? PersNoAdminGastPersSustInt { get; set; }

    public decimal? PersNoAdminHorasPersSustInt { get; set; }
}
