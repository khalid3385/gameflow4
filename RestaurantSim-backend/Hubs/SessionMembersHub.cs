using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using RestaurantSim.Data;
using RestaurantSim.DTO;

namespace RestaurantSim.Hubs;

public sealed class SessionMembersHub(ApplicationDbContext db) : Hub
{
    public async Task<CreateSessionResponse?> GetSession(int sessionId)
    {
        var creatorId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (creatorId is null)
        {
            return null;
        }

        var session = await db.GameSessions
            .AsNoTracking()
            .Include(session => session.Teams)
            .ThenInclude(team => team.Members)
            .SingleOrDefaultAsync(
                session => session.Id == sessionId && session.CreatorId == creatorId,
                Context.ConnectionAborted);

        if (session is null)
        {
            return null;
        }

        return new CreateSessionResponse(
            session.Id,
            session.CreatedAtUtc,
            session.Teams.OrderBy(team => team.Id).Select(team =>
                new CreatedTeamResponse(
                    team.Id,
                    team.Name,
                    team.JoinCode,
                    team.ProfileNumber,
                    team.Members.OrderBy(member => member.Id)
                        .Select(member => member.Name).ToList())).ToList());
    }
}