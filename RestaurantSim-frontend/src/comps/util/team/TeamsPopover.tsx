import type { SessionTeam } from "../../../api/sessionTypes";
 
type TeamsPopoverProps = {
  teams: SessionTeam[];
  loading: boolean;
  error: string;
};
 
export default function TeamsPopover({
  teams,
  loading,
  error,
}: TeamsPopoverProps) {
  if (loading) {
    return (
      <div className="teams-popover" role="status">
        Teams laden...
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="teams-popover" role="alert">
        {error}
      </div>
    );
  }
 
  return (
    <div className="teams-popover">
      <h2>Teams</h2>
 
      {teams.length === 0 ? (
        <p>Er zijn geen teams gevonden.</p>
      ) : (
        <ul className="teams-popover__teams">
          {teams.map((team) => (
            <li key={team.id} className="teams-popover__team">
              <strong>{team.name}</strong>
              <p>Profiel {team.profileNumber}</p>
 
              {team.members.length === 0 ? (
                <p>Nog geen namen ingevuld.</p>
              ) : (
                <ul className="teams-popover__members">
                  {team.members.map((member) => (
                    <li key={member.id}>{member.name}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}