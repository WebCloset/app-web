import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, query } = body;

    // Validate input
    if (!email || !query) {
      return NextResponse.json(
        { message: "Email and query are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check if this exact search already exists for this email
    const existing = await sql`
      SELECT id FROM saved_searches 
      WHERE email = ${email.toLowerCase()} 
      AND query = ${JSON.stringify(query)}
      LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "You've already saved this search" },
        { status: 409 }
      );
    }

    // Insert the saved search
    await sql`
      INSERT INTO saved_searches (email, query)
      VALUES (${email.toLowerCase()}, ${JSON.stringify(query)})
    `;

    return NextResponse.json(
      { message: "Search saved successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error saving search:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
