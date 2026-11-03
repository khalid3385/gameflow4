namespace RestaurantSim.DTO;
 
public record JoinTeamRequest(
    string? JoinCode);
 
public record AddTeamMemberRequest(
    string? JoinCode,
    string? Name);
 
public record DeleteTeamMemberRequest(
    string? JoinCode);