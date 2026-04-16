using Microsoft.EntityFrameworkCore;
using MZAsistencial.Server.Data;
using MZAsistencial.Server.Services;
using MZAsistencial.Server.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://localhost:60007", "http://localhost:60007")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Conexión a la base de datos
builder.Services.AddDbContext<MZAsistencial.Server.Data.MZAsistencialContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Servicios
builder.Services.AddScoped<IDescuadresService, DescuadresService>();
builder.Services.AddScoped<IMutuasService, MutuasService>();
builder.Services.AddScoped<IPlantillasAcuerdoService, PlantillasAcuerdoService>();
builder.Services.AddScoped<FincaRegistralService>();
builder.Services.AddScoped<CentroPropioIcgService>();


var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");
app.Run();
