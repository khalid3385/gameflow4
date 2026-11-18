
import type { CreatedTeam } from './CreateSession';

const CreatedTeamRow = ({
  index,
  name,
  profileNumber,
  joinCode,
  memberNames = [],
}: CreatedTeam) => {
  return (
    <div className="border border-context-border bg-white p-3 rounded-xl ">
      <div className="flex justify-between w-full ">
        <div className="flex items-center gap-3">
          <p className="p-1 px-2.25 rounded-full bg-surface-darker font-medium text-xs">
            {index}
          </p>

          <p className="font-medium">{name}</p>
          <p className="p-1 px-1.5 bg-surface-darker rounded-lg font-medium text-xs">
            Profile #{profileNumber}
          </p>
        </div>
        {joinCode && (
          <div>
            <p className="text-primary font-semibold bg-surface-darker p-1 px-3 rounded-lg">
              <span className="opacity-50 mr-1"># </span> {joinCode}
            </p>
          </div>
        )}
      </div>

      {joinCode && (
        <div className="border-t border-inherit pt-3 mt-2 text-xs">
          <span className="font-medium">Joined Members: </span>
          <span className="flex-inline gap-1">
            {memberNames.map((m: string) => (
              <span className="mr-1 p-0.5 px-2 border rounded-full border-context-border">
                {m}
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
};


export default CreatedTeamRow;
