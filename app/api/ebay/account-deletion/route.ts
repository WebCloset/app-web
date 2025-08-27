// app/api/ebay/account-deletion/route.ts
// NOTE: Do NOT add `export const runtime = "edge"` here. We need Node runtime for `crypto`.

import { NextResponse } from "next/server";
import crypto from "crypto";

function sha256Hex(s: string) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

// eBay GETs: ?challenge_code=... (sometimes ?challengeCode=...)
// We must return: { "challengeResponse": sha256(challenge + token + endpoint) }
export async function GET(req: Request) {
  const url = new URL(req.url);
  const challenge =
    url.searchParams.get("challenge_code") ??
    url.searchParams.get("challengeCode") ??
    "";

  const endpoint = `${url.origin}${url.pathname}`; // exact URL eBay called (no query)
  const token = process.env.EBAY_VERIFICATION_TOKEN || "";

  if (!challenge || !token) {
    return NextResponse.json({ error: "missing" }, { status: 400 });
  }

  const challengeResponse = sha256Hex(challenge + token + endpoint);
  return NextResponse.json({ challengeResponse }, { status: 200 });
}

// Real deletion events POST here; we just acknowledge 204 for now.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("eBay MAD payload:", JSON.stringify(body));
  } catch {
    // ignore parse errors
  }
  return new Response(null, { status: 204 });
}
