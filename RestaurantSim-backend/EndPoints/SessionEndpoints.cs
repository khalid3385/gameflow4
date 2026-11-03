using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using RestaurantSim.Services;
using RestaurantSim.DTO;

namespace RestaurantSim.Endpoints;

public static class SessionEndpoints
{
    public static IEndpointRouteBuilder MapSessionEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/sessions", async (
            [FromBody] CreateSessionRequest request,
            ClaimsPrincipal user,
            GameSessionService service,
            CancellationToken cancellationToken) =>
        {
            var creatorId =
                user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
         
            if (creatorId is null)
            {
                return Results.Unauthorized();
            }
         
            try
            {
                var session = await service.CreateAsync(
                    creatorId,
                    request,
                    cancellationToken);
         
                var response = new CreateSessionResponse(
                    session.Id,
                    session.CreatedAtUtc,
                    session.Teams
                        .Select(team => new CreatedTeamResponse(
                            team.Id,
                            team.Name,
                            team.JoinCode,
                            team.ProfileNumber,
                            team.Members
                                .Select(member => member.Name)
                                .ToList()))
                        .ToList());
         
                return Results.Json(
                    response,
                    statusCode: StatusCodes.Status201Created);
            }
            catch (ArgumentException exception)
            {
                return Results.BadRequest(new
                {
                    error = exception.Message
                });
            }
        })
        .RequireAuthorization();

        return endpoints;
    }
}