using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HRM.Migrations
{
    public partial class DropColumnTableMessage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_Employee_RecipientId",
                table: "Message");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_Employee_SenderId",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Message_RecipientId",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Message_SenderId",
                table: "Message");

            migrationBuilder.AddColumn<Guid>(
                name: "EmployeeId",
                table: "Message",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "EmployeeId1",
                table: "Message",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Message_EmployeeId",
                table: "Message",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Message_EmployeeId1",
                table: "Message",
                column: "EmployeeId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Employee_EmployeeId",
                table: "Message",
                column: "EmployeeId",
                principalTable: "Employee",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Employee_EmployeeId1",
                table: "Message",
                column: "EmployeeId1",
                principalTable: "Employee",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_Employee_EmployeeId",
                table: "Message");

            migrationBuilder.DropForeignKey(
                name: "FK_Message_Employee_EmployeeId1",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Message_EmployeeId",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Message_EmployeeId1",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "EmployeeId",
                table: "Message");

            migrationBuilder.DropColumn(
                name: "EmployeeId1",
                table: "Message");

            migrationBuilder.CreateIndex(
                name: "IX_Message_RecipientId",
                table: "Message",
                column: "RecipientId");

            migrationBuilder.CreateIndex(
                name: "IX_Message_SenderId",
                table: "Message",
                column: "SenderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Employee_RecipientId",
                table: "Message",
                column: "RecipientId",
                principalTable: "Employee",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Employee_SenderId",
                table: "Message",
                column: "SenderId",
                principalTable: "Employee",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
