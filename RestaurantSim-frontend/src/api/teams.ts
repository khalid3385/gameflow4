export type TeamMember = { id: number; name: string };

function sendTeamRequest(
  path: string,
  method: "POST" | "DELETE",
  body: { joinCode: string; name?: string },
  signal?: AbortSignal,
) {
  return fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "omit",
    body: JSON.stringify(body),
    signal,
  });
}

export function lookupTeam(joinCode: string, signal?: AbortSignal) {
  return sendTeamRequest("/teams/join", "POST", { joinCode: joinCode.trim() }, signal);
}

async function requireSuccess(response: Response) {
  if (response.ok) return;

  const problem: { error?: string } | null = await response.json().catch(() => null);
  throw new Error(problem?.error ?? "Could not update the team members.");
}

export async function addTeamMember(joinCode: string, name: string): Promise<TeamMember> {
  const response = await sendTeamRequest("/teams/members", "POST", { joinCode, name });
  await requireSuccess(response);
  return response.json();
}

export async function deleteTeamMember(joinCode: string, memberId: number) {
  const response = await sendTeamRequest(`/teams/members/${memberId}`, "DELETE", { joinCode });
  if (response.status !== 404) await requireSuccess(response);
}