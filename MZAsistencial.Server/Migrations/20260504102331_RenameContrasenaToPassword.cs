using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MZAsistencial.Server.Migrations
{
    /// <inheritdoc />
    public partial class RenameContrasenaToPassword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            
            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Usuarios",
                newName: "Contraseña");
        }
    }
}