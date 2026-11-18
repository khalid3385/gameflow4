export type SessionTeamMember = {
  id: number
  name: string
}
 
export type SessionTeam = {
  id: number
  name: string
  profileNumber: number
  members: SessionTeamMember[]
}