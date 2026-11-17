
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RestaurantSim.Data.Migrations
{
    public partial class AddTeam : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Strategie",
                table: "Teams",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Punten",
                table: "Teams",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Strategie",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Punten",
                table: "Teams");
        }
    }
}
