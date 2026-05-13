import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fear = typeof body?.fear === "string" ? body.fear.trim() : "";

    if (!fear) {
      return NextResponse.json({ error: "you have to let it go" }, { status: 400 });
    }

    const payload = JSON.stringify({ fear, createdAt: new Date().toISOString() });

    console.log("[/api/fears] writing blob, token present:", !!process.env.BLOB_READ_WRITE_TOKEN);

    await put(`fears/fear-${Date.now()}.json`, payload, {
      access: "private",
      contentType: "application/json",
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[/api/fears] unhandled error:", err);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}
