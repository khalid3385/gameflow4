namespace RestaurantSim.DTO;
 
public record JoinedTeamResponse(
    int Id,
    string Name,
    int ProfileNumber,
    List<TeamMemberResponse> Members);
 
public record TeamMemberResponse(
    int Id,
    string Name);