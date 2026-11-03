namespace RestaurantSim.Models;
 
public class Team
{
    public int Id { get; set; }
 
    public int GameSessionId { get; set; }
 
    public string Name { get; set; } = string.Empty;
 
    public string JoinCode { get; set; } = string.Empty;
 
    public int ProfileNumber { get; set; }
 
    public GameSession GameSession { get; set; } = null!;
 
    public List<TeamMember> Members { get; set; } = [];
}