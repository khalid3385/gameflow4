using Microsoft.AspNetCore.Mvc;
using RestaurantSim.DTO;
using RestaurantSim.Services;

namespace RestaurantSim.Endpoints;

public static class TeamEndpoints
{
    public static IEndpointRouteBuilder MapTeamEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/teams/join", async (
            [FromBody] JoinTeamRequest request,
            GameSessionService service,
            CancellationToken cancellationToken) =>
        {
            var joinCode = request.JoinCode?.Trim();

            if (string.IsNullOrWhiteSpace(joinCode))
            {
                return Results.BadRequest(new
                {
                    error = "A team code is required."
                });
            }

            if (joinCode.Length != 6
                || joinCode.Any(character =>
                    character < '0' || character > '9'))
            {
                return Results.BadRequest(new
                {
                    error = "The team code must contain six digits."
                });
            }

            var team = await service.JoinTeamAsync(
                joinCode,
                cancellationToken);

            if (team is null)
            {
                return Results.NotFound(new
                {
                    error = "No team was found for this code."
                });
            }

            var response = new JoinedTeamResponse(
                team.Id,
                team.Name,
                joinCode,
                team.ProfileNumber,
                team.Members
                    .Select(member => new TeamMemberResponse(
                        member.Id,
                        member.Name))
                    .ToList(),
                team.GameSession.StartedAtUtc is not null);

            return Results.Ok(response);
        })
        .AllowAnonymous();

        endpoints.MapPost("/teams/members", async (
            [FromBody] AddTeamMemberRequest request,
            GameSessionService service,
            CancellationToken cancellationToken) =>
        {
            var joinCode = request.JoinCode?.Trim();
            var name = request.Name?.Trim();

            if (string.IsNullOrWhiteSpace(joinCode))
            {
                return Results.BadRequest(new
                {
                    error = "A team code is required."
                });
            }

            if (string.IsNullOrWhiteSpace(name))
            {
                return Results.BadRequest(new
                {
                    error = "A name is required."
                });
            }

            try
            {
                var member = await service.AddTeamMemberAsync(
                    joinCode,
                    name,
                    cancellationToken);

                if (member is null)
                {
                    return Results.NotFound(new
                    {
                        error = "No team was found for this code."
                    });
                }

                return Results.Json(
                    new TeamMemberResponse(
                        member.Id,
                        member.Name),
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
        .AllowAnonymous();

        endpoints.MapDelete("/teams/members/{memberId:int}", async (
            int memberId,
            [FromBody] DeleteTeamMemberRequest request,
            GameSessionService service,
            CancellationToken cancellationToken) =>
        {
            var joinCode = request.JoinCode?.Trim();

            if (string.IsNullOrWhiteSpace(joinCode))
            {
                return Results.BadRequest(new
                {
                    error = "A team code is required."
                });
            }

            var deleted = await service.DeleteTeamMemberAsync(
                memberId,
                joinCode,
                cancellationToken);

            if (!deleted)
            {
                return Results.NotFound(new
                {
                    error = "The team member was not found."
                });
            }

            return Results.NoContent();
        })
        .AllowAnonymous();

        endpoints.MapGet("/teams/{joinCode}/goals", async (
            string joinCode,
            GameSessionService service,
            CancellationToken cancellationToken) =>
        {
            var goals = await service.GetGoalsAsync(
                joinCode.Trim(),
                cancellationToken);

            if (goals is null)
            {
                return Results.NotFound(new
                {
                    error = "No team was found for this code."
                });
            }

            return Results.Ok(goals
                .Select(goal => new GoalResponse(
                    goal.Id,
                    goal.Description,
                    goal.IsChosen))
                .ToList());
        })
        .AllowAnonymous();

        endpoints.MapPost("/teams/goals", async (
            [FromBody] AddGoalRequest request,
            GameSessionService service,
            CancellationToken cancellationToken) =>
        {
            var joinCode = request.JoinCode?.Trim();
            var description = request.Description?.Trim();

            if (string.IsNullOrWhiteSpace(joinCode))
            {
                return Results.BadRequest(new
                {
                    error = "A team code is required."
                });
            }

            if (string.IsNullOrWhiteSpace(description))
            {
                return Results.BadRequest(new
                {
                    error = "A goal description is required."
                });
            }

            try
            {
                var goal = await service.AddGoalAsync(
                    joinCode,
                    description,
                    cancellationToken);

                if (goal is null)
                {
                    return Results.NotFound(new
                    {
                        error = "No team was found for this code."
                    });
                }

                return Results.Json(
                    new GoalResponse(
                        goal.Id,
                        goal.Description,
                        goal.IsChosen),
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
        .AllowAnonymous();

        endpoints.MapPut("/teams/goals/chosen", async (
            [FromBody] ChooseGoalsRequest request,
            GameSessionService service,
            CancellationToken cancellationToken) =>
        {
            var joinCode = request.JoinCode?.Trim();

            if (string.IsNullOrWhiteSpace(joinCode))
            {
                return Results.BadRequest(new
                {
                    error = "A team code is required."
                });
            }

            if (request.GoalIds is null)
            {
                return Results.BadRequest(new
                {
                    error = "Goal ids are required."
                });
            }

            try
            {
                var chosen = await service.ChooseGoalsAsync(
                    joinCode,
                    request.GoalIds,
                    cancellationToken);

                if (chosen is null)
                {
                    return Results.NotFound(new
                    {
                        error = "No team was found for this code."
                    });
                }

                return Results.Ok(chosen
                    .Select(goal => new GoalResponse(
                        goal.Id,
                        goal.Description,
                        goal.IsChosen))
                    .ToList());
            }
            catch (ArgumentException exception)
            {
                return Results.BadRequest(new
                {
                    error = exception.Message
                });
            }
        })
        .AllowAnonymous();

        return endpoints;
    }
}