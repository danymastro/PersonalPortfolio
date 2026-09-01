/** HTTP Basic Auth guard for the /leads dashboard. */

import type { Env } from "./types";

/** Constant-time-ish string compare (length leak is acceptable here). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const CHALLENGE: HeadersInit = {
  "WWW-Authenticate": 'Basic realm="leads", charset="UTF-8"',
  "Content-Type": "text/plain; charset=utf-8",
};

/**
 * Returns a 401 Response when auth fails / is not configured, or null when the
 * caller is authorised.
 */
export function requireBasicAuth(request: Request, env: Env): Response | null {
  const user = env.LEADS_USER;
  const pass = env.LEADS_PASSWORD;
  if (!user || !pass) {
    return new Response("Dashboard non configurata (LEADS_USER / LEADS_PASSWORD mancanti).", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const header = request.headers.get("Authorization") || "";
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) {
    return new Response("Autenticazione richiesta.", { status: 401, headers: CHALLENGE });
  }

  let decoded = "";
  try {
    decoded = atob(encoded);
  } catch {
    return new Response("Header non valido.", { status: 401, headers: CHALLENGE });
  }

  const sep = decoded.indexOf(":");
  const gotUser = sep >= 0 ? decoded.slice(0, sep) : decoded;
  const gotPass = sep >= 0 ? decoded.slice(sep + 1) : "";

  if (!safeEqual(gotUser, user) || !safeEqual(gotPass, pass)) {
    return new Response("Credenziali non valide.", { status: 401, headers: CHALLENGE });
  }

  return null;
}
