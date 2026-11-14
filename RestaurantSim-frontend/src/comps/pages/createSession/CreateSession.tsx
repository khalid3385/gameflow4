import { CardHeader } from "../../util/card/CardHeader";
import { Card2 } from "../../util/card/Card2";

import { useState } from "react";

import { SubmitButton } from "../../util/Button";
import { useForm, type SubmitHandler } from "react-hook-form";
import Input from "../../util/TextInput";

export type TeamInput = {
  name: string;
  profileNumber: number;
};

type CreatedTeam = {
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

const MOCK_TEAMS: CreatedTeam[] = [
  {
    name: "Bistro Brigade",
    profileNumber: 1,
    index: 0,
    joinCode: "BIST-73",
    memberNames: ["jacob", "fortnite", "john"],
  },
  { name: "Bistro Brigade", profileNumber: 1, index: 0, joinCode: "BIST-73" },
  { name: "Bistro Brigade", profileNumber: 1, index: 0, joinCode: "BIST-73" },
  { name: "Bistro Brigade", profileNumber: 1, index: 0, joinCode: "BIST-73" },
  { name: "Bistro Brigade", profileNumber: 1, index: 0, joinCode: "BIST-73" },
];

const MOCK_SESSION: CreatedSession = {
  id: 1,
  createdAtUtc: "1",
  teams: MOCK_TEAMS,
};

const CreateSession = () => {
  const [teams, setTeams] = useState<CreatedTeam[]>(MOCK_TEAMS);

  const [session, setSession] = useState<CreatedSession | null>();

  async function createSession() {
    setSession(null);

    try {
      const response = await fetch("/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ teams }),
      });

      if (!response.ok) {
        const problem: { error?: string } | null = await response
          .json()
          .catch(() => null);

          console.log("problem")
        // setMessage(problem?.error ?? "Could not create the session.");
        return;
      }

      const created: CreatedSession = await response.json();
      setSession(created);
      setTeams([]);
      //   setMessage("Session created successfully.");
    } catch {
      //   setMessage("Could not reach the server.");
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
              <CreateTeamForm handleAddTeam={addTeam} />
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
                        joinCode={session ? t.joinCode : null}
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

        <section className="flex ">
          <SubmitButton
            onClick={() => !session && createSession()}
            className="mt-2! py-3"
            disabled={!session && teams.length <= 0}
            text={
              session ? "Start Simulation" : "Create Session & Generate Codes"
            }
          />
        </section>
      </Card2>
    </div>
  );
};

const CreatedTeam = ({
  index,
  name,
  profileNumber,
  joinCode,
  memberNames = [],
}: CreatedTeam) => {
  return (
    <div className="border border-context-border p-3 rounded-xl ">
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
            {memberNames.map((m) => (
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

const CreateTeamForm = ({ handleAddTeam }) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<TeamInput>();

  const onSubmit: SubmitHandler<TeamInput> = async (data: TeamInput) => {
    clearErrors("root.serverError");

    handleAddTeam(data.name, data.profileNumber);
  };

  return (
    <form className="flex gap-4  w-full " onSubmit={handleSubmit(onSubmit)}>
      <Input
        registration={register("name", {
          required: "Team Name can not be empty",
        })}
        errorContent={errors?.name?.message}
        labelContent={"Team Name"}
        containerClassName="flex-1 h-full mt-0!"

        // maxLength={30}
      />

      <Input
        type="number"
        registration={register("profileNumber", {
          required: "Profile number can not be empty",
        })}
        errorContent={errors?.profileNumber?.message}
        labelContent={"Profile Number"}
        containerClassName="mt-0!"

        // maxLength={30}
      />

      <SubmitButton
        disabled={isSubmitting}
        className="h-13"
        text={isSubmitting ? "Creating..." : "+ Add Team"}
      />
    </form>
  );
};

export default CreateSession;
