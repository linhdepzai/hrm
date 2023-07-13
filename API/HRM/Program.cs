using Business.Helpers;
using Business.Interfaces;
using Business.Interfaces.IMessageService;
using Business.Repository;
using Business.Services;
using Business.Services.MessageService;
using Database;
using HRM.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Business.SignalR;
using Business.Interfaces.IDepartmentService;
using Business.Services.DepartmentService;
using Business.Interfaces.IAccountService;
using Business.Services.AccountService;
using Business.Interfaces.IEmployeeService;
using Business.Services.EmployeeService;
using Business.Interfaces.IEvaluateService;
using Business.Services.EvaluateService;
using Business.Interfaces.INotificationService;
using Business.Services.NotificationService;
using Business.Interfaces.IOnLeaveService;
using Business.Services.OnLeaveService;
using Business.Interfaces.IPayoffService;
using Business.Services.PayoffService;
using Business.Interfaces.IPositionService;
using Business.Services.PositionService;
using Business.Interfaces.ISalaryService;
using Business.Services.SalaryService;
using Business.Interfaces.IStatisticalService;
using Business.Services.StatisticalService;
using Business.Interfaces.ITaskService;
using Business.Services.TaskService;
using Business.Interfaces.ITimeKeepingService;
using Business.Interfaces.ITimeWorkingService;
using Business.Services.TimeKeepingService;
using Business.Services.TimeWorkingService;

Environment.SetEnvironmentVariable("APP_BASE_DIRECTORY", Directory.GetCurrentDirectory());

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddCors();
builder.Services.AddRazorPages();
builder.Services.AddSingleton<PresenceTracker>();
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped(typeof(IRepository<,>), typeof(Repository<,>));
builder.Services.AddScoped<IAccountAppService, AccountAppService>();
builder.Services.AddScoped<IDepartmentAppService, DepartmentAppService>();
builder.Services.AddScoped<IEmployeeAppService, EmployeeAppService>();
builder.Services.AddScoped<IEvaluateAppService, EvaluateAppService>();
builder.Services.AddScoped<IMessageAppService, MessageAppService>();
builder.Services.AddScoped<INotificationAppService, NotificationAppService>();
builder.Services.AddScoped<IOnLeaveAppService, OnLeaveAppService>();
builder.Services.AddScoped<IPayoffAppService, PayoffAppService>();
builder.Services.AddScoped<IPositionAppService, PositionAppService>();
builder.Services.AddScoped<ISalaryAppService, SalaryAppService>();
builder.Services.AddScoped<IStatisticalAppService, StatisticalAppService>();
builder.Services.AddScoped<ITaskAppService, TaskAppService>();
builder.Services.AddScoped<ITimeKeepingAppService, TimeKeepingAppService>();
builder.Services.AddScoped<ITimeWorkingAppService, TimeWorkingAppService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    //options.EnableSensitiveDataLogging();
    options.EnableSensitiveDataLogging(true);
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("JWTToken:Key").Value!)),
            ValidateIssuer = false,
            ValidateAudience = false,
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddSignalR();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4200"));
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

//app.UseSession();
app.MapRazorPages();
app.MapControllers();
app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");

app.Run();
