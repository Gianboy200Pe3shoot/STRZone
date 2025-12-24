import { NextResponse } from "next/server";

// Force Node runtime so manual redirects behave predictably (302 visible)
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const gasUrl = process.env.GAS_WEBAPP_URL;
    if (!gasUrl) {
      return NextResponse.json(
        { ok: false, error: "Missing GAS_WEBAPP_URL in environment variables" },
        { status: 500 }
      );
    }

    const resp = await fetch(gasUrl, {
      method: "POST",
      redirect: "manual",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // Success cases:
    // - Node: 302
    // - Some setups: 200
    // - Edge opaque redirect: status 0 + type opaqueredirect
    if (
      resp.status === 302 ||
      resp.ok ||
      (resp.status === 0 && resp.type === "opaqueredirect")
    ) {
      return NextResponse.json({ ok: true });
    }

    const text = await resp.text().catch(() => "");
    return NextResponse.json(
      { ok: false, status: resp.status, statusText: resp.statusText, text },
      { status: 500 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
