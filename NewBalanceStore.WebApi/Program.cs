using Firebase.Database;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NewBalanceStore.Application.Common.Behaviors;
using NewBalanceStore.Application.Common.Caching;
using NewBalanceStore.Application.Common.Security;
using NewBalanceStore.Application.Interfaces;
using NewBalanceStore.Application.Mappings;
using NewBalanceStore.Application.Services;
using NewBalanceStore.Domain.Interfaces;
using NewBalanceStore.Infrastructure.Authentication;
using NewBalanceStore.Infrastructure.Configurations;
using NewBalanceStore.Infrastructure.Repositories;
using NewBalanceStore.Infrastructure.Services;
using NewBalanceStore.WebApi.HealthChecks;
using NewBalanceStore.WebApi.Middleware;
using Serilog;
using Serilog.Events;
using System.Text;
using System.Threading.RateLimiting;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithEnvironmentName()
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext}: {Message:lj}{NewLine}{Exception}")
    .WriteTo.File("logs/newbalance-log-.txt", rollingInterval: RollingInterval.Day, restrictedToMinimumLevel: LogEventLevel.Warning)
    .CreateLogger();

try
{
    Log.Information("Запуск веб-додатка NewBalanceStore API...");

    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog();

    builder.Services.AddControllers();
    builder.Services.AddHealthChecks();
    builder.Services.AddProblemDetails();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddMemoryCache();


    builder.Services.AddScoped<IPhotoService, PhotoService>();
    builder.Services.AddScoped<IEmailService, EmailService>();
    builder.Services.AddScoped<IUserRepository, FirebaseUserRepository>();
    builder.Services.AddScoped<IOrderRepository, FirebaseOrderRepository>();
    builder.Services.AddScoped<IProductRepository, FirebaseProductRepository>();
    builder.Services.AddScoped<IProductService, ProductService>();
    builder.Services.AddScoped<IOrderService, OrderService>();
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

    builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
    builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);
    builder.Services.AddHealthChecks().AddCheck<FirebaseHealthCheck>("firebase-check");
    builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(CachingBehavior<,>));
    builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
    builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ProductService).Assembly));

    builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
    builder.Services.AddSingleton(new FirebaseClient("https://newbalancestore-bc142-default-rtdb.europe-west1.firebasedatabase.app/"));
    builder.Services.AddAutoMapper(_ => { }, typeof(OrderMappingProfile).Assembly);

    builder.Services.AddRateLimiter(options =>
    {
        options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
        options.AddFixedWindowLimiter("fixed", opt =>
        {
            opt.Window = TimeSpan.FromMinutes(1);
            opt.PermitLimit = 100;
            opt.QueueLimit = 0;
        });
    });

    builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
        options.AddPolicy("RequireCustomerRole", policy => policy.RequireRole("Customer", "Admin"));
    });

    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "NewBalanceStore.WebApi", Version = "v1" });
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "Введите JWT-токен в формате: Bearer {ваш_токен}",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                },
                Array.Empty<string>()
            }
        });
    });

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowReactApp", policy =>
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
    });

    var jwtSettings = builder.Configuration.GetSection("Jwt");
    var key = Encoding.UTF8.GetBytes(jwtSettings["Secret"]!);
    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

    var app = builder.Build();

    app.UseSerilogRequestLogging();
    app.UseExceptionHandler();

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "New Balance Store API V1");
        c.RoutePrefix = "swagger";
    });

    app.UseHttpsRedirection();
    app.UseCors("AllowReactApp");
    app.UseRateLimiter();

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();
    app.MapHealthChecks("/health");

    app.MapHealthChecks("/healthz", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
    {
        Predicate = _ => false
    });

    app.MapHealthChecks("/readyz", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
    {
        Predicate = reg => reg.Name == "firebase-check"
    });

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Додаток аварійно завершив роботу через критичну помилку!");
}
finally
{
    Log.CloseAndFlush();
}
public partial class Program { }
