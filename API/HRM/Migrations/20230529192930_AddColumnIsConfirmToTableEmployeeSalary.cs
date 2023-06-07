using Microsoft.EntityFrameworkCore.Migrations;

namespace HRM.Migrations
{
    public partial class AddColumnIsConfirmToTableEmployeeSalary : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsConfirm",
                table: "EmployeeSalary",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsConfirm",
                table: "EmployeeSalary");
        }
    }
}
