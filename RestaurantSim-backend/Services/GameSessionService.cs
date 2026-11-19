using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using RestaurantSim.Data;
using RestaurantSim.Models;
using RestaurantSim.DTO;
using Microsoft.AspNetCore.SignalR;
using RestaurantSim.Hubs;

namespace RestaurantSim.Services;

public class GameSessionService
{
    private readonly ApplicationDbContext _db;
    private readonly IHubContext<SessionMembersHub> _hub;
    private readonly ILogger<GameSessionService> _logger;

    public GameSessionService(
    ApplicationDbContext db,
    IHubContext<SessionMembersHub> hub,
    ILogger<GameSessionService> logger)
    {
        _db = db;
        _hub = hub;
        _logger = logger;
    }

    private async Task NotifyHostAsync(GameSession session)
    {
        try
        {
            await _hub.Clients.User(session.CreatorId)
                .SendAsync("SessionMembersChanged", session.Id);
        }
        catch (Exception exception)
        {
            // The database change has already succeeded.
            _logger.LogWarning(exception,
                "Could not notify the host for session {SessionId}", session.Id);
        }
    }

    public async Task<GameSession> CreateAsync(
        string creatorId,
        CreateSessionRequest request,
        CancellationToken cancellationToken = default)
    {
        if (request.Teams is null || request.Teams.Count == 0)
        {
            throw new ArgumentException(
                "At least one team is required.");
        }

        var preparedTeams = new List<PreparedTeam>();

        foreach (var requestedTeam in request.Teams)
        {
            var teamName = requestedTeam.Name?.Trim();

            if (string.IsNullOrWhiteSpace(teamName))
            {
                throw new ArgumentException(
                    "Every team must have a name.");
            }

            if (teamName.Length > 50)
            {
                throw new ArgumentException(
                    "A team name must be at most 50 characters.");
            }

            if (requestedTeam.ProfileNumber < 1
                || requestedTeam.ProfileNumber > 6)
            {
                throw new ArgumentException(
                    "A profile number must be between 1 and 6.");
            }


            preparedTeams.Add(new PreparedTeam(
                teamName,
                requestedTeam.ProfileNumber));
        }

        const int maxAttempts = 5;

        for (var attempt = 0; attempt < maxAttempts; attempt++)
        {
            var generatedCodes = new HashSet<string>();

            string GenerateDifferentCode()
            {
                string code;

                do
                {
                    code = SessionCodeGenerator.Generate();
                }
                while (!generatedCodes.Add(code));

                return code;
            }

            var session = new GameSession
            {
                // Tijdelijk nodig zolang de oude databasekolom bestaat.
                JoinCode = GenerateDifferentCode(),

                CreatorId = creatorId,
                CreatedAtUtc = DateTime.UtcNow,
                Teams = preparedTeams.Select(preparedTeam =>
                    new Team
                    {
                        Name = preparedTeam.Name,
                        JoinCode = GenerateDifferentCode(),
                        ProfileNumber = preparedTeam.ProfileNumber
                    })
                    .ToList()
            };

            _db.GameSessions.Add(session);

            try
            {
                await _db.SaveChangesAsync(cancellationToken);
                return session;
            }
            catch (DbUpdateException exception) when (
                exception.InnerException is SqliteException sqliteException
                && sqliteException.SqliteExtendedErrorCode == 2067)
            {
                _db.ChangeTracker.Clear();
            }
        }

        throw new InvalidOperationException(
            "Could not generate unique team codes.");
    }

    public async Task<Team?> JoinTeamAsync(
        string joinCode,
        CancellationToken cancellationToken = default)
    {
        return await _db.Teams
            .AsNoTracking()
            .Include(team => team.Members)
            .SingleOrDefaultAsync(
                team => team.JoinCode == joinCode,
                cancellationToken);
    }

    public async Task<TeamMember?> AddTeamMemberAsync(
        string joinCode,
        string name,
        CancellationToken cancellationToken = default)
    {
        var team = await _db.Teams
            .Include(team => team.Members)
            .Include(team => team.GameSession)
            .SingleOrDefaultAsync(
                team => team.JoinCode == joinCode,
                cancellationToken);

        if (team is null)
        {
            return null;
        }

        if (team.Members.Count >= 20)
        {
            throw new ArgumentException(
                "A team can have at most 20 names.");
        }

        var cleanedName = name.Trim();

        if (string.IsNullOrWhiteSpace(cleanedName))
        {
            throw new ArgumentException(
                "A name is required.");
        }

        if (cleanedName.Length > 50)
        {
            throw new ArgumentException(
                "A name must be at most 50 characters.");
        }

        var member = new TeamMember
        {
            TeamId = team.Id,
            Name = cleanedName
        };

        _db.TeamMembers.Add(member);

        await _db.SaveChangesAsync(cancellationToken);
        await NotifyHostAsync(team.GameSession);

        return member;
    }

    public async Task<bool> DeleteTeamMemberAsync(
        int memberId,
        string joinCode,
        CancellationToken cancellationToken = default)
    {
        var member = await _db.TeamMembers
            .Include(member => member.Team)
            .ThenInclude(team => team.GameSession)
            .SingleOrDefaultAsync(
                member => member.Id == memberId && member.Team.JoinCode == joinCode,
                cancellationToken);

        if (member is null)
        {
            return false;
        }

        var session = member.Team.GameSession;
        _db.TeamMembers.Remove(member);

        await _db.SaveChangesAsync(cancellationToken);
        await NotifyHostAsync(session);

        return true;
    }


public async Task<List<Team>?> GetSessionTeamsAsync(
    int sessionId,
    CancellationToken cancellationToken = default)
{
    var sessionExists = await _db.GameSessions
        .AsNoTracking()
        .AnyAsync(
            session => session.Id == sessionId,
            cancellationToken);
 
    if (!sessionExists)
    {
        return null;
    }
 
    return await _db.Teams
        .AsNoTracking()
        .Include(team => team.Members)
        .Where(team => team.GameSessionId == sessionId)
        .OrderBy(team => team.Id)
        .ToListAsync(cancellationToken);
}

     
    private sealed record PreparedTeam(
        string Name,
        int ProfileNumber);


}