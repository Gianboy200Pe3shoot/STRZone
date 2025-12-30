import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    { error: "Not Found" },
    { status: 404 }
  );
}

type RuleRow = {
  jurisdiction_name: string;
  jurisdiction_type?: string;
  str_status?: string;
  permit_required?: string;
  min_stay_nights?: string;
  primary_residence_required?: string;
  cap_or_limit?: string;
  taxes?: string;
  notes?: string;
  source_url?: string;
  last_verified?: string;
};

function normalize(s: string) {
  return (s || "").trim().toLowerCase();
}

// Simple CSV parser that handles quotes
function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    const next = csv[i + 1];

    // Escaped quote inside quotes: ""
    if (ch === '"' && inQuotes && next === '"') {
      cell += '"';
      i++;
      continue;
    }

    // Toggle quote state
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    // Cell separator
    if (ch === "," && !inQuotes) {
      cur.push(cell);
      cell = "";
      continue;
    }

    // Row separator
    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && next === "\n") i++;
      cur.push(cell);
      cell = "";
      if (cur.some((v) => v !== "")) rows.push(cur);
      cur = [];
      continue;
    }

    cell += ch;
  }

  // Last cell/row
  cur.push(cell);
  if (cur.some((v) => v !== "")) rows.push(cur);

  return rows;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Read & sanitize city query param
    const cityRaw = (searchParams.get("city") || "").replace(/\\/g, "").trim();
    const qCity = normalize(cityRaw);

    const sheetId = process.env.SHEET_ID;
    const sheetTab = process.env.SHEET_TAB || "Sheet1";

    if (!sheetId) {
      return NextResponse.json(
        { error: "Missing SHEET_ID in .env.local" },
        { status: 500 }
      );
    }

    // Google sheet must be public or "anyone with link can view"
    const csvUrl =
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=` +
      encodeURIComponent(sheetTab);

    const r = await fetch(csvUrl, { cache: "no-store" });
    if (!r.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch sheet (${r.status}). Make sure the Google Sheet is public or link-viewable.`,
          csvUrl,
        },
        { status: 502 }
      );
    }

    const csv = await r.text();
    const table = parseCSV(csv);

    if (table.length < 2) {
      return NextResponse.json(
        { error: "Sheet returned no data (check SHEET_TAB name)", csvUrl },
        { status: 500 }
      );
    }

    const header = table[0].map((h) => normalize(h));
    const dataRows = table.slice(1);

    const idx = (name: string) => header.indexOf(normalize(name));

    const get = (row: string[], col: string) => {
      const i = idx(col);
      return i >= 0 ? (row[i] ?? "").trim() : "";
    };

    const rows: RuleRow[] = dataRows.map((row) => ({
      jurisdiction_name: get(row, "jurisdiction_name"),
      jurisdiction_type: get(row, "jurisdiction_type"),
      str_status: get(row, "str_status"),
      permit_required: get(row, "permit_required"),
      min_stay_nights: get(row, "min_stay_nights"),
      primary_residence_required: get(row, "primary_residence_required"),
      cap_or_limit: get(row, "cap_or_limit"),
      taxes: get(row, "taxes"),
      notes: get(row, "notes"),
      source_url: get(row, "source_url"),
      last_verified: get(row, "last_verified"),
    }));

    // Filter by city (exact match)
      const rowsOut = qCity
  ? rows.filter((r) => normalize(r.jurisdiction_name) === qCity)
  : rows;



    return NextResponse.json({
  rows: rowsOut,          // ALWAYS an array
  total: rowsOut.length, // matches returned rows
  city: cityRaw|| null,
});
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}