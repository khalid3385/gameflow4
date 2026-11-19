# GameFlow (group 4)

Multi-round restaurant business simulation, built for the module **Multilayer Webapplications** (HBO-ICT Software Engineering, Haagse Hogeschool, year 2 semester 3).

A host (spelleider) creates a game session with teams. Teams of about five players join with a team code, make decisions each round, and are scored on KPIs, feedback and a leaderboard.

## Architecture

| Layer    | Technology                                                        | Hosting                      |
| -------- | ----------------------------------------------------------------- | ---------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router, SignalR client | Vercel                  |
| Backend  | ASP.NET Core (.NET 10) minimal API, ASP.NET Identity (cookie auth), SignalR, Swagger | Azure (planned) |
| Database | PostgreSQL on Supabase, accessed through EF Core (code-first)     | Supabase                     |

```
Browser (React)  --HTTP / WebSocket-->  ASP.NET Core API  --EF Core / Npgsql-->  Supabase (PostgreSQL)
```

The backend is the only part that talks to the database. The frontend never connects to Supabase directly.

## Repository structure

```
RestaurantSim-frontend/   React + Vite app
RestaurantSim-backend/    ASP.NET Core API
  EndPoints/              Auth, session and team endpoints
  Services/               Business logic (GameSessionService)
  Models/                 Entity classes
  data/                   ApplicationDbContext
  Migrations/             EF Core migrations (PostgreSQL)
  Hubs/                   SignalR hub (/hubs/session-members)
dotnet-tools.json         Local dotnet-ef tool
```

## Running locally

### Prerequisites

- .NET 10 SDK
- Node.js and npm
- Access to the team's Supabase project (ask for the connection details)

### 1. Backend

```powershell
cd RestaurantSim-backend
dotnet tool restore
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=<pooler host>;Port=5432;Database=postgres;Username=postgres.<project-ref>;Password=<password>;SSL Mode=Require;Trust Server Certificate=true"
dotnet ef database update
dotnet run
```

- Use the **Session pooler** connection details from Supabase (Connect button). The direct connection needs IPv6 and often fails on home networks.
- The connection string is stored with .NET user secrets, so the password is **never committed**. Every developer sets it on their own machine.
- The API listens on `http://localhost:5176`. Swagger is available in Development.

### 2. Frontend

```powershell
cd RestaurantSim-frontend
npm ci
npm run dev
```

The Vite dev server proxies `/auth`, `/sessions`, `/teams` and `/hubs` (WebSocket) to `http://localhost:5176`, so the backend must be running.

## Database

- The schema is defined in C# (entities + `ApplicationDbContext`) and created through **EF Core migrations**. Do not create or change app tables by hand in the Supabase dashboard.
- Current tables: ASP.NET Identity tables (`AspNetUsers`, `AspNetRoles`, ...), `GameSessions`, `SessionParticipants`, `Teams`, `TeamMembers`.
- Adding a table:
  1. Add the entity class in `Models/` and a `DbSet` in `ApplicationDbContext`.
  2. `dotnet ef migrations add <Name>`
  3. `dotnet ef database update`
  4. Enable **Row Level Security** (no policies) on the new table in Supabase, so it is not exposed through the Supabase REST API. The backend connects as the `postgres` user and is not affected.
- Migrations are committed to git. Agree in the team who creates a migration, to avoid two conflicting migrations.

## Changelog

- The database moved from SQLite to Supabase (PostgreSQL). The old SQLite migrations were replaced by a single `InitialPostgres` migration.
- Team branches (Thijs, Owen, jacob) were merged into `dev`.

## Team workflow

- `main` is the stable branch, `dev` is the integration branch, features are built on their own branch.
- Changes go into `dev` through a pull request, with 2 approvals.
- Never commit secrets (passwords, connection strings, `.env` files).
