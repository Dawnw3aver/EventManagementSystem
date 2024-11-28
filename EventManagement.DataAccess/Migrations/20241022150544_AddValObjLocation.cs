using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventManagement.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddValObjLocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Location",
                table: "Events",
                newName: "Location_Country");

            migrationBuilder.AddColumn<string>(
                name: "Location_Address",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Location_City",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Location_Latitude",
                table: "Events",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Location_Longitude",
                table: "Events",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location_Address",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Location_City",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Location_Latitude",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Location_Longitude",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "Location_Country",
                table: "Events",
                newName: "Location");
        }
    }
}
