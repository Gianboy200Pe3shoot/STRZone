import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const gasUrl = process.env.GAS_WEBAPP_URL;
    if (!gasUrl) {
      return NextResponse.json(
        { ok: false, error: "Missing GAS_WEBAPP_URL in Vercel env vars" },
        { status: 500 }
      );
    }

    const resp = await fetch(gasUrl, {
      method: "POST",
      redirect: "manual",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: body.email,
        city: body.city,
        source: "app",
        ts: String(Date.now()),
      }),
    });

    // ✅ SUCCESS PATH
    if (resp.status === 302 || resp.ok) {
      return NextResponse.json({
        ok: true,
        forwarded: true,
        gasStatus: resp.status,
        marker: "SUBSCRIBE_FORWARDING_V2",
      });
    }

    // ✅ ERROR PATH
    const text = await resp.text().catch(() => "");
    return NextResponse.json(
      { ok: false, forwarded: true, gasStatus: resp.status, text },
      { status: 500 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Invalid JSON" },
      { status: 400 }
    );
  }
}
