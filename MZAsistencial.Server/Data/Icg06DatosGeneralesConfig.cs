using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MZAsistencial.Server.Models.ICG06;

namespace MZAsistencial.Server.Data.Configurations;

public class Icg06DatosGeneralesConfig : IEntityTypeConfiguration<Icg06DatosGenerales>
{
    public void Configure(EntityTypeBuilder<Icg06DatosGenerales> b)
    {
        b.ToTable("Icg06DatosGenerales");
        b.HasKey(x => x.Id);
        b.Property(x => x.SuptotConst).HasPrecision(18, 2);
        b.Property(x => x.OtrasObservac).HasMaxLength(2000);

        // Un único registro de DatosGenerales por ICG06
        b.HasIndex(x => x.Icg06Id).IsUnique();
    }
}
