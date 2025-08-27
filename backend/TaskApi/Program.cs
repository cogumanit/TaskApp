using Microsoft.EntityFrameworkCore;
using TaskApi.Data;

var builder = WebApplication.CreateBuilder(args);

// 1) Add DbContext using the connection string from appsettings.json
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2) Add controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3) Allow CORS for React dev (Vite: 5173, CRA: 3000)
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("DevCors", p => p.WithOrigins("http://localhost:5173", "http://localhost:3000").AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

// 4) Middleware pipeline
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); 
}

app.UseHttpsRedirection();

// Enable CORS before mapping controllers
app.UseCors("DevCors");

app.MapControllers();

app.Run();