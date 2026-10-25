using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using RestaurantSim.Data;
using RestaurantSim.Models;
using RestaurantSim.DTO;

namespace RestaurantSim.Services;

public class GameSessionService
{
    private readonly ApplicationDbContext _db;

    public GameSessionService(ApplicationDbContext db)
    {
        _db = db;
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

    return member;
}

public async Task<bool> DeleteTeamMemberAsync(
    int memberId,
    string joinCode,
    CancellationToken cancellationToken = default)
{
    var member = await _db.TeamMembers
        .SingleOrDefaultAsync(
            teamMember =>
                teamMember.Id == memberId
                && teamMember.Team.JoinCode == joinCode,
            cancellationToken);
 
    if (member is null)
    {
        return false;
    }
 
    _db.TeamMembers.Remove(member);
 
    await _db.SaveChangesAsync(cancellationToken);
 
    return true;
}

     
    private sealed record PreparedTeam(
        string Name,
        int ProfileNumber);

    public async Task<SessionParticipant?> JoinAsync(
    string joinCode,
    string nickname,
    CancellationToken cancellationToken = default)
    {
        var session = await _db.GameSessions
            .AsNoTracking()
            .SingleOrDefaultAsync(
                s => s.JoinCode == joinCode,
                cancellationToken);

        if (session is null)
        {
            return null;
        }

        var participant = new SessionParticipant
        {
            GameSessionId = session.Id,
            Nickname = nickname,
            JoinedAtUtc = DateTime.UtcNow
        };

        _db.SessionParticipants.Add(participant);

        await _db.SaveChangesAsync(cancellationToken);

        return participant;
    }
}