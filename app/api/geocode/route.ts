import { NextRequest, NextResponse } from "next/server";
import { encodeCustomLocationSlug } from "@/lib/weather/locationSlug";
import type { LocationInfo } from "@/lib/weather/types";

export const runtime = "edge";

/**
 * Free, keyless geocoding via Open-Meteo so users can search any city, not
 * just the curated mock roster. No weather comes from this API — only
 * name/coordinates/timezone, which the mock provider then uses to
 * synthesize a plausible forecast (see mockWeatherProvider.ts).
 */
interface OpenMeteoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const upstream = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`,
      { headers: { Accept: "application/json" } },
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { results: [], error: "Geocoding service unavailable" },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const data: { results?: OpenMeteoResult[] } = await upstream.json();

    const results: LocationInfo[] = (data.results ?? []).map((r) => {
      const base = {
        name: r.name,
        region: r.admin1 ?? r.country ?? "",
        country: r.country_code ?? r.country ?? "",
        coordinates: { lat: r.latitude, lon: r.longitude },
        timezone: r.timezone ?? "UTC",
      };
      return { ...base, slug: encodeCustomLocationSlug(base) };
    });

    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch {
    return NextResponse.json(
      { results: [], error: "Geocoding service unavailable" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
