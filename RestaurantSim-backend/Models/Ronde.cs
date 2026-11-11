namespace RestaurantSim.Models;

public class Ronde
{
    public int Id {get; set;}
    public int GameSessionId {get; set;}
    public int RondeNummer {get; set;}
    public string RondeStatus {get; set;} = string.Empty;

}