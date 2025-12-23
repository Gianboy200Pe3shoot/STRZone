import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json({ error: "Missing ?q=" }, { status: 400 });
    }

    const token = process.env.MAPBOX_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "Missing MAPBOX_TOKEN in .env.local" },
        { status: 500 }
      );
    }

    const url =
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      encodeURIComponent(q) +
      ".json?limit=1&types=address,place&access_token=" +
      token;

    const r = await fetch(url);
    if (!r.ok) {
      return NextResponse.json(
        { error: `Mapbox error ${r.status}` },
        { status: 502 }
      );
    }

    const data = await r.json();

    const feature = data?.features?.[0];
    if (!feature) {
      return NextResponse.json({ city: null, raw: data });
    }

let city: string | null = null;

// Case 1: feature itself IS the city
if (Array.isArray(feature.place_type) && feature.place_type.includes("place")) {
  city = feature.text;
}

// Case 2: city exists in context (addresses)
if (!city && Array.isArray(feature.context)) {
  const placeCtx = feature.context.find((c: any) =>
    String(c.id).startsWith("place.")
  );
  city = placeCtx?.text ?? null;
}

    return NextResponse.json({
      city,
      fullPlaceName: feature.place_name ?? null,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}