import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth.js";

// Maak één context waarin de pagina’s de gebruiker en sessiefuncties delen.
const AuthContext = createContext(null);
// Lees de gegevens uit de dichtstbijzijnde AuthProvider.
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // Begin zonder gebruiker en wacht tot de sessie is gecontroleerd.
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState("loading");

  // Vraag de sessie op. Bewaar de gebruiker bij succes, wis hem bij een fout en rond de laadstatus altijd af.
  async function refreshUser() {
    try {
      const current = await authApi.getMe();
      setUser(current);

    } catch (error) {
      if (error.status !== 401) {
        console.error("Aanmeldstatus ophalen mislukt", error);
      }
      setUser(null);
    } finally {
      setAuthStatus("ready");
    }
  }
  // Controleer de sessie wanneer de provider wordt gemount.
  useEffect(() => {
    refreshUser();
  }, []);
  // Meld aan en vraag daarna de actuele gebruiker en rollen op.
  async function login(credentials) {
    await authApi.login(credentials);
    await refreshUser();
  }
  // Beëindig de sessie en wis daarna de gebruiker uit React-state.
  async function logout() {
    await authApi.logout();
    setUser(null);
  }
  // Toon beheerknoppen alleen aan Editor en Admin. De API controleert de rechten ook zelf.
  // const canEdit = user?.roles.some(role => ["Editor", "Admin"].includes(role)) ?? false;
  // Geef de sessiegegevens en functies door aan alle onderliggende componenten.
  return (
    <AuthContext.Provider
      value={{
        user,
        authStatus,
        loading: authStatus === "loading",
        isLoggedIn: user !== null,
        // canEdit, later
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
