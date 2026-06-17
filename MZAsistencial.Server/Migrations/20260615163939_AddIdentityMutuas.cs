using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MZAsistencial.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddIdentityMutuas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF NOT EXISTS (
                    SELECT 1 FROM sys.columns 
                    WHERE object_id = OBJECT_ID('Mutuas') 
                    AND name = 'Mutua_id' 
                    AND is_identity = 1
                )
                BEGIN
                    ALTER TABLE [Mutuas] DROP CONSTRAINT [PK_Mutuas];
                    ALTER TABLE [Mutuas] ADD [Mutua_id_temp] INT IDENTITY(1,1) NOT NULL;
                    DBCC CHECKIDENT ('Mutuas', RESEED, 0);
                    EXEC sp_rename 'Mutuas.Mutua_id', 'Mutua_id_old', 'COLUMN';
                    EXEC sp_rename 'Mutuas.Mutua_id_temp', 'Mutua_id', 'COLUMN';
                    ALTER TABLE [Mutuas] DROP COLUMN [Mutua_id_old];
                    ALTER TABLE [Mutuas] ADD CONSTRAINT [PK_Mutuas] 
                        PRIMARY KEY CLUSTERED ([Mutua_id] ASC);
                    DECLARE @maxId INT = (SELECT ISNULL(MAX(Mutua_id), 0) FROM [Mutuas]);
                    IF @maxId > 0
                        DBCC CHECKIDENT ('Mutuas', RESEED, @maxId);
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // No revertimos el IDENTITY para evitar pérdida de datos
        }
    }
}
