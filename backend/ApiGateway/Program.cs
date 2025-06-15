using Ocelot.DependencyInjection;
using Ocelot.Middleware;

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

// Cargar configuración Ocelot
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// Agregar Ocelot
builder.Services.AddOcelot();

var app = builder.Build();

app.UseCors("AllowFrontend");

await app.UseOcelot();

app.Run();
