import type { TeamInput } from "../../pages/CreateSession2";
import { BellDot, Folder } from "lucide-react";

const TeamTable = ({ teams, session }) => {
  return (
    <section>
      <table className="  table table-fixed w-full relative">
        <thead className=" text-muted-text sticky top-0  w-full z-10 bg-surface">
          <tr className="font-norma w-full">
            <WorkspaceTableHeader title={"Name"} icon={Folder} width={"30%"} />

            {session ? (
              <>
                <WorkspaceTableHeader
                  title={"Profile"}
                  icon={BellDot}
                  width={"20%"}
                />
                <WorkspaceTableHeader
                  title={"Join Code"}
                  icon={BellDot}
                  width={"20%"}
                />
              </>
            ) : (
              <WorkspaceTableHeader
                title={"Profile"}
                icon={BellDot}
                width={"30%"}
              />
            )}

            <WorkspaceTableHeader
              title={"Actions"}
              icon={BellDot}
              width={"15%"}
            />

            {/* <WorkspaceTableHeader
                title={"Created"}
                icon={Calendar}
                width={"30%"}
              /> */}

            {/* <WorkspaceTableHeader title={""} width={"16%"} /> */}
          </tr>
        </thead>

        <tbody>
          {teams.length > 0 ? (
            teams.map((f) => <TeamRow {...f} />)
          ) : (
            <tr>
              <td className=" h-full p-8  w-full text-center opacity-50" rowSpan={4} colSpan={3}>
                No teams added yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

const WorkspaceTableHeader = ({ title, icon, width }) => {
  return (
    <th
      style={{ width: width }}
      className="uppercase text-[smaller]  font-medium "
    >
      <div className="flex gap-2 items-center border-b border-context-border  p-3">
        {/* <Icon size="16" icon={icon} /> */}
        <p className="text-nowrap ">{title}</p>
      </div>
    </th>
  );
};

const TeamRow = ({ name, profileNumber }: TeamInput) => {
  return (
    <tr className="border-b border-context-border  gap-1 ">
      <td className="font-medium p-4-">
        <p>{name}</p>
      </td>
      <td className="p-4-">
        <div className="border w-fit px-2 rounded border-context-border">
          <p>{profileNumber}</p>
        </div>
      </td>
    </tr>
  );
};

export default TeamTable;
