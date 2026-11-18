import { useEffect, useState } from "react";
import { Card2 } from "../../util/card/Card2";
import { CardHeader } from "../../util/card/CardHeader";
import JoinTeamForm from "./JoinTeamForm";
import AddMemberForm from "./AddMemberForm";
import Button from "../../util/Button";
import {
  addTeamMember,
  deleteTeamMember,
  lookupTeam,
  type TeamMember,
} from "../../../api/teams";
import { readTabValue, writeTabValue } from "../../util/tabStorage";

const JOIN_CODE_KEY = "restauflow.joinCode";

export type JoinedTeam = {
  id: number;
  name: string;
  profileNumber: number;
  joinCode: string;
  members: TeamMember[];
};

export default function JoinSession() {
  const [team, setTeam] = useState<JoinedTeam | null>(null);
  const members = team?.members ?? [];
  const [savedCode] = useState(() => readTabValue(JOIN_CODE_KEY));
  const [restoring, setRestoring] = useState(Boolean(savedCode));
  const [restoreError, setRestoreError] = useState("");

  useEffect(() => {
    if (!savedCode) return;
    const controller = new AbortController();

    async function restore(code: string) {
      try {
        const response = await lookupTeam(code, controller.signal);
        if (controller.signal.aborted) return;

        if (response.status === 400 || response.status === 404) {
          writeTabValue(JOIN_CODE_KEY, null);
        }
        if (!response.ok) throw new Error("Could not restore the team.");

        const joined: JoinedTeam = await response.json();
        if (!controller.signal.aborted) setTeam(joined);
      } catch {
        if (!controller.signal.aborted) {
          setRestoreError(
            "Could not restore your team. Enter the code to join again.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setRestoring(false);
      }
    }

    void restore(savedCode);
    return () => controller.abort();
  }, [savedCode]);

  function rememberTeam(joined: JoinedTeam) {
    writeTabValue(JOIN_CODE_KEY, joined.joinCode);
    setTeam(joined);
    setRestoreError("");
  }

  function updateMembers(
    teamId: number,
    update: (list: TeamMember[]) => TeamMember[],
  ) {
    setTeam((current) => {
      if (current?.id !== teamId) return current;
      return { ...current, members: update(current.members) };
    });
  }

  async function handleAddMember(name: string) {
    if (!team) throw new Error("Join a team first.");

    const member = await addTeamMember(team.joinCode, name.trim());
    updateMembers(team.id, (list) => [...list, member]);
  }

  async function handleDeleteMember(id: number) {
    if (!team) return;

    await deleteTeamMember(team.joinCode, id);
    updateMembers(team.id, (list) => list.filter((member) => member.id !== id));
  }

  if (restoring) return <p role="status">Restoring your team...</p>;

  return !team ? (
    <div className="flex flex-1  items-center justify-center">
      <Card2 className="w-110">
        {restoreError && <p role="alert">{restoreError}</p>}
        <JoinTeamForm setTeam={rememberTeam} />
      </Card2>
    </div>
  ) : (
    <div className="flex flex-1 flex-col m-10 ">
      <Card2 className="flex flex-col gap-5 flex-1">
        <CardHeader
          title={
            <span>
              You joined team: <span className="font-bold">{team.name}</span>
            </span>
          }
          size="lg"
          align="left"
          className="mb-2"
          description="Add your team members and await the host to start the game!"
        />
        <section className="mt-4  flex flex-col min-h-0 justify-start items-start">
          <CardHeader
            className="mb-2"
            title="Add Member"
            size="md"
            align="left"
          />
          <AddMemberForm
            handleAddMember={(name: string) => handleAddMember(name)}
          />
        </section>
        <div className="flex-1 w-full p-5 border border-context-border rounded-xl flex flex-col gap-2">
          {members.length > 0 ? (
            members.map((member) => (
              <MemberRow
                key={member.id}
                name={member.name}
                handleDeleteMember={() => handleDeleteMember(member.id)}
              />
            ))
          ) : (
            <div className="flex-1 flex justify-center items-center opacity-50">
              No team members added
            </div>
          )}
        </div>
      </Card2>
    </div>
  );
}

const MemberRow = ({ name, handleDeleteMember }: {
  name: string;
  handleDeleteMember: () => Promise<void>;
}) => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    setPending(true);
    setError("");

    try {
      await handleDeleteMember();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not remove the member.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center justify-between border border-context-border bg-white p-3 rounded-xl">
      {name}
      {error && <span role="alert">{error}</span>}
      <Button onClick={remove} disabled={pending} className="bg-red-500 text-white">
        Delete
      </Button>
    </div>
  );
};