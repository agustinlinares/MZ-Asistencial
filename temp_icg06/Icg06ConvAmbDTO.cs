namespace MZAsistencial.Server.DTOs
{
    public class Icg06ConvAmbDTO
    {
        public int IdIcg    { get; set; }
        public int Año      { get; set; }
        public int CentroId { get; set; }

        public decimal? PacenConvSectBilMult              { get; set; }
        public decimal? PrimConsConvSectBilMultProg        { get; set; }
        public decimal? PrimConsConvSectBilMultProgVideo   { get; set; }
        public decimal? PrimConsConvSectBilMultNoProg      { get; set; }
        public decimal? PrimConsConvSectBilMultNoProgVideo { get; set; }
        public decimal? ConssucConvSectBilMult             { get; set; }
        public decimal? ConssucConvSectBilMultVideo        { get; set; }
        public decimal? SesrehabConvSectBilMult            { get; set; }
        public decimal? ConsEnfConvSectBilMult             { get; set; }
        public decimal? PradConvSectBilMultRm              { get; set; }
        public decimal? PradConvSectBilMultEco             { get; set; }
        public decimal? PradConvSectBilMultTac             { get; set; }
        public decimal? PradConvSectBilMultRadio           { get; set; }
        public decimal? IquircenConvSectBilMult            { get; set; }
        public decimal? OppractConvSectBilMult             { get; set; }
        public decimal? PruBiomConvSectBilMult             { get; set; }
    }
}
