import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import FormCard, { FormHeader } from "../util/FormCard";

type CreatedSession = {
  id: number;
  joinCode: string;
  createdAtUtc: string;
};

type FormFields = {
  code: string;
};

const CreateSession = () => {
  const [session, setSession] = useState<CreatedSession | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {};

  async function createSession() {
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });

      if (response.status === 401) {
        setMessage("Log in as a creator first.");
        return;
      }

      if (!response.ok) {
        setMessage("Could not create the session.");
        return;
      }

      const created: CreatedSession = await response.json();
      setSession(created);
    } catch {
      setMessage("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <FormCard width="w-110">
        <FormHeader
          title="Create a session"
          description="Enter the code given by the host to join a team."
          marginBottom="2rem"
        />
      </FormCard>
    </div>
    //  <section>
    //    <h2>Create a session</h2>

    //    <button
    //      type="button"
    //      disabled={busy}
    //      onClick={() => void createSession()}
    //    >
    //      {busy ? 'Creating…' : 'Create session'}
    //    </button>

    //    {session && (
    //      <p>
    //        Session {session.id} — Join code: <strong>{session.joinCode}</strong>
    //      </p>
    //    )}

    //    <p role="status">{message}</p>
    //  </section>
  );
};

export default CreateSession;
