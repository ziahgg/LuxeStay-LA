import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stateless, signed session tokens (HMAC-SHA256), shared by the Proxy and the
 * server-side Data Access Layer. No database is required.
 *
 * Token format: base64url(JSON payload) + "." + base64url(signature)
 * The payload carries only an opaque resident id and timestamps — no personal
 * data — and is signed with AUTH_SECRET (server-side only, ≥ 32 characters).
 */

export const SESSION_COOKIE = "ls_resident_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export interface SessionPayload {
  /** Opaque resident identifier issued by the identity provider. */
  sub: string;
  /** Identity provider that authenticated the resident. */
  provider: string;
  /** Issued-at / expiry, seconds since epoch. */
  iat: number;
  exp: number;
}

function getSecret(): string | null {
  const secret = process.env.AUTH_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

export function isSessionSecretConfigured() {
  return getSecret() !== null;
}

const b64 = (input: string | Buffer) => Buffer.from(input).toString("base64url");

function sign(data: string, secret: string) {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function createSessionToken(sub: string, provider: string, now = Date.now()): string {
  const secret = getSecret();
  if (!secret) throw new Error("AUTH_SECRET is missing or shorter than 32 characters.");
  const iat = Math.floor(now / 1000);
  const payload: SessionPayload = { sub, provider, iat, exp: iat + SESSION_TTL_SECONDS };
  const body = b64(JSON.stringify(payload));
  return `${body}.${sign(body, secret)}`;
}

/** Returns the payload when the signature is valid and the token has not expired. */
export function verifySessionToken(token: string | undefined, now = Date.now()): SessionPayload | null {
  const secret = getSecret();
  if (!secret || !token) return null;
  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra !== undefined) return null;

  const expected = Buffer.from(sign(body, secret));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (typeof payload.sub !== "string" || typeof payload.exp !== "number") return null;
    if (payload.exp <= Math.floor(now / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
