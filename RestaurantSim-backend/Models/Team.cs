
namespace RestaurantSim.Models;

public class Team
{
    public int Id { get; set; }

    public string T_naam { get; set; } = string.Empty;

    public string TeamCode { get; set; } = string.Empty;

    public string Profiel { get; set; } = string.Empty;

    public string Strategie { get; set; } = string.Empty;

    public int Punten { get; set; }

    public int GameSessionId { get; set; }
}
