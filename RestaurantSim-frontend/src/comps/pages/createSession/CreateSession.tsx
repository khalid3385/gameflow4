import { CardHeader } from "../../util/card/CardHeader";
import { Card2 } from "../../util/card/Card2";

import { useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { readTabValue, writeTabValue } from "../../util/tabStorage";

import { SubmitButton } from "../../util/Button";
import { ErrorMessage } from "../../util/TextInput";
import CreateTeamForm from "./CreateTeamForm";
import CreatedTeamRow from "./CreatedTeam";

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
  startedAtUtc: string | null;
  teams: CreatedTeam[];
};

const SESSION_ID_KEY = "restauflow.hostSessionId";

function readSessionId() {
  const id = Number(readTabValue(SESSION_ID_KEY));
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

const MAX_TEAMS = 8;

const CreateSession = () => {
  const [teams, setTeams] = useState<CreatedTeam[]>([]);
  const [session, setSession] = useState<CreatedSession | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const [sessionId, setSessionId] = useState(readSessionId);
  const [liveError, setLiveError] = useState("");

  useEffect(() => {
    if (sessionId === null) return;

    const connection = new HubConnectionBuilder()
      .withUrl("/hubs/session-members")
      .withAutomaticReconnect()
      .build();

    let active = true;
    let readVersion = 0;

    async function refreshSession() {
      const version = ++readVersion;

      try {
        const fresh = await connection.invoke<CreatedSession | null>(
          "GetSession",
          sessionId,
        );
        if (!active || version !== readVersion) return;

        if (!fresh) {
          writeTabValue(SESSION_ID_KEY, null);
          setSessionId(null);
          setSession(null);
          setLiveError("This session is no longer available.");
          return;
        }

        setSession(fresh);
        setLiveError("");
      } catch {
        if (active && version === readVersion) {
          setLiveError("Could not load team members. Refresh to retry.");
        }
      }
    }

    connection.on("SessionMembersChanged", (changedId: number) => {
      if (changedId === sessionId) void refreshSession();
    });

    connection.onreconnecting(() => {
      readVersion++;
      if (active) setLiveError("Reconnecting live member updates...");
    });

    connection.onreconnected(() => void refreshSession());

    connection.onclose(() => {
      readVersion++;
      if (active) setLiveError("Live updates disconnected. Refresh to retry.");
    });

    void connection
      .start()
      .then(refreshSession)
      .catch(() => {
        if (active)
          setLiveError("Could not connect to live updates. Refresh to retry.");
      });

    return () => {
      active = false;
      void connection.stop().catch(() => {});
    };
  }, [sessionId]);

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
      setSessionId(created.id);
      writeTabValue(SESSION_ID_KEY, String(created.id));
      setLiveError("");
      setTeams([]);
    } catch {
      setCreateError("Could not create the session. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }

  async function startSession() {
    if (!session) return;

    setCreateError(null);
    setIsStarting(true);

    try {
      const response = await fetch(`/sessions/${session.id}/start`, {
        method: "POST",
        credentials: "include",
      });

      if (response.status === 401) {
        setCreateError("Please log in to start the session.");
        return;
      }

      if (!response.ok) {
        const problem: { error?: string } | null = await response
          .json()
          .catch(() => null);

        setCreateError(problem?.error ?? "Could not start the session.");
        return;
      }

      const result: { startedAtUtc: string } = await response.json();
      setSession({ ...session, startedAtUtc: result.startedAtUtc });
    } catch {
      setCreateError("Could not start the session. Please try again.");
    } finally {
      setIsStarting(false);
    }
  }

  function addTeam(_teamName: string, _profileNumber: number) {
    const cleanedName = _teamName.trim();

    setTeams((currentTeams) => [
      ...currentTeams,
      { name: cleanedName, profileNumber: _profileNumber },
    ]);
  }

  function removeTeam(indexToRemove: number) {
    setTeams((currentTeams) =>
      currentTeams.filter((_, i) => i !== indexToRemove),
    );
  }

  if (sessionId !== null && !session) {
    return liveError ? (
      <p role="alert">{liveError}</p>
    ) : (
      <p role="status">Restoring your session...</p>
    );
  }

  const hasStarted = Boolean(session?.startedAtUtc);

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
              <fieldset
                disabled={isCreating || teams.length >= MAX_TEAMS}
                className="min-w-0 w-full"
              >
                <CreateTeamForm
                  handleAddTeam={addTeam}
                  usedProfiles={teams.map((t) => t.profileNumber)}
                />
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
                      <CreatedTeamRow
                        key={`${t.name}-${i}`}
                        {...t}
                        index={i + 1}
                        joinCode={session ? t.joinCode : undefined}
                        onRemove={session ? undefined : () => removeTeam(i)}
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
            onClick={() => (session ? startSession() : createSession())}
            className="mt-2! py-3"
            disabled={
              session
                ? hasStarted || isStarting
                : isCreating || teams.length <= 0
            }
            text={
              session
                ? hasStarted
                  ? "Simulation Started"
                  : isStarting
                    ? "Starting..."
                    : "Start Simulation"
                : "Create Session & Generate Codes"
            }
          />

          {liveError && <p role="status">{liveError}</p>}

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