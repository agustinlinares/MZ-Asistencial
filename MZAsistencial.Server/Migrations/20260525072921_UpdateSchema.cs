using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MZAsistencial.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Año",
                table: "Citaciones",
                newName: "Anio");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ICG06",
                table: "ICG06",
                column: "Id_ICG");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ICG06",
                table: "ICG06");

            migrationBuilder.RenameColumn(
                name: "Anio",
                table: "Citaciones",
                newName: "Año");
        }
    }
}
