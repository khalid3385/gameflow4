import { useState } from 'react'

type CreatedSession = {
  id: number
  joinCode: string
  createdAtUtc: string
}

export default function CreateSessionPanel() {
  const [session, setSession] = useState<CreatedSession | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function createSession() {
    setBusy(true)
    setMessage('')

    try {
      const response = await fetch('/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      })

      if (response.status === 401) {
        setMessage('Log in as a creator first.')
        return
      }

      if (!response.ok) {
        setMessage('Could not create the session.')
        return
      }

      const created: CreatedSession = await response.json()
      setSession(created)
    } catch {
      setMessage('Could not reach the server.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section>
      <h2>Create a session</h2>

      <button
        type="button"
        disabled={busy}
        onClick={() => void createSession()}
      >
        {busy ? 'Creating…' : 'Create session'}
      </button>

      {session && (
        <p>
          Session {session.id} — Join code: <strong>{session.joinCode}</strong>
        </p>
      )}

      <p role="status">{message}</p>
    </section>
  )
}