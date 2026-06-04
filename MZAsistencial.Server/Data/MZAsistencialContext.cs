using System;
using System.Collections.Generic;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Data;

public partial class MZAsistencialContext : DbContext
{
    public MZAsistencialContext()
    {
    }

    public MZAsistencialContext(DbContextOptions<MZAsistencialContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AccesosUsuario> AccesosUsuarios { get; set; }

    public virtual DbSet<AccessActividadAsistencialA> AccessActividadAsistencialAs { get; set; }

    public virtual DbSet<AccessActividadAsistencialH> AccessActividadAsistencialHs { get; set; }

    public virtual DbSet<AccessConciertosNc> AccessConciertosNcs { get; set; }

    public virtual DbSet<AccessConciertosNv> AccessConciertosNvs { get; set; }

    public virtual DbSet<AccessConciertosV> AccessConciertosVs { get; set; }

    public virtual DbSet<AccessDatosGenerale> AccessDatosGenerales { get; set; }

    public virtual DbSet<AccessFincasRegistrale> AccessFincasRegistrales { get; set; }

    public virtual DbSet<AccessIdentificacionCentro> AccessIdentificacionCentros { get; set; }

    public virtual DbSet<AuxAgrupacionConcierto> AuxAgrupacionConciertos { get; set; }

    public virtual DbSet<AuxAmbitosCobertura> AuxAmbitosCoberturas { get; set; }

    public virtual DbSet<AuxArea> AuxAreas { get; set; }

    public virtual DbSet<AuxCitacionMovimiento> AuxCitacionMovimientos { get; set; }

    public virtual DbSet<AuxDescripcionesSeguimiento> AuxDescripcionesSeguimientos { get; set; }

    public virtual DbSet<AuxEspecialidade> AuxEspecialidades { get; set; }

    public virtual DbSet<AuxEstadosCitacion> AuxEstadosCitacions { get; set; }

    public virtual DbSet<AuxEstadosDemandum> AuxEstadosDemanda { get; set; }

    public virtual DbSet<AuxEstadosInformesIcg> AuxEstadosInformesIcgs { get; set; }

    public virtual DbSet<AuxFichasSistema> AuxFichasSistemas { get; set; }

    public virtual DbSet<AuxIconosMutua> AuxIconosMutuas { get; set; }

    public virtual DbSet<AuxInformesAcuerdo> AuxInformesAcuerdos { get; set; }

    public virtual DbSet<AuxMese> AuxMeses { get; set; }

    public virtual DbSet<AuxPoblacione> AuxPoblaciones { get; set; }

    public virtual DbSet<AuxPoblacionesCodPostale> AuxPoblacionesCodPostales { get; set; }

    public virtual DbSet<AuxProvincia> AuxProvincias { get; set; }

    public virtual DbSet<AuxServicio> AuxServicios { get; set; }

    public virtual DbSet<AuxSesionUsuario> AuxSesionUsuarios { get; set; }

    public virtual DbSet<AuxTipoAnulacion> AuxTipoAnulacions { get; set; }

    public virtual DbSet<AuxTipoFinca> AuxTipoFincas { get; set; }

    public virtual DbSet<AuxTipoRechazo> AuxTipoRechazos { get; set; }

    public virtual DbSet<AuxTipoServicio> AuxTipoServicios { get; set; }

    public virtual DbSet<AuxTiposAcreditacion> AuxTiposAcreditacions { get; set; }

    public virtual DbSet<AuxTiposDemandum> AuxTiposDemanda { get; set; }

    public virtual DbSet<AuxTiposSeguimiento> AuxTiposSeguimientos { get; set; }

    public virtual DbSet<Ccaa> Ccaas { get; set; }

    public virtual DbSet<CentrosConcertado> CentrosConcertados { get; set; }

    public virtual DbSet<CentrosEspecialidade> CentrosEspecialidades { get; set; }

    public virtual DbSet<CentrosPropio> CentrosPropios { get; set; }

    public virtual DbSet<CentrosPropiosCatalogoServicio> CentrosPropiosCatalogoServicios { get; set; }

    public virtual DbSet<CentrosPropiosEspecialidade> CentrosPropiosEspecialidades { get; set; }

    public virtual DbSet<CitacionDocumentacion> CitacionDocumentacions { get; set; }

    public virtual DbSet<Citacione> Citaciones { get; set; }

    public virtual DbSet<CodigosCiep> CodigosCieps { get; set; }

    public virtual DbSet<Concierto> Conciertos { get; set; }

    public virtual DbSet<ConciertosAmbitoCobertura> ConciertosAmbitoCoberturas { get; set; }

    public virtual DbSet<ConciertosDocumento> ConciertosDocumentos { get; set; }

    public virtual DbSet<ConciertosEspecialidade> ConciertosEspecialidades { get; set; }

    public virtual DbSet<ConfiguracionAdministracion> ConfiguracionAdministracions { get; set; }

    public virtual DbSet<Delegacione> Delegaciones { get; set; }

    public virtual DbSet<Demanda> Demandas { get; set; }

    public virtual DbSet<DemandasDocumentacion> DemandasDocumentacions { get; set; }

    public virtual DbSet<DemandasSubSol> DemandasSubSols { get; set; }

    public virtual DbSet<Descuadre> Descuadres { get; set; }

    public virtual DbSet<DisponibilidadCentrosPropio> DisponibilidadCentrosPropios { get; set; }

    public virtual DbSet<Ejercicio> Ejercicios { get; set; }

    public virtual DbSet<Fichero> Ficheros { get; set; }

    public virtual DbSet<FicherosAcreditacionesInforme> FicherosAcreditacionesInformes { get; set; }

    public virtual DbSet<FicherosGenerado> FicherosGenerados { get; set; }

    public virtual DbSet<FincasRegistrale> FincasRegistrales { get; set; }

    public virtual DbSet<FincasRegistralesCostesPorAño> FincasRegistralesCostesPorAños { get; set; }

    public virtual DbSet<HistoricoCatalogoCompletoServicio> HistoricoCatalogoCompletoServicios { get; set; }

    public virtual DbSet<HistoricoCentrosPropiosEspecialidade> HistoricoCentrosPropiosEspecialidades { get; set; }

    public virtual DbSet<Icg06> Icg06s { get; set; }
    public virtual DbSet<Icg06Especialidad> Icg06Especialidades { get; set; }

    public virtual DbSet<Icg07> Icg07s { get; set; }

    public virtual DbSet<IcgConcierto> IcgConciertos { get; set; }

    public virtual DbSet<Informe> Informes { get; set; }

    public virtual DbSet<InformesAcuerdo> InformesAcuerdos { get; set; }

    public virtual DbSet<InformesDireccionAgrupado> InformesDireccionAgrupados { get; set; }

    public virtual DbSet<InformesIcg> InformesIcgs { get; set; }

    public virtual DbSet<Motivo> Motivos { get; set; }

    public virtual DbSet<Mutua> Mutuas { get; set; }

    public virtual DbSet<MutuasBm> MutuasBms { get; set; }

    public virtual DbSet<MutuasPresupuesto> MutuasPresupuestos { get; set; }

    public virtual DbSet<Oferta> Ofertas { get; set; }

    public virtual DbSet<Perfile> Perfiles { get; set; }

    public virtual DbSet<Proveedore> Proveedores { get; set; }

    public virtual DbSet<PsAcuerdosBiMultilateralesMutuasDemandum> PsAcuerdosBiMultilateralesMutuasDemanda { get; set; }

    public virtual DbSet<PsAcuerdosBiMultilateralesMutuasOfertum> PsAcuerdosBiMultilateralesMutuasOferta { get; set; }

    public virtual DbSet<PsAcuerdosBiMultilateralesMutuasProvinciasDemandum> PsAcuerdosBiMultilateralesMutuasProvinciasDemanda { get; set; }

    public virtual DbSet<PsAcuerdosBiMultilateralesMutuasProvinciasOfertum> PsAcuerdosBiMultilateralesMutuasProvinciasOferta { get; set; }

    public virtual DbSet<PsAcuerdosBiMultilateralesMutuasTipoServicioDemandum> PsAcuerdosBiMultilateralesMutuasTipoServicioDemanda { get; set; }

    public virtual DbSet<PsAcuerdosBiMultilateralesMutuasTipoServicioOfertum> PsAcuerdosBiMultilateralesMutuasTipoServicioOferta { get; set; }

    public virtual DbSet<RegistroActividad> RegistroActividads { get; set; }

    public virtual DbSet<RegistroErrore> RegistroErrores { get; set; }

    public virtual DbSet<SeguimientoOd> SeguimientoOds { get; set; }

    public virtual DbSet<ServiciosEspecialidadesComparacion2> ServiciosEspecialidadesComparacion2s { get; set; }

    public virtual DbSet<Subgrupo> Subgrupos { get; set; }

    public virtual DbSet<Tarifa> Tarifas { get; set; }

    public virtual DbSet<TarifasDetalle> TarifasDetalles { get; set; }

    public virtual DbSet<TiposAsistencium> TiposAsistencia { get; set; }

    public virtual DbSet<TiposDemandum> TiposDemanda { get; set; }

    public virtual DbSet<TiposVium> TiposVia { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<UsuariosPorPerfilesModificar> UsuariosPorPerfilesModificars { get; set; }

    public virtual DbSet<UsuariosWeb> UsuariosWebs { get; set; }

    public virtual DbSet<VwCitacione> VwCitaciones { get; set; }

    public virtual DbSet<VwConcertadosNoValidado> VwConcertadosNoValidados { get; set; }

    public virtual DbSet<VwConcertadosValidado> VwConcertadosValidados { get; set; }

    public virtual DbSet<VwConciertosArticulo25> VwConciertosArticulo25s { get; set; }

    public virtual DbSet<VwConciertosArticulo2581> VwConciertosArticulo2581s { get; set; }

    public virtual DbSet<VwConciertosArticulo2582> VwConciertosArticulo2582s { get; set; }

    public virtual DbSet<VwConciertosArticulo25Resto> VwConciertosArticulo25Restos { get; set; }

    public virtual DbSet<VwDemandasCitacione> VwDemandasCitaciones { get; set; }

    public virtual DbSet<VwDemandasCitacionesSinAgrupar> VwDemandasCitacionesSinAgrupars { get; set; }

    public virtual DbSet<VwDisponibilidad> VwDisponibilidads { get; set; }

    public virtual DbSet<VwDisponibilidadCentro> VwDisponibilidadCentros { get; set; }

    public virtual DbSet<VwEspecialidadesConcierto> VwEspecialidadesConciertos { get; set; }

    public virtual DbSet<VwEspecialidadesPropio> VwEspecialidadesPropios { get; set; }

    public virtual DbSet<VwPropiosArticulo32> VwPropiosArticulo32s { get; set; }

    public virtual DbSet<VwPropiosArticulo62> VwPropiosArticulo62s { get; set; }

    public virtual DbSet<VwPropiosArticulo63> VwPropiosArticulo63s { get; set; }

    public virtual DbSet<VwPropiosCapitulo1> VwPropiosCapitulo1s { get; set; }

    public virtual DbSet<VwPropiosCapitulo1Anterior> VwPropiosCapitulo1Anteriors { get; set; }

    public virtual DbSet<VwPropiosCapitulo2> VwPropiosCapitulo2s { get; set; }

    public virtual DbSet<VwPropiosCapitulo3> VwPropiosCapitulo3s { get; set; }

    public virtual DbSet<VwPropiosCuenta68> VwPropiosCuenta68s { get; set; }

    public virtual DbSet<VwPropiosNoValidado> VwPropiosNoValidados { get; set; }

    public virtual DbSet<VwPropiosValidado> VwPropiosValidados { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {}  //

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AccesosUsuario>(entity =>
        {
            entity.HasKey(e => e.AccesoUsuarioId);

            entity.Property(e => e.AccesoUsuarioId).HasColumnName("AccesoUsuario_id");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.FichaId).HasColumnName("Ficha_id");
            entity.Property(e => e.PerfilId).HasColumnName("Perfil_id");
        });

        modelBuilder.Entity<AccessActividadAsistencialA>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Access_ActividadAsistencial_A");

            entity.Property(e => e.Actidesde).HasColumnType("datetime");
            entity.Property(e => e.Actihasta).HasColumnType("datetime");
            entity.Property(e => e.ConsEnfArt82).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConsEnfConvSectBilMult).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConsEnfentgyApart12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConsEnfentgyAPArt12");
            entity.Property(e => e.ConsEnfnoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConsEnfotmutArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConsEnfotrosArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConsEnftrmut).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Conssuc25km).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Conssuc25kmVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Conssuc50km).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Conssuc50kmVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConssucArt82).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConssucArt82Video).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConssucConvSectBilMult).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConssucConvSectBilMultVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConssucentgyApart12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConssucentgyAPArt12");
            entity.Property(e => e.ConssucentgyApart12Video)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConssucentgyAPArt12Video");
            entity.Property(e => e.Conssucmas50km).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Conssucmas50kmVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Conssucnoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConssucnoapantVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConssucotmutArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConssucotmutArt12Video).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConssucotrosArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConssucotrosArt12Video).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.IquircenArt82).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.IquircenConvSectBilMult).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.IquirentgyApart12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("IquirentgyAPArt12");
            entity.Property(e => e.Iquirnoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.IquirotmutArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.IquirotrosArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Iquirtrmut).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.OppractArt82).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.OppractConvSectBilMult).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.OppractentgyApart12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OppractentgyAPArt12");
            entity.Property(e => e.Oppractnoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.OppractotmutArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.OppractotrosArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Otrpptrmut).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Pacen25km)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAcen25km");
            entity.Property(e => e.Pacen50km)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAcen50km");
            entity.Property(e => e.PacenArt82)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAcenArt82");
            entity.Property(e => e.PacenConvSectBilMult)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAcenConvSectBilMult");
            entity.Property(e => e.Pacenmas50km)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAcenmas50km");
            entity.Property(e => e.PaentgyApart12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAentgyAPArt12");
            entity.Property(e => e.Panoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PaotmutArt12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAotmutArt12");
            entity.Property(e => e.PaotrosArt12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAotrosArt12");
            entity.Property(e => e.PradArt82Eco).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PradArt82Radio).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PradArt82Rm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradArt82RM");
            entity.Property(e => e.PradArt82Tac)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradArt82TAC");
            entity.Property(e => e.PradConvSectBilMultEco).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PradConvSectBilMultRadio).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PradConvSectBilMultRm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradConvSectBilMultRM");
            entity.Property(e => e.PradConvSectBilMultTac)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradConvSectBilMultTAC");
            entity.Property(e => e.PradentgyApart12Eco)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradentgyAPArt12Eco");
            entity.Property(e => e.PradentgyApart12Radio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradentgyAPArt12Radio");
            entity.Property(e => e.PradentgyApart12Rm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradentgyAPArt12RM");
            entity.Property(e => e.PradentgyApart12Tac)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradentgyAPArt12TAC");
            entity.Property(e => e.PradnoapantEco).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PradnoapantRadio).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PradnoapantRm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradnoapantRM");
            entity.Property(e => e.PradnoapantTac)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradnoapantTAC");
            entity.Property(e => e.PradotmutArt12Eco).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PradotmutArt12Radio).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PradotmutArt12Rm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotmutArt12RM");
            entity.Property(e => e.PradotmutArt12Tac)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotmutArt12TAC");
            entity.Property(e => e.PradotrosArt12Eco).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PradotrosArt12Radio).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PradotrosArt12Rm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotrosArt12RM");
            entity.Property(e => e.PradotrosArt12Tac)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotrosArt12TAC");
            entity.Property(e => e.PradtrmutEco).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PradtrmutRadio).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PradtrmutRm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradtrmutRM");
            entity.Property(e => e.PradtrmutTac)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradtrmutTAC");
            entity.Property(e => e.PrimConentgyApart12NoProg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConentgyAPArt12NoProg");
            entity.Property(e => e.PrimConentgyApart12NoProgVideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConentgyAPArt12NoProgVideo");
            entity.Property(e => e.PrimConentgyApart12Prog)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConentgyAPArt12Prog");
            entity.Property(e => e.PrimConentgyApart12ProgVideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConentgyAPArt12ProgVideo");
            entity.Property(e => e.PrimConotmutArt12NoProg).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConotmutArt12NoProgVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConotrosArt12NoProg).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConotrosArt12NoProgVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConotrosArt12Prog).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConotrosArt12ProgVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsArt82NoProg).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsArt82NoProgVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsArt82Prog).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsArt82ProgVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsConvSectBilMultNoProg).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsConvSectBilMultNoProgVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsConvSectBilMultProg).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsConvSectBilMultProgVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsNoProg25km).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsNoProg50km).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsNoProgVideo25km).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsNoProgVideo50km).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsNoProgVideomas50km).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsNoProgmas50km).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsProg25km).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsProg50km).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsProgVideo25km).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsProgVideo50km).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsProgVideomas50km).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsProgmas50km).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsnoapantNoProg).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsnoapantNoProgVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsnoapantProg).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsnoapantProgVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsotmutArt12Prog).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsotmutArt12ProgVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PruBiomArt82).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PruBiomConvSectBilMult).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PruBiomentgyApart12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PruBiomentgyAPArt12");
            entity.Property(e => e.PruBiomnoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PruBiomotmutArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PruBiomotrosArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PruBiomtrmut).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.SesrehabArt82).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.SesrehabConvSectBilMult).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.SesrehabentgyApart12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("SesrehabentgyAPArt12");
            entity.Property(e => e.Sesrehabnoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.SesrehabotmutArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.SesrehabotrosArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Sesrehabtrmut).HasColumnType("numeric(10, 2)");
        });

        modelBuilder.Entity<AccessActividadAsistencialH>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Access_ActividadAsistencial_H");

            entity.Property(e => e.ConsEnfArt82Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConsEnfArt82HOS");
            entity.Property(e => e.ConsEnfConvSecBilMultHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConsEnfConvSecBilMultHOS");
            entity.Property(e => e.ConsEnfEgyapart12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConsEnfEGYAPArt12HOS");
            entity.Property(e => e.ConsEnfHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConsEnfHOS");
            entity.Property(e => e.ConsEnfnoapantHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConsEnfnoapantHOS");
            entity.Property(e => e.ConsEnfotrmutArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConsEnfotrmutArt12HOS");
            entity.Property(e => e.ConsEnfotrosArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConsEnfotrosArt12HOS");
            entity.Property(e => e.ConssucArt82Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConssucArt82HOS");
            entity.Property(e => e.ConssucArt82Hosvideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConssucArt82HOSVideo");
            entity.Property(e => e.ConssucConvSecBilMultHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConssucConvSecBilMultHOS");
            entity.Property(e => e.ConssucConvSecBilMultHosvideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConssucConvSecBilMultHOSVideo");
            entity.Property(e => e.ConssucEgyapart12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConssucEGYAPArt12HOS");
            entity.Property(e => e.ConssucEgyapart12Hosvideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConssucEGYAPArt12HOSVideo");
            entity.Property(e => e.ConssucHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConssucHOS");
            entity.Property(e => e.ConssucHosvideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConssucHOSVideo");
            entity.Property(e => e.ConssucotrmutArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConssucotrmutArt12HOS");
            entity.Property(e => e.ConssucotrmutArt12Hosvideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConssucotrmutArt12HOSVideo");
            entity.Property(e => e.Conssucotrnoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConssucotrnoapantVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConssucotrosArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConssucotrosArt12HOS");
            entity.Property(e => e.ConssucotrosArt12Hosvideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConssucotrosArt12HOSVideo");
            entity.Property(e => e.EstEgyapart12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("EstEGYAPArt12HOS");
            entity.Property(e => e.EstotrmutArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("EstotrmutArt12HOS");
            entity.Property(e => e.Estotrnoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.EstotrosArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("EstotrosArt12HOS");
            entity.Property(e => e.EsttrmutArt82Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("EsttrmutArt82HOS");
            entity.Property(e => e.EsttrmutConvSecBilMultHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("EsttrmutConvSecBilMultHOS");
            entity.Property(e => e.EsttrmutHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("EsttrmutHOS");
            entity.Property(e => e.IquirEgyapart12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("IquirEGYAPArt12HOS");
            entity.Property(e => e.IquirnoapantHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("IquirnoapantHOS");
            entity.Property(e => e.IquirotrmutArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("IquirotrmutArt12HOS");
            entity.Property(e => e.IquirotrosArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("IquirotrosArt12HOS");
            entity.Property(e => e.IquirtrmutArt82Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("IquirtrmutArt82HOS");
            entity.Property(e => e.IquirtrmutConvSecBilMultHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("IquirtrmutConvSecBilMultHOS");
            entity.Property(e => e.IquirtrmutHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("IquirtrmutHOS");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.OppEgyapart12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OppEGYAPArt12HOS");
            entity.Property(e => e.OppnoapantHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OppnoapantHOS");
            entity.Property(e => e.OppotrmutArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OppotrmutArt12HOS");
            entity.Property(e => e.OppotrosArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OppotrosArt12HOS");
            entity.Property(e => e.OppracttrmutHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OppracttrmutHOS");
            entity.Property(e => e.OpptrmutArt82Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OpptrmutArt82HOS");
            entity.Property(e => e.OpptrmutConvSecBilMultHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OpptrmutConvSecBilMultHOS");
            entity.Property(e => e.PaurgNoIngrArt82Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAUrgNoIngrArt82HOS");
            entity.Property(e => e.PaurgNoIngrConvSecBilMultHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAUrgNoIngrConvSecBilMultHOS");
            entity.Property(e => e.PaurniEgyapart12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAurniEGYAPArt12HOS");
            entity.Property(e => e.PaurninoapantHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAurninoapantHOS");
            entity.Property(e => e.PaurniotrmutArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAurniotrmutArt12HOS");
            entity.Property(e => e.PaurniotrosArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAurniotrosArt12HOS");
            entity.Property(e => e.PaurnointrmutHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAurnointrmutHOS");
            entity.Property(e => e.Piegyapart12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PIEGYAPArt12HOS");
            entity.Property(e => e.PiotrmutArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PIotrmutArt12HOS");
            entity.Property(e => e.Piotrnoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PiotrosArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PIotrosArt12HOS");
            entity.Property(e => e.PitrmutArt82Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PItrmutArt82HOS");
            entity.Property(e => e.PitrmutConvSecBilMultHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PItrmutConvSecBilMultHOS");
            entity.Property(e => e.PitrmutHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PItrmutHOS");
            entity.Property(e => e.PradEgyapart12Hoseco)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradEGYAPArt12HOSEco");
            entity.Property(e => e.PradEgyapart12Hosradio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradEGYAPArt12HOSRadio");
            entity.Property(e => e.PradEgyapart12Hosrm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradEGYAPArt12HOSRM");
            entity.Property(e => e.PradEgyapart12Hostac)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradEGYAPArt12HOSTAC");
            entity.Property(e => e.PradnoapantHoseco)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradnoapantHOSEco");
            entity.Property(e => e.PradnoapantHosradio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradnoapantHOSRadio");
            entity.Property(e => e.PradnoapantHosrm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradnoapantHOSRM");
            entity.Property(e => e.PradnoapantHostac)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradnoapantHOSTAC");
            entity.Property(e => e.PradotrmutArt12Hoseco)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotrmutArt12HOSEco");
            entity.Property(e => e.PradotrmutArt12Hosradio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotrmutArt12HOSRadio");
            entity.Property(e => e.PradotrmutArt12Hosrm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotrmutArt12HOSRM");
            entity.Property(e => e.PradotrmutArt12Hostac)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotrmutArt12HOSTAC");
            entity.Property(e => e.PradotrosArt12Hoseco)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotrosArt12HOSEco");
            entity.Property(e => e.PradotrosArt12Hosradio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotrosArt12HOSRadio");
            entity.Property(e => e.PradotrosArt12Hosrm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotrosArt12HOSRM");
            entity.Property(e => e.PradotrosArt12Hostac)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotrosArt12HOSTAC");
            entity.Property(e => e.PradtrmutHoseco)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradtrmutHOSEco");
            entity.Property(e => e.PradtrmutHosradio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradtrmutHOSRadio");
            entity.Property(e => e.PradtrmutHosrm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradtrmutHOSRM");
            entity.Property(e => e.PradtrmutHostac)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradtrmutHOSTAC");
            entity.Property(e => e.PrimConsArt82HosnoProg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsArt82HOSNoProg");
            entity.Property(e => e.PrimConsArt82HosnoProgVideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsArt82HOSNoProgVideo");
            entity.Property(e => e.PrimConsArt82Hosprog)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsArt82HOSProg");
            entity.Property(e => e.PrimConsArt82HosprogVideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsArt82HOSProgVideo");
            entity.Property(e => e.PrimConsConvSecBilMultHosnoProg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsConvSecBilMultHOSNoProg");
            entity.Property(e => e.PrimConsConvSecBilMultHosnoProgVideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsConvSecBilMultHOSNoProgVideo");
            entity.Property(e => e.PrimConsConvSecBilMultHosprog)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsConvSecBilMultHOSProg");
            entity.Property(e => e.PrimConsConvSecBilMultHosprogVideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsConvSecBilMultHOSProgVideo");
            entity.Property(e => e.PrimConsEgyapart12HosnoProg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsEGYAPArt12HOSNoProg");
            entity.Property(e => e.PrimConsEgyapart12HosnoProgVideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsEGYAPArt12HOSNoProgVideo");
            entity.Property(e => e.PrimConsEgyapart12Hosprog)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsEGYAPArt12HOSProg");
            entity.Property(e => e.PrimConsEgyapart12HosprogVideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsEGYAPArt12HOSProgVideo");
            entity.Property(e => e.PrimConsHosnoProg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsHOSNoProg");
            entity.Property(e => e.PrimConsHosnoProgVideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsHOSNoProgVideo");
            entity.Property(e => e.PrimConsHosprog)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsHOSProg");
            entity.Property(e => e.PrimConsHosprogVideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsHOSProgVideo");
            entity.Property(e => e.PrimConsotrmutArt12HosnoProg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsotrmutArt12HOSNoProg");
            entity.Property(e => e.PrimConsotrmutArt12HosnoProgVideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsotrmutArt12HOSNoProgVideo");
            entity.Property(e => e.PrimConsotrmutArt12Hosprog)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsotrmutArt12HOSProg");
            entity.Property(e => e.PrimConsotrmutArt12HosprogVideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsotrmutArt12HOSProgVideo");
            entity.Property(e => e.PrimConsotrnoapantNoProg).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsotrnoapantNoProgVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsotrnoapantProg).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsotrnoapantProgVideo).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrimConsotrosArt12HosnoProg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsotrosArt12HOSNoProg");
            entity.Property(e => e.PrimConsotrosArt12HosnoProgVideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsotrosArt12HOSNoProgVideo");
            entity.Property(e => e.PrimConsotrosArt12Hosprog)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsotrosArt12HOSProg");
            entity.Property(e => e.PrimConsotrosArt12HosprogVideo)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsotrosArt12HOSProgVideo");
            entity.Property(e => e.PrmydtrmutArt82Hoseco)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrmydtrmutArt82HOSEco");
            entity.Property(e => e.PrmydtrmutArt82Hosradio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrmydtrmutArt82HOSRadio");
            entity.Property(e => e.PrmydtrmutArt82Hosrm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrmydtrmutArt82HOSRM");
            entity.Property(e => e.PrmydtrmutArt82Hostac)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrmydtrmutArt82HOSTAC");
            entity.Property(e => e.PrmydtrmutConvSecBilMultHoseco)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrmydtrmutConvSecBilMultHOSEco");
            entity.Property(e => e.PrmydtrmutConvSecBilMultHosradio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrmydtrmutConvSecBilMultHOSRadio");
            entity.Property(e => e.PrmydtrmutConvSecBilMultHosrm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrmydtrmutConvSecBilMultHOSRM");
            entity.Property(e => e.PrmydtrmutConvSecBilMultHostac)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrmydtrmutConvSecBilMultHOSTAC");
            entity.Property(e => e.PruBiomEgyapart12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PruBiomEGYAPArt12HOS");
            entity.Property(e => e.PruBiomHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PruBiomHOS");
            entity.Property(e => e.PruBiomnoapantHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PruBiomnoapantHOS");
            entity.Property(e => e.PruBiomotrmutArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PruBiomotrmutArt12HOS");
            entity.Property(e => e.PruBiomotrosArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PruBiomotrosArt12HOS");
            entity.Property(e => e.PrueBiomArt82Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrueBiomArt82HOS");
            entity.Property(e => e.PrueBiomConvSecBilMultHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrueBiomConvSecBilMultHOS");
            entity.Property(e => e.SesrehabtrmutHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("SesrehabtrmutHOS");
            entity.Property(e => e.SrehabEgyapart12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("SrehabEGYAPArt12HOS");
            entity.Property(e => e.SrehabnoapantHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("SrehabnoapantHOS");
            entity.Property(e => e.SrehabotrmutArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("SrehabotrmutArt12HOS");
            entity.Property(e => e.SrehabotrosArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("SrehabotrosArt12HOS");
            entity.Property(e => e.SrehabtrmutArt82Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("SrehabtrmutArt82HOS");
            entity.Property(e => e.SrehabtrmutConvSecBilMultHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("SrehabtrmutConvSecBilMultHOS");
        });

        modelBuilder.Entity<AccessConciertosNc>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Access_Conciertos_NC");

            entity.Property(e => e.Asambiomec).HasColumnName("ASAMBiomec");
            entity.Property(e => e.Asamconseenf).HasColumnName("ASAMconseenf");
            entity.Property(e => e.Asamconssuc).HasColumnName("ASAMconssuc");
            entity.Property(e => e.AsamconssucVideo).HasColumnName("ASAMconssucVideo");
            entity.Property(e => e.Asamestcaus).HasColumnName("ASAMestcaus");
            entity.Property(e => e.Asamintquir).HasColumnName("ASAMintquir");
            entity.Property(e => e.Asamintquirmp).HasColumnName("ASAMintquirmp");
            entity.Property(e => e.Asamotrasprueb).HasColumnName("ASAMotrasprueb");
            entity.Property(e => e.Asamplacrad).HasColumnName("ASAMplacrad");
            entity.Property(e => e.AsamplacradEco).HasColumnName("ASAMplacradEco");
            entity.Property(e => e.AsamplacradRm).HasColumnName("ASAMplacradRM");
            entity.Property(e => e.AsamplacradTac).HasColumnName("ASAMplacradTAC");
            entity.Property(e => e.Asamprimcons).HasColumnName("ASAMprimcons");
            entity.Property(e => e.AsamprimconsNoProg).HasColumnName("ASAMprimconsNoProg");
            entity.Property(e => e.AsamprimconsNoProgVideo).HasColumnName("ASAMprimconsNoProgVideo");
            entity.Property(e => e.AsamprimconsProgVideo).HasColumnName("ASAMprimconsProgVideo");
            entity.Property(e => e.Asamsesrehab).HasColumnName("ASAMsesrehab");
            entity.Property(e => e.Ashnbiomec).HasColumnName("ASHNBiomec");
            entity.Property(e => e.Ashnconsenf).HasColumnName("ASHNconsenf");
            entity.Property(e => e.Ashnconssuc).HasColumnName("ASHNconssuc");
            entity.Property(e => e.Ashnconssucvideo).HasColumnName("ASHNconssucvideo");
            entity.Property(e => e.Ashnestcaus).HasColumnName("ASHNestcaus");
            entity.Property(e => e.Ashnintquir).HasColumnName("ASHNintquir");
            entity.Property(e => e.Ashnintquirmp).HasColumnName("ASHNintquirmp");
            entity.Property(e => e.Ashnotrasprueb).HasColumnName("ASHNotrasprueb");
            entity.Property(e => e.Ashnplacrad).HasColumnName("ASHNplacrad");
            entity.Property(e => e.AshnplacradEco).HasColumnName("ASHNplacradEco");
            entity.Property(e => e.AshnplacradRm).HasColumnName("ASHNplacradRM");
            entity.Property(e => e.AshnplacradTac).HasColumnName("ASHNplacradTAC");
            entity.Property(e => e.Ashnprimcons).HasColumnName("ASHNprimcons");
            entity.Property(e => e.AshnprimconsNoProg).HasColumnName("ASHNprimconsNoProg");
            entity.Property(e => e.AshnprimconsNoProgvideo).HasColumnName("ASHNprimconsNoProgvideo");
            entity.Property(e => e.AshnprimconsProgvideo).HasColumnName("ASHNprimconsProgvideo");
            entity.Property(e => e.Ashnsesrehab).HasColumnName("ASHNsesrehab");
            entity.Property(e => e.Citnºconsesp).HasColumnName("CITnºconsesp");
            entity.Property(e => e.Citnºintquir).HasColumnName("CITnºintquir");
            entity.Property(e => e.Citnºotrpru).HasColumnName("CITnºotrpru");
            entity.Property(e => e.Citnºsesrehab).HasColumnName("CITnºsesrehab");
            entity.Property(e => e.CosteIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("CosteIT");
            entity.Property(e => e.Costeassan).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Cp).HasColumnName("CP");
            entity.Property(e => e.Cpcon).HasColumnName("CPcon");
            entity.Property(e => e.Direcpost).HasColumnName("direcpost");
            entity.Property(e => e.Fautorizacion).HasColumnType("datetime");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Pasinurg).HasColumnName("PAsinurg");
            entity.Property(e => e.Paurgencias).HasColumnName("PAurgencias");
            entity.Property(e => e.PersjurOsp).HasColumnName("PersjurOSP");
        });

        modelBuilder.Entity<AccessConciertosNv>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Access_Conciertos_NV");

            entity.Property(e => e.Asambiomec).HasColumnName("ASAMBiomec");
            entity.Property(e => e.Asamconseenf).HasColumnName("ASAMconseenf");
            entity.Property(e => e.Asamconssuc).HasColumnName("ASAMconssuc");
            entity.Property(e => e.AsamconssucVideo).HasColumnName("ASAMconssucVideo");
            entity.Property(e => e.Asamestcaus).HasColumnName("ASAMestcaus");
            entity.Property(e => e.Asamintquir).HasColumnName("ASAMintquir");
            entity.Property(e => e.Asamintquirmp).HasColumnName("ASAMintquirmp");
            entity.Property(e => e.Asamotrasprueb).HasColumnName("ASAMotrasprueb");
            entity.Property(e => e.Asamplacrad).HasColumnName("ASAMplacrad");
            entity.Property(e => e.AsamplacradEco).HasColumnName("ASAMplacradEco");
            entity.Property(e => e.AsamplacradRm).HasColumnName("ASAMplacradRM");
            entity.Property(e => e.AsamplacradTac).HasColumnName("ASAMplacradTAC");
            entity.Property(e => e.Asamprimcons).HasColumnName("ASAMprimcons");
            entity.Property(e => e.AsamprimconsNoProg).HasColumnName("ASAMprimconsNoProg");
            entity.Property(e => e.AsamprimconsNoProgVideo).HasColumnName("ASAMprimconsNoProgVideo");
            entity.Property(e => e.AsamprimconsProgVideo).HasColumnName("ASAMprimconsProgVideo");
            entity.Property(e => e.Asamsesrehab).HasColumnName("ASAMsesrehab");
            entity.Property(e => e.Ashnbiomec).HasColumnName("ASHNBiomec");
            entity.Property(e => e.Ashnconsenf).HasColumnName("ASHNconsenf");
            entity.Property(e => e.Ashnconssuc).HasColumnName("ASHNconssuc");
            entity.Property(e => e.Ashnconssucvideo).HasColumnName("ASHNconssucvideo");
            entity.Property(e => e.Ashnestcaus).HasColumnName("ASHNestcaus");
            entity.Property(e => e.Ashnintquir).HasColumnName("ASHNintquir");
            entity.Property(e => e.Ashnintquirmp).HasColumnName("ASHNintquirmp");
            entity.Property(e => e.Ashnotrasprueb).HasColumnName("ASHNotrasprueb");
            entity.Property(e => e.Ashnplacrad).HasColumnName("ASHNplacrad");
            entity.Property(e => e.AshnplacradEco).HasColumnName("ASHNplacradEco");
            entity.Property(e => e.AshnplacradRm).HasColumnName("ASHNplacradRM");
            entity.Property(e => e.AshnplacradTac).HasColumnName("ASHNplacradTAC");
            entity.Property(e => e.Ashnprimcons).HasColumnName("ASHNprimcons");
            entity.Property(e => e.AshnprimconsNoProg).HasColumnName("ASHNprimconsNoProg");
            entity.Property(e => e.AshnprimconsNoProgvideo).HasColumnName("ASHNprimconsNoProgvideo");
            entity.Property(e => e.AshnprimconsProgvideo).HasColumnName("ASHNprimconsProgvideo");
            entity.Property(e => e.Ashnsesrehab).HasColumnName("ASHNsesrehab");
            entity.Property(e => e.Citnºconsesp).HasColumnName("CITnºconsesp");
            entity.Property(e => e.Citnºintquir).HasColumnName("CITnºintquir");
            entity.Property(e => e.Citnºotrpru).HasColumnName("CITnºotrpru");
            entity.Property(e => e.Citnºsesrehab).HasColumnName("CITnºsesrehab");
            entity.Property(e => e.CosteIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("CosteIT");
            entity.Property(e => e.Costeassan).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Cp).HasColumnName("CP");
            entity.Property(e => e.Cpcon).HasColumnName("CPcon");
            entity.Property(e => e.Direcpost).HasColumnName("direcpost");
            entity.Property(e => e.Fautorizacion).HasColumnType("datetime");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Pasinurg).HasColumnName("PAsinurg");
            entity.Property(e => e.Paurgencias).HasColumnName("PAurgencias");
            entity.Property(e => e.PersjurOsp).HasColumnName("PersjurOSP");
        });

        modelBuilder.Entity<AccessConciertosV>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Access_Conciertos_V");

            entity.Property(e => e.Asambiomec).HasColumnName("ASAMBiomec");
            entity.Property(e => e.Asamconseenf).HasColumnName("ASAMconseenf");
            entity.Property(e => e.Asamconssuc).HasColumnName("ASAMconssuc");
            entity.Property(e => e.AsamconssucVideo).HasColumnName("ASAMconssucVideo");
            entity.Property(e => e.Asamestcaus).HasColumnName("ASAMestcaus");
            entity.Property(e => e.Asamintquir).HasColumnName("ASAMintquir");
            entity.Property(e => e.Asamintquirmp).HasColumnName("ASAMintquirmp");
            entity.Property(e => e.Asamotrasprueb).HasColumnName("ASAMotrasprueb");
            entity.Property(e => e.Asamplacrad).HasColumnName("ASAMplacrad");
            entity.Property(e => e.AsamplacradEco).HasColumnName("ASAMplacradEco");
            entity.Property(e => e.AsamplacradRm).HasColumnName("ASAMplacradRM");
            entity.Property(e => e.AsamplacradTac).HasColumnName("ASAMplacradTAC");
            entity.Property(e => e.Asamprimcons).HasColumnName("ASAMprimcons");
            entity.Property(e => e.AsamprimconsNoProg).HasColumnName("ASAMprimconsNoProg");
            entity.Property(e => e.AsamprimconsNoProgVideo).HasColumnName("ASAMprimconsNoProgVideo");
            entity.Property(e => e.AsamprimconsProgVideo).HasColumnName("ASAMprimconsProgVideo");
            entity.Property(e => e.Asamsesrehab).HasColumnName("ASAMsesrehab");
            entity.Property(e => e.Ashnbiomec).HasColumnName("ASHNBiomec");
            entity.Property(e => e.Ashnconsenf).HasColumnName("ASHNconsenf");
            entity.Property(e => e.Ashnconssuc).HasColumnName("ASHNconssuc");
            entity.Property(e => e.Ashnconssucvideo).HasColumnName("ASHNconssucvideo");
            entity.Property(e => e.Ashnestcaus).HasColumnName("ASHNestcaus");
            entity.Property(e => e.Ashnintquir).HasColumnName("ASHNintquir");
            entity.Property(e => e.Ashnintquirmp).HasColumnName("ASHNintquirmp");
            entity.Property(e => e.Ashnotrasprueb).HasColumnName("ASHNotrasprueb");
            entity.Property(e => e.Ashnplacrad).HasColumnName("ASHNplacrad");
            entity.Property(e => e.AshnplacradEco).HasColumnName("ASHNplacradEco");
            entity.Property(e => e.AshnplacradRm).HasColumnName("ASHNplacradRM");
            entity.Property(e => e.AshnplacradTac).HasColumnName("ASHNplacradTAC");
            entity.Property(e => e.Ashnprimcons).HasColumnName("ASHNprimcons");
            entity.Property(e => e.AshnprimconsNoProg).HasColumnName("ASHNprimconsNoProg");
            entity.Property(e => e.AshnprimconsNoProgvideo).HasColumnName("ASHNprimconsNoProgvideo");
            entity.Property(e => e.AshnprimconsProgvideo).HasColumnName("ASHNprimconsProgvideo");
            entity.Property(e => e.Ashnsesrehab).HasColumnName("ASHNsesrehab");
            entity.Property(e => e.Citnºconsesp).HasColumnName("CITnºconsesp");
            entity.Property(e => e.Citnºintquir).HasColumnName("CITnºintquir");
            entity.Property(e => e.Citnºotrpru).HasColumnName("CITnºotrpru");
            entity.Property(e => e.Citnºsesrehab).HasColumnName("CITnºsesrehab");
            entity.Property(e => e.CosteIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("CosteIT");
            entity.Property(e => e.Costeassan).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Cp).HasColumnName("CP");
            entity.Property(e => e.Cpcon).HasColumnName("CPcon");
            entity.Property(e => e.Direcpost).HasColumnName("direcpost");
            entity.Property(e => e.Fautorizacion).HasColumnType("datetime");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Pasinurg).HasColumnName("PAsinurg");
            entity.Property(e => e.Paurgencias).HasColumnName("PAurgencias");
            entity.Property(e => e.PersjurOsp).HasColumnName("PersjurOSP");
        });

        modelBuilder.Entity<AccessDatosGenerale>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Access_DatosGenerales");

            entity.Property(e => e.AmortizAg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("AmortizAG");
            entity.Property(e => e.AmortizAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("AmortizASCC");
            entity.Property(e => e.AmortizAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("AmortizASCP");
            entity.Property(e => e.AmortizCit)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("AmortizCIT");
            entity.Property(e => e.AmortizPss)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("AmortizPSS");
            entity.Property(e => e.Factejercresto).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Factejercsist).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.FactejerotrmutuasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("FactejerotrmutuasCC");
            entity.Property(e => e.FactejerotrmutuasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("FactejerotrmutuasCP");
            entity.Property(e => e.Factpendcobro).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.GasbienescysAg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasbienescysAG");
            entity.Property(e => e.GasbienescysAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasbienescysASCC");
            entity.Property(e => e.GasbienescysAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasbienescysASCP");
            entity.Property(e => e.GasbienescysCit)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasbienescysCIT");
            entity.Property(e => e.GasbienescysPss)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasbienescysPSS");
            entity.Property(e => e.GasfinAg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasfinAG");
            entity.Property(e => e.GasfinAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasfinASCC");
            entity.Property(e => e.GasfinAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasfinASCP");
            entity.Property(e => e.GasfinCit)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasfinCIT");
            entity.Property(e => e.GasfinPss)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasfinPSS");
            entity.Property(e => e.Inversnue).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Inversrep).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Obs25kmAd).HasColumnName("Obs25kmAD");
            entity.Property(e => e.Obs50kmAd).HasColumnName("Obs50kmAD");
            entity.Property(e => e.Obsmas50kmAd).HasColumnName("Obsmas50kmAD");
            entity.Property(e => e.PersAdminGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersAdminGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersAdminHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersAdminHorasAGM");
            entity.Property(e => e.PersAdminHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersAdminHorasATEP");
            entity.Property(e => e.PersAdminHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersAdminHorasCC");
            entity.Property(e => e.PersAdminHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersAdminHorasCP");
            entity.Property(e => e.PersAdminHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersAdminHorasIT");
            entity.Property(e => e.PersAdminHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersAdminNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersAdminNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersDirCenGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersDirCenGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersDirCenHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersDirCenHorasAGM");
            entity.Property(e => e.PersDirCenHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersDirCenHorasATEP");
            entity.Property(e => e.PersDirCenHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersDirCenHorasCC");
            entity.Property(e => e.PersDirCenHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersDirCenHorasCP");
            entity.Property(e => e.PersDirCenHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersDirCenHorasIT");
            entity.Property(e => e.PersDirCenHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersDirCenNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersDirCenNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersNoAdminGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersNoAdminGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersNoAdminHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersNoAdminHorasAGM");
            entity.Property(e => e.PersNoAdminHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersNoAdminHorasATEP");
            entity.Property(e => e.PersNoAdminHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersNoAdminHorasCC");
            entity.Property(e => e.PersNoAdminHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersNoAdminHorasCP");
            entity.Property(e => e.PersNoAdminHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersNoAdminHorasIT");
            entity.Property(e => e.PersNoAdminHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersNoAdminNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersNoAdminNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7DuegastPers)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEGastPers");
            entity.Property(e => e.PersSanitArt7DuegastPersSustInt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEGastPersSustInt");
            entity.Property(e => e.PersSanitArt7DuehorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEHorasAGM");
            entity.Property(e => e.PersSanitArt7DuehorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEHorasATEP");
            entity.Property(e => e.PersSanitArt7DuehorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEHorasCC");
            entity.Property(e => e.PersSanitArt7DuehorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEHorasCP");
            entity.Property(e => e.PersSanitArt7DuehorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEHorasIT");
            entity.Property(e => e.PersSanitArt7DuehorasPersSustInt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEHorasPersSustInt");
            entity.Property(e => e.PersSanitArt7DuenumPers)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUENumPers");
            entity.Property(e => e.PersSanitArt7DuenumPersSustInt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUENumPersSustInt");
            entity.Property(e => e.PersSanitArt7FisGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7FisGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7FisHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7FisHorasAGM");
            entity.Property(e => e.PersSanitArt7FisHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7FisHorasATEP");
            entity.Property(e => e.PersSanitArt7FisHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7FisHorasCC");
            entity.Property(e => e.PersSanitArt7FisHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7FisHorasCP");
            entity.Property(e => e.PersSanitArt7FisHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7FisHorasIT");
            entity.Property(e => e.PersSanitArt7FisHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7FisNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7FisNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7PsicoGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7PsicoGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7PsicoHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7PsicoHorasAGM");
            entity.Property(e => e.PersSanitArt7PsicoHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7PsicoHorasATEP");
            entity.Property(e => e.PersSanitArt7PsicoHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7PsicoHorasCC");
            entity.Property(e => e.PersSanitArt7PsicoHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7PsicoHorasCP");
            entity.Property(e => e.PersSanitArt7PsicoHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7PsicoHorasIT");
            entity.Property(e => e.PersSanitArt7PsicoHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7PsicoNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7PsicoNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7RestGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7RestGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7RestHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7RestHorasAGM");
            entity.Property(e => e.PersSanitArt7RestHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7RestHorasATEP");
            entity.Property(e => e.PersSanitArt7RestHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7RestHorasCC");
            entity.Property(e => e.PersSanitArt7RestHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7RestHorasCP");
            entity.Property(e => e.PersSanitArt7RestHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7RestHorasIT");
            entity.Property(e => e.PersSanitArt7RestHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7RestNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7RestNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TecRxgastPers)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXGastPers");
            entity.Property(e => e.PersSanitArt7TecRxgastPersSustInt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXGastPersSustInt");
            entity.Property(e => e.PersSanitArt7TecRxhorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXHorasAGM");
            entity.Property(e => e.PersSanitArt7TecRxhorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXHorasATEP");
            entity.Property(e => e.PersSanitArt7TecRxhorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXHorasCC");
            entity.Property(e => e.PersSanitArt7TecRxhorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXHorasCP");
            entity.Property(e => e.PersSanitArt7TecRxhorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXHorasIT");
            entity.Property(e => e.PersSanitArt7TecRxhorasPersSustInt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXHorasPersSustInt");
            entity.Property(e => e.PersSanitArt7TecRxnumPers)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXNumPers");
            entity.Property(e => e.PersSanitArt7TecRxnumPersSustInt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXNumPersSustInt");
            entity.Property(e => e.PersSanitArt7TerOcuGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TerOcuGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TerOcuHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TerOcuHorasAGM");
            entity.Property(e => e.PersSanitArt7TerOcuHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TerOcuHorasATEP");
            entity.Property(e => e.PersSanitArt7TerOcuHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TerOcuHorasCC");
            entity.Property(e => e.PersSanitArt7TerOcuHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TerOcuHorasCP");
            entity.Property(e => e.PersSanitArt7TerOcuHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TerOcuHorasIT");
            entity.Property(e => e.PersSanitArt7TerOcuHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TerOcuNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TerOcuNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TrSocGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TrSocGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TrSocHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TrSocHorasAGM");
            entity.Property(e => e.PersSanitArt7TrSocHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TrSocHorasATEP");
            entity.Property(e => e.PersSanitArt7TrSocHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TrSocHorasCC");
            entity.Property(e => e.PersSanitArt7TrSocHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TrSocHorasCP");
            entity.Property(e => e.PersSanitArt7TrSocHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TrSocHorasIT");
            entity.Property(e => e.PersSanitArt7TrSocHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TrSocNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TrSocNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedAuxEnfGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedAuxEnfGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedAuxEnfHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedAuxEnfHorasAGM");
            entity.Property(e => e.PersSanitGradMedAuxEnfHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedAuxEnfHorasATEP");
            entity.Property(e => e.PersSanitGradMedAuxEnfHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedAuxEnfHorasCC");
            entity.Property(e => e.PersSanitGradMedAuxEnfHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedAuxEnfHorasCP");
            entity.Property(e => e.PersSanitGradMedAuxEnfHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedAuxEnfHorasIT");
            entity.Property(e => e.PersSanitGradMedAuxEnfHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedAuxEnfNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedAuxEnfNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedRestGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedRestGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedRestHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedRestHorasAGM");
            entity.Property(e => e.PersSanitGradMedRestHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedRestHorasATEP");
            entity.Property(e => e.PersSanitGradMedRestHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedRestHorasCC");
            entity.Property(e => e.PersSanitGradMedRestHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedRestHorasCP");
            entity.Property(e => e.PersSanitGradMedRestHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedRestHorasIT");
            entity.Property(e => e.PersSanitGradMedRestHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedRestNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedRestNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradSupGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradSupGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradSupHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradSupHorasAGM");
            entity.Property(e => e.PersSanitGradSupHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradSupHorasATEP");
            entity.Property(e => e.PersSanitGradSupHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradSupHorasCC");
            entity.Property(e => e.PersSanitGradSupHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradSupHorasCP");
            entity.Property(e => e.PersSanitGradSupHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradSupHorasIT");
            entity.Property(e => e.PersSanitGradSupHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradSupNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradSupNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedArt6GastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedArt6GastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedArt6HorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedArt6HorasAGM");
            entity.Property(e => e.PersSanitMedArt6HorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedArt6HorasATEP");
            entity.Property(e => e.PersSanitMedArt6HorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedArt6HorasCC");
            entity.Property(e => e.PersSanitMedArt6HorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedArt6HorasCP");
            entity.Property(e => e.PersSanitMedArt6HorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedArt6HorasIT");
            entity.Property(e => e.PersSanitMedArt6HorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedArt6NumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedArt6NumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedEspArt6GastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedEspArt6GastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedEspArt6HorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedEspArt6HorasAGM");
            entity.Property(e => e.PersSanitMedEspArt6HorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedEspArt6HorasATEP");
            entity.Property(e => e.PersSanitMedEspArt6HorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedEspArt6HorasCC");
            entity.Property(e => e.PersSanitMedEspArt6HorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedEspArt6HorasCP");
            entity.Property(e => e.PersSanitMedEspArt6HorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedEspArt6HorasIT");
            entity.Property(e => e.PersSanitMedEspArt6HorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedEspArt6NumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedEspArt6NumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedGesArt6GastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedGesArt6GastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedGesArt6HorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedGesArt6HorasAGM");
            entity.Property(e => e.PersSanitMedGesArt6HorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedGesArt6HorasATEP");
            entity.Property(e => e.PersSanitMedGesArt6HorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedGesArt6HorasCC");
            entity.Property(e => e.PersSanitMedGesArt6HorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedGesArt6HorasCP");
            entity.Property(e => e.PersSanitMedGesArt6HorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedGesArt6HorasIT");
            entity.Property(e => e.PersSanitMedGesArt6HorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedGesArt6NumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedGesArt6NumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersTecPreGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersTecPreGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersTecPreHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersTecPreHorasAGM");
            entity.Property(e => e.PersTecPreHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersTecPreHorasATEP");
            entity.Property(e => e.PersTecPreHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersTecPreHorasCC");
            entity.Property(e => e.PersTecPreHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersTecPreHorasCP");
            entity.Property(e => e.PersTecPreHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersTecPreHorasIT");
            entity.Property(e => e.PersTecPreHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersTecPreNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersTecPreNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Pobpr25kmAd)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Pobpr25kmAD");
            entity.Property(e => e.Pobpr25kmCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Pobpr25kmCP");
            entity.Property(e => e.Pobpr25kmItcc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Pobpr25kmITCC");
            entity.Property(e => e.Pobpr50kmAd)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Pobpr50kmAD");
            entity.Property(e => e.Pobpr50kmCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Pobpr50kmCP");
            entity.Property(e => e.Pobpr50kmItcc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Pobpr50kmITCC");
            entity.Property(e => e.Pobprmas50Ad)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Pobprmas50AD");
            entity.Property(e => e.Pobprmas50Cp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Pobprmas50CP");
            entity.Property(e => e.Pobprmas50Itcc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Pobprmas50ITCC");
            entity.Property(e => e.RestPersSanitGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.RestPersSanitGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.RestPersSanitHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestPersSanitHorasAGM");
            entity.Property(e => e.RestPersSanitHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestPersSanitHorasATEP");
            entity.Property(e => e.RestPersSanitHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestPersSanitHorasCC");
            entity.Property(e => e.RestPersSanitHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestPersSanitHorasCP");
            entity.Property(e => e.RestPersSanitHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestPersSanitHorasIT");
            entity.Property(e => e.RestPersSanitHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.RestPersSanitNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.RestPersSanitNumPersSustInt).HasColumnType("numeric(10, 2)");
        });

        modelBuilder.Entity<AccessFincasRegistrale>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Access_FincasRegistrales");

            entity.Property(e => e.Costealq).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Fadqoarr).HasColumnType("datetime");
            entity.Property(e => e.Finscreg).HasColumnType("datetime");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.SupConst).HasColumnType("numeric(10, 2)");
        });

        modelBuilder.Entity<AccessIdentificacionCentro>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Access_IdentificacionCentros");

            entity.Property(e => e.ContradIt).HasColumnName("ContradIT");
            entity.Property(e => e.Cp).HasColumnName("CP");
            entity.Property(e => e.DenomMutCesion).HasColumnName("Denom_Mut_Cesion");
            entity.Property(e => e.Fautocom).HasColumnType("datetime");
            entity.Property(e => e.Fcalisuf).HasColumnType("datetime");
            entity.Property(e => e.Fechaciere).HasColumnType("datetime");
            entity.Property(e => e.Fpufuncio).HasColumnType("datetime");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Nfincreg).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Numcamas).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Numdcierre).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Numdiano).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Numquirof).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PrevrlabSsoc).HasColumnName("PrevrlabSSOC");
            entity.Property(e => e.SuptotConst).HasColumnType("numeric(10, 2)");
        });

        modelBuilder.Entity<AuxAgrupacionConcierto>(entity =>
        {
            entity.HasKey(e => e.AgrupacionId);

            entity.ToTable("Aux_AgrupacionConciertos");

            entity.Property(e => e.AgrupacionId).HasColumnName("Agrupacion_id");
            entity.Property(e => e.Agrupacion).HasMaxLength(50);
        });

        modelBuilder.Entity<AuxAmbitosCobertura>(entity =>
        {
            entity.HasKey(e => e.AmbitoId);

            entity.ToTable("Aux_AmbitosCobertura");

            entity.Property(e => e.AmbitoId).HasColumnName("Ambito_id");
            entity.Property(e => e.Ambito).HasMaxLength(100);
        });

        modelBuilder.Entity<AuxArea>(entity =>
        {
            entity.HasKey(e => e.AreaId).HasName("PK_Areas");

            entity.ToTable("Aux_Areas");

            entity.Property(e => e.AreaId).HasColumnName("Area_id");
            entity.Property(e => e.Area)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AuxCitacionMovimiento>(entity =>
        {
            entity.HasKey(e => e.MovimientoId).HasName("PK_aux_Movimientos");

            entity.ToTable("Aux_Citacion_Movimientos");

            entity.Property(e => e.MovimientoId).HasColumnName("Movimiento_id");
        });

        modelBuilder.Entity<AuxDescripcionesSeguimiento>(entity =>
        {
            entity.HasKey(e => e.DescripcionAccionId).HasName("PK_Aux_Aux_DescripcionesSeguimiento");

            entity.ToTable("Aux_DescripcionesSeguimiento");

            entity.Property(e => e.DescripcionAccionId)
                .ValueGeneratedNever()
                .HasColumnName("DescripcionAccion_id");
            entity.Property(e => e.DescripcionAccion).HasMaxLength(200);
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<AuxEspecialidade>(entity =>
        {
            entity.HasKey(e => e.EspecialidadId).HasName("PK_Especialidades");

            entity.ToTable("Aux_Especialidades");

            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.Especialidad).HasMaxLength(150);
        });

        modelBuilder.Entity<AuxEstadosCitacion>(entity =>
        {
            entity.HasKey(e => e.EstadoId);

            entity.ToTable("Aux_Estados_Citacion");

            entity.Property(e => e.EstadoId)
                .ValueGeneratedNever()
                .HasColumnName("Estado_id");
            entity.Property(e => e.Estado).HasMaxLength(200);
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<AuxEstadosDemandum>(entity =>
        {
            entity.HasKey(e => e.EstadoId);

            entity.ToTable("Aux_Estados_Demanda");

            entity.Property(e => e.EstadoId).HasColumnName("Estado_id");
            entity.Property(e => e.Estado).HasMaxLength(200);
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<AuxEstadosInformesIcg>(entity =>
        {
            entity.HasKey(e => e.EstadoInformeId).HasName("PK_Aux_EstadosInformesICG06");

            entity.ToTable("Aux_EstadosInformesICG");

            entity.Property(e => e.EstadoInformeId).HasColumnName("EstadoInforme_id");
            entity.Property(e => e.EstadoInforme)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AuxFichasSistema>(entity =>
        {
            entity.HasKey(e => e.FichaId);

            entity.ToTable("Aux_FichasSistema");

            entity.Property(e => e.FichaId).HasColumnName("Ficha_id");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
        });

        modelBuilder.Entity<AuxIconosMutua>(entity =>
        {
            entity.HasKey(e => e.IconoId);

            entity.ToTable("Aux_IconosMutuas");

            entity.Property(e => e.IconoId).HasColumnName("Icono_id");
            entity.Property(e => e.Icono).HasMaxLength(300);
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
        });

        modelBuilder.Entity<AuxInformesAcuerdo>(entity =>
        {
            entity.HasKey(e => e.TipoAcuerdoId).HasName("PK_Informes_Acuerdos_Aux");

            entity.ToTable("Aux_Informes_Acuerdos");

            entity.Property(e => e.TipoAcuerdoId)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasColumnName("Tipo_acuerdo_id");
            entity.Property(e => e.TipoAcuerdo)
                .HasMaxLength(100)
                .IsFixedLength()
                .HasColumnName("Tipo_acuerdo");
        });

        modelBuilder.Entity<AuxMese>(entity =>
        {
            entity.HasKey(e => e.MesId);

            entity.ToTable("Aux_Meses");

            entity.Property(e => e.MesId).HasColumnName("Mes_id");
            entity.Property(e => e.Mes).HasMaxLength(100);
        });

        modelBuilder.Entity<AuxPoblacione>(entity =>
        {
            entity.HasKey(e => e.PoblacionId);

            entity.ToTable("Aux_Poblaciones");

            entity.Property(e => e.PoblacionId).HasColumnName("Poblacion_id");
            entity.Property(e => e.ProvinciaId).HasColumnName("Provincia_id");

            entity.HasOne(d => d.Provincia).WithMany(p => p.AuxPoblaciones)
                .HasForeignKey(d => d.ProvinciaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Aux_Poblaciones_Aux_Provincias");
        });

        modelBuilder.Entity<AuxPoblacionesCodPostale>(entity =>
        {
            entity.HasKey(e => e.RegistroId);

            entity.ToTable("Aux_Poblaciones_Cod_Postales");

            entity.Property(e => e.RegistroId).HasColumnName("Registro_id");
            entity.Property(e => e.Cp)
                .HasMaxLength(5)
                .HasColumnName("CP");
            entity.Property(e => e.PoblacionId).HasColumnName("Poblacion_id");

            entity.HasOne(d => d.Poblacion).WithMany(p => p.AuxPoblacionesCodPostales)
                .HasForeignKey(d => d.PoblacionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Aux_Poblaciones_Cod_Postales_Aux_Poblaciones");
        });

        modelBuilder.Entity<AuxProvincia>(entity =>
        {
            entity.HasKey(e => e.ProvinciaId).HasName("PK_Aux_Provincias_1");

            entity.ToTable("Aux_Provincias");

            entity.Property(e => e.ProvinciaId)
                .ValueGeneratedNever()
                .HasColumnName("Provincia_id");
            entity.Property(e => e.CcaaId).HasColumnName("CCAA_id");
            entity.Property(e => e.Provincia)
                .HasMaxLength(200)
                .IsUnicode(false)
                .IsFixedLength();

            entity.HasOne(d => d.Ccaa).WithMany(p => p.AuxProvincia)
                .HasForeignKey(d => d.CcaaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Aux_Provincias_CCAA");
        });

        modelBuilder.Entity<AuxServicio>(entity =>
        {
            entity.HasKey(e => e.ServicioId);

            entity.ToTable("Aux_Servicios");

            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
            entity.Property(e => e.Servicio).HasMaxLength(200);
            entity.Property(e => e.TipoServicioId).HasColumnName("TipoServicio_id");
        });

        modelBuilder.Entity<AuxSesionUsuario>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Aux_SesionUsuario");

            entity.Property(e => e.FechaIntento).HasColumnType("datetime");
            entity.Property(e => e.Usuario)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AuxTipoAnulacion>(entity =>
        {
            entity.HasKey(e => e.TipoAnulacionId);

            entity.ToTable("Aux_TipoAnulacion");

            entity.Property(e => e.TipoAnulacionId)
                .ValueGeneratedNever()
                .HasColumnName("TipoAnulacion_id");
            entity.Property(e => e.Motivo).HasMaxLength(50);
        });

        modelBuilder.Entity<AuxTipoFinca>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Aux_TipoFinca");

            entity.Property(e => e.TipoFinca).HasMaxLength(50);
            entity.Property(e => e.TipoFincaId).HasColumnName("TipoFinca_ID");
        });

        modelBuilder.Entity<AuxTipoRechazo>(entity =>
        {
            entity.HasKey(e => e.TipoRechazoId);

            entity.ToTable("Aux_TipoRechazo");

            entity.Property(e => e.TipoRechazoId).HasColumnName("TipoRechazo_id");
            entity.Property(e => e.Rechazo).HasMaxLength(50);
        });

        modelBuilder.Entity<AuxTipoServicio>(entity =>
        {
            entity.HasKey(e => e.TipoServicioId).HasName("PK__Aux_Tipo__7DDA2B8398720696");

            entity.ToTable("Aux_TipoServicio");

            entity.Property(e => e.TipoServicioId).HasColumnName("TipoServicio_id");
            entity.Property(e => e.TipoServicio).HasMaxLength(100);
            entity.Property(e => e.TipoServicioNan)
                .HasMaxLength(2)
                .IsFixedLength()
                .HasColumnName("TipoServicio_nan");
        });

        modelBuilder.Entity<AuxTiposAcreditacion>(entity =>
        {
            entity.HasKey(e => e.TipoAcreditacionId);

            entity.ToTable("Aux_TiposAcreditacion");

            entity.Property(e => e.TipoAcreditacionId).HasColumnName("TipoAcreditacion_id");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.TipoAcreditacion).HasMaxLength(300);
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<AuxTiposDemandum>(entity =>
        {
            entity.HasKey(e => e.TipoId);

            entity.ToTable("Aux_TiposDemanda");

            entity.Property(e => e.TipoId).HasColumnName("Tipo_id");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.Tipo).HasMaxLength(300);
            entity.Property(e => e.UsuarioId).HasColumnName("Usuario_id");
        });

        modelBuilder.Entity<AuxTiposSeguimiento>(entity =>
        {
            entity.HasKey(e => e.TipoAccionId);

            entity.ToTable("Aux_TiposSeguimiento");

            entity.Property(e => e.TipoAccionId)
                .ValueGeneratedNever()
                .HasColumnName("TipoAccion_id");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.TipoAccion).HasMaxLength(200);
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<Ccaa>(entity =>
        {
            entity.ToTable("CCAA");

            entity.Property(e => e.CcaaId).HasColumnName("CCAA_id");
            entity.Property(e => e.Ccaa1)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CCAA");
        });

        modelBuilder.Entity<CentrosConcertado>(entity =>
        {
            entity.HasKey(e => e.CentroId);

            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroIdNuevo).HasColumnName("Centro_idNuevo");
            entity.Property(e => e.Cifnif)
                .HasMaxLength(15)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CIFNIF");
            entity.Property(e => e.Cifnifvalido).HasColumnName("CIFNIFValido");
            entity.Property(e => e.CodigoMz)
                .HasMaxLength(50)
                .HasColumnName("CodigoMZ");
            entity.Property(e => e.Cp)
                .HasMaxLength(5)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CP");
            entity.Property(e => e.DelegacionId).HasColumnName("Delegacion_id");
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
            entity.Property(e => e.IdIcg072013).HasColumnName("id_ICG072013");
            entity.Property(e => e.Latitud).HasMaxLength(50);
            entity.Property(e => e.Localizador).HasMaxLength(50);
            entity.Property(e => e.Longitud).HasMaxLength(50);
            entity.Property(e => e.MotivoBaja).HasMaxLength(500);
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
            entity.Property(e => e.ProveedorId).HasColumnName("Proveedor_id");
            entity.Property(e => e.Puerta).HasMaxLength(15);
            entity.Property(e => e.Telefono)
                .HasMaxLength(15)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.TipoViaId)
                .HasMaxLength(10)
                .HasColumnName("TipoVia_id");
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.UsuarioBajaId).HasColumnName("UsuarioBaja_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<CentrosEspecialidade>(entity =>
        {
            entity.HasKey(e => new { e.CentroId, e.MutuaId, e.Año, e.EspecialidadId, e.Servicio });

            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.Servicio).HasMaxLength(150);
            entity.Property(e => e.Cantidad).HasDefaultValue(0, "DF_CentrosEspecialidades_Cantidad");
            entity.Property(e => e.CentroEspecialidadId)
                .ValueGeneratedOnAdd()
                .HasColumnName("CentroEspecialidad_id");
            entity.Property(e => e.ImporteConIva)
                .HasDefaultValue(0.0, "DF_CentrosEspecialidades_ImporteConIVA_1")
                .HasColumnName("ImporteConIVA");
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
        });

            modelBuilder.Entity<CentrosPropio>(entity =>
            {
                entity.HasKey(e => e.CentroId);
                entity.Property(e => e.CentroId).HasColumnName("Centro_id");

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

        modelBuilder.Entity<CentrosPropiosCatalogoServicio>(entity =>
        {
            entity.HasKey(e => e.CentroPropioCatalogoServiciosId);

            entity.Property(e => e.CentroPropioCatalogoServiciosId).HasColumnName("CentroPropioCatalogoServicios_id");
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaBaja).HasColumnType("datetime");
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.UsuarioBajaId).HasColumnName("UsuarioBaja_id");
        });

        modelBuilder.Entity<CentrosPropiosEspecialidade>(entity =>
        {
            entity.HasKey(e => e.CentroPropioEspecialidadId).HasName("PK_CentrosPropiosEspecialidades_1");

            entity.Property(e => e.CentroPropioEspecialidadId).HasColumnName("CentroPropioEspecialidad_id");
            entity.Property(e => e.Cantidad).HasDefaultValue(0, "DF_CentrosPropiosEspecialidades_Cantidad");
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.FechaActualizarDisponibilidad).HasColumnType("datetime");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaBaja).HasColumnType("datetime");
            entity.Property(e => e.FechaGeneracionAcreditacion).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.ImporteConIva)
                .HasDefaultValue(0.0, "DF_CentrosPropiosEspecialidades_ImporteConIVA_1")
                .HasColumnName("ImporteConIVA");
            entity.Property(e => e.Servicio).HasMaxLength(150);
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
        });

        modelBuilder.Entity<CitacionDocumentacion>(entity =>
        {
            entity.HasKey(e => e.DocId).HasName("PK_Documentacion");

            entity.ToTable("CitacionDocumentacion");

            entity.Property(e => e.DocId).HasColumnName("Doc_id");
            entity.Property(e => e.CitacionId).HasColumnName("Citacion_id");
            entity.Property(e => e.DemandaId).HasColumnName("Demanda_id");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.NombreFisicoServidor).HasColumnName("Nombre_fisico_servidor");
        });

        modelBuilder.Entity<Citacione>(entity =>
        {
            entity.HasKey(e => e.CitacionId);

            entity.Property(e => e.CitacionId).HasColumnName("citacion_id");
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.DemandaId).HasColumnName("Demanda_id");
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.EstadoId).HasColumnName("Estado_id");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaAltaSolicitud).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.FechaRechazo).HasColumnType("datetime");
            entity.Property(e => e.FechaRespuestaCitacion).HasColumnType("datetime");
            entity.Property(e => e.MovimientoId).HasColumnName("Movimiento_id");
            entity.Property(e => e.ProvinciaId).HasColumnName("Provincia_id");
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<CodigosCiep>(entity =>
        {
            entity.HasKey(e => e.CiepId);

            entity.ToTable("CodigosCIEP");

            entity.Property(e => e.CiepId).HasColumnName("CIEP_id");
            entity.Property(e => e.Ciep)
                .HasMaxLength(50)
                .HasColumnName("CIEP");
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
        });

        modelBuilder.Entity<Concierto>(entity =>
        {
            entity.HasKey(e => e.ConciertoId).HasName("PK_Conciertos_1");

            entity.Property(e => e.ConciertoId).HasColumnName("Concierto_id");
            entity.Property(e => e.CentroAsociadoId).HasColumnName("CentroAsociado_id");
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.CodigoCasa)
                .HasMaxLength(50)
                .HasColumnName("CodigoCASA");
            entity.Property(e => e.CodigoMz)
                .HasMaxLength(50)
                .HasColumnName("CodigoMZ");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaAutorizacion).HasColumnType("datetime");
            entity.Property(e => e.FechaBaja).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.FechaProrroga).HasColumnType("datetime");
            entity.Property(e => e.FechaResolucion).HasColumnType("datetime");
            entity.Property(e => e.FechaSuscripcion).HasColumnType("datetime");
            entity.Property(e => e.FechaVigencia).HasColumnType("datetime");
            entity.Property(e => e.Localizador).HasMaxLength(50);
            entity.Property(e => e.Muniambito).HasMaxLength(255);
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.TipoAsistenciaId).HasColumnName("TipoAsistencia_id");
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.UsuarioAutorizacionId).HasColumnName("UsuarioAutorizacion_id");
            entity.Property(e => e.UsuarioBajaId).HasColumnName("UsuarioBaja_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<ConciertosAmbitoCobertura>(entity =>
        {
            entity.HasKey(e => new { e.ConciertoId, e.AmbitoId, e.PoblacionId });

            entity.ToTable("ConciertosAmbitoCobertura");

            entity.Property(e => e.ConciertoId).HasColumnName("Concierto_id");
            entity.Property(e => e.AmbitoId).HasColumnName("Ambito_id");
            entity.Property(e => e.PoblacionId).HasColumnName("Poblacion_id");
            entity.Property(e => e.Cp)
                .HasMaxLength(5)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CP");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnName("ID");
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<ConciertosDocumento>(entity =>
        {
            entity.HasKey(e => e.DocumentoId);

            entity.Property(e => e.DocumentoId).HasColumnName("Documento_id");
            entity.Property(e => e.ConciertoId).HasColumnName("Concierto_id");
            entity.Property(e => e.Documento).HasMaxLength(100);
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.FechaVigencia).HasColumnType("datetime");
            entity.Property(e => e.Observaciones).HasMaxLength(500);
            entity.Property(e => e.Titulo).HasMaxLength(100);
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<ConciertosEspecialidade>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.Cantidad).HasDefaultValue(0, "DF_ConciertosEspecialidades_Cantidad");
            entity.Property(e => e.ConciertoEspecialidadId)
                .ValueGeneratedOnAdd()
                .HasColumnName("ConciertoEspecialidad_id");
            entity.Property(e => e.ConciertoId).HasColumnName("Concierto_id");
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.ImporteConIva)
                .HasDefaultValue(0.0, "DF_ConciertosEspecialidades_ImporteConIVA_1")
                .HasColumnName("ImporteConIVA");
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
        });

        modelBuilder.Entity<ConfiguracionAdministracion>(entity =>
        {
            entity.ToTable("Configuracion_Administracion");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<Delegacione>(entity =>
        {
            entity.HasKey(e => e.DelegacionId);

            entity.Property(e => e.DelegacionId).HasColumnName("Delegacion_id");
            entity.Property(e => e.CodigoCuenta).HasMaxLength(50);
            entity.Property(e => e.Cp)
                .HasMaxLength(5)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CP");
            entity.Property(e => e.Delegacion).HasMaxLength(100);
            entity.Property(e => e.PoblacionId)
                .HasDefaultValue(0, "DF_Delegaciones_Poblacion_id")
                .HasColumnName("Poblacion_id");
            entity.Property(e => e.ProveedorId).HasColumnName("Proveedor_id");
        });

        modelBuilder.Entity<Demanda>(entity =>
        {

            entity.Property(e => e.DemandaId).HasColumnName("Demanda_id");
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.EstadoId).HasColumnName("Estado_id");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaRevision).HasColumnType("datetime");
            entity.Property(e => e.MotivoAnulacion)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.MotivoRechazo).HasMaxLength(200);
            entity.Property(e => e.MutuaDemandaId).HasColumnName("MutuaDemanda_id");
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
            entity.Property(e => e.TipoId).HasColumnName("Tipo_id");
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.UsuarioAnulacionId).HasColumnName("UsuarioAnulacion_id");
            entity.Property(e => e.Año).HasColumnName("Anio");
        });

        modelBuilder.Entity<DemandasDocumentacion>(entity =>
        {
            entity.HasKey(e => e.DocumentoId);

            entity.ToTable("DemandasDocumentacion");

            entity.Property(e => e.DocumentoId).HasColumnName("Documento_id");
            entity.Property(e => e.DemandaId).HasColumnName("Demanda_id");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
        });

        modelBuilder.Entity<DemandasSubSol>(entity =>
        {
            entity.ToTable("Demandas_SubSol");

            entity.Property(e => e.DemandasSubSolId).HasColumnName("Demandas_SubSol_id");
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.DemandaId).HasColumnName("Demanda_id");
            entity.Property(e => e.EstadoId).HasColumnName("Estado_id");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.OfertaId).HasColumnName("Oferta_id");
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
        });

        modelBuilder.Entity<Descuadre>(entity =>
        {
            entity.HasKey(e => new { e.UsuarioId, e.MutuaId }).HasName("PK_Descuadres1");

            entity.Property(e => e.UsuarioId).HasColumnName("Usuario_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Amortizacion).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.Aplicacion2581).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.Aplicacion2582).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.GastoCorrientes).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.GastoPersonal).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.GastosFinancieros).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.InversionNueva).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.InversionReposicion).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.MediosAjenos).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.OtrosIngresos).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.Resto25).HasColumnType("numeric(18, 2)");
        });

        modelBuilder.Entity<DisponibilidadCentrosPropio>(entity =>
        {
            entity.HasKey(e => e.DisponibilidadCentroId);

            entity.Property(e => e.DisponibilidadCentroId).HasColumnName("DisponibilidadCentro_id");
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
        });

        modelBuilder.Entity<Ejercicio>(entity =>
        {
            entity.HasKey(e => e.Año);

            entity.Property(e => e.Año).ValueGeneratedNever();
            entity.Property(e => e.FechaApertura).HasColumnType("datetime");
            entity.Property(e => e.FechaCierre).HasColumnType("datetime");
        });

        modelBuilder.Entity<Fichero>(entity =>
        {
            entity.Property(e => e.FicheroId).HasColumnName("Fichero_Id");
            entity.Property(e => e.AreaId).HasColumnName("Area_id");
            entity.Property(e => e.Descripción).HasMaxLength(1000);
            entity.Property(e => e.Fecha).HasColumnType("datetime");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.Fichero1)
                .HasMaxLength(200)
                .HasColumnName("Fichero");
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.UsuarioId).HasColumnName("Usuario_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<FicherosAcreditacionesInforme>(entity =>
        {
            entity.HasKey(e => e.FicheroId);

            entity.ToTable("FicherosAcreditaciones_Informes");

            entity.Property(e => e.FicheroId).HasColumnName("Fichero_id");
            entity.Property(e => e.ActivoId)
                .HasDefaultValue(0, "DF_FicherosAcreditaciones_Informes_Activo_id_1")
                .HasColumnName("Activo_id");
            entity.Property(e => e.DemandaId).HasColumnName("Demanda_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.TipoAcreditacionId).HasColumnName("TipoAcreditacion_id");
        });

        modelBuilder.Entity<FicherosGenerado>(entity =>
        {
            entity.HasKey(e => e.FicheroGeneradoId);

            entity.Property(e => e.FicheroGeneradoId).HasColumnName("FicheroGenerado_id");
            entity.Property(e => e.EstadoId).HasColumnName("Estado_id");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FicheroGenerado).HasMaxLength(200);
            entity.Property(e => e.MutuaId)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasColumnName("Mutua_id");
            entity.Property(e => e.TipoCentroId).HasColumnName("TipoCentro_id");
            entity.Property(e => e.TipoConciertoId).HasColumnName("TipoConcierto_id");
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
        });

        modelBuilder.Entity<FincasRegistrale>(entity =>
        {
            entity.HasKey(e => e.FincaId);

            entity.Property(e => e.FincaId).HasColumnName("Finca_id");
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.DireccionElectronica)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Fadqoarr).HasColumnType("datetime");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaBaja).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.Finscreg).HasColumnType("datetime");
            entity.Property(e => e.IdFincaIcgAccess).HasColumnName("id_Finca_ICG_Access");
            entity.Property(e => e.Localizador).HasMaxLength(50);
            entity.Property(e => e.NombreVia).HasMaxLength(250);
            entity.Property(e => e.Numero).HasMaxLength(50);
            entity.Property(e => e.OtrosDatos)
                .HasMaxLength(100)
                .HasColumnName("Otros Datos");
            entity.Property(e => e.PersonaContacto)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Piso).HasMaxLength(50);
            entity.Property(e => e.Puerta).HasMaxLength(50);
            entity.Property(e => e.ReferenciaCatastral).HasColumnName("Referencia Catastral");
            entity.Property(e => e.TipoViaId)
                .HasMaxLength(10)
                .HasColumnName("TipoVia_id");
            entity.Property(e => e.Titinmueble).HasMaxLength(150);
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.Utilizacion).HasMaxLength(50);
        });

        modelBuilder.Entity<FincasRegistralesCostesPorAño>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FincasRe__3214EC274BC808FA");

            entity.ToTable("FincasRegistrales_CostesPorAnio");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.FincaId).HasColumnName("Finca_id");
            entity.Property(e => e.Localizador).HasMaxLength(50);
            entity.Property(e => e.Anio).HasColumnName("Anio");
            entity.HasOne(d => d.Finca).WithMany(p => p.FincasRegistralesCostesPorAños)
                .HasForeignKey(d => d.FincaId)
                .HasConstraintName("FK_FincasRegistrales_CostesPorAño_FincasRegistrales");
        });

        modelBuilder.Entity<HistoricoCatalogoCompletoServicio>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Historico_CatalogoCompletoServicios");

            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.HistoricoCatalogoCompletoServiciosId)
                .ValueGeneratedOnAdd()
                .HasColumnName("HistoricoCatalogoCompletoServicios_id");
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
            entity.Property(e => e.UsuarioId).HasColumnName("Usuario_id");
        });

        modelBuilder.Entity<HistoricoCentrosPropiosEspecialidade>(entity =>
        {
            entity.HasKey(e => e.HistoricoCentroPropioEspecialidadId);

            entity.ToTable("Historico_CentrosPropiosEspecialidades");

            entity.Property(e => e.HistoricoCentroPropioEspecialidadId).HasColumnName("HistoricoCentroPropioEspecialidad_id");
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaBaja).HasColumnType("datetime");
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<Icg06>(entity =>
        {
            entity
                .HasKey(e => e.IdIcg);
            entity.ToTable("ICG06");

            entity.Property(e => e.Actidesde).HasColumnType("datetime");
            entity.Property(e => e.Actihasta).HasColumnType("datetime");
            entity.Property(e => e.AmortizAg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("AmortizAG");
            entity.Property(e => e.AmortizAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("AmortizASCC");
            entity.Property(e => e.AmortizAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("AmortizASCP");
            entity.Property(e => e.AmortizCit)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("AmortizCIT");
            entity.Property(e => e.AmortizPss)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("AmortizPSS");
            entity.Property(e => e.Atsyascoste)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ATSyascoste");
            entity.Property(e => e.AtsyashorAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ATSyashorASCC");
            entity.Property(e => e.AtsyashorAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ATSyashorASCP");
            entity.Property(e => e.AtsyashorPss)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ATSyashorPSS");
            entity.Property(e => e.Atsyasnum)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ATSyasnum");
            entity.Property(e => e.Auxclcoste).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.AuxclhorAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("AuxclhorASCC");
            entity.Property(e => e.AuxclhorAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("AuxclhorASCP");
            entity.Property(e => e.Auxclnum).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.ConsEnfArt82).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.ConsEnfArt82Hos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConsEnfArt82HOS");
            entity.Property(e => e.ConsEnfConvSecBilMultHos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConsEnfConvSecBilMultHOS");
            entity.Property(e => e.ConsEnfConvSectBilMult).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.ConsEnfEgyapart12Hos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConsEnfEGYAPArt12HOS");
            entity.Property(e => e.ConsEnfHos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConsEnfHOS");
            entity.Property(e => e.ConsEnfentgyApart12)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConsEnfentgyAPArt12");
            entity.Property(e => e.ConsEnfnoapant).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.ConsEnfnoapantHos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConsEnfnoapantHOS");
            entity.Property(e => e.ConsEnfotmutArt12).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.ConsEnfotrmutArt12Hos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConsEnfotrmutArt12HOS");
            entity.Property(e => e.ConsEnfotrosArt12).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.ConsEnfotrosArt12Hos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConsEnfotrosArt12HOS");
            entity.Property(e => e.ConsEnftrmut).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.Conssuc25kmVideo).HasColumnName("Conssuc25km(Video)");
            entity.Property(e => e.Conssuc50km1).HasColumnName("Conssuc+50km");
            entity.Property(e => e.Conssuc50kmVideo).HasColumnName("Conssuc50km(Video)");
            entity.Property(e => e.Conssuc50kmVideo1).HasColumnName("Conssuc+50km(Video)");
            entity.Property(e => e.ConssucArt82).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.ConssucArt82Hos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucArt82HOS");
            entity.Property(e => e.ConssucArt82HosVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucArt82HOS(Video)");
            entity.Property(e => e.ConssucArt82Video)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucArt82(Video)");
            entity.Property(e => e.ConssucConvSecBilMultHos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucConvSecBilMultHOS");
            entity.Property(e => e.ConssucConvSecBilMultHosVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucConvSecBilMultHOS(Video)");
            entity.Property(e => e.ConssucConvSectBilMult).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.ConssucConvSectBilMultVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucConvSectBilMult(Video)");
            entity.Property(e => e.ConssucEgyapart12Hos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucEGYAPArt12HOS");
            entity.Property(e => e.ConssucEgyapart12HosVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucEGYAPArt12HOS(Video)");
            entity.Property(e => e.ConssucHos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucHOS");
            entity.Property(e => e.ConssucHosVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucHOS(Video)");
            entity.Property(e => e.ConssucentgyApart12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("ConssucentgyAPArt12");
            entity.Property(e => e.ConssucentgyApart12Video)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucentgyAPArt12(Video)");
            entity.Property(e => e.Conssucnoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConssucnoapantVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Conssucnoapant(Video)");
            entity.Property(e => e.ConssucotmutArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConssucotmutArt12Video)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucotmutArt12(Video)");
            entity.Property(e => e.ConssucotrmutArt12Hos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucotrmutArt12HOS");
            entity.Property(e => e.ConssucotrmutArt12HosVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucotrmutArt12HOS(Video)");
            entity.Property(e => e.Conssucotrnoapant).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.ConssucotrnoapantVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Conssucotrnoapant(Video)");
            entity.Property(e => e.ConssucotrosArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.ConssucotrosArt12Hos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucotrosArt12HOS");
            entity.Property(e => e.ConssucotrosArt12HosVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucotrosArt12HOS(Video)");
            entity.Property(e => e.ConssucotrosArt12Video)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("ConssucotrosArt12(Video)");
            entity.Property(e => e.DircentroMedHorAg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Dircentro(med)horAG");
            entity.Property(e => e.DircentroMedHorAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Dircentro(med)horASCC");
            entity.Property(e => e.DircentroMedHorAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Dircentro(med)horASCP");
            entity.Property(e => e.DircentroMedHorCit)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Dircentro(med)horCIT");
            entity.Property(e => e.DircentroMedHorPss)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Dircentro(med)horPSS");
            entity.Property(e => e.DircentroNomedHorAg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Dircentro(nomed)horAG");
            entity.Property(e => e.DircentroNomedHorAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Dircentro(nomed)horASCC");
            entity.Property(e => e.DircentroNomedHorAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Dircentro(nomed)horASCP");
            entity.Property(e => e.DircentroNomedHorCit)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Dircentro(nomed)horCIT");
            entity.Property(e => e.DircentroNomedHorPss)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Dircentro(nomed)horPSS");
            entity.Property(e => e.Dircentrogastsust).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.DircentrohorAg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("DircentrohorAG");
            entity.Property(e => e.DircentrohorAscc)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("DircentrohorASCC");
            entity.Property(e => e.DircentrohorAscp)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("DircentrohorASCP");
            entity.Property(e => e.DircentrohorCit)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("DircentrohorCIT");
            entity.Property(e => e.DircentrohorPss)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("DircentrohorPSS");
            entity.Property(e => e.Dircentroperssust).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.DirectcentroMedCoste)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Directcentro(med)coste");
            entity.Property(e => e.DirectcentroMedNum).HasColumnName("Directcentro(med)num");
            entity.Property(e => e.DirectcentroNomedCoste)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Directcentro(nomed)coste");
            entity.Property(e => e.DirectcentroNomedNum)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Directcentro(nomed)num");
            entity.Property(e => e.Directcentrocoste).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Directcentronum).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.Dueyascoste)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("DUEyascoste");
            entity.Property(e => e.DueyashorAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("DUEyashorASCC");
            entity.Property(e => e.DueyashorAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("DUEyashorASCP");
            entity.Property(e => e.DueyashorPss)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("DUEyashorPSS");
            entity.Property(e => e.Dueyasnum)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("DUEyasnum");
            entity.Property(e => e.EstEgyapart12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("EstEGYAPArt12HOS");
            entity.Property(e => e.EstotrmutArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("EstotrmutArt12HOS");
            entity.Property(e => e.Estotrnoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.EstotrosArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("EstotrosArt12HOS");
            entity.Property(e => e.EsttrmutArt82Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("EsttrmutArt82HOS");
            entity.Property(e => e.EsttrmutConvSecBilMultHos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("EsttrmutConvSecBilMultHOS");
            entity.Property(e => e.EsttrmutHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("EsttrmutHOS");
            entity.Property(e => e.Factejerc).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Factejercresto).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Factejercsist).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.FactejerotrmutuasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("FactejerotrmutuasCC");
            entity.Property(e => e.FactejerotrmutuasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("FactejerotrmutuasCP");
            entity.Property(e => e.Factpendcobro).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Fautocom).HasColumnType("datetime");
            entity.Property(e => e.Fcalisuf).HasColumnType("datetime");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.Fechaciere).HasColumnType("datetime");
            entity.Property(e => e.Fpufuncio).HasColumnType("datetime");
            entity.Property(e => e.GasbienescysAg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasbienescysAG");
            entity.Property(e => e.GasbienescysAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasbienescysASCC");
            entity.Property(e => e.GasbienescysAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasbienescysASCP");
            entity.Property(e => e.GasbienescysCit)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasbienescysCIT");
            entity.Property(e => e.GasbienescysPss)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasbienescysPSS");
            entity.Property(e => e.GasfinAg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasfinAG");
            entity.Property(e => e.GasfinAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasfinASCC");
            entity.Property(e => e.GasfinAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasfinASCP");
            entity.Property(e => e.GasfinCit)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasfinCIT");
            entity.Property(e => e.GasfinPss)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("GasfinPSS");
            entity.Property(e => e.HorasMedicoDescuento)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Horas_Medico_Descuento");
            entity.Property(e => e.IdIcg)
                .ValueGeneratedOnAdd()
                .HasColumnName("Id_ICG");
            entity.Property(e => e.InversionesNuevas).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.InversionesReposicion).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Inversnue).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Inversnue2).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Inversrep).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Inversrep2).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.IquirEgyapart12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("IquirEGYAPArt12HOS");
            entity.Property(e => e.IquircenArt82).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.IquircenConvSectBilMult).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.IquirentgyApart12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("IquirentgyAPArt12");
            entity.Property(e => e.Iquirnoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.IquirnoapantHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("IquirnoapantHOS");
            entity.Property(e => e.IquirotmutArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.IquirotrmutArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("IquirotrmutArt12HOS");
            entity.Property(e => e.IquirotrosArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.IquirotrosArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("IquirotrosArt12HOS");
            entity.Property(e => e.Iquirtrmut).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.IquirtrmutArt82Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("IquirtrmutArt82HOS");
            entity.Property(e => e.IquirtrmutConvSecBilMultHos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("IquirtrmutConvSecBilMultHOS");
            entity.Property(e => e.IquirtrmutHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("IquirtrmutHOS");
            entity.Property(e => e.Medactmedcoste).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Medactmednum).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Medespcoste).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.MedesphorAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("MedesphorASCC");
            entity.Property(e => e.MedesphorAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("MedesphorASCP");
            entity.Property(e => e.Medespnum).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.Medmedtrabcoste).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.MedmedtrabhorAscp)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("MedmedtrabhorASCP");
            entity.Property(e => e.MedmedtrabhorPss)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("MedmedtrabhorPSS");
            entity.Property(e => e.MutuaActosPracticadas).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.MutuaActosQuirurgicas).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.Nfincreg).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.NumPersAtendTotalTraMut).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Obs25kmAd).HasColumnName("Obs25kmAD");
            entity.Property(e => e.Obs50kmAd).HasColumnName("Obs50kmAD");
            entity.Property(e => e.Obsmas50kmAd).HasColumnName("Obsmas50kmAD");
            entity.Property(e => e.Opersancoste).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.OpersanhorAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OpersanhorASCC");
            entity.Property(e => e.OpersanhorAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OpersanhorASCP");
            entity.Property(e => e.Opersnosannotitcoste).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.OpersnosannotithorAg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OpersnosannotithorAG");
            entity.Property(e => e.OpersnosannotithorAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OpersnosannotithorASCC");
            entity.Property(e => e.OpersnosannotithorAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OpersnosannotithorASCP");
            entity.Property(e => e.OpersnosannotithorCit)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OpersnosannotithorCIT");
            entity.Property(e => e.OpersnosannotithorPss)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OpersnosannotithorPSS");
            entity.Property(e => e.Opersnosannotitnum).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.Opersnosantitcoste).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.OpersnosantithorAg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OpersnosantithorAG");
            entity.Property(e => e.OpersnosantithorAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OpersnosantithorASCC");
            entity.Property(e => e.OpersnosantithorAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OpersnosantithorASCP");
            entity.Property(e => e.OpersnosantithorCit)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OpersnosantithorCIT");
            entity.Property(e => e.OpersnosantithorPss)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OpersnosantithorPSS");
            entity.Property(e => e.Opersnosantitnum).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.Operssannum).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.OppEgyapart12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OppEGYAPArt12HOS");
            entity.Property(e => e.OppnoapantHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OppnoapantHOS");
            entity.Property(e => e.OppotrmutArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OppotrmutArt12HOS");
            entity.Property(e => e.OppotrosArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OppotrosArt12HOS");
            entity.Property(e => e.OppractArt82).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.OppractConvSectBilMult).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.OppractentgyApart12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OppractentgyAPArt12");
            entity.Property(e => e.Oppractnoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.OppractotmutArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.OppractotrosArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.OppracttrmutHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OppracttrmutHOS");
            entity.Property(e => e.OpptrmutArt82Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("OpptrmutArt82HOS");
            entity.Property(e => e.OpptrmutConvSecBilMultHos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("OpptrmutConvSecBilMultHOS");
            entity.Property(e => e.OtrasObservac).HasColumnName("Otras Observac");
            entity.Property(e => e.Otrpptrmut).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Pacen25km).HasColumnName("PAcen25km");
            entity.Property(e => e.Pacen50km).HasColumnName("PAcen50km");
            entity.Property(e => e.Pacen50km1).HasColumnName("PAcen+50km");
            entity.Property(e => e.PacenArt82)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAcenArt82");
            entity.Property(e => e.PacenConvSectBilMult)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PAcenConvSectBilMult");
            entity.Property(e => e.PaentgyApart12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAentgyAPArt12");
            entity.Property(e => e.Panoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PaotmutArt12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAotmutArt12");
            entity.Property(e => e.PaotrosArt12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAotrosArt12");
            entity.Property(e => e.PaurgNoIngrArt82Hos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PAUrgNoIngrArt82(HOS)");
            entity.Property(e => e.PaurgNoIngrConvSecBilMultHos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PAUrgNoIngrConvSecBilMult(HOS)");
            entity.Property(e => e.PaurniEgyapart12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAurniEGYAPArt12HOS");
            entity.Property(e => e.PaurninoapantHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAurninoapantHOS");
            entity.Property(e => e.PaurniotrmutArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAurniotrmutArt12HOS");
            entity.Property(e => e.PaurniotrosArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAurniotrosArt12HOS");
            entity.Property(e => e.PaurnointrmutHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PAurnointrmutHOS");
            entity.Property(e => e.PeradAgcoste)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PeradAGcoste");
            entity.Property(e => e.PeradAghorAg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PeradAGhorAG");
            entity.Property(e => e.PeradAghorCit)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PeradAGhorCIT");
            entity.Property(e => e.PeradAgnum)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PeradAGnum");
            entity.Property(e => e.PeradcompAgcoste)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PeradcompAGcoste");
            entity.Property(e => e.PeradcompAghorAg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PeradcompAGhorAG");
            entity.Property(e => e.PeradcompAghorAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PeradcompAGhorASCC");
            entity.Property(e => e.PeradcompAghorAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PeradcompAGhorASCP");
            entity.Property(e => e.PeradcompAghorCit)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PeradcompAGhorCIT");
            entity.Property(e => e.PeradcompAghorPss)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PeradcompAGhorPSS");
            entity.Property(e => e.PeradcompAgnum)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PeradcompAGnum");
            entity.Property(e => e.PeradnoAgcoste)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PeradnoAGcoste");
            entity.Property(e => e.PeradnoAghorAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PeradnoAGhorASCC");
            entity.Property(e => e.PeradnoAghorAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PeradnoAGhorASCP");
            entity.Property(e => e.PeradnoAghorCit)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PeradnoAGhorCIT");
            entity.Property(e => e.PeradnoAghorPss)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PeradnoAGhorPSS");
            entity.Property(e => e.PeradnoAgnum)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PeradnoAGnum");
            entity.Property(e => e.PersAdminGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersAdminGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersAdminHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersAdminHorasAGM");
            entity.Property(e => e.PersAdminHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersAdminHorasATEP");
            entity.Property(e => e.PersAdminHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersAdminHorasCC");
            entity.Property(e => e.PersAdminHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersAdminHorasCP");
            entity.Property(e => e.PersAdminHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersAdminHorasIT");
            entity.Property(e => e.PersAdminHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersAdminNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersAdminNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersDirCenGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersDirCenGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersDirCenHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersDirCenHorasAGM");
            entity.Property(e => e.PersDirCenHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersDirCenHorasATEP");
            entity.Property(e => e.PersDirCenHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersDirCenHorasCC");
            entity.Property(e => e.PersDirCenHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersDirCenHorasCP");
            entity.Property(e => e.PersDirCenHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersDirCenHorasIT");
            entity.Property(e => e.PersDirCenHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersDirCenNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersDirCenNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersNoAdminGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersNoAdminGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersNoAdminHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersNoAdminHorasAGM");
            entity.Property(e => e.PersNoAdminHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersNoAdminHorasATEP");
            entity.Property(e => e.PersNoAdminHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersNoAdminHorasCC");
            entity.Property(e => e.PersNoAdminHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersNoAdminHorasCP");
            entity.Property(e => e.PersNoAdminHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersNoAdminHorasIT");
            entity.Property(e => e.PersNoAdminHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersNoAdminNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersNoAdminNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7DuegastPers)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEGastPers");
            entity.Property(e => e.PersSanitArt7DuegastPersSustInt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEGastPersSustInt");
            entity.Property(e => e.PersSanitArt7DuehorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEHorasAGM");
            entity.Property(e => e.PersSanitArt7DuehorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEHorasATEP");
            entity.Property(e => e.PersSanitArt7DuehorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEHorasCC");
            entity.Property(e => e.PersSanitArt7DuehorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEHorasCP");
            entity.Property(e => e.PersSanitArt7DuehorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEHorasIT");
            entity.Property(e => e.PersSanitArt7DuehorasPersSustInt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUEHorasPersSustInt");
            entity.Property(e => e.PersSanitArt7DuenumPers)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUENumPers");
            entity.Property(e => e.PersSanitArt7DuenumPersSustInt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7DUENumPersSustInt");
            entity.Property(e => e.PersSanitArt7FisGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7FisGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7FisHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7FisHorasAGM");
            entity.Property(e => e.PersSanitArt7FisHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7FisHorasATEP");
            entity.Property(e => e.PersSanitArt7FisHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7FisHorasCC");
            entity.Property(e => e.PersSanitArt7FisHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7FisHorasCP");
            entity.Property(e => e.PersSanitArt7FisHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7FisHorasIT");
            entity.Property(e => e.PersSanitArt7FisHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7FisNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7FisNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7PsicoGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7PsicoGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7PsicoHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7PsicoHorasAGM");
            entity.Property(e => e.PersSanitArt7PsicoHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7PsicoHorasATEP");
            entity.Property(e => e.PersSanitArt7PsicoHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7PsicoHorasCC");
            entity.Property(e => e.PersSanitArt7PsicoHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7PsicoHorasCP");
            entity.Property(e => e.PersSanitArt7PsicoHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7PsicoHorasIT");
            entity.Property(e => e.PersSanitArt7PsicoHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7PsicoNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7PsicoNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7RestGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7RestGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7RestHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7RestHorasAGM");
            entity.Property(e => e.PersSanitArt7RestHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7RestHorasATEP");
            entity.Property(e => e.PersSanitArt7RestHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7RestHorasCC");
            entity.Property(e => e.PersSanitArt7RestHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7RestHorasCP");
            entity.Property(e => e.PersSanitArt7RestHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7RestHorasIT");
            entity.Property(e => e.PersSanitArt7RestHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7RestNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7RestNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TecRxgastPers)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXGastPers");
            entity.Property(e => e.PersSanitArt7TecRxgastPersSustInt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXGastPersSustInt");
            entity.Property(e => e.PersSanitArt7TecRxhorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXHorasAGM");
            entity.Property(e => e.PersSanitArt7TecRxhorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXHorasATEP");
            entity.Property(e => e.PersSanitArt7TecRxhorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXHorasCC");
            entity.Property(e => e.PersSanitArt7TecRxhorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXHorasCP");
            entity.Property(e => e.PersSanitArt7TecRxhorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXHorasIT");
            entity.Property(e => e.PersSanitArt7TecRxhorasPersSustInt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXHorasPersSustInt");
            entity.Property(e => e.PersSanitArt7TecRxnumPers)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXNumPers");
            entity.Property(e => e.PersSanitArt7TecRxnumPersSustInt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TecRXNumPersSustInt");
            entity.Property(e => e.PersSanitArt7TerOcuGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TerOcuGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TerOcuHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TerOcuHorasAGM");
            entity.Property(e => e.PersSanitArt7TerOcuHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TerOcuHorasATEP");
            entity.Property(e => e.PersSanitArt7TerOcuHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TerOcuHorasCC");
            entity.Property(e => e.PersSanitArt7TerOcuHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TerOcuHorasCP");
            entity.Property(e => e.PersSanitArt7TerOcuHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TerOcuHorasIT");
            entity.Property(e => e.PersSanitArt7TerOcuHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TerOcuNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TerOcuNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TrSocGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TrSocGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TrSocHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TrSocHorasAGM");
            entity.Property(e => e.PersSanitArt7TrSocHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TrSocHorasATEP");
            entity.Property(e => e.PersSanitArt7TrSocHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TrSocHorasCC");
            entity.Property(e => e.PersSanitArt7TrSocHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TrSocHorasCP");
            entity.Property(e => e.PersSanitArt7TrSocHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitArt7TrSocHorasIT");
            entity.Property(e => e.PersSanitArt7TrSocHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TrSocNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitArt7TrSocNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedAuxEnfGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedAuxEnfGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedAuxEnfHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedAuxEnfHorasAGM");
            entity.Property(e => e.PersSanitGradMedAuxEnfHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedAuxEnfHorasATEP");
            entity.Property(e => e.PersSanitGradMedAuxEnfHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedAuxEnfHorasCC");
            entity.Property(e => e.PersSanitGradMedAuxEnfHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedAuxEnfHorasCP");
            entity.Property(e => e.PersSanitGradMedAuxEnfHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedAuxEnfHorasIT");
            entity.Property(e => e.PersSanitGradMedAuxEnfHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedAuxEnfNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedAuxEnfNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedRestGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedRestGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedRestHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedRestHorasAGM");
            entity.Property(e => e.PersSanitGradMedRestHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedRestHorasATEP");
            entity.Property(e => e.PersSanitGradMedRestHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedRestHorasCC");
            entity.Property(e => e.PersSanitGradMedRestHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedRestHorasCP");
            entity.Property(e => e.PersSanitGradMedRestHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradMedRestHorasIT");
            entity.Property(e => e.PersSanitGradMedRestHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedRestNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradMedRestNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradSupGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradSupGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradSupHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradSupHorasAGM");
            entity.Property(e => e.PersSanitGradSupHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradSupHorasATEP");
            entity.Property(e => e.PersSanitGradSupHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradSupHorasCC");
            entity.Property(e => e.PersSanitGradSupHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradSupHorasCP");
            entity.Property(e => e.PersSanitGradSupHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitGradSupHorasIT");
            entity.Property(e => e.PersSanitGradSupHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradSupNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitGradSupNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedArt6GastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedArt6GastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedArt6HorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedArt6HorasAGM");
            entity.Property(e => e.PersSanitMedArt6HorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedArt6HorasATEP");
            entity.Property(e => e.PersSanitMedArt6HorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedArt6HorasCC");
            entity.Property(e => e.PersSanitMedArt6HorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedArt6HorasCP");
            entity.Property(e => e.PersSanitMedArt6HorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedArt6HorasIT");
            entity.Property(e => e.PersSanitMedArt6HorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedArt6NumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedArt6NumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedEspArt6GastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedEspArt6GastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedEspArt6HorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedEspArt6HorasAGM");
            entity.Property(e => e.PersSanitMedEspArt6HorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedEspArt6HorasATEP");
            entity.Property(e => e.PersSanitMedEspArt6HorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedEspArt6HorasCC");
            entity.Property(e => e.PersSanitMedEspArt6HorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedEspArt6HorasCP");
            entity.Property(e => e.PersSanitMedEspArt6HorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedEspArt6HorasIT");
            entity.Property(e => e.PersSanitMedEspArt6HorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedEspArt6NumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedEspArt6NumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedGesArt6GastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedGesArt6GastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedGesArt6HorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedGesArt6HorasAGM");
            entity.Property(e => e.PersSanitMedGesArt6HorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedGesArt6HorasATEP");
            entity.Property(e => e.PersSanitMedGesArt6HorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedGesArt6HorasCC");
            entity.Property(e => e.PersSanitMedGesArt6HorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedGesArt6HorasCP");
            entity.Property(e => e.PersSanitMedGesArt6HorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersSanitMedGesArt6HorasIT");
            entity.Property(e => e.PersSanitMedGesArt6HorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedGesArt6NumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersSanitMedGesArt6NumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersTecPreGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersTecPreGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersTecPreHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersTecPreHorasAGM");
            entity.Property(e => e.PersTecPreHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersTecPreHorasATEP");
            entity.Property(e => e.PersTecPreHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersTecPreHorasCC");
            entity.Property(e => e.PersTecPreHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersTecPreHorasCP");
            entity.Property(e => e.PersTecPreHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PersTecPreHorasIT");
            entity.Property(e => e.PersTecPreHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersTecPreNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PersTecPreNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PerssanitArt6Coste)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art6)coste");
            entity.Property(e => e.PerssanitArt6Gastsust)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art6)gastsust");
            entity.Property(e => e.PerssanitArt6HorAg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art6)horAG");
            entity.Property(e => e.PerssanitArt6HorAscc)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art6)horASCC");
            entity.Property(e => e.PerssanitArt6HorAscp)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art6)horASCP");
            entity.Property(e => e.PerssanitArt6HorCit)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art6)horCIT");
            entity.Property(e => e.PerssanitArt6HorPss)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art6)horPSS");
            entity.Property(e => e.PerssanitArt6Num)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art6)num");
            entity.Property(e => e.PerssanitArt6Perssust)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art6)perssust");
            entity.Property(e => e.PerssanitArt7Coste)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Perssanit(art7)coste");
            entity.Property(e => e.PerssanitArt7Gastsust)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Perssanit(art7)gastsust");
            entity.Property(e => e.PerssanitArt7HorAg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art7)horAG");
            entity.Property(e => e.PerssanitArt7HorAscc)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art7)horASCC");
            entity.Property(e => e.PerssanitArt7HorAscp)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art7)horASCP");
            entity.Property(e => e.PerssanitArt7HorCit)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art7)horCIT");
            entity.Property(e => e.PerssanitArt7HorPss)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art7)horPSS");
            entity.Property(e => e.PerssanitArt7Num)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art7)num");
            entity.Property(e => e.PerssanitArt7Perssust)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(art7)perssust");
            entity.Property(e => e.PerssanitGradMedCoste)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Perssanit(GradMed)coste");
            entity.Property(e => e.PerssanitGradMedGastsust)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Perssanit(GradMed)gastsust");
            entity.Property(e => e.PerssanitGradMedHorAg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(GradMed)horAG");
            entity.Property(e => e.PerssanitGradMedHorAscc)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(GradMed)horASCC");
            entity.Property(e => e.PerssanitGradMedHorAscp)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(GradMed)horASCP");
            entity.Property(e => e.PerssanitGradMedHorCit)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(GradMed)horCIT");
            entity.Property(e => e.PerssanitGradMedHorPss)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(GradMed)horPSS");
            entity.Property(e => e.PerssanitGradMedNum)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(GradMed)num");
            entity.Property(e => e.PerssanitGradMedPerssust)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(GradMed)perssust");
            entity.Property(e => e.PerssanitGradSupCoste)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Perssanit(GradSup)coste");
            entity.Property(e => e.PerssanitGradSupGastsust)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Perssanit(GradSup)gastsust");
            entity.Property(e => e.PerssanitGradSupHorAg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(GradSup)horAG");
            entity.Property(e => e.PerssanitGradSupHorAscc)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(GradSup)horASCC");
            entity.Property(e => e.PerssanitGradSupHorAscp)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(GradSup)horASCP");
            entity.Property(e => e.PerssanitGradSupHorCit)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(GradSup)horCIT");
            entity.Property(e => e.PerssanitGradSupHorPss)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(GradSup)horPSS");
            entity.Property(e => e.PerssanitGradSupNum)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(GradSup)num");
            entity.Property(e => e.PerssanitGradSupPerssust)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Perssanit(GradSup)perssust");
            entity.Property(e => e.Piegyapart12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PIEGYAPArt12HOS");
            entity.Property(e => e.PiotrmutArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PIotrmutArt12HOS");
            entity.Property(e => e.Piotrnoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.PiotrosArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PIotrosArt12HOS");
            entity.Property(e => e.PitrmutArt82Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PItrmutArt82HOS");
            entity.Property(e => e.PitrmutConvSecBilMultHos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PItrmutConvSecBilMultHOS");
            entity.Property(e => e.PitrmutHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PItrmutHOS");
            entity.Property(e => e.Pobpr25kmAd)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Pobpr25kmAD");
            entity.Property(e => e.Pobpr25kmCp)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Pobpr25kmCP");
            entity.Property(e => e.Pobpr25kmItcc)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Pobpr25kmITCC");
            entity.Property(e => e.Pobpr50kmAd)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Pobpr50kmAD");
            entity.Property(e => e.Pobpr50kmCp)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Pobpr50kmCP");
            entity.Property(e => e.Pobpr50kmItcc)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Pobpr50kmITCC");
            entity.Property(e => e.Pobprmas50Ad)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Pobprmas50AD");
            entity.Property(e => e.Pobprmas50Cp)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Pobprmas50CP");
            entity.Property(e => e.Pobprmas50Itcc)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Pobprmas50ITCC");
            entity.Property(e => e.PradArt82Eco)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradArt82(Eco)");
            entity.Property(e => e.PradArt82Radio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradArt82(Radio)");
            entity.Property(e => e.PradArt82Rm)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradArt82(RM)");
            entity.Property(e => e.PradArt82Tac)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradArt82(TAC)");
            entity.Property(e => e.PradConvSectBilMultEco)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradConvSectBilMult(Eco)");
            entity.Property(e => e.PradConvSectBilMultRadio)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradConvSectBilMult(Radio)");
            entity.Property(e => e.PradConvSectBilMultRm)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradConvSectBilMult(RM)");
            entity.Property(e => e.PradConvSectBilMultTac)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradConvSectBilMult(TAC)");
            entity.Property(e => e.PradEgyapart12HosEco)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradEGYAPArt12HOS(Eco)");
            entity.Property(e => e.PradEgyapart12HosRadio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradEGYAPArt12HOS(Radio)");
            entity.Property(e => e.PradEgyapart12HosRm)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradEGYAPArt12HOS(RM)");
            entity.Property(e => e.PradEgyapart12HosTac)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradEGYAPArt12HOS(TAC)");
            entity.Property(e => e.PradentgyApart12Eco)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradentgyAPArt12(Eco)");
            entity.Property(e => e.PradentgyApart12Radio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradentgyAPArt12(Radio)");
            entity.Property(e => e.PradentgyApart12Rm)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradentgyAPArt12(RM)");
            entity.Property(e => e.PradentgyApart12Tac)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradentgyAPArt12(TAC)");
            entity.Property(e => e.PradnoapantEco)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Pradnoapant(Eco)");
            entity.Property(e => e.PradnoapantHosEco)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradnoapantHOS(Eco)");
            entity.Property(e => e.PradnoapantHosRadio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradnoapantHOS(Radio)");
            entity.Property(e => e.PradnoapantHosRm)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradnoapantHOS(RM)");
            entity.Property(e => e.PradnoapantHosTac)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradnoapantHOS(TAC)");
            entity.Property(e => e.PradnoapantRadio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Pradnoapant(Radio)");
            entity.Property(e => e.PradnoapantRm)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Pradnoapant(RM)");
            entity.Property(e => e.PradnoapantTac)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Pradnoapant(TAC)");
            entity.Property(e => e.PradotmutArt12Eco)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradotmutArt12(Eco)");
            entity.Property(e => e.PradotmutArt12Radio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotmutArt12(Radio)");
            entity.Property(e => e.PradotmutArt12Rm)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradotmutArt12(RM)");
            entity.Property(e => e.PradotmutArt12Tac)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradotmutArt12(TAC)");
            entity.Property(e => e.PradotrmutArt12HosEco)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradotrmutArt12HOS(Eco)");
            entity.Property(e => e.PradotrmutArt12HosRadio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotrmutArt12HOS(Radio)");
            entity.Property(e => e.PradotrmutArt12HosRm)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradotrmutArt12HOS(RM)");
            entity.Property(e => e.PradotrmutArt12HosTac)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradotrmutArt12HOS(TAC)");
            entity.Property(e => e.PradotrosArt12Eco)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradotrosArt12(Eco)");
            entity.Property(e => e.PradotrosArt12HosEco)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradotrosArt12HOS(Eco)");
            entity.Property(e => e.PradotrosArt12HosRadio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotrosArt12HOS(Radio)");
            entity.Property(e => e.PradotrosArt12HosRm)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradotrosArt12HOS(RM)");
            entity.Property(e => e.PradotrosArt12HosTac)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradotrosArt12HOS(TAC)");
            entity.Property(e => e.PradotrosArt12Radio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradotrosArt12(Radio)");
            entity.Property(e => e.PradotrosArt12Rm)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradotrosArt12(RM)");
            entity.Property(e => e.PradotrosArt12Tac)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradotrosArt12(TAC)");
            entity.Property(e => e.PradtrmutEco)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Pradtrmut(Eco)");
            entity.Property(e => e.PradtrmutHosEco)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradtrmutHOS(Eco)");
            entity.Property(e => e.PradtrmutHosRadio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PradtrmutHOS(Radio)");
            entity.Property(e => e.PradtrmutHosRm)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradtrmutHOS(RM)");
            entity.Property(e => e.PradtrmutHosTac)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PradtrmutHOS(TAC)");
            entity.Property(e => e.PradtrmutRadio)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Pradtrmut(Radio)");
            entity.Property(e => e.PradtrmutRm)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Pradtrmut(RM)");
            entity.Property(e => e.PradtrmutTac)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Pradtrmut(TAC)");
            entity.Property(e => e.PrimConentgyApart12NoProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConentgyAPArt12(NoProg)");
            entity.Property(e => e.PrimConentgyApart12NoProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConentgyAPArt12(NoProgVideo)");
            entity.Property(e => e.PrimConentgyApart12Prog)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConentgyAPArt12(Prog)");
            entity.Property(e => e.PrimConentgyApart12ProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConentgyAPArt12(ProgVideo)");
            entity.Property(e => e.PrimConotmutArt12NoProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConotmutArt12(NoProg)");
            entity.Property(e => e.PrimConotmutArt12NoProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConotmutArt12(NoProgVideo)");
            entity.Property(e => e.PrimConotrosArt12NoProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConotrosArt12(NoProg)");
            entity.Property(e => e.PrimConotrosArt12NoProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConotrosArt12(NoProgVideo)");
            entity.Property(e => e.PrimConotrosArt12Prog)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConotrosArt12(Prog)");
            entity.Property(e => e.PrimConotrosArt12ProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConotrosArt12(ProgVideo)");
            entity.Property(e => e.PrimConsArt82HosNoProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsArt82HOS(NoProg)");
            entity.Property(e => e.PrimConsArt82HosNoProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsArt82HOS(NoProgVideo)");
            entity.Property(e => e.PrimConsArt82HosProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsArt82HOS(Prog)");
            entity.Property(e => e.PrimConsArt82HosProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsArt82HOS(ProgVideo)");
            entity.Property(e => e.PrimConsArt82NoProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsArt82(NoProg)");
            entity.Property(e => e.PrimConsArt82NoProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsArt82(NoProgVideo)");
            entity.Property(e => e.PrimConsArt82Prog)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsArt82(Prog)");
            entity.Property(e => e.PrimConsArt82ProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsArt82(ProgVideo)");
            entity.Property(e => e.PrimConsConvSecBilMultHosNoProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsConvSecBilMultHOS(NoProg)");
            entity.Property(e => e.PrimConsConvSecBilMultHosNoProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsConvSecBilMultHOS(NoProgVideo)");
            entity.Property(e => e.PrimConsConvSecBilMultHosProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsConvSecBilMultHOS(Prog)");
            entity.Property(e => e.PrimConsConvSecBilMultHosProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsConvSecBilMultHOS(ProgVideo)");
            entity.Property(e => e.PrimConsConvSectBilMultNoProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsConvSectBilMult(NoProg)");
            entity.Property(e => e.PrimConsConvSectBilMultNoProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsConvSectBilMult(NoProgVideo)");
            entity.Property(e => e.PrimConsConvSectBilMultProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsConvSectBilMult(Prog)");
            entity.Property(e => e.PrimConsConvSectBilMultProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsConvSectBilMult(ProgVideo)");
            entity.Property(e => e.PrimConsEgyapart12HosNoProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsEGYAPArt12HOS(NoProg)");
            entity.Property(e => e.PrimConsEgyapart12HosNoProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsEGYAPArt12HOS(NoProgVideo)");
            entity.Property(e => e.PrimConsEgyapart12HosProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsEGYAPArt12HOS(Prog)");
            entity.Property(e => e.PrimConsEgyapart12HosProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsEGYAPArt12HOS(ProgVideo)");
            entity.Property(e => e.PrimConsHosNoProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsHOS(NoProg)");
            entity.Property(e => e.PrimConsHosNoProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsHOS(NoProgVideo)");
            entity.Property(e => e.PrimConsHosProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsHOS(Prog)");
            entity.Property(e => e.PrimConsHosProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsHOS(ProgVideo)");
            entity.Property(e => e.PrimConsNoProg25km)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimCons(NoProg)25km");
            entity.Property(e => e.PrimConsNoProg50km)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimCons(NoProg)50km");
            entity.Property(e => e.PrimConsNoProg50km1)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimCons(NoProg)+50km");
            entity.Property(e => e.PrimConsNoProgVideo25km)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimCons(NoProgVideo)25km");
            entity.Property(e => e.PrimConsNoProgVideo50km)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimCons(NoProgVideo)50km");
            entity.Property(e => e.PrimConsNoProgVideo50km1)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimCons(NoProgVideo)+50km");
            entity.Property(e => e.PrimConsProg25km).HasColumnName("PrimCons(Prog)25km");
            entity.Property(e => e.PrimConsProg50km).HasColumnName("PrimCons(Prog)50km");
            entity.Property(e => e.PrimConsProg50km1).HasColumnName("PrimCons(Prog)+50km");
            entity.Property(e => e.PrimConsProgVideo25km).HasColumnName("PrimCons(ProgVideo)25km");
            entity.Property(e => e.PrimConsProgVideo50km).HasColumnName("PrimCons(ProgVideo)50km");
            entity.Property(e => e.PrimConsProgVideo50km1).HasColumnName("PrimCons(ProgVideo)+50km");
            entity.Property(e => e.PrimConsnoapantNoProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsnoapant(NoProg)");
            entity.Property(e => e.PrimConsnoapantNoProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsnoapant(NoProgVideo)");
            entity.Property(e => e.PrimConsnoapantProg)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsnoapant(Prog)");
            entity.Property(e => e.PrimConsnoapantProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsnoapant(ProgVideo)");
            entity.Property(e => e.PrimConsotmutArt12Prog)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrimConsotmutArt12(Prog)");
            entity.Property(e => e.PrimConsotmutArt12ProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsotmutArt12(ProgVideo)");
            entity.Property(e => e.PrimConsotrmutArt12HosNoProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsotrmutArt12HOS(NoProg)");
            entity.Property(e => e.PrimConsotrmutArt12HosNoProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsotrmutArt12HOS(NoProgVideo)");
            entity.Property(e => e.PrimConsotrmutArt12HosProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsotrmutArt12HOS(Prog)");
            entity.Property(e => e.PrimConsotrmutArt12HosProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsotrmutArt12HOS(ProgVideo)");
            entity.Property(e => e.PrimConsotrnoapantNoProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsotrnoapant(NoProg)");
            entity.Property(e => e.PrimConsotrnoapantNoProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsotrnoapant(NoProgVideo)");
            entity.Property(e => e.PrimConsotrnoapantProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsotrnoapant(Prog)");
            entity.Property(e => e.PrimConsotrnoapantProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsotrnoapant(ProgVideo)");
            entity.Property(e => e.PrimConsotrosArt12HosNoProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsotrosArt12HOS(NoProg)");
            entity.Property(e => e.PrimConsotrosArt12HosNoProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsotrosArt12HOS(NoProgVideo)");
            entity.Property(e => e.PrimConsotrosArt12HosProg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsotrosArt12HOS(Prog)");
            entity.Property(e => e.PrimConsotrosArt12HosProgVideo)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrimConsotrosArt12HOS(ProgVideo)");
            entity.Property(e => e.PrmydtrmutArt82Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("PrmydtrmutArt82HOS");
            entity.Property(e => e.PrmydtrmutArt82HosEco)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrmydtrmutArt82HOS(Eco)");
            entity.Property(e => e.PrmydtrmutArt82HosRadio)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrmydtrmutArt82HOS(Radio)");
            entity.Property(e => e.PrmydtrmutArt82HosRm)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrmydtrmutArt82HOS(RM)");
            entity.Property(e => e.PrmydtrmutArt82HosTac)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrmydtrmutArt82HOS(TAC)");
            entity.Property(e => e.PrmydtrmutConvSecBilMultHosEco)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrmydtrmutConvSecBilMultHOS(Eco)");
            entity.Property(e => e.PrmydtrmutConvSecBilMultHosRadio)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrmydtrmutConvSecBilMultHOS(Radio)");
            entity.Property(e => e.PrmydtrmutConvSecBilMultHosRm)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrmydtrmutConvSecBilMultHOS(RM)");
            entity.Property(e => e.PrmydtrmutConvSecBilMultHosTac)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrmydtrmutConvSecBilMultHOS(TAC)");
            entity.Property(e => e.PruBiomArt82).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.PruBiomConvSectBilMult).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.PruBiomEgyapart12Hos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PruBiomEGYAPArt12HOS");
            entity.Property(e => e.PruBiomHos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PruBiomHOS");
            entity.Property(e => e.PruBiomentgyApart12)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PruBiomentgyAPArt12");
            entity.Property(e => e.PruBiomnoapant).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.PruBiomnoapantHos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PruBiomnoapantHOS");
            entity.Property(e => e.PruBiomotmutArt12).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.PruBiomotrmutArt12Hos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PruBiomotrmutArt12HOS");
            entity.Property(e => e.PruBiomotrosArt12).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.PruBiomotrosArt12Hos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PruBiomotrosArt12HOS");
            entity.Property(e => e.PruBiomtrmut).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.PrueBiomArt82Hos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrueBiomArt82HOS");
            entity.Property(e => e.PrueBiomConvSecBilMultHos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("PrueBiomConvSecBilMultHOS");
            entity.Property(e => e.RestPersSanitGastPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.RestPersSanitGastPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.RestPersSanitHorasAgm)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestPersSanitHorasAGM");
            entity.Property(e => e.RestPersSanitHorasAtep)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestPersSanitHorasATEP");
            entity.Property(e => e.RestPersSanitHorasCc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestPersSanitHorasCC");
            entity.Property(e => e.RestPersSanitHorasCp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestPersSanitHorasCP");
            entity.Property(e => e.RestPersSanitHorasIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestPersSanitHorasIT");
            entity.Property(e => e.RestPersSanitHorasPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.RestPersSanitNumPers).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.RestPersSanitNumPersSustInt).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.RestoPersAdminCoste)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestoPers(Admin)coste");
            entity.Property(e => e.RestoPersAdminGastsust)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestoPers(Admin)gastsust");
            entity.Property(e => e.RestoPersAdminHorAg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("RestoPers(Admin)horAG");
            entity.Property(e => e.RestoPersAdminHorAscc)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("RestoPers(Admin)horASCC");
            entity.Property(e => e.RestoPersAdminHorAscp)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("RestoPers(Admin)horASCP");
            entity.Property(e => e.RestoPersAdminHorCit)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("RestoPers(Admin)horCIT");
            entity.Property(e => e.RestoPersAdminHorPss)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("RestoPers(Admin)horPSS");
            entity.Property(e => e.RestoPersAdminNum)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("RestoPers(Admin)num");
            entity.Property(e => e.RestoPersAdminPerssust)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("RestoPers(Admin)perssust");
            entity.Property(e => e.RestoPersNoAdminCoste)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestoPers(NoAdmin)coste");
            entity.Property(e => e.RestoPersNoAdminGastsust)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestoPers(NoAdmin)gastsust");
            entity.Property(e => e.RestoPersNoAdminHorAg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("RestoPers(NoAdmin)horAG");
            entity.Property(e => e.RestoPersNoAdminHorAscc)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("RestoPers(NoAdmin)horASCC");
            entity.Property(e => e.RestoPersNoAdminHorAscp)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("RestoPers(NoAdmin)horASCP");
            entity.Property(e => e.RestoPersNoAdminHorCit)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("RestoPers(NoAdmin)horCIT");
            entity.Property(e => e.RestoPersNoAdminHorPss)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("RestoPers(NoAdmin)horPSS");
            entity.Property(e => e.RestoPersNoAdminNum)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("RestoPers(NoAdmin)num");
            entity.Property(e => e.RestoPersNoAdminPerssust)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("RestoPers(NoAdmin)perssust");
            entity.Property(e => e.Restofaccoste).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.RestofachorAscc)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestofachorASCC");
            entity.Property(e => e.RestofachorAscp)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestofachorASCP");
            entity.Property(e => e.RestofachorCit)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestofachorCIT");
            entity.Property(e => e.RestofachorPss)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestofachorPSS");
            entity.Property(e => e.Restofacnum).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.RestperssanitArt6Coste)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Restperssanit(art6)coste");
            entity.Property(e => e.RestperssanitArt6Gastsust)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Restperssanit(art6)gastsust");
            entity.Property(e => e.RestperssanitArt6HorAg)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Restperssanit(art6)horAG");
            entity.Property(e => e.RestperssanitArt6HorAscc)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Restperssanit(art6)horASCC");
            entity.Property(e => e.RestperssanitArt6HorAscp)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Restperssanit(art6)horASCP");
            entity.Property(e => e.RestperssanitArt6HorCit)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Restperssanit(art6)horCIT");
            entity.Property(e => e.RestperssanitArt6HorPss)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Restperssanit(art6)horPSS");
            entity.Property(e => e.RestperssanitArt6Horassust)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("Restperssanit(art6)horassust");
            entity.Property(e => e.RestperssanitArt6Num)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Restperssanit(art6)num");
            entity.Property(e => e.RestperssanitArt6Perssust)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("Restperssanit(art6)perssust");
            entity.Property(e => e.SesrehabArt82).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.SesrehabConvSectBilMult).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.SesrehabentgyApart12)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("SesrehabentgyAPArt12");
            entity.Property(e => e.Sesrehabnoapant).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.SesrehabotmutArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.SesrehabotrosArt12).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.SesrehabtrmutHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("SesrehabtrmutHOS");
            entity.Property(e => e.SrehabEgyapart12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("SrehabEGYAPArt12HOS");
            entity.Property(e => e.SrehabnoapantHos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("SrehabnoapantHOS");
            entity.Property(e => e.SrehabotrmutArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("SrehabotrmutArt12HOS");
            entity.Property(e => e.SrehabotrosArt12Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("SrehabotrosArt12HOS");
            entity.Property(e => e.SrehabtrmutArt82Hos)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("SrehabtrmutArt82HOS");
            entity.Property(e => e.SrehabtrmutConvSecBilMultHos)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("SrehabtrmutConvSecBilMultHOS");
            entity.Property(e => e.SuptotConst).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.TprevBcoste)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("TPrevBcoste");
            entity.Property(e => e.TprevBhorPss)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("TPrevBhorPSS");
            entity.Property(e => e.TprevBnum)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("TPrevBnum");
            entity.Property(e => e.TprevMcoste)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("TPrevMcoste");
            entity.Property(e => e.TprevMhorPss)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("TPrevMhorPSS");
            entity.Property(e => e.TprevMnum)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("TPrevMnum");
            entity.Property(e => e.TprevScoste)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("TPrevScoste");
            entity.Property(e => e.TprevShorPss)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("TPrevShorPSS");
            entity.Property(e => e.TprevSnum)
                .HasColumnType("numeric(10, 0)")
                .HasColumnName("TPrevSnum");
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<Icg07>(entity =>
        {
            entity.HasKey(e => e.IdIcg).HasName("PK_ICG07_1");

            entity.ToTable("ICG07");

            entity.Property(e => e.IdIcg).HasColumnName("Id_ICG");
            entity.Property(e => e.AgrupacionId).HasColumnName("Agrupacion_id");
            entity.Property(e => e.Art2581).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Art2582).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Asambiomec).HasColumnName("ASAMBiomec");
            entity.Property(e => e.Asamconseenf).HasColumnName("ASAMconseenf");
            entity.Property(e => e.Asamconssuc).HasColumnName("ASAMconssuc");
            entity.Property(e => e.AsamconssucVideo).HasColumnName("ASAMconssuc(Video)");
            entity.Property(e => e.Asamestcaus).HasColumnName("ASAMestcaus");
            entity.Property(e => e.Asamintquir).HasColumnName("ASAMintquir");
            entity.Property(e => e.Asamintquirmp).HasColumnName("ASAMintquirmp");
            entity.Property(e => e.Asamotrasprueb).HasColumnName("ASAMotrasprueb");
            entity.Property(e => e.AsamplacradEco).HasColumnName("ASAMplacrad(Eco)");
            entity.Property(e => e.AsamplacradRadio).HasColumnName("ASAMplacrad(RADIO)");
            entity.Property(e => e.AsamplacradRm).HasColumnName("ASAMplacrad(RM)");
            entity.Property(e => e.AsamplacradTac).HasColumnName("ASAMplacrad(TAC)");
            entity.Property(e => e.AsamprimconsNoProg).HasColumnName("ASAMprimconsNoProg");
            entity.Property(e => e.AsamprimconsNoProgVideo).HasColumnName("ASAMprimconsNoProg(Video)");
            entity.Property(e => e.AsamprimconsProg).HasColumnName("ASAMprimconsProg");
            entity.Property(e => e.AsamprimconsProgVideo).HasColumnName("ASAMprimconsProg(Video)");
            entity.Property(e => e.Asamsesrehab).HasColumnName("ASAMsesrehab");
            entity.Property(e => e.Ashnbiomec).HasColumnName("ASHNBiomec");
            entity.Property(e => e.Ashnconssuc).HasColumnName("ASHNconssuc");
            entity.Property(e => e.AshnconssucVideo).HasColumnName("ASHNconssuc(video)");
            entity.Property(e => e.AshnconsultasEnfermeria).HasColumnName("ASHNConsultasEnfermeria");
            entity.Property(e => e.Ashnestcaus).HasColumnName("ASHNestcaus");
            entity.Property(e => e.Ashnintquir).HasColumnName("ASHNintquir");
            entity.Property(e => e.Ashnintquirmp).HasColumnName("ASHNintquirmp");
            entity.Property(e => e.Ashnotrasprueb).HasColumnName("ASHNotrasprueb");
            entity.Property(e => e.AshnplacradEco).HasColumnName("ASHNplacrad(Eco)");
            entity.Property(e => e.AshnplacradRadio).HasColumnName("ASHNplacrad(RADIO)");
            entity.Property(e => e.AshnplacradRm).HasColumnName("ASHNplacrad(RM)");
            entity.Property(e => e.AshnplacradTac).HasColumnName("ASHNplacrad(TAC)");
            entity.Property(e => e.AshnprimconsNoProg).HasColumnName("ASHNprimconsNoProg");
            entity.Property(e => e.AshnprimconsNoProgVideo).HasColumnName("ASHNprimconsNoProg(video)");
            entity.Property(e => e.AshnprimconsProg).HasColumnName("ASHNprimconsProg");
            entity.Property(e => e.AshnprimconsProgVideo).HasColumnName("ASHNprimconsProg(video)");
            entity.Property(e => e.Ashnsesrehab).HasColumnName("ASHNsesrehab");
            entity.Property(e => e.CitnintervencionesQuirurjicas).HasColumnName("CITNIntervencionesQuirurjicas");
            entity.Property(e => e.CitnotrasPruebasControl).HasColumnName("CITNOtrasPruebasControl");
            entity.Property(e => e.Citnºconsesp).HasColumnName("CITnºconsesp");
            entity.Property(e => e.Citnºintquir).HasColumnName("CITnºintquir");
            entity.Property(e => e.Citnºotrpru).HasColumnName("CITnºotrpru");
            entity.Property(e => e.Citnºsesrehab).HasColumnName("CITnºsesrehab");
            entity.Property(e => e.ConciertoId).HasColumnName("Concierto_id");
            entity.Property(e => e.CosteIt)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("CosteIT");
            entity.Property(e => e.CostePrl).HasColumnName("CostePRL");
            entity.Property(e => e.Costeassan).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Cp).HasColumnName("CP");
            entity.Property(e => e.Dista2550km).HasColumnName("Dista25-50km");
            entity.Property(e => e.Fautorizacion).HasColumnType("datetime");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.GastoCentroNoConcert).HasColumnType("numeric(10, 2)");
            entity.Property(e => e.Icg072014).HasColumnName("ICG07_2014");
            entity.Property(e => e.Pasinurg).HasColumnName("PAsinurg");
            entity.Property(e => e.Paurgencias).HasColumnName("PAurgencias");
            entity.Property(e => e.PersjurOsp).HasColumnName("PersjurOSP");
            entity.Property(e => e.RestoArticulo25Scon)
                .HasColumnType("numeric(10, 2)")
                .HasColumnName("RestoArticulo25SCon");
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<IcgConcierto>(entity =>
        {
            entity.HasKey(e => e.Id_Icg);

            entity.ToTable("IcgConciertos");

            entity.Property(e => e.Id_Icg).HasColumnName("Id_Icg");
            entity.Property(e => e.Concierto_id).HasColumnName("Concierto_id");
            entity.Property(e => e.CodCASA).HasColumnName("CodCasa");
            entity.Property(e => e.Centro_id).HasColumnName("Centro_id");
            entity.Property(e => e.AsistenciaSanitaria).HasColumnType("nvarchar(max)");
            entity.Property(e => e.IncapacidadTemp).HasColumnType("nvarchar(max)");
            entity.Property(e => e.Gastos).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Total).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<Informe>(entity =>
        {
            entity.Property(e => e.InformeId).HasColumnName("Informe_id");
            entity.Property(e => e.Informe1)
                .HasMaxLength(100)
                .HasColumnName("Informe");
            entity.Property(e => e.Pagina).HasMaxLength(100);
            entity.Property(e => e.Tipo).HasMaxLength(50);
        });

        modelBuilder.Entity<InformesAcuerdo>(entity =>
        {
            entity.HasKey(e => e.InformesId);

            entity.ToTable("Informes_Acuerdos");

            entity.Property(e => e.InformesId).HasColumnName("Informes_id");
            entity.Property(e => e.EstadoInformeId).HasColumnName("EstadoInforme_id");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.Informe)
                .HasMaxLength(250)
                .IsFixedLength();
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.TipoAcuerdo)
                .HasMaxLength(10)
                .IsFixedLength();
        });

        modelBuilder.Entity<InformesDireccionAgrupado>(entity =>
        {
            entity.HasKey(e => e.InformeId);

            entity.ToTable("Informes_Direccion_Agrupados");

            entity.Property(e => e.InformeId).HasColumnName("Informe_id");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
        });

        modelBuilder.Entity<InformesIcg>(entity =>
        {
            entity.HasKey(e => e.InformeId).HasName("PK_Informes_ICG06");

            entity.ToTable("Informes_ICG");

            entity.Property(e => e.InformeId).HasColumnName("Informe_id");
            entity.Property(e => e.EstadoInformeId).HasColumnName("EstadoInforme_id");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Año).HasColumnName("Anio");
            entity.Property(e => e.UsuarioModificación).HasColumnName("UsuarioModificación");
            entity.Property(e => e.TipoIcg)
                .HasMaxLength(10)
                .HasColumnName("TipoICG");
        });

        modelBuilder.Entity<Motivo>(entity =>
        {
            entity.Property(e => e.MotivoId).HasColumnName("Motivo_id");
            entity.Property(e => e.Motivo1)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Motivo");
        });

        modelBuilder.Entity<Mutua>(entity =>
        {
            entity.HasKey(e => e.MutuaId).HasFillFactor(100);

            entity.Property(e => e.MutuaId)
                //.ValueGeneratedNever()
                .ValueGeneratedOnAdd()
                .HasColumnName("Mutua_id");
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
            entity.Property(e => e.Fax)
                .HasMaxLength(15)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaBaja).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.Logotipo)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Mutua1)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Mutua");
            entity.Property(e => e.NumeroMutua)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.PersonaContacto)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.PoblacionId).HasColumnName("Poblacion_id");
            entity.Property(e => e.RatioConsultas).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.RazonSocial)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Telefono)
                .HasMaxLength(15)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.UsuarioBajaId).HasColumnName("UsuarioBaja_id");
            entity.Property(e => e.UsuarioId).HasColumnName("Usuario_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
            entity.HasOne(d => d.PoblacionNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.PoblacionId);

        });

        modelBuilder.Entity<MutuasBm>(entity =>
        {
            entity.HasKey(e => e.MutuaId);

            entity.ToTable("Mutuas_bm");

            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
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
            entity.Property(e => e.Fax)
                .HasMaxLength(15)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaBaja).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.Logotipo)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Mutua)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.NumeroMutua)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.PersonaContacto)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.PoblacionId).HasColumnName("Poblacion_id");
            entity.Property(e => e.RazonSocial)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Telefono)
                .HasMaxLength(15)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.UsuarioBajaId).HasColumnName("UsuarioBaja_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<MutuasPresupuesto>(entity =>
        {
            entity.HasKey(e => e.IdPresupuesto);

            entity.ToTable("MutuasPresupuesto");

            entity.Property(e => e.IdPresupuesto).HasColumnName("Id_Presupuesto");
            entity.Property(e => e.Año)
                .HasMaxLength(4)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.PresupuestoGastosFinancieros).HasDefaultValue(0.0, "DF_MutuasPresupuesto_PresupuestoGastosFinancieros_1");
        });

        modelBuilder.Entity<Oferta>(entity =>
        {
            entity.Property(e => e.OfertaId).HasColumnName("Oferta_id");
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.DemandaId).HasColumnName("Demanda_id");
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.EstadoId).HasColumnName("Estado_id");
            entity.Property(e => e.FechaAsignacion).HasColumnType("datetime");
            entity.Property(e => e.FechaConfirmacion).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
            entity.Property(e => e.Año).HasColumnName("Año");
        });

        modelBuilder.Entity<Perfile>(entity =>
        {
            entity.HasKey(e => e.PerfilId).HasName("PK_TipoAcceso");

            entity.Property(e => e.PerfilId).HasColumnName("Perfil_id");
            entity.Property(e => e.Perfil)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Proveedore>(entity =>
        {
            entity.HasKey(e => e.ProveedorId);

            entity.Property(e => e.ProveedorId).HasColumnName("Proveedor_id");
            entity.Property(e => e.Cifnif)
                .HasMaxLength(15)
                .HasColumnName("CIFNIF");
            entity.Property(e => e.CodigoCuenta).HasMaxLength(50);
            entity.Property(e => e.Cp)
                .HasMaxLength(5)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CP");
            entity.Property(e => e.PoblacionId).HasColumnName("Poblacion_id");
            entity.Property(e => e.Proveedor).HasMaxLength(150);
            entity.Property(e => e.TipoProveedorId).HasColumnName("TipoProveedor_id");
        });

        modelBuilder.Entity<PsAcuerdosBiMultilateralesMutuasDemandum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PS_Acuer__3214EC274CC3B304");

            entity.ToTable("PS_AcuerdosBI_MultilateralesMutuas_Demanda");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ContraprestacionEconomica).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.IdmutuaAnio)
                .HasMaxLength(15)
                .HasColumnName("IDMutuaAnio");
            entity.Property(e => e.MutuaDemandanteId).HasColumnName("MutuaDemandante_id");
            entity.Property(e => e.MutuaOfertanteId).HasColumnName("MutuaOfertante_id");
        });

        modelBuilder.Entity<PsAcuerdosBiMultilateralesMutuasOfertum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PS_Acuer__3214EC2756242C9C");

            entity.ToTable("PS_AcuerdosBI_MultilateralesMutuas_Oferta");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ContraprestacionEconomica).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.IdmutuaAnio)
                .HasMaxLength(15)
                .HasColumnName("IDMutuaAnio");
            entity.Property(e => e.MutuaDemandanteId).HasColumnName("MutuaDemandante_id");
            entity.Property(e => e.MutuaOfertanteId).HasColumnName("MutuaOfertante_id");
        });

        modelBuilder.Entity<PsAcuerdosBiMultilateralesMutuasProvinciasDemandum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PS_Acuer__3214EC274FBA91AE");

            entity.ToTable("PS_AcuerdosBI_MultilateralesMutuasProvincias_Demanda");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ContraprestacionEconomicaBi)
                .HasColumnType("numeric(18, 2)")
                .HasColumnName("ContraprestacionEconomicaBI");
            entity.Property(e => e.ContraprestacionEconomicaTerceros).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.IdmutuaAnio)
                .HasMaxLength(15)
                .HasColumnName("IDMutuaAnio");
            entity.Property(e => e.MutuaDemandanteId).HasColumnName("MutuaDemandante_id");
            entity.Property(e => e.NumServiciosBi).HasColumnName("NumServiciosBI");
            entity.Property(e => e.ProvinciaId).HasColumnName("Provincia_id");
        });

        modelBuilder.Entity<PsAcuerdosBiMultilateralesMutuasProvinciasOfertum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PS_Acuer__3214EC278C50ED46");

            entity.ToTable("PS_AcuerdosBI_MultilateralesMutuasProvincias_Oferta");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ContraprestacionEconomicaBi)
                .HasColumnType("numeric(18, 2)")
                .HasColumnName("ContraprestacionEconomicaBI");
            entity.Property(e => e.ContraprestacionEconomicaTerceros).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.IdmutuaAnio)
                .HasMaxLength(15)
                .HasColumnName("IDMutuaAnio");
            entity.Property(e => e.MutuaOfertanteId).HasColumnName("MutuaOfertante_id");
            entity.Property(e => e.NumServiciosBi).HasColumnName("NumServiciosBI");
            entity.Property(e => e.ProvinciaId).HasColumnName("Provincia_id");
        });

        modelBuilder.Entity<PsAcuerdosBiMultilateralesMutuasTipoServicioDemandum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PS_Acuer__3214EC2775B82324");

            entity.ToTable("PS_AcuerdosBI_MultilateralesMutuasTipoServicio_Demanda");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ContraprestacionEconomicaBi)
                .HasColumnType("numeric(18, 2)")
                .HasColumnName("ContraprestacionEconomicaBI");
            entity.Property(e => e.ContraprestacionEconomicaTerceros).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.IdmutuaAnio)
                .HasMaxLength(15)
                .HasColumnName("IDMutuaAnio");
            entity.Property(e => e.MutuaDemandanteId).HasColumnName("MutuaDemandante_id");
            entity.Property(e => e.NumServiciosBi).HasColumnName("NumServiciosBI");
            entity.Property(e => e.NumTipoServicio).HasMaxLength(2);
            entity.Property(e => e.TipoServicioId).HasColumnName("TipoServicio_id");
        });

        modelBuilder.Entity<PsAcuerdosBiMultilateralesMutuasTipoServicioOfertum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PS_Acuer__3214EC2720C768F2");

            entity.ToTable("PS_AcuerdosBI_MultilateralesMutuasTipoServicio_Oferta");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ContraprestacionEconomicaBi)
                .HasColumnType("numeric(18, 2)")
                .HasColumnName("ContraprestacionEconomicaBI");
            entity.Property(e => e.ContraprestacionEconomicaTerceros).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.IdmutuaAnio)
                .HasMaxLength(15)
                .HasColumnName("IDMutuaAnio");
            entity.Property(e => e.MutuaOfertanteId).HasColumnName("MutuaOfertante_id");
            entity.Property(e => e.NumServiciosBi).HasColumnName("NumServiciosBI");
            entity.Property(e => e.NumTipoServicio).HasMaxLength(2);
            entity.Property(e => e.TipoServicioId).HasColumnName("TipoServicio_id");
        });

        modelBuilder.Entity<RegistroActividad>(entity =>
        {
            entity.HasKey(e => e.RegistroId);

            entity.ToTable("RegistroActividad");

            entity.Property(e => e.RegistroId).HasColumnName("Registro_id");
            entity.Property(e => e.Accion).HasMaxLength(250);
            entity.Property(e => e.Fecha).HasColumnType("datetime");
            entity.Property(e => e.Sql).HasColumnType("text");
            entity.Property(e => e.UsuarioId).HasColumnName("Usuario_id");
        });

        modelBuilder.Entity<RegistroErrore>(entity =>
        {
            entity.HasKey(e => e.ErrorId).HasName("PK_REGISTRO_ERRORES");

            entity.ToTable("Registro_Errores");

            entity.Property(e => e.ErrorId).HasColumnName("Error_id");
            entity.Property(e => e.Comentarios).HasMaxLength(2000);
            entity.Property(e => e.Descripcion).HasMaxLength(2000);
            entity.Property(e => e.EstadoId).HasColumnName("Estado_Id");
            entity.Property(e => e.FechaCierre).HasColumnType("datetime");
            entity.Property(e => e.FechaError).HasColumnType("datetime");
            entity.Property(e => e.FechaResolucion).HasColumnType("datetime");
            entity.Property(e => e.FicheroLog).HasMaxLength(200);
            entity.Property(e => e.UsuarioId).HasColumnName("Usuario_id");
        });

        modelBuilder.Entity<SeguimientoOd>(entity =>
        {
            entity.HasKey(e => e.GestionId);

            entity.ToTable("SeguimientoOD");

            entity.Property(e => e.GestionId).HasColumnName("Gestion_id");
            entity.Property(e => e.DescripcionAccionId).HasColumnName("DescripcionAccion_id");
            entity.Property(e => e.EstadoId).HasColumnName("Estado_id");
            entity.Property(e => e.EstadoLinea).HasColumnName("Estado_Linea");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.OfertaDemandaId).HasColumnName("OfertaDemanda_id");
            entity.Property(e => e.TipoAccionId).HasColumnName("TipoAccion_id");
            entity.Property(e => e.UsuarioId).HasColumnName("Usuario_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<ServiciosEspecialidadesComparacion2>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("ServiciosEspecialidades_Comparacion2");

            entity.Property(e => e.ProvinciaId)
                .HasMaxLength(50)
                .HasColumnName("Provincia_id");
        });

        modelBuilder.Entity<Subgrupo>(entity =>
        {
            entity.Property(e => e.SubgrupoId)
                .HasMaxLength(6)
                .IsUnicode(false)
                .HasColumnName("Subgrupo_id");
            entity.Property(e => e.FechaAlta).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.GrupoId)
                .HasMaxLength(4)
                .IsUnicode(false)
                .HasColumnName("Grupo_id");
            entity.Property(e => e.Subgrupo1)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Subgrupo");
            entity.Property(e => e.UsuarioAltaId).HasColumnName("UsuarioAlta_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<Tarifa>(entity =>
        {
            entity.HasKey(e => e.TarifaId).HasName("PK_Tarifas_1");

            entity.Property(e => e.TarifaId).HasColumnName("Tarifa_id");
            entity.Property(e => e.Año).HasMaxLength(4);
            entity.Property(e => e.Tarifa1)
                .HasMaxLength(250)
                .HasColumnName("Tarifa");
        });

        modelBuilder.Entity<TarifasDetalle>(entity =>
        {
            entity.HasKey(e => e.TarifaDetalleId).HasName("PK_TarifasDetalle_1");

            entity.ToTable("TarifasDetalle");

            entity.Property(e => e.TarifaDetalleId).HasColumnName("TarifaDetalle_id");
            entity.Property(e => e.CiepId).HasColumnName("CIEP_id");
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.Observaciones).HasColumnType("ntext");
            entity.Property(e => e.Servicio).HasMaxLength(150);
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
            entity.Property(e => e.TarifaId).HasColumnName("Tarifa_id");

            entity.HasOne(d => d.Tarifa).WithMany(p => p.TarifasDetalles)
                .HasForeignKey(d => d.TarifaId)
                .HasConstraintName("FK_TarifasDetalle_Tarifas");
        });

        modelBuilder.Entity<TiposAsistencium>(entity =>
        {
            entity.HasKey(e => new { e.RegistroId, e.TipoAsistenciaId, e.Año }).HasName("PK_TiposConcierto");

            entity.Property(e => e.RegistroId)
                .ValueGeneratedOnAdd()
                .HasColumnName("Registro_id");
            entity.Property(e => e.TipoAsistenciaId).HasColumnName("TipoAsistencia_id");
            entity.Property(e => e.TipoAsistencia)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TiposDemandum>(entity =>
        {
            entity.HasKey(e => e.TipoDemandaId);

            entity.Property(e => e.TipoDemandaId).HasColumnName("TipoDemanda_id");
            entity.Property(e => e.ActivaId).HasColumnName("Activa_id");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.TipoDemanda).HasMaxLength(250);
            entity.Property(e => e.TipoId).HasColumnName("Tipo_id");
            entity.Property(e => e.UsuarioModificacionId).HasColumnName("UsuarioModificacion_id");
        });

        modelBuilder.Entity<TiposVium>(entity =>
        {
            entity.HasKey(e => e.TipoViaId);

            entity.Property(e => e.TipoViaId).HasColumnName("TipoVia_id");
            entity.Property(e => e.TipoVia).HasMaxLength(50);
            entity.Property(e => e.TipoViaAbreviada)
                .HasMaxLength(50)
                .HasColumnName("TipoVia_Abreviada");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.Property(e => e.UsuarioId).HasColumnName("Usuario_id");
            entity.Property(e => e.Apellidos).HasMaxLength(150);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            /*
            entity.Property(e => e.Contraseña)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasColumnName("Contraseña");
            */
            entity.Property(e => e.CorreoElectronico).IsUnicode(false);
            entity.Property(e => e.DgossrecibeCorreo).HasColumnName("DGOSSRecibeCorreo");
            entity.Property(e => e.DireccionElectronica).HasMaxLength(150);
            entity.Property(e => e.FechaBaja).HasColumnType("datetime");
            entity.Property(e => e.FechaPassword).HasColumnType("datetime");
            entity.Property(e => e.LimiteCorreos).HasDefaultValue(0, "DF_Usuarios_LimiteCorreos");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Nombre).HasMaxLength(50);
            entity.Property(e => e.PassTmp)
                .HasMaxLength(100)
                .HasColumnName("Pass_TMP");
            entity.Property(e => e.Password)
                .IsUnicode(false)
                .HasColumnName("Password");
            entity.Property(e => e.PerfilId).HasColumnName("Perfil_id");
            entity.Property(e => e.PreguntaRecordatorio).HasMaxLength(150);
            entity.Property(e => e.RespuestaRecordatorio).HasMaxLength(150);
            entity.Property(e => e.UltimoLogin).HasColumnType("datetime");
            entity.Property(e => e.Usuario1)
                .HasMaxLength(50)
                .HasColumnName("Usuario");
        });

        modelBuilder.Entity<UsuariosPorPerfilesModificar>(entity =>
        {
            entity.HasKey(e => e.AccesoUsuarioId);

            entity.ToTable("UsuariosPorPerfilesModificar");

            entity.Property(e => e.AccesoUsuarioId).HasColumnName("AccesoUsuario_id");
            entity.Property(e => e.PerfilId).HasColumnName("Perfil_id");
            entity.Property(e => e.PerfilModificarId).HasColumnName("PerfilModificar_id");
        });

        modelBuilder.Entity<UsuariosWeb>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Usuarios_web");

            entity.Property(e => e.CaducidadToken).HasColumnType("datetime");
            entity.Property(e => e.UsuarioId)
                .ValueGeneratedOnAdd()
                .HasColumnName("Usuario_id");
            entity.Property(e => e.UsuarioIdApp).HasColumnName("Usuario_id_app");
        });

        modelBuilder.Entity<VwCitacione>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vwCitaciones");

            entity.Property(e => e.Centro).HasMaxLength(201);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.CitacionId).HasColumnName("citacion_id");
            entity.Property(e => e.DireccionGis)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DireccionGIS");
            entity.Property(e => e.Especialidad).HasMaxLength(150);
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.Estado).HasMaxLength(200);
            entity.Property(e => e.EstadoId).HasColumnName("Estado_id");
            entity.Property(e => e.FechaAltaSolicitud).HasColumnType("datetime");
            entity.Property(e => e.FechaAsignacion).HasColumnType("datetime");
            entity.Property(e => e.FechaConfirmacion).HasColumnType("datetime");
            entity.Property(e => e.FechaRechazo).HasColumnType("datetime");
            entity.Property(e => e.FechaRespuestaCitacion).HasColumnType("datetime");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.LocalidadId).HasColumnName("Localidad_id");
            entity.Property(e => e.MovimientoId).HasColumnName("Movimiento_id");
            entity.Property(e => e.MutuaOfertante)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.MutuaSolicitante)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Provincia)
                .HasMaxLength(200)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.ProvinciaId).HasColumnName("Provincia_id");
            entity.Property(e => e.Servicio).HasMaxLength(200);
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
            entity.Property(e => e.Telefono)
                .HasMaxLength(15)
                .IsUnicode(false)
                .IsFixedLength();
        });

        modelBuilder.Entity<VwConcertadosNoValidado>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Concertados_NoValidados");

            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.ConciertoId).HasColumnName("Concierto_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
        });

        modelBuilder.Entity<VwConcertadosValidado>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Concertados_Validados");

            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.ConciertoId).HasColumnName("Concierto_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
        });

        modelBuilder.Entity<VwConciertosArticulo25>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Conciertos_Articulo25");

            entity.Property(e => e.CapituloCm)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("CapituloCM");
            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.ConceptoCm)
                .HasMaxLength(6)
                .IsUnicode(false)
                .HasColumnName("ConceptoCM");
            entity.Property(e => e.ConciertoId).HasColumnName("Concierto_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Respuesta).HasColumnType("numeric(38, 2)");
        });

        modelBuilder.Entity<VwConciertosArticulo2581>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Conciertos_Articulo258_1");

            entity.Property(e => e.CapituloCm)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("CapituloCM");
            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.ConceptoCm)
                .HasMaxLength(6)
                .IsUnicode(false)
                .HasColumnName("ConceptoCM");
            entity.Property(e => e.ConciertoId).HasColumnName("Concierto_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Respuesta).HasColumnType("numeric(38, 2)");
        });

        modelBuilder.Entity<VwConciertosArticulo2582>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Conciertos_Articulo258_2");

            entity.Property(e => e.CapituloCm)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("CapituloCM");
            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.ConceptoCm)
                .HasMaxLength(6)
                .IsUnicode(false)
                .HasColumnName("ConceptoCM");
            entity.Property(e => e.ConciertoId).HasColumnName("Concierto_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Respuesta).HasColumnType("numeric(38, 2)");
        });

        modelBuilder.Entity<VwConciertosArticulo25Resto>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Conciertos_Articulo25_Resto");

            entity.Property(e => e.CapituloCm)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("CapituloCM");
            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.ConceptoCm)
                .HasMaxLength(6)
                .IsUnicode(false)
                .HasColumnName("ConceptoCM");
            entity.Property(e => e.ConciertoId).HasColumnName("Concierto_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Respuesta).HasColumnType("numeric(38, 2)");
        });

        modelBuilder.Entity<VwDemandasCitacione>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vwDemandas_Citaciones");

            entity.Property(e => e.Agrupacion).HasMaxLength(719);
            entity.Property(e => e.Centro)
                .HasMaxLength(61)
                .IsUnicode(false);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.CitacionId).HasColumnName("citacion_id");
            entity.Property(e => e.DemandaId)
                .HasMaxLength(125)
                .HasColumnName("Demanda_id");
            entity.Property(e => e.DireccionGis)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DireccionGIS");
            entity.Property(e => e.Especialidad).HasMaxLength(150);
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.Estado).HasMaxLength(200);
            entity.Property(e => e.EstadoCitacionId).HasColumnName("Estado_Citacion_id");
            entity.Property(e => e.EstadoId).HasColumnName("Estado_id");
            entity.Property(e => e.FechaAltaSolicitud).HasColumnType("datetime");
            entity.Property(e => e.FechaAsignacion).HasColumnType("datetime");
            entity.Property(e => e.FechaConfirmacion).HasMaxLength(10);
            entity.Property(e => e.FechaRevision).HasColumnType("datetime");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Mutua)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.MutuaOfertante)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.MutuaOfertanteId).HasColumnName("MutuaOfertante_Id");
            entity.Property(e => e.PeticionesAtendidas).HasColumnName("Peticiones_Atendidas");
            entity.Property(e => e.PeticionesPendientes).HasColumnName("Peticiones_Pendientes");
            entity.Property(e => e.PoblacionId).HasColumnName("Poblacion_id");
            entity.Property(e => e.Provincia)
                .HasMaxLength(200)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.ProvinciaId).HasColumnName("Provincia_id");
            entity.Property(e => e.Servicio).HasMaxLength(200);
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
            entity.Property(e => e.Telefono)
                .HasMaxLength(15)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.TipoId).HasColumnName("Tipo_id");
            entity.Property(e => e.TipoMovimiento)
                .HasMaxLength(7)
                .IsUnicode(false);
            entity.Property(e => e.TipoMovimientoId).HasColumnName("TipoMovimiento_id");
        });

        modelBuilder.Entity<VwDemandasCitacionesSinAgrupar>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vwDemandas_Citaciones_SinAgrupar");

            entity.Property(e => e.Agrupacion).HasMaxLength(719);
            entity.Property(e => e.Centro).HasMaxLength(61);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.CitacionId).HasColumnName("citacion_id");
            entity.Property(e => e.DemandaId)
                .HasMaxLength(125)
                .HasColumnName("Demanda_id");
            entity.Property(e => e.DireccionGis)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DireccionGIS");
            entity.Property(e => e.Especialidad).HasMaxLength(150);
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.EstadoId).HasColumnName("Estado_id");
            entity.Property(e => e.FechaAltaSolicitud).HasColumnType("datetime");
            entity.Property(e => e.FechaAsignacion).HasColumnType("datetime");
            entity.Property(e => e.FechaConfirmacion).HasMaxLength(10);
            entity.Property(e => e.FechaRevision).HasColumnType("datetime");
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Mutua)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.MutuaOfertante)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.MutuaOfertanteId).HasColumnName("MutuaOfertante_Id");
            entity.Property(e => e.PeticionesAtendidas).HasColumnName("Peticiones_Atendidas");
            entity.Property(e => e.PeticionesPendientes).HasColumnName("Peticiones_Pendientes");
            entity.Property(e => e.Provincia)
                .HasMaxLength(200)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Servicio).HasMaxLength(200);
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
            entity.Property(e => e.Telefono)
                .HasMaxLength(15)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.TipoId).HasColumnName("Tipo_id");
            entity.Property(e => e.TipoMovimiento)
                .HasMaxLength(7)
                .IsUnicode(false);
            entity.Property(e => e.TipoMovimientoId).HasColumnName("TipoMovimiento_id");
        });

        modelBuilder.Entity<VwDisponibilidad>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Disponibilidad");

            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
        });

        modelBuilder.Entity<VwDisponibilidadCentro>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_DisponibilidadCentro");

            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.FechaActualizarDisponibilidad).HasColumnType("datetime");
            entity.Property(e => e.FechaModificacion).HasColumnType("datetime");
            entity.Property(e => e.ServicioId).HasColumnName("Servicio_id");
        });

        modelBuilder.Entity<VwEspecialidadesConcierto>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_especialidadesConciertos");

            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.CodigoCasa)
                .HasMaxLength(50)
                .HasColumnName("CodigoCASA");
            entity.Property(e => e.ConciertoEspecialidadId).HasColumnName("ConciertoEspecialidad_id");
            entity.Property(e => e.ConciertoId).HasColumnName("Concierto_id");
            entity.Property(e => e.Especialidad).HasMaxLength(150);
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.Localizador).HasMaxLength(50);
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Servicio).HasMaxLength(200);
        });

        modelBuilder.Entity<VwEspecialidadesPropio>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_EspecialidadesPropios");

            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.CentroPropioEspecialidadId).HasColumnName("CentroPropioEspecialidad_id");
            entity.Property(e => e.Especialidad).HasMaxLength(150);
            entity.Property(e => e.EspecialidadId).HasColumnName("Especialidad_id");
            entity.Property(e => e.Localizador).HasMaxLength(50);
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Servicio).HasMaxLength(150);
        });

        modelBuilder.Entity<VwPropiosArticulo32>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Propios_Articulo32");

            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Respuesta).HasColumnType("numeric(38, 2)");
        });

        modelBuilder.Entity<VwPropiosArticulo62>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Propios_Articulo62");

            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Respuesta).HasColumnType("numeric(38, 2)");
        });

        modelBuilder.Entity<VwPropiosArticulo63>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Propios_Articulo63");

            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Respuesta).HasColumnType("numeric(38, 2)");
        });

        modelBuilder.Entity<VwPropiosCapitulo1>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Propios_Capitulo1");

            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Respuesta).HasColumnType("numeric(38, 2)");
        });

        modelBuilder.Entity<VwPropiosCapitulo1Anterior>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Propios_Capitulo1_Anterior");

            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Respuesta).HasColumnType("numeric(38, 2)");
        });

        modelBuilder.Entity<VwPropiosCapitulo2>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Propios_Capitulo2");

            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Respuesta).HasColumnType("numeric(38, 2)");
        });

        modelBuilder.Entity<VwPropiosCapitulo3>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Propios_Capitulo3");

            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Respuesta).HasColumnType("numeric(38, 2)");
        });

        modelBuilder.Entity<VwPropiosCuenta68>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Propios_Cuenta68");

            entity.Property(e => e.Centro).HasMaxLength(150);
            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
            entity.Property(e => e.Respuesta).HasColumnType("numeric(38, 2)");
        });

        modelBuilder.Entity<VwPropiosNoValidado>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Propios_NoValidados");

            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
        });

        modelBuilder.Entity<VwPropiosValidado>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Propios_Validados");

            entity.Property(e => e.CentroId).HasColumnName("Centro_id");
            entity.Property(e => e.MutuaId).HasColumnName("Mutua_id");
        });

        OnModelCreatingPartial(modelBuilder);
    }
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

