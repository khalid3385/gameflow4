import { apiRequest } from "./client.js";
// GET /movies: haal de lijst op. Geef het signaal mee zodat de pagina het ophalen kan afbreken.
export function getMovies(signal) {
  return apiRequest("/movies", { signal });
}
// GET /movies/:id: haal één film op.
export function getMovie(id, signal) {
  return apiRequest(`/movies/${id}`, { signal });
}
// POST /movies: stuur de waarden voor een nieuwe film.
export function createMovie(movie) {
  return apiRequest("/movies", {
    method: "POST",
    body: movie
  });
}
// PUT /movies/:id: stuur de nieuwe waarden voor deze film.
export function updateMovie(id, movie) {
  return apiRequest(`/movies/${id}`, {
    method: "PUT",
    body: movie
  });
}
// DELETE /movies/:id: verwijder de film met dit id.
export function deleteMovie(id) {
  return apiRequest(`/movies/${id}`, { method: "DELETE" });
}
