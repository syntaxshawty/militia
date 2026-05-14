import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fear =
      typeof body?.fear === "string"
        ? body.fear.trim()
        : "";
    const createdAt = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, "-");

    if (!fear) {
      return NextResponse.json(
        { error: "you have to let it go" },
        { status: 400 }
      );
    }

    const payload = JSON.stringify({ fear, createdAt });

    console.log(
      "[/api/cemetery] writing blob, token present:",
      !!process.env.BLOB_READ_WRITE_TOKEN
    );
    console.log("timestamp: ", createdAt);

    await put(`cemetery/fear-${createdAt}.json`, payload, {
      access: "private",
      contentType: "application/json",
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[/api/cemetery] unhandled error:", err);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
