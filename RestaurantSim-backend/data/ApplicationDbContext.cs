using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RestaurantSim.Models;

namespace RestaurantSim.Data;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<GameSession> GameSessions => Set<GameSession>();
    public DbSet<Team> Teams => Set<Team>();
    public DbSet<SessionParticipant> SessionParticipants
    => Set<SessionParticipant>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<GameSession>(session =>
        {
            session.Property(s => s.JoinCode)
                .IsRequired();

            session.HasIndex(s => s.JoinCode)
                .IsUnique();

            session.Property(s => s.CreatorId)
                .IsRequired();

            session.HasOne<IdentityUser>()
                .WithMany()
                .HasForeignKey(s => s.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<SessionParticipant>(participant =>
        {
            participant.Property(p => p.Nickname)
                .IsRequired();

            participant.HasOne<GameSession>()
                .WithMany()
                .HasForeignKey(p => p.GameSessionId)
                .OnDelete(DeleteBehavior.Cascade);  
        });

        
        builder.Entity<Team>(team =>{
    team.HasKey(t => t.Id);

    team.Property(t => t.T_naam)
        .IsRequired();

    team.Property(t => t.TeamCode)
        .IsRequired();

    team.HasIndex(t => t.TeamCode)
        .IsUnique();

    team.HasOne<GameSession>()
        .WithMany()
        .HasForeignKey(t => t.GameSessionId)
        .OnDelete(DeleteBehavior.Cascade);
});

    }
}