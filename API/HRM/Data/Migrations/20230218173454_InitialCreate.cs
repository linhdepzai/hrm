using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HRM.Data.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Department",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Department", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Employee",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Sex = table.Column<bool>(type: "bit", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(11)", maxLength: 11, nullable: false),
                    DoB = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Level = table.Column<int>(type: "int", nullable: false),
                    Position = table.Column<int>(type: "int", nullable: false),
                    DepartmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    StartingDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LeaveDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Bank = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BankAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TaxCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InsuranceStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Identify = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlaceOfOrigin = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlaceOfResidence = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateOfIssue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IssuedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employee", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Employee_Department_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Department",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Evaluate",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DateEvaluate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PMId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OldLevel = table.Column<int>(type: "int", nullable: false),
                    NewLevel = table.Column<int>(type: "int", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Evaluate", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Evaluate_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OnLeave",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DateLeave = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Option = table.Column<int>(type: "int", nullable: false),
                    TimeLeave = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OnLeave", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OnLeave_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Payoff",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Amount = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payoff", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payoff_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Salary",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Money = table.Column<int>(type: "int", nullable: false),
                    DateReview = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Salary", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Salary_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TimeKeeping",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Checkin = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PhotoCheckin = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Checkout = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PhotoCheckout = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Punish = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeKeeping", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TimeKeeping_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TimeWorking",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MorningStartTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    MorningEndTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    AfternoonStartTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    AfternoonEndTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    ApplyDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Details = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeWorking", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TimeWorking_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Employee_DepartmentId",
                table: "Employee",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Evaluate_EmployeeId",
                table: "Evaluate",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_OnLeave_EmployeeId",
                table: "OnLeave",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Payoff_EmployeeId",
                table: "Payoff",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Salary_EmployeeId",
                table: "Salary",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_TimeKeeping_EmployeeId",
                table: "TimeKeeping",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_TimeWorking_EmployeeId",
                table: "TimeWorking",
                column: "EmployeeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Evaluate");

            migrationBuilder.DropTable(
                name: "OnLeave");

            migrationBuilder.DropTable(
                name: "Payoff");

            migrationBuilder.DropTable(
                name: "Salary");

            migrationBuilder.DropTable(
                name: "TimeKeeping");

            migrationBuilder.DropTable(
                name: "TimeWorking");

            migrationBuilder.DropTable(
                name: "Employee");

            migrationBuilder.DropTable(
                name: "Department");
        }
    }
}
