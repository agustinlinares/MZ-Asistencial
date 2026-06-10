using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Models;

public partial class MzasistencialContext : DbContext
{
    public MzasistencialContext(DbContextOptions<MzasistencialContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CentrosPropio> CentrosPropios { get; set; }
    public virtual DbSet<MutuasPresupuesto> MutuasPresupuesto { get; set; }
    public virtual DbSet<Usuario> Usuarios { get; set; }
    public virtual DbSet<RegistroErrore> RegistroErrores { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CentrosPropio>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroCesionarioId).HasColumnName("CentroCesionario_id");
            entity.Property(e => e.CentroId)
                .ValueGeneratedOnAdd()
                .HasColumnName("Centro_id");
            entity.Property(e => e.CentroIdNuevo).HasColumnName("Centro_idNuevo");
            entity.Property(e => e.Cifnif)
                .HasMaxLength(15)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CIFNIF");
            entity.Property(e => e.CodigoMz)
                .HasMaxLength(50)
                .HasColumnName("CodigoMZ");
            entity.Property(e => e.Cp)
                .HasMaxLength(5)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CP");
            entity.Property(e => e.Direccion)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.DireccionElectronica)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.DireccionGis)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DireccionGIS");
            entity.Property(e => e.Fautocom).HasColumnType("datetime");
            entity.Property(e => e.Fax)
                .HasMaxLength(15)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Fcalisuf).HasColumnType("datetime");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaBaja).HasColumnType("datetime");
            entity.Property(e => e.FechaCarga).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.Fpufuncio).HasColumnType("datetime");
            entity.Property(e => e.Latitud).HasMaxLength(50);
            entity.Property(e => e.Localizador).HasMaxLength(50);
            entity.Property(e => e.Longitud).HasMaxLength(50);
            entity.Property(e => e.MotivoBaja).HasMaxLength(500);
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Numero).HasMaxLength(50);
            entity.Property(e => e.Observaciones)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.OtrosDatos).HasMaxLength(255);
            entity.Property(e => e.PersonaContacto)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Piso).HasMaxLength(15);
            entity.Property(e => e.PoblacionId).HasColumnName("Poblacion_id");
            entity.Property(e => e.Puerta).HasMaxLength(15);
            entity.Property(e => e.Telefono)
                .HasMaxLength(15)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.TipoViaId).HasColumnName("TipoVia_id");
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.UsuarioBajaId).HasColumnName("UsuarioBaja_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
