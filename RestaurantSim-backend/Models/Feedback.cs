
namespace RestaurantSim.Models;

public class Feedback
{
    public int Id { get; set; }

    public string Feedback_Tekst { get; set; } = string.Empty;

    public int TeamId { get; set; }

    public int RondeId { get; set; }
}
