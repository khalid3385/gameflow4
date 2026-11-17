
namespace RestaurantSim.Models;

public class Beslissing
{
    public int Id { get; set; }

    public string Aspect { get; set; } = string.Empty;

    public string Keuze { get; set; } = string.Empty;

    public int RondeId { get; set; }

    public int TeamId { get; set; }
}
