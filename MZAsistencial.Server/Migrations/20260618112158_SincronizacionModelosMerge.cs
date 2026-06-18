using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MZAsistencial.Server.Migrations
{
    /// <inheritdoc />
    public partial class SincronizacionModelosMerge : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Nombre_Modulo",
                table: "Registro_Errores");

            migrationBuilder.RenameColumn(
                name: "UsuarioModificación",
                table: "Informes_ICG",
                newName: "UsuarioModificacion");

            migrationBuilder.RenameColumn(
                name: "Anio",
                table: "Citaciones",
                newName: "Año");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UsuarioModificacion",
                table: "Informes_ICG",
                newName: "UsuarioModificación");

            migrationBuilder.RenameColumn(
                name: "Año",
                table: "Citaciones",
                newName: "Anio");

            migrationBuilder.AddColumn<string>(
                name: "Nombre_Modulo",
                table: "Registro_Errores",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
