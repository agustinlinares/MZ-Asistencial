using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.Services;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MZAsistencial.Server.Helpers;

var builder = WebApplication.CreateBuilder(args);

// ── Infraestructura ──────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ── Authentication ─────────────────────────────────────────────────────────────
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// ── CORS ─────────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
     "https://localhost:60007",
     "http://localhost:60007",
     "https://localhost:60008",
     "http://localhost:60008",
     "https://localhost:5173",
     "http://localhost:5173"
 )
               .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ── Conexión a la base de datos ──────────────────────────────────────────────
builder.Services.AddDbContext<MZAsistencialContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Helpers ──────────────────────────────────────────────────────────────────
builder.Services.AddMemoryCache();
builder.Services.AddScoped<BruteForceHelper>(provider =>
{
    var config = provider.GetRequiredService<IConfiguration>();
    var connectionString = config.GetConnectionString("DefaultConnection")!;
    return new BruteForceHelper(connectionString);
});
builder.Services.AddScoped<CaptchaHelper>();

// ── Servicios existentes ─────────────────────────────────────────────────────
builder.Services.AddScoped<IRegistroErroresService, RegistroErroresService>();
builder.Services.AddScoped<IRegistrosActividadService, RegistrosActividadService>();
builder.Services.AddScoped<IDescuadresService, DescuadresService>();
builder.Services.AddScoped<CentrosPropiosService>();
builder.Services.AddScoped<RegistroICGService>();
builder.Services.AddScoped<FincaRegistralService>();
builder.Services.AddScoped<ICentrosConcertadosService, CentrosConcertadosService>();
builder.Services.AddScoped<CentroPropioIcgService>();
builder.Services.AddScoped<IAcuerdosBIService, AcuerdosBIService>();
builder.Services.AddScoped<IMutuasService, MutuasService>();
builder.Services.AddScoped<IListaOfertasService, ListaOfertasService>();
builder.Services.AddScoped<IListaDemandasService, ListaDemandasService>();
builder.Services.AddScoped<IAcreditacionesSectorialesService, AcreditacionesSectorialesService>();
builder.Services.AddScoped<IAcreditacionesIndividualesService, AcreditacionesIndividualesService>();
builder.Services.AddScoped<IPlantillasAcuerdoService, PlantillasAcuerdoService>();
builder.Services.AddScoped<DashboardService>();
builder.Services.AddScoped<ICitacionesService, CitacionesService>();
builder.Services.AddScoped<IPresupuestosLiquidadosService, PresupuestosLiquidadosService>();
builder.Services.AddScoped<IFicherosService, FicherosService>();
builder.Services.AddScoped<IExportarAccessService, ExportarAccessService>();
builder.Services.AddScoped<PlantillasICGService>();
builder.Services.AddScoped<ListadoPropiosIcgService>();
builder.Services.AddScoped<Icg06CrearService>();
builder.Services.AddScoped<Icg06ValidarService>();
builder.Services.AddScoped<IConciertosService, ConciertosService>();
builder.Services.AddScoped<IRegistroErroresService, RegistroErroresService>();
builder.Services.AddScoped<ITiposDemandaService, TiposDemandaService>();
builder.Services.AddScoped<IRegistroErroresService, RegistroErroresService>();
builder.Services.AddScoped<ITiposDemandaService, TiposDemandaService>();
builder.Services.AddScoped<IUsuariosService, UsuariosService>();

// ── Servicios ICG06 ──────────────────────────────────────────────────────────
builder.Services.AddScoped<Icg06HosService>();
builder.Services.AddScoped<Icg06AmbService>();
builder.Services.AddScoped<Icg06ConvHosService>();
builder.Services.AddScoped<Icg06ConvAmbService>();
builder.Services.AddScoped<Icg06ItHosService>();
builder.Services.AddScoped<Icg06ItAmbService>();
builder.Services.AddScoped<Icg06OtrasHosService>();
builder.Services.AddScoped<Icg06OtrasAmbService>();
builder.Services.AddScoped<Icg06AsProService>();
builder.Services.AddScoped<Icg06AreaAsistencialService>();
builder.Services.AddScoped<Icg06DatosEconomicosService>();
builder.Services.AddScoped<Icg06DatosGeneralesService>();
builder.Services.AddScoped<Icg06DatosPlantillaService>();
builder.Services.AddScoped<Icg06EspecialidadService>();
builder.Services.AddScoped<Icg06PoblacionProtegidaService>();
builder.Services.AddScoped<ListadoPropiosIcgService>();
builder.Services.AddScoped<IListaDemandasService, ListaDemandasService>();
builder.Services.AddScoped<Icg06CrearService>();
builder.Services.AddScoped<Icg06ValidarService>();
builder.Services.AddScoped<IRegistrosActividadService, RegistrosActividadService>();

// ── Servicios ICG07 (Conciertos) ─────────────────────────────────────────────
builder.Services.AddScoped<IcgConciertosService>();

// ── Pipeline ─────────────────────────────────────────────────────────────────
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();