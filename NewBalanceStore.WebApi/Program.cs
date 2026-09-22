using Firebase.Database;
using NewBalanceStore.Domain.Interfaces; 
using NewBalanceStore.Application.Interfaces;
using NewBalanceStore.Application.Services;   
using NewBalanceStore.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton(new FirebaseClient("https://newbalancestore-bc142-default-rtdb.europe-west1.firebasedatabase.app/"));

builder.Services.AddScoped<IProductRepository, FirebaseProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderRepository, FirebaseOrderRepository>();
builder.Services.AddScoped<IOrderService, OrderService>();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddControllers();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();