namespace RestaurantSim.DTO;

public record JoinSessionRequest(
    string? JoinCode,
    string? Nickname);