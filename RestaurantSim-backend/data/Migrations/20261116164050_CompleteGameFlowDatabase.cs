using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RestaurantSim.Data.Migrations
{
    /// <inheritdoc />
    public partial class CompleteGameFlowDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RolId",
                table: "SessionParticipants",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TeamId",
                table: "SessionParticipants",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EventId",
                table: "Rondes",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Doelen",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Omschrijving = table.Column<string>(type: "TEXT", nullable: false),
                    Doel_Soort = table.Column<string>(type: "TEXT", nullable: false),
                    Doel_Streefwaarde = table.Column<decimal>(type: "TEXT", nullable: false),
                    Doel_Punten = table.Column<int>(type: "INTEGER", nullable: false),
                    Doel_Gekozen = table.Column<bool>(type: "INTEGER", nullable: false),
                    TeamId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Doelen", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Doelen_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    E_naam = table.Column<string>(type: "TEXT", nullable: false),
                    Beschrijving = table.Column<string>(type: "TEXT", nullable: false),
                    Effect = table.Column<string>(type: "TEXT", nullable: false),
                    GameSessionId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Events_GameSessions_GameSessionId",
                        column: x => x.GameSessionId,
                        principalTable: "GameSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Rollen",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    R_naam = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rollen", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SessionParticipants_RolId",
                table: "SessionParticipants",
                column: "RolId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionParticipants_TeamId",
                table: "SessionParticipants",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Rondes_EventId",
                table: "Rondes",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Doelen_TeamId",
                table: "Doelen",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_GameSessionId",
                table: "Events",
                column: "GameSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_Rollen_R_naam",
                table: "Rollen",
                column: "R_naam",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Rondes_Events_EventId",
                table: "Rondes",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SessionParticipants_Rollen_RolId",
                table: "SessionParticipants",
                column: "RolId",
                principalTable: "Rollen",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SessionParticipants_Teams_TeamId",
                table: "SessionParticipants",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rondes_Events_EventId",
                table: "Rondes");

            migrationBuilder.DropForeignKey(
                name: "FK_SessionParticipants_Rollen_RolId",
                table: "SessionParticipants");

            migrationBuilder.DropForeignKey(
                name: "FK_SessionParticipants_Teams_TeamId",
                table: "SessionParticipants");

            migrationBuilder.DropTable(
                name: "Doelen");

            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropTable(
                name: "Rollen");

            migrationBuilder.DropIndex(
                name: "IX_SessionParticipants_RolId",
                table: "SessionParticipants");

            migrationBuilder.DropIndex(
                name: "IX_SessionParticipants_TeamId",
                table: "SessionParticipants");

            migrationBuilder.DropIndex(
                name: "IX_Rondes_EventId",
                table: "Rondes");

            migrationBuilder.DropColumn(
                name: "RolId",
                table: "SessionParticipants");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "SessionParticipants");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "Rondes");
        }
    }
}
