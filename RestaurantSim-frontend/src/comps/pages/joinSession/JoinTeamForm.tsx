import { lookupTeam } from "../../../api/teams";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { JoinedTeam } from "./JoinSession";
import { CardHeader } from "../../util/card/CardHeader";
import { CardBody } from "../../util/card/Card2";
import Input, { ErrorMessage } from "../../util/TextInput";
import { SubmitButton } from "../../util/Button";

type FormFields = {
  code: string;
};

const JoinTeamForm = ({ setTeam }: { setTeam: (team: JoinedTeam) => void }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async ({ code }) => {
    try {
      const response = await lookupTeam(code);

      if (!response.ok) {
        const problem: { error?: string } | null = await response
          .json()
          .catch(() => null);

        setError("code", {
          type: "server",
          message: problem?.error ?? "Could not join the team.",
        });
        return;
      }

      const joined: JoinedTeam = await response.json();
      setTeam(joined);
    } catch {
      setError("root.request", {
        type: "server",
        message: "Could not reach the server, try again later.",
      });
    }
  };

  const requestError = errors.root?.request?.message;

  return (
    <>
      <CardHeader
        title="Join a team"
        size="lg"
        description="Enter a team code to join a team."
      />
      <CardBody>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <Input
            registration={register("code", {
              required: "Enter a team code.",
              pattern: {
                value: /^[0-9]{6}$/,
                message: "Enter a six-digit team code.",
              },
            })}
            errorContent={errors.code?.message ?? ""}
            labelContent="Team code"
            type="text"
            inputMode="numeric"
            maxLength={6}
          />
          <SubmitButton
            className="mt-2! py-3"
            disabled={isSubmitting}
            text={isSubmitting ? "Joining…" : "Join"}
          />
        </form>
        {requestError && <ErrorMessage errorContent={requestError} />}
      </CardBody>
    </>
  );
};

export default JoinTeamForm;