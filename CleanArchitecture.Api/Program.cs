using CleanArchitecture.Api;
using CleanArchitecture.Application;
using CleanArchitecture.Infrastructure;

// Load .env (searching this and parent directories) before configuration is built,
// so its values are already process environment variables when AddEnvironmentVariables() runs.
DotNetEnv.Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApiServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Authentication is wired in Phase 2, alongside Identity/JWT configuration.
app.UseAuthorization();

app.MapControllers();

app.Run();
