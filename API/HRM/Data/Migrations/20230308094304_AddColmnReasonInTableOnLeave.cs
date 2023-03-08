using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HRM.Data.Migrations
{
    public partial class AddColmnReasonInTableOnLeave : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Details",
                table: "TimeWorking");

            migrationBuilder.DropColumn(
                name: "TimeLeave",
                table: "OnLeave");

            migrationBuilder.AlterColumn<DateTime>(
                name: "MorningStartTime",
                table: "TimeWorking",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time");

            migrationBuilder.AlterColumn<DateTime>(
                name: "MorningEndTime",
                table: "TimeWorking",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AfternoonStartTime",
                table: "TimeWorking",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AfternoonEndTime",
                table: "TimeWorking",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time");

            migrationBuilder.AddColumn<string>(
                name: "Reason",
                table: "OnLeave",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Reason",
                table: "OnLeave");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "MorningStartTime",
                table: "TimeWorking",
                type: "time",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "MorningEndTime",
                table: "TimeWorking",
                type: "time",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "AfternoonStartTime",
                table: "TimeWorking",
                type: "time",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "AfternoonEndTime",
                table: "TimeWorking",
                type: "time",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<string>(
                name: "Details",
                table: "TimeWorking",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TimeLeave",
                table: "OnLeave",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
