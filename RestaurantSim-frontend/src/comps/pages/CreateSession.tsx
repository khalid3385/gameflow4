import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import FormCard, { FormHeader } from "../util/FormCard";

import { ErrorMessage } from "../util/TextInput";
import { SubmitButton } from "../util/Button";

type CreatedSession = {
  id: number;
  joinCode: string;
  createdAtUtc: string;
};

type FormFields = {
  request: string;
};

const CreateSession = () => {
  const [session, setSession] = useState<CreatedSession | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) =>
    createSession(data);

  async function createSession(data: FormFields) {
    try {
      const response = await fetch("/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });

      // should not be an error,
      // page should be inaccessible if not logged in
      if (response.status === 401) {
        setError("request", {
          type: "custom",
          message: "Log in as a creator first.",
        });
        return;
      }

      if (!response.ok) {
        setError("request", {
          type: "custom",
          message: "Could not create the session, try again later.",
        });
        return;
      }

      const created: CreatedSession = await response.json();
      setSession(created);
    } catch {
      setError("request", {
        type: "custom",
        message: "Could not reach the server, try again later.",
      });
    }
  }

  return (
    <div
      className={`flex flex-1  ${session ? "flex-col mt-12 gap-12" : "items-center justify-center"}`}
    >
      {!session ? (
        <FormCard width="w-110">
          <>
            <FormHeader
              title="Create a session"
              description="Enter the code given by the host to join a team."
              marginBottom="2rem"
            />

            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* 

                add options here
            */}

              <p className="opacity-30 text-xs text-center">
                {" "}
                options go here later...
              </p>
              <SubmitButton
                disabled={isSubmitting}
                text={isSubmitting ? "Creating..." : "Create"}
              ></SubmitButton>
            </form>

            {errors?.request && (
              <ErrorMessage errorContent={errors?.request?.message} />
            )}
          </>
        </FormCard>
      ) : (
        <>
          <WaitingRoom
            joinCode={session?.joinCode}
            isSubmitting={isSubmitting}
          />
        </>
      )}
    </div>
  );
};

const WaitingRoom = ({
  joinCode,
  isSubmitting,
}: {
  joinCode: string;
  isSubmitting: boolean;
}) => {
  return (
    <>
      <div className="text-center flex flex-col justify-center items-center pt-15">
        <p className="text-6xl text-green-500 mb-4">✓</p>

        <h2 className="text-3xl mb-2 font-medium max-w-100">
          Join at <span className="font-bold">gameflow/join.nl</span> with code:
        </h2>

        <span className="font-bold text-6xl mt-5 bg-white p-5 px-6 rounded-xl">
          {joinCode}
        </span>
      </div>

      <div className="relative flex items-center justify-center flex-1   border border-neutral-300">
        <h2 className="text-xl">Waiting for players...</h2>
        <div className="absolute right-5 top-0">
          <SubmitButton
            disabled={isSubmitting}
            text={isSubmitting ? "Creating..." : "Start"}
          />
        </div>
      </div>
    </>
  );
};

export default CreateSession;
