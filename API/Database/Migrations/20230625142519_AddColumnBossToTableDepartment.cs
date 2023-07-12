using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HRM.Migrations
{
    public partial class AddColumnBossToTableDepartment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "Boss",
                table: "Department",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Boss",
                table: "Department");
        }
    }
}
