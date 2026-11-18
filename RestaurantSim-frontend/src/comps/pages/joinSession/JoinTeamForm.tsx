import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { JoinedTeam } from "./JoinSession";
import { CardHeader } from "../../util/card/CardHeader";
import { CardBody } from "../../util/card/Card2";
import Input, { ErrorMessage } from "../../util/TextInput";
import { SubmitButton } from "../../util/Button";

type FormFields = {
  code: string;
  request: string;
};

const JoinTeamForm = ({ setTeam }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    try {
      const response = await fetch("/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          joinCode: String(data.code ?? "").trim(),
        }),
      });

      if (!response.ok) {
        const problem: { error?: string } | null = await response
          .json()
          .catch(() => null);

        setError("code", {
          type: "custom",
          message: problem?.error ?? "Could not find the session.",
        });
        return;
      }


      const joined: JoinedTeam = await response.json();
      setTeam(joined);
    } catch {
      setError("request", {
        type: "custom",
        message: "Could not reach the server, try again later.",
      });
    }
  };

  return (
    <>
      <CardHeader
        title="Join a team"
        size="lg"
        description="Enter a team code to join a team."
        // className="mb-2!"
      />
      <CardBody>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <Input
            registration={register("code", {
              required: "Code can not be empty",

              pattern: {
                value: /[0-9]{6}/,
                message: "Enter a valid code.",
              },
            })}
            errorContent={errors?.code?.message}
            labelContent={"Team code"}
            type="text"
            inputMode="numeric"
            maxLength={6}
            // required
          />
          <SubmitButton
            className="mt-2! py-3"
            disabled={isSubmitting}
            text={isSubmitting ? "Joining…" : "Join"}
          />
        </form>
        {errors?.request && (
          <ErrorMessage errorContent={errors?.request?.message} />
        )}
      </CardBody>
    </>
  );
};

export default JoinTeamForm;
