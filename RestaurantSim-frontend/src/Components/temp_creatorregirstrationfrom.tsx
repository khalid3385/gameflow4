import { useState } from 'react'

type RegistrationProblem = {
  title?: string
  errors?: Record<string, string[]>
}

export default function CreatorRegistrationForm() {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function register(form: HTMLFormElement) {
    const data = new FormData(form)

    setBusy(true)
    setMessage('')

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({
          email: String(data.get('email') ?? '').trim(),
          password: String(data.get('password') ?? ''),
        }),
      })

      if (!response.ok) {
        const problem: RegistrationProblem | null =
          await response.json().catch(() => null)

        const errors = Object.values(problem?.errors ?? {})
          .flat()
          .join(' ')

        setMessage(
          errors || problem?.title || 'Could not create the account.',
        )
        return
      }

      form.reset()
      setMessage('Account created. Use the login form to log in.')
    } catch {
      setMessage('Could not reach the server.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section>
      <h2>Create a creator account</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          void register(event.currentTarget)
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
              autoComplete="new-password"
              required
            />
          </label>
        </p>

        <button type="submit" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p role="status">{message}</p>
    </section>
  )
}