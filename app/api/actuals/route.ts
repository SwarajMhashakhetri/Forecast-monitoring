import { NextRequest, NextResponse } from "next/server";

// Implements BMRS FUELHH endpoint using correct open API params for fuelType=WIND
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate') || '2024-01-01';
  const endDate = searchParams.get('endDate') || '2024-01-31';

  // Fix: Use correct URL, parse as top-level array always (per live curl example)
  const apiUrl = `https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH/stream?publishDateTimeFrom=${startDate}T00:00:00Z&publishDateTimeTo=${endDate}T23:59:59Z&fuelType=WIND`;
  try {
    const resp = await fetch(apiUrl);
    if (!resp.ok) {
      const msg = await resp.text();
      throw new Error(`BMRS FUELHH fetch failed (${resp.status}): ${msg}`);
    }
    const parsed = await resp.json();
    const records = Array.isArray(parsed) ? parsed : [];
    const actuals = records.map((rec: any) => ({
      startTime: rec.startTime,
      generation: Number(rec.generation)
    }));
    return NextResponse.json({
      actuals,
      range: { startDate, endDate }
    });
  } catch (e: any) {
    // (Error logs can be re-enabled here if diagnosing fatal production issue)
    return NextResponse.json(
      { actuals: [], error: `BMRS fetch error: ${e?.message || 'unknown'}`, range: { startDate, endDate } },
      { status: 500 }
    );
  }
}

