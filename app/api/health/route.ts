export const runtime = "edge";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() }, { status: 200 });
}
