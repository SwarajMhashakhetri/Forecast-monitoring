import { NextRequest, NextResponse } from "next/server";

// Implements BMRS WINDFOR endpoint using real API and correct query params
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate') || '2024-01-01';
  const endDate = searchParams.get('endDate') || '2024-01-31';
  const forecastHorizon = Number(searchParams.get('forecastHorizon') || 4); // hours

  // Elexon docs show /datasets/WINDFOR/stream&publishDateTimeFrom=&publishDateTimeTo=
  // We'll fetch all forecasts published within a liberal range before and after Jan 2024
  const publishFrom = `${startDate}T00:00:00Z`;
  const publishTo = `${endDate}T23:59:59Z`;
  // Fix: Use correct URL and array parsing per your example docs
  const apiUrl = `https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR/stream?publishDateTimeFrom=${startDate}&publishDateTimeTo=${endDate}`;
  try {
    const resp = await fetch(apiUrl);
    if (!resp.ok) {
      const msg = await resp.text();
      throw new Error(`BMRS WINDFOR fetch failed (${resp.status}): ${msg}`);
    }
    const parsed = await resp.json();
    const records = Array.isArray(parsed) ? parsed : [];
    // Only keep forecasts in the right horizon
    const allForecasts = records
      .map((rec: any) => ({
        startTime: rec.startTime,
        publishTime: rec.publishTime,
        generation: Number(rec.generation)
      }));
    // Group by startTime, keep only those with publishTime <= startTime - forecastHorizon
    const byStart: {[key: string]: any[]} = {};
    allForecasts.forEach((f: { startTime: string; publishTime: string; generation: number; }) => {
      if (!byStart[f.startTime]) byStart[f.startTime] = [];
      byStart[f.startTime].push(f);
    });
    // For every target time, pick the latest publishTime <= (startTime - horizon)
    const forecasts: any[] = [];
    Object.entries(byStart).forEach(([start, arr]) => {
      // Reference cutoff
      const targetMillis = new Date(start).getTime() - forecastHorizon * 3600 * 1e3;
      // Get forecasts published <= targetMillis
      const eligible = arr.filter(f => new Date(f.publishTime).getTime() <= targetMillis);
      if (eligible.length > 0) {
        // Get the latest (max publishTime)
        const latest = eligible.reduce((a, b) => new Date(a.publishTime).getTime() > new Date(b.publishTime).getTime() ? a : b);
        forecasts.push({ ...latest, horizon: forecastHorizon });
      }
    
    });
    forecasts.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    // Return only; console logs removed for prod
    return NextResponse.json({
      forecasts,
      range: { startDate, endDate },
      forecastHorizon
    });
  } catch (e: any) {
    return NextResponse.json(
        { forecasts: [], error: `BMRS WINDFOR fetch error: ${e?.message || "unknown"}`, range: { startDate, endDate }, forecastHorizon },
        { status: 500 }
    );
  }
}


