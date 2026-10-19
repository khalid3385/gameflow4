using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using RestaurantSim.Data;
using RestaurantSim.Models;

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
        CancellationToken cancellationToken = default)
    {
        const int maxAttempts = 5;

        for (var attempt = 0; attempt < maxAttempts; attempt++)
        {
            var session = new GameSession
            {
                JoinCode = SessionCodeGenerator.Generate(),
                CreatorId = creatorId,
                CreatedAtUtc = DateTime.UtcNow
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
                _db.Entry(session).State = EntityState.Detached;
            }
        }

        throw new InvalidOperationException(
            "Could not generate a unique session code.");
    }

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