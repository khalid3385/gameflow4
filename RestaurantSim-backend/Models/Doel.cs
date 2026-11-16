
namespace RestaurantSim.Models;

public class Doel
{
    public int Id { get; set; }

    public string Omschrijving { get; set; } = string.Empty;

    public string Doel_Soort { get; set; } = string.Empty;

    public decimal Doel_Streefwaarde { get; set; }

    public int Doel_Punten { get; set; }

    public bool Doel_Gekozen { get; set; }

    public int TeamId { get; set; }
}
