import { NextRequest, NextResponse } from "next/server";
import { weatherService } from "@/lib/weather/weatherService";
import type { LocationInfo, WeatherSnapshot } from "@/lib/weather/types";

export const runtime = "edge";

const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=600";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  if (!location) {
    const locations: LocationInfo[] = await weatherService.listLocations();
    return NextResponse.json(
      { locations },
      { headers: { "Cache-Control": CACHE_CONTROL } },
    );
  }

  const snapshot: WeatherSnapshot | undefined = await weatherService.getSnapshot(location);

  if (!snapshot) {
    return NextResponse.json(
      { error: `Unknown location "${location}"` },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": CACHE_CONTROL },
  });
}
