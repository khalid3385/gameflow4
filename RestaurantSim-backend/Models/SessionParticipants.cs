namespace RestaurantSim.Models;

public class SessionParticipant
{
    public int Id { get; set; }

    public int GameSessionId { get; set; }

    public string Nickname { get; set; } = string.Empty;

    public DateTime JoinedAtUtc { get; set; }
}