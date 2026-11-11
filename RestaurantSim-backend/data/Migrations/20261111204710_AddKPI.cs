using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RestaurantSim.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddKPI : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "KPIs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    KPI_Naam = table.Column<string>(type: "TEXT", nullable: false),
                    Waarde = table.Column<decimal>(type: "TEXT", nullable: false),
                    TeamId = table.Column<int>(type: "INTEGER", nullable: false),
                    RondeId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KPIs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KPIs_Rondes_RondeId",
                        column: x => x.RondeId,
                        principalTable: "Rondes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_KPIs_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KPIs_RondeId",
                table: "KPIs",
                column: "RondeId");

            migrationBuilder.CreateIndex(
                name: "IX_KPIs_TeamId_RondeId_KPI_Naam",
                table: "KPIs",
                columns: new[] { "TeamId", "RondeId", "KPI_Naam" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KPIs");
        }
    }
}
