import { NextRequest, NextResponse } from "next/server";

// Temporary stub handler so the route is a valid module.
// You can wire this up to real Stripe Checkout later.
export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { ok: false, error: "create-checkout-session not implemented yet" },
    { status: 501 }
  );
}
