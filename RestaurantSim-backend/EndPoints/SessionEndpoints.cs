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
                    session.StartedAtUtc,
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

        endpoints.MapGet("/sessions/{sessionId:int}/teams", async (
            int sessionId,
            GameSessionService service,
            CancellationToken cancellationToken) =>
        {
            var teams = await service.GetSessionTeamsAsync(
                sessionId,
                cancellationToken);
         
            if (teams is null)
            {
                return Results.NotFound(new
                {
                    error = "The session was not found."
                });
            }
         
            var response = teams
                .Select(team => new SessionTeamResponse(
                    team.Id,
                    team.Name,
                    team.ProfileNumber,
                    team.Members
                        .Select(member => new TeamMemberResponse(
                            member.Id,
                            member.Name))
                        .ToList()))
                .ToList();
         
            return Results.Ok(response);
        })
        .AllowAnonymous();

        endpoints.MapPost("/sessions/{sessionId:int}/start", async (
            int sessionId,
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
                var session = await service.StartSessionAsync(
                    sessionId,
                    creatorId,
                    cancellationToken);

                if (session is null)
                {
                    return Results.NotFound(new
                    {
                        error = "The session was not found."
                    });
                }

                return Results.Ok(new
                {
                    startedAtUtc = session.StartedAtUtc
                });
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