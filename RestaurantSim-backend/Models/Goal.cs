namespace RestaurantSim.Models;

public class Goal
{
    public int Id { get; set; }

    public int TeamId { get; set; }

    public string Description { get; set; } = string.Empty;

    public bool IsChosen { get; set; }

    public Team Team { get; set; } = null!;
}