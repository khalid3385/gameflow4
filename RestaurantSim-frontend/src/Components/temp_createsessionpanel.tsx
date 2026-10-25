import { useState } from 'react'

type TeamInput = { 
  name: string
  profileNumber: number
}

type CreatedTeam = {
  id: number
  name: string
  joinCode: string
  profileNumber: number
  memberNames: string[]
}

type CreatedSession = {
  id: number
  createdAtUtc: string
  teams: CreatedTeam[]
}

export default function CreateSessionPanel() {
  const [teamName, setTeamName] = useState('')
  const [profileNumber, setProfileNumber] = useState(1)
  const [teams, setTeams] = useState<TeamInput[]>([])
  const [session, setSession] = useState<CreatedSession | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  function addTeam() {
    const cleanedName = teamName.trim()

    setMessage('')

    if(!cleanedName) {
      setMessage('Enter a team name.')
      return
    }

    if (cleanedName.length > 50) {
      setMessage('A team name must be at most 50 characters.')
      return
    }
  

  setTeams((currentTeams) => [
    ...currentTeams,
    { name: cleanedName, 
      profileNumber, },
  ])

  setTeamName('')
  setProfileNumber(1)
}

function deleteTeam(indextoDelete: number) {
  setTeams((currentTeams) =>
    currentTeams.filter((_, index) => index !== indextoDelete)
  )
}

  async function createSession() {
    setMessage('')
    setSession(null)

    if (teams.length === 0) {
      setMessage('Add at least one team before creating a session.')
      return
    }

    setBusy(true)

    try {
      const response = await fetch('/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({teams,}),
      })

      if (response.status === 401) {
        setMessage('Log in as a creator first.')
        return
      }

      if (!response.ok) {
        const problem: { error?: string } | null =
            await response.json().catch(() => null)
        
            setMessage(problem?.error ?? 'Could not create the session.')
        return
      }

      const created: CreatedSession = await response.json()
      setSession(created)
      setTeams([])
      setMessage('Session created successfully.')
    } catch {
      setMessage('Could not reach the server.')
    } finally {
      setBusy(false)
    }
  }

  
   return (
       <section>
         <h2>Create a session</h2>
    
         <h3>Add teams</h3>
    
         <form
           onSubmit={(event) => {
             event.preventDefault()
             addTeam()
           }}
         >
           <p>
             <label>
               Team name
               <input
                 type="text"
                 maxLength={50}
                 value={teamName}
                 disabled={busy}
                 onChange={(event) => setTeamName(event.target.value)}
               />
             </label>
           </p>
    
           <p>
             <label>
               Profile
               <select
                 value={profileNumber}
                 disabled={busy}
                 onChange={(event) =>
                   setProfileNumber(Number(event.target.value))
                 }
               >
                 <option value={1}>Profile 1</option>
                 <option value={2}>Profile 2</option>
                 <option value={3}>Profile 3</option>
                 <option value={4}>Profile 4</option>
                 <option value={5}>Profile 5</option>
                 <option value={6}>Profile 6</option>
               </select>
             </label>
           </p>
    
           <button type="submit" disabled={busy}>
             Add team
           </button>
         </form>
    
         {teams.length > 0 && (
           <div>
             <h3>Teams to create</h3>
    
             <ul>
               {teams.map((team, index) => (
                 <li key={`${team.name}-${index}`}>
                   <strong>{team.name}</strong>
                   {' - '}
                   Profile {team.profileNumber}
                   {' '}
                   <button
                     type="button"
                     disabled={busy}
                     onClick={() => deleteTeam(index)}
                   >
                     Delete
                   </button>
                 </li>
               ))}
             </ul>
           </div>
         )}
    
         <p>
           <button
             type="button"
             disabled={busy || teams.length === 0}
             onClick={() => void createSession()}
           >
             {busy ? 'Creating...' : 'Create session'}
           </button>
         </p>
    
         {session && (
           <div>
             <h3>Session {session.id} created</h3>
    
             <p>Give each team its own code:</p>
    
             <ul>
               {session.teams.map((team) => (
                 <li key={team.id}>
                   <strong>{team.name}</strong>
                   {' - '}
                   Profile {team.profileNumber}
                   {' - '}
                   Team code: <strong>{team.joinCode}</strong>
                 </li>
               ))}
             </ul>
           </div>
         )}
    
         <p role="status">{message}</p>
       </section>
     )
    }