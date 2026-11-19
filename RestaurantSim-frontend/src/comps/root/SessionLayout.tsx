import { useEffect, useRef, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import type { SessionTeam } from "../../api/sessionTypes";
import TeamsPopover from "../util/team/TeamsPopover";
 
export default function SessionLayout() {
  const { sessionId } = useParams();
  const [teams, setTeams] = useState<SessionTeam[]>([]);
  const [showTeams, setShowTeams] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [teamsError, setTeamsError] = useState("");
  const teamsContainerRef = useRef<HTMLDivElement | null>(null);
 
  async function loadTeams() {
    if (!sessionId) {
      setTeamsError("Geen actieve sessie gevonden.");
      return;
    }
 
    setLoadingTeams(true);
    setTeamsError("");
 
    try {
      const response = await fetch(`/sessions/${sessionId}/teams`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
 
      if (response.status === 401) {
        setTeamsError("Je moet ingelogd zijn om de teams te bekijken.");
        return;
      }
 
      if (response.status === 404) {
        setTeamsError("De sessie kon niet worden gevonden.");
        return;
      }
 
      if (!response.ok) {
        const problem: { error?: string } | null =
          await response.json().catch(() => null);
 
        setTeamsError(
          problem?.error ?? "De teams konden niet worden geladen.",
        );
        return;
      }
 
      const loadedTeams: SessionTeam[] = await response.json();
      setTeams(loadedTeams);
    } catch {
      setTeamsError("De backend kon niet worden bereikt.");
    } finally {
      setLoadingTeams(false);
    }
  }
 
  async function toggleTeams() {
    const shouldShowTeams = !showTeams;
 
    setShowTeams(shouldShowTeams);
 
    if (shouldShowTeams) {
      await loadTeams();
    }
  }
 
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const clickedElement = event.target as Node;
 
      if (
        showTeams &&
        teamsContainerRef.current &&
        !teamsContainerRef.current.contains(clickedElement)
      ) {
        setShowTeams(false);
      }
    }
 
    document.addEventListener("mousedown", handleOutsideClick);
 
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showTeams]);
 
  return (
    <div className="session-layout">
      <div
        className="session-layout__teams"
        ref={teamsContainerRef}
      >
        <button
          type="button"
          aria-expanded={showTeams}
          aria-controls="session-teams-popover"
          onClick={() => void toggleTeams()}
        >
          {showTeams ? "Hide teams" : "Show teams"}
        </button>
 
        {showTeams && (
          <div
            id="session-teams-popover"
            className="session-layout__teams-popover"
          >
            <TeamsPopover
              teams={teams}
              loading={loadingTeams}
              error={teamsError}
            />
          </div>
        )}
      </div>
 
      <Outlet />
    </div>
  );
}