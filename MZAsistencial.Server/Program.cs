using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Infraestructura ──────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// ── Servicios existentes ─────────────────────────────────────────────────────
builder.Services.AddScoped<IDescuadresService, DescuadresService>();
builder.Services.AddScoped<CentrosPropiosService>();
builder.Services.AddScoped<RegistroICGService>();
builder.Services.AddScoped<FincaRegistralService>();
builder.Services.AddScoped<ICentrosConcertadosService, CentrosConcertadosService>();
builder.Services.AddScoped<CentroPropioIcgService>();
builder.Services.AddScoped<IAcuerdosBIService, AcuerdosBIService>();
builder.Services.AddScoped<IMutuasService, MutuasService>();
builder.Services.AddScoped<IListaOfertasService, ListaOfertasService>();

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
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();