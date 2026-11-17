using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
var builder = WebApplication.CreateBuilder(args);

// 1. Add CORS service to allow any origin to connect
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();

// 2. Enable CORS policy before mapping controllers
app.UseCors("AllowAll");

app.MapControllers();

app.UseStaticFiles();

app.Run();