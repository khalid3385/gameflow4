import { useState } from 'react'

type JoinedParticipant = {
  id: number
  gameSessionId: number
  nickname: string
  joinedAtUtc: string
}

export default function JoinSessionForm() {
  const [participant, setParticipant] =
    useState<JoinedParticipant | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function join(form: HTMLFormElement) {
    const data = new FormData(form)

    setBusy(true)
    setMessage('')
    setParticipant(null)

    try {
      const response = await fetch('/sessions/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({
          joinCode: String(data.get('joinCode') ?? '').trim(),
          nickname: String(data.get('nickname') ?? '').trim(),
        }),
      })

      if (!response.ok) {
        const problem: { error?: string } | null =
          await response.json().catch(() => null)

        setMessage(problem?.error ?? 'Could not join the session.')
        return
      }

      const joined: JoinedParticipant = await response.json()
      setParticipant(joined)
      form.reset()
    } catch {
      setMessage('Could not reach the server.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section>
      <h2>Join a session</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          void join(event.currentTarget)
        }}
      >
        <p>
          <label>
            Session code
            <input
              name="joinCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
            />
          </label>
        </p>

        <p>
          <label>
            Nickname
            <input name="nickname" maxLength={30} required />
          </label>
        </p>

        <button type="submit" disabled={busy}>
          {busy ? 'Joining…' : 'Join session'}
        </button>
      </form>

      {participant && (
        <p role="status">
          {participant.nickname} joined session {participant.gameSessionId}.
          Participant ID: {participant.id}
        </p>
      )}

      <p role="status">{message}</p>
    </section>
  )
}