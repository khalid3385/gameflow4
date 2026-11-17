
namespace RestaurantSim.Models;

public class KPI
{
    public int Id { get; set; }

    public string KPI_Naam { get; set; } = string.Empty;

    public decimal Waarde { get; set; }

    public int TeamId { get; set; }

    public int RondeId { get; set; }
}
