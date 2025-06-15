using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TransactionService.Data;
using TransactionService.Interfaces;
using TransactionService.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});

builder.WebHost.UseUrls("http://0.0.0.0:80");


// Leer la cadena de conexión desde appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Registrar el contexto de EF Core
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Inyectar el servicio y su interfaz
builder.Services.AddScoped<ITransactionService, TransactionService.Services.TransactionService>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TransactionService API",
        Version = "v1"
    });
});

// Controladores y autorización
builder.Services.AddAuthorization();
builder.Services.AddControllers();
// Registro del contexto e interfaz
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());
builder.Services.AddHttpClient("ProductService", client =>
{
    client.BaseAddress = new Uri("https://localhost:7146"); // Puerto de ProductService (ajústalo)
});

builder.Services.AddHttpClient("ProductService", client =>
{
    client.BaseAddress = new Uri("http://productservice");
});


var app = builder.Build();

// Swagger solo en entorno de desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TransactionService API v1");
    });
}

app.UseCors("AllowFrontend");
app.UseAuthorization();

app.MapControllers();

app.Run();
