namespace RestaurantSim.DTO;

public record AddGoalRequest(
    string? JoinCode,
    string? Description);

public record ChooseGoalsRequest(
    string? JoinCode,
    List<int>? GoalIds);

public record GoalResponse(
    int Id,
    string Description,
    bool IsChosen);