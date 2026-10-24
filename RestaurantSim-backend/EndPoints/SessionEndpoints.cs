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

        endpoints.MapPost("/sessions/join", async (
            [FromBody] JoinSessionRequest request,
            GameSessionService service,
            CancellationToken cancellationToken) =>
        {
            if (string.IsNullOrWhiteSpace(request.JoinCode)
                || string.IsNullOrWhiteSpace(request.Nickname))
            {
                return Results.BadRequest(new
                {
                    error = "Join code and nickname are required."
                });
            }

            var joinCode = request.JoinCode.Trim();
            var nickname = request.Nickname.Trim();

            if (joinCode.Length != 6
                || joinCode.Any(c => c < '0' || c > '9'))
            {
                return Results.BadRequest(new
                {
                    error = "Join code must contain six digits."
                });
            }

            if (nickname.Length > 30)
            {
                return Results.BadRequest(new
                {
                    error = "Nickname must be at most 30 characters."
                });
            }

            var participant = await service.JoinAsync(
                joinCode,
                nickname,
                cancellationToken);

            if (participant is null)
            {
                return Results.NotFound(new
                {
                    error = "Session was not found."
                });
            }

            return Results.Json(new
            {
                participant.Id,
                participant.GameSessionId,
                participant.Nickname,
                participant.JoinedAtUtc
            }, statusCode: StatusCodes.Status201Created);
            })
            .AllowAnonymous();

        return endpoints;
    }
}