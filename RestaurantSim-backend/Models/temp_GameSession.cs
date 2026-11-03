namespace RestaurantSim.Models;

public class GameSession
{
    public int Id { get; set; }

    public string JoinCode { get; set; } = string.Empty;

    public string CreatorId { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; }

    public List<Team> Teams { get; set; } = [];
}