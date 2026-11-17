import { useState } from 'react'

type TeamMember = {
  id: number
  name: string
}

type JoinedTeam = {
  id: number
  name: string
  profileNumber: number
  members: TeamMember[]
}

export default function JoinSessionForm() {
  const [joinedTeam, setJoinedTeam] = useState<JoinedTeam | null>(null)
  const [joinCode, setJoinCode] = useState('')
  const [memberName, setMemberName] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function joinTeam() {
    const cleanedCode = joinCode.trim()

    setMessage('')
    setJoinedTeam(null)

    if (!/^[0-9]{6}$/.test(cleanedCode)) {
      setMessage('The team code must contain six digits.')
      return
    }

    setBusy(true)

    try {
      const response = await fetch('/teams/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify({
          joinCode: cleanedCode,
        }),
      })

      if (!response.ok) {
        const problem: { error?: string } | null =
          await response.json().catch(() => null)

        setMessage(problem?.error ?? 'Could not join the team.')
        return
      }

      const team: JoinedTeam = await response.json()

      setJoinCode(cleanedCode)
      setJoinedTeam(team)
      setMessage(`Successfully joined ${team.name}.`)
    } catch {
      setMessage('Could not reach the server.')
    } finally {
      setBusy(false)
    }
  }

  async function addMember() {
    const cleanedName = memberName.trim()

    setMessage('')

    if (!joinedTeam) {
      setMessage('Join a team first.')
      return
    }

    if (!cleanedName) {
      setMessage('Enter a name.')
      return
    }

    if (cleanedName.length > 50) {
      setMessage('A name must be at most 50 characters.')
      return
    }

    if (joinedTeam.members.length >= 20) {
      setMessage('A team can have at most 20 names.')
      return
    }

    setBusy(true)

    try {
      const response = await fetch('/teams/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify({
          joinCode,
          name: cleanedName,
        }),
      })

      if (!response.ok) {
        const problem: { error?: string } | null =
          await response.json().catch(() => null)

        setMessage(problem?.error ?? 'Could not add the name.')
        return
      }

      const createdMember: TeamMember = await response.json()

      setJoinedTeam((currentTeam) => {
        if (!currentTeam) {
          return currentTeam
        }

        return {
          ...currentTeam,
          members: [...currentTeam.members, createdMember],
        }
      })

      setMemberName('')
      setMessage(`${createdMember.name} was added to the team.`)
    } catch {
      setMessage('Could not reach the server.')
    } finally {
      setBusy(false)
    }
  }

  async function deleteMember(memberId: number) {
    if (!joinedTeam) {
      return
    }

    setBusy(true)
    setMessage('')

    try {
      const response = await fetch(`/teams/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify({
          joinCode,
        }),
      })

      if (!response.ok) {
        const problem: { error?: string } | null =
          await response.json().catch(() => null)

        setMessage(problem?.error ?? 'Could not delete the name.')
        return
      }

      setJoinedTeam((currentTeam) => {
        if (!currentTeam) {
          return currentTeam
        }

        return {
          ...currentTeam,
          members: currentTeam.members.filter(
            (member) => member.id !== memberId,
          ),
        }
      })

      setMessage('The name was deleted.')
    } catch {
      setMessage('Could not reach the server.')
    } finally {
      setBusy(false)
    }
  }

  function leaveTeam() {
    setJoinedTeam(null)
    setJoinCode('')
    setMemberName('')
    setMessage('')
  }

  return (
    <section>
      <h2>Join a team</h2>

      {!joinedTeam && (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void joinTeam()
          }}
        >
          <p>
            <label>
              Team code
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={joinCode}
                disabled={busy}
                onChange={(event) => setJoinCode(event.target.value)}
              />
            </label>
          </p>

          <button type="submit" disabled={busy}>
            {busy ? 'Joining...' : 'Join team'}
          </button>
        </form>
      )}

      {joinedTeam && (
        <div>
          <h3>{joinedTeam.name}</h3>

          <p>
            Successfully joined <strong>{joinedTeam.name}</strong>.
          </p>

          <p>Selected profile: {joinedTeam.profileNumber}</p>

          <p>Waiting for the host to start the game.</p>

          <h3>Team members</h3>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              void addMember()
            }}
          >
            <p>
              <label>
                Name
                <input
                  type="text"
                  maxLength={50}
                  required
                  value={memberName}
                  disabled={busy || joinedTeam.members.length >= 20}
                  onChange={(event) => setMemberName(event.target.value)}
                />
              </label>
            </p>

            <button
              type="submit"
              disabled={busy || joinedTeam.members.length >= 20}
            >
              {busy ? 'Saving...' : 'Add name'}
            </button>
          </form>

          <p>
            {joinedTeam.members.length} of 20 names added
          </p>

          {joinedTeam.members.length === 0 ? (
            <p>No names have been added yet.</p>
          ) : (
            <ul>
              {joinedTeam.members.map((member) => (
                <li key={member.id}>
                  {member.name}
                  {' '}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void deleteMember(member.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={leaveTeam}
          >
            Leave team
          </button>
        </div>
      )}

      <p role="status">{message}</p>
    </section>
  )
}