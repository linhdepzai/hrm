using Microsoft.EntityFrameworkCore.Migrations;

namespace HRM.Migrations
{
    public partial class AlterTableEmployeeSalary : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "totalWorkdays",
                table: "EmployeeSalary",
                newName: "TotalWorkdays");

            migrationBuilder.AddColumn<bool>(
                name: "Punish",
                table: "Payoff",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ActualSalary",
                table: "EmployeeSalary",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Bounty",
                table: "EmployeeSalary",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Punish",
                table: "EmployeeSalary",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Punish",
                table: "Payoff");

            migrationBuilder.DropColumn(
                name: "ActualSalary",
                table: "EmployeeSalary");

            migrationBuilder.DropColumn(
                name: "Bounty",
                table: "EmployeeSalary");

            migrationBuilder.DropColumn(
                name: "Punish",
                table: "EmployeeSalary");

            migrationBuilder.RenameColumn(
                name: "TotalWorkdays",
                table: "EmployeeSalary",
                newName: "totalWorkdays");
        }
    }
}
