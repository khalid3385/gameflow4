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
    public DbSet<SessionParticipant> SessionParticipants
    => Set<SessionParticipant>();
    public DbSet<Team> Teams => Set<Team>();
    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();

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

        builder.Entity<Team>(team =>
        {
            team.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(50);

            team.Property(t => t.JoinCode)
                .IsRequired()
                .HasMaxLength(6);

            team.HasIndex(t => t.JoinCode)
                .IsUnique();

            team.HasOne(t => t.GameSession)
                .WithMany(s => s.Teams)
                .HasForeignKey(t => t.GameSessionId)
                .OnDelete(DeleteBehavior.Cascade);

            team.ToTable(table =>
         {
            table.HasCheckConstraint(
                "CK_Teams_ProfileNumber",
                "\"ProfileNumber\" >= 1 AND \"ProfileNumber\" <= 6");
            });
        });

        builder.Entity<TeamMember>(member =>
        {
            member.Property(m => m.Name)
                .IsRequired()
                .HasMaxLength(50);

            member.HasOne(m => m.Team)
                .WithMany(t => t.Members)
                .HasForeignKey(m => m.TeamId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}