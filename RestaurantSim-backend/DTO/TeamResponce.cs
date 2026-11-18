namespace RestaurantSim.DTO;
 
public record JoinedTeamResponse(
    int Id,
    string Name,
    string joinCode,
    int ProfileNumber,
    List<TeamMemberResponse> Members);
 
public record TeamMemberResponse(
    int Id,
    string Name);