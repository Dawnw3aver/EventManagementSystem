using EventManagement.Application.Services;
using EventManagement.Core.Abstractions;
using EventManagement.Core.Models;
using EventManagement.DataAccess;
using EventManagement.DataAccess.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthorization();
builder.Services.AddAuthentication().AddCookie(IdentityConstants.ApplicationScheme);

builder.Services.AddIdentityCore<User>()
    .AddEntityFrameworkStores<EventManagementDbContext>()
    .AddApiEndpoints();

builder.Services.AddDbContext<EventManagementDbContext>(
    options => 
    {
        options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(EventManagementDbContext)));
    });

builder.Services.AddScoped<IEventsService, EventsService>();
builder.Services.AddScoped<IEventsRepository, EventsRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapIdentityApi<User>();

app.Run();
