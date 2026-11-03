namespace RestaurantSim.Models;
 
public class TeamMember
{
    public int Id { get; set; }
 
    public int TeamId { get; set; }
 
    public string Name { get; set; } = string.Empty;
 
    public Team Team { get; set; } = null!;
}