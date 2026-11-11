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
    public DbSet<Ronde> Rondes => Set<Ronde>();
    public DbSet<Beslissing> Beslissingen => Set<Beslissing>();
    public DbSet<KPI> KPIs => Set<KPI>();
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


        builder.Entity<Team>(team =>
        {
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

             
        builder.Entity<Ronde>(ronde =>
        {
            ronde.HasKey(r => r.Id);

            ronde.Property(r => r.RondeStatus)
                .IsRequired();

            ronde.HasIndex(r => new { r.GameSessionId, r.RondeNummer })
                .IsUnique();

            ronde.HasOne<GameSession>()
                .WithMany()
                .HasForeignKey(r => r.GameSessionId)
                .OnDelete(DeleteBehavior.Cascade);
        });



builder.Entity<Beslissing>(beslissing =>
{
    beslissing.HasKey(b => b.Id);

    beslissing.Property(b => b.Aspect)
        .IsRequired();

    beslissing.Property(b => b.Keuze)
        .IsRequired();

    beslissing.HasOne<Team>()
        .WithMany()
        .HasForeignKey(b => b.TeamId)
        .OnDelete(DeleteBehavior.Restrict);

    beslissing.HasOne<Ronde>()
        .WithMany()
        .HasForeignKey(b => b.RondeId)
        .OnDelete(DeleteBehavior.Restrict);

    beslissing.HasIndex(b => new { b.TeamId, b.RondeId })
        .IsUnique();
});

builder.Entity<KPI>(kpi =>
{
    kpi.HasKey(k => k.Id);

    kpi.Property(k => k.KPI_Naam)
        .IsRequired();

    kpi.HasOne<Team>()
        .WithMany()
        .HasForeignKey(k => k.TeamId)
        .OnDelete(DeleteBehavior.Restrict);

    kpi.HasOne<Ronde>()
        .WithMany()
        .HasForeignKey(k => k.RondeId)
        .OnDelete(DeleteBehavior.Restrict);

    kpi.HasIndex(k => new
    {
        k.TeamId,
        k.RondeId,
        k.KPI_Naam
    }).IsUnique();
});



    }
}