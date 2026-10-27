import { useState } from "react";
import FormCard, { FormHeader } from "../util/FormCard";
import TextInput from "../util/TextInput";
import Button from "../util/Button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "../util/TextInput";
import { SubmitButton } from "../util/Button";

type FormFields = {
  code: string;
  nickname: string;
  request: string;
};

type JoinedParticipant = {
  id: number;
  gameSessionId: number;
  nickname: string;
  joinedAtUtc: string;
};

export default function JoinSession() {
  const [participant, setParticipant] = useState<JoinedParticipant | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await fetch("/sessions/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          joinCode: String(data.code ?? "").trim(),
          nickname: String(data.nickname ?? "").trim(),
        }),
      });

      if (!response.ok) {
        const problem: { error?: string } | null = await response
          .json()
          .catch(() => null);

        setError("code", {
          type: "custom",
          message: problem?.error ?? "Could not join the session.",
        });
        return;
      }

      const joined: JoinedParticipant = await response.json();
      setParticipant(joined);
    } catch {
      setError("request", {
        type: "custom",
        message: "Could not reach the server, try again later.",
      });
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <FormCard width="w-110">
        {!participant ? (
          <>
            <FormHeader
              title="Join a team"
              description="Enter the code given by the host to join a team."
              marginBottom="2rem"
            />
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                {...register("nickname", {
                  required: "Nickname can not be empty",
                })}
                errorContent={errors?.nickname?.message}
                placeholder="John Doe"
                labelContent={"Nickname"}
                name="nickname"
                maxLength={30}
                // required
              />
              <TextInput
                {...register("code", {
                  required: "Code can not be empty",

                  pattern: {
                    value: /[0-9]{6}/,
                    message: "Enter a valid code.",
                  },
                })}
                placeholder="Enter Code"
                errorContent={errors?.code?.message}
                labelContent={"Session code"}
                name="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                // required
              />
              <SubmitButton 
                disabled={isSubmitting}
                text={isSubmitting ? "Joining…" : "Join"}
              />
            </form>
            {errors?.request && (
              <ErrorMessage errorContent={errors?.request?.message} />
            )}
          </>
        ) : (
          <div className="text-center">
            <p className="text-6xl text-green-500 mb-4">✓</p>
            <h2 className="text-4xl mb-2 font-medium">
              You joined Session {participant.gameSessionId}
            </h2>
            <p className="opacity-70">Awaiting the host to start the game.</p>
            {/* <h3 className="mt-5 text-2xl">Get ready {participant.nickname}!</h3> */}
          </div>
        )}
      </FormCard>
    </div>
  );
}
