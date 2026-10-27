import { useState } from "react";
import FormCard from "../util/FormCard";
import TextInput from "../util/TextInput";
import Button from "../util/Button";

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
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function join(form: HTMLFormElement) {
    const data = new FormData(form);

    setBusy(true);
    setMessage("");
    setParticipant(null);

    try {
      const response = await fetch("/sessions/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          joinCode: String(data.get("joinCode") ?? "").trim(),
          nickname: String(data.get("nickname") ?? "").trim(),
        }),
      });

      if (!response.ok) {
        const problem: { error?: string } | null = await response
          .json()
          .catch(() => null);

        setMessage(problem?.error ?? "Could not join the session.");
        return;
      }

      const joined: JoinedParticipant = await response.json();
      setParticipant(joined);
      form.reset();
    } catch {
      setMessage("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <FormCard width="w-110">
        <div className="mb-5 text-center">
          <h2 className="text-xl mb-1 font-medium">Join a team</h2>
          <p className="opacity-70">
            Enter the code given by the host to join a team.
          </p>
        </div>

        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void join(event.currentTarget);
          }}
        >
          <TextInput
            placeholder="John Doe"
            labelContent={"Nickname"}
            name="nickname"
            maxLength={30}
            required
          />
          <TextInput
            placeholder="Enter Code"
            errorContent={message}
            className={message && " border-red-500! "}
            labelContent={"Session code"}
            name="joinCode"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
          />

          <Button
            className="bg-blue-600 text-white h-10 mt-4"
            type="submit"
            disabled={busy}
          >
            {busy ? "Joining…" : "Join session"}
          </Button>
        </form>

        {/* {participant && (
          <p role="status">
            {participant.nickname} joined session {participant.gameSessionId}.
            Participant ID: {participant.id}
          </p>
        )} */}
      </FormCard>
    </div>
  );
}
