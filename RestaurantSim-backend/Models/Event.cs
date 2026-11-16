
namespace RestaurantSim.Models;

public class Event
{
    public int Id { get; set; }

    public string E_naam { get; set; } = string.Empty;

    public string Beschrijving { get; set; } = string.Empty;

    public string Effect { get; set; } = string.Empty;

    public int GameSessionId { get; set; }
}
