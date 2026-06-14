using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MZAsistencial.Server.Migrations
{
    /// <inheritdoc />
    public partial class SincronizacionModelosActuales : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropTable(
            //    name: "Icg06Especialidades");

            //migrationBuilder.RenameColumn(
            //    name: "Anio",
            //    table: "Informes_ICG",
            //    newName: "Año");

            //migrationBuilder.RenameColumn(
            //    name: "Anio",
            //    table: "FincasRegistrales_CostesPorAnio",
            //    newName: "Año");

            migrationBuilder.AddColumn<string>(
                name: "Nombre_Modulo",
                table: "Registro_Errores",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Nombre_Modulo",
                table: "Registro_Errores");

            migrationBuilder.RenameColumn(
                name: "Año",
                table: "Informes_ICG",
                newName: "Anio");

            migrationBuilder.RenameColumn(
                name: "Año",
                table: "FincasRegistrales_CostesPorAnio",
                newName: "Anio");

            migrationBuilder.CreateTable(
                name: "Icg06Especialidades",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Año = table.Column<int>(type: "int", nullable: false),
                    Cantidad = table.Column<int>(type: "int", nullable: true),
                    CentroId = table.Column<int>(type: "int", nullable: false),
                    Especialidad = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Servicio = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Icg06Especialidades", x => x.Id);
                });
        }
    }
}
