namespace RestaurantSim.DTO;
 
public record CreateSessionResponse(
    int Id,
    DateTime CreatedAtUtc,
    List<CreatedTeamResponse> Teams);
 
public record CreatedTeamResponse(
    int Id,
    string Name,
    string JoinCode,
    int ProfileNumber,
    List<string> MemberNames);