import { CardHeader } from "../../util/card/CardHeader";
import { Card2 } from "../../util/card/Card2";

import { useState } from "react";

import { SubmitButton } from "../../util/Button";
import { ErrorMessage } from "../../util/TextInput";
import CreateTeamForm from "./CreateTeamForm";
import CreatedTeam from "./CreatedTeam";
export type TeamInput = {
  name: string;
  profileNumber: number;
};

export type CreatedTeam = {
  index?: number;
  name: string;
  joinCode?: string;
  profileNumber: number;
  memberNames?: string[];
};

type CreatedSession = {
  id: number;
  createdAtUtc: string;
  teams: CreatedTeam[];
};

const CreateSession = () => {
  const [teams, setTeams] = useState<CreatedTeam[]>([]);
  const [session, setSession] = useState<CreatedSession | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  async function createSession() {
    setCreateError(null);
    setIsCreating(true);

    try {
      const response = await fetch("/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ teams }),
      });

      if (response.status === 401) {
        setCreateError("Please log in to create a session.");
        return;
      }

      if (!response.ok) {
        const problem: { error?: string } | null = await response
          .json()
          .catch(() => null);

        setCreateError(problem?.error ?? "Could not create the session.");
        return;
      }

      const created: CreatedSession = await response.json();
      setSession(created);
      setTeams([]);
    } catch {
      setCreateError("Could not create the session. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }

  function addTeam(_teamName: string, _profileNumber: number) {
    const cleanedName = _teamName.trim();

    setTeams((currentTeams) => [
      ...currentTeams,
      { name: cleanedName, profileNumber: _profileNumber },
    ]);
  }

  return (
    <div className="flex flex-col   m-10">
      <Card2 className="flex flex-col gap-5 flex-1 ">
        <CardHeader
          title={session ? "Join Active Session" : "Create Session"}
          size="lg"
          description="Set up your restaurant simulation teams, assign profile numbers, and launch your live session. "
          align="left"
          className="mb-5"
        />

        <section className="flex flex-col flex-1 min-h-0  justify-start items-start">
          {!session && (
            <>
              <CardHeader
                className="mb-2"
                title="Create Teams"
                size="md"
                align="left"
              />
              <fieldset disabled={isCreating} className="min-w-0 w-full">
                <CreateTeamForm handleAddTeam={addTeam} />
              </fieldset>
            </>
          )}

          <div className="mt-4 flex- w-full p-5 border border-context-border rounded-xl flex flex-col">
            <div className="flex flex-col gap-3 min-h-0 max-h-full   flex-1">
              <CardHeader
                align="left"
                className="shrink-0 border-b pb-4 border-context-border"
                title={session ? "Generated Team Join Codes" : "Current Teams"}
                size="sm"
                description={
                  session
                    ? "Distribute codes to player teams to let them enter the waiting room"
                    : "Join codes are generated next."
                }
              />

              {teams.length > 0 || session ? (
                <>
                  <div className="flex-1 max-h-75 h-75   overflow-y-auto flex flex-col gap-4 pr-1">
                    {(session?.teams || teams).map((t, i) => (
                      <CreatedTeam
                        key={`${t.name}-${i}`}
                        {...t}
                        index={i + 1}
                        joinCode={session ? t.joinCode : undefined}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="size-full flex-1 flex justify-center items-center">
                  <p className="text-center text-muted-text">
                    No teams created yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="flex flex-col items-start gap-2">
          <SubmitButton
            onClick={() => !session && createSession()}
            className="mt-2! py-3"
            disabled={!session && (isCreating || teams.length <= 0)}
            text={
              session ? "Start Simulation" : "Create Session & Generate Codes"
            }
          />

          {createError && (
            <div role="alert">
              <ErrorMessage errorContent={createError} />
            </div>
          )}
        </section>
      </Card2>
    </div>
  );
};



export default CreateSession;
