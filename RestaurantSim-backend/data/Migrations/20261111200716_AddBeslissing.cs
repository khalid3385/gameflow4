using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RestaurantSim.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBeslissing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Beslissingen",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Aspect = table.Column<string>(type: "TEXT", nullable: false),
                    Keuze = table.Column<string>(type: "TEXT", nullable: false),
                    RondeId = table.Column<int>(type: "INTEGER", nullable: false),
                    TeamId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Beslissingen", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Beslissingen_Rondes_RondeId",
                        column: x => x.RondeId,
                        principalTable: "Rondes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Beslissingen_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Beslissingen_RondeId",
                table: "Beslissingen",
                column: "RondeId");

            migrationBuilder.CreateIndex(
                name: "IX_Beslissingen_TeamId_RondeId",
                table: "Beslissingen",
                columns: new[] { "TeamId", "RondeId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Beslissingen");
        }
    }
}
