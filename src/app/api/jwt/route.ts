import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "dcf176b95e26a31a9677546b42ee19a3cbd30e51336bd8396523794da44795d5";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email || "admin@mentorlagbe.com";
    const role = body.role || "student";

    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ email, role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    return NextResponse.json({ token });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to issue token" },
      { status: 500 }
    );
  }
}
