// Bewaar naast de fouttekst ook de HTTP-status en eventuele fouten per veld.
export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export async function apiRequest(path, { body, ...options } = {}) {
  // Neem opties zoals het abortsignaal over. Laat cookies toe en zet een opgegeven body om naar JSON.
  const headers = { ...options.headers };

  // Alleen als er een body is, geven we standaard JSON als formaat mee.
  if (body !== undefined && headers["Content-Type"] === undefined) {
    headers["Content-Type"] = "application/json";
  }

  const request = {
    ...options,
    credentials: "include",
    headers
  };

  if (body !== undefined) {
    request.body = JSON.stringify(body);
  }
  // Geef bijvoorbeeld /projects mee. De client zet /api ervoor.
  const result = await fetch(`${path}`, request);


  

  

  // Bij een mislukte HTTP-respons: lees de foutdetails, kies een terugvaltekst en geef de fout door aan React.
  if (!result.ok) {
    const details = await result.json().catch(() => ({}));
    const messages = {
      400: "Controleer de invoer.",
      401: "Niet ingelogd.",
      403: "Onvoldoende rechten.",
      404: "Niet gevonden.",
      409: "Dit bestaat al."
    };
    const message = details.message ?? messages[result.status] ?? `HTTP ${result.status}`;
    throw new ApiError(message, result.status, details.errors);
  }
  // Bij 204: geef null terug omdat er geen body is. Lees bij ander succes de JSON-body.
  if (result.status === 204) {
    return null;
  }

  
  const text = await result.text();
  return text ? JSON.parse(text) : result;
}
