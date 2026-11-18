import { apiRequest } from "./client.js";
// POST: stuur de ingevulde gegevens om een account aan te maken.
export function register(data) {
  return apiRequest("/auth/register", { method: "POST", body: data });
}
// POST: stuur de inloggegevens om een sessie te starten.
export function login(data) {
  return apiRequest("/auth/login?useCookies=true", { method: "POST", body: data });
}
// GET: vraag welke gebruiker bij de huidige sessie hoort.
export function getMe() {
  return apiRequest("/auth/me");
}
// POST: beëindig de sessie.
export function logout() {
  return apiRequest("/auth/logout", { method: "POST" });
}
