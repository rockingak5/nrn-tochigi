import crypto from 'crypto';

// GoDaddy's hosting platform sits behind an edge/CDN layer that does not
// reliably pass through this app's own `Set-Cookie` header (confirmed via
// server logs: the `connect.sid` session cookie set on login is never sent
// back by the browser on any later request, on both the preview subdomain
// and the live custom domain — only the platform's own cookies, e.g.
// `dps_site_id`/`_tccl_visitor`, and Cloudflare's `__cf_bm`, ever arrive).
// Cookie-based sessions are therefore unusable in this hosting environment.
//
// As a replacement, admin auth uses a small self-contained (stateless)
// bearer token: it is not looked up in any store, it is just verified by
// recomputing its HMAC signature. The client stores it (in localStorage)
// and sends it back as `Authorization: Bearer <token>` on every request,
// which is a plain HTTP header — not a cookie — so nothing on the network
// path has a reason to touch it.

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days, matches the old cookie maxAge

function base64UrlEncode(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

export function signAdminToken(adminId: number): string {
  const secret = process.env.SESSION_SECRET ?? 'dev-secret-change-me';
  const payload = base64UrlEncode(JSON.stringify({ adminId, exp: Date.now() + TOKEN_TTL_MS }));
  const signature = sign(payload, secret);
  return `${payload}.${signature}`;
}

export function verifyAdminToken(token: string | undefined | null): number | null {
  if (!token) return null;
  const secret = process.env.SESSION_SECRET ?? 'dev-secret-change-me';
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;

  const expected = sign(payload, secret);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      adminId: number;
      exp: number;
    };
    if (typeof data.adminId !== 'number' || typeof data.exp !== 'number') return null;
    if (Date.now() > data.exp) return null;
    return data.adminId;
  } catch {
    return null;
  }
}

export function getBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  const match = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
  return match ? match[1] : null;
}
