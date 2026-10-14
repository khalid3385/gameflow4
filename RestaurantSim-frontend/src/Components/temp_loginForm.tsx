import { useState } from "react";

export default function CreatorLoginForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function login(form: HTMLFormElement) {
    const data = new FormData(form);

    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/auth/login?useCookies=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: String(data.get("email") ?? "").trim(),
          password: String(data.get("password") ?? ""),
        }),
      });

      if (!response.ok) {
        setMessage("Login failed. Check your email and password.");
        return;
      }

      form.reset();
      setMessage("Logged in successfully.");
    } catch {
      setMessage("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });

      if (!response.ok && response.status !== 401) {
        setMessage("Could not log out.");
        return;
      }

      setMessage("Logged out.");
    } catch {
      setMessage("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h2>Creator login</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void login(event.currentTarget);
        }}
      >
        <p>
          <label>
            Email
            <input name="email" type="email" autoComplete="username" required />
          </label>
        </p>

        <p>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
        </p>

        <button type="submit" disabled={busy}>
          {busy ? 'Working…' : 'Log in'}
        </button>
      </form>

      <button type="button" disabled={busy} onClick={() => void logout()}>
        Log out
      </button>

      <p role="status">{message}</p>
    </section>
  );
}
