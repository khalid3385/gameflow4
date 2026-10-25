namespace RestaurantSim.DTO;

public record CreateSessionRequest(
    List<CreateTeamRequest>? Teams);

public record CreateTeamRequest(
    string? Name,
    int ProfileNumber);
    