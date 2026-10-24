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
     
            var memberNames = requestedTeam.MemberNames
                ?.Where(name => !string.IsNullOrWhiteSpace(name))
                .Select(name => name!.Trim())
                .ToList()
                ?? [];
     
            if (memberNames.Count > 20)
            {
                throw new ArgumentException(
                    "A team can have at most 20 names.");
            }
     
            if (memberNames.Any(name => name.Length > 50))
            {
                throw new ArgumentException(
                    "A member name must be at most 50 characters.");
            }
     
            preparedTeams.Add(new PreparedTeam(
                teamName,
                requestedTeam.ProfileNumber,
                memberNames));
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
                        ProfileNumber = preparedTeam.ProfileNumber,
                        Members = preparedTeam.MemberNames
                            .Select(memberName => new TeamMember
                            {
                                Name = memberName
                            })
                            .ToList()
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
     
    private sealed record PreparedTeam(
        string Name,
        int ProfileNumber,
        List<string> MemberNames);

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