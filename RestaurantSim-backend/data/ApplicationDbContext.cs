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
    public DbSet<Ronde> Rondes => Set<Ronde>();
    public DbSet<Beslissing> Beslissingen => Set<Beslissing>();
    public DbSet<KPI> KPIs => Set<KPI>();
    public DbSet<Feedback> Feedbacks => Set<Feedback>();
    public DbSet<Rol> Rollen => Set<Rol>();
    public DbSet<Doel> Doelen => Set<Doel>();
    public DbSet<Event> Events => Set<Event>();
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

participant.HasOne<Team>()
    .WithMany()
    .HasForeignKey(p => p.TeamId)
    .OnDelete(DeleteBehavior.Restrict);

participant.HasOne<Rol>()
    .WithMany()
    .HasForeignKey(p => p.RolId)
    .OnDelete(DeleteBehavior.Restrict);
 
        });


        
builder.Entity<Team>(team =>
{
    team.HasKey(t => t.Id);

    team.Property(t => t.Name)
        .IsRequired()
        .HasMaxLength(50);

    team.Property(t => t.JoinCode)
        .IsRequired()
        .HasMaxLength(6);

    team.HasIndex(t => t.JoinCode)
        .IsUnique();

    team.Property(t => t.Strategie)
        .IsRequired();

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

ronde.HasOne<Event>()
    .WithMany()
    .HasForeignKey(r => r.EventId)
    .OnDelete(DeleteBehavior.Restrict);


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


builder.Entity<Feedback>(feedback =>
{
    feedback.HasKey(f => f.Id);

    feedback.Property(f => f.Feedback_Tekst)
        .IsRequired();

    feedback.HasOne<Team>()
        .WithMany()
        .HasForeignKey(f => f.TeamId)
        .OnDelete(DeleteBehavior.Restrict);

    feedback.HasOne<Ronde>()
        .WithMany()
        .HasForeignKey(f => f.RondeId)
        .OnDelete(DeleteBehavior.Restrict);
});


builder.Entity<Rol>(rol =>
{
    rol.HasKey(r => r.Id);

    rol.Property(r => r.R_naam)
        .IsRequired();

    rol.HasIndex(r => r.R_naam)
        .IsUnique();
});

builder.Entity<Doel>(doel =>
{
    doel.HasKey(d => d.Id);

    doel.Property(d => d.Omschrijving)
        .IsRequired();

    doel.Property(d => d.Doel_Soort)
        .IsRequired();

    doel.HasOne<Team>()
        .WithMany()
        .HasForeignKey(d => d.TeamId)
        .OnDelete(DeleteBehavior.Cascade);
});

builder.Entity<Event>(gameEvent =>
{
    gameEvent.HasKey(e => e.Id);

    gameEvent.Property(e => e.E_naam)
        .IsRequired();

    gameEvent.Property(e => e.Beschrijving)
        .IsRequired();

    gameEvent.Property(e => e.Effect)
        .IsRequired();

    gameEvent.HasOne<GameSession>()
        .WithMany()
        .HasForeignKey(e => e.GameSessionId)
        .OnDelete(DeleteBehavior.Cascade);
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