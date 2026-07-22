import { NextRequest, NextResponse } from "next/server";
import { weatherService } from "@/lib/weather/weatherService";
import type { WeatherAlert } from "@/lib/weather/types";

export const runtime = "edge";

const CACHE_CONTROL = "public, s-maxage=120, stale-while-revalidate=300";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  const alerts: WeatherAlert[] = await weatherService.listAlerts();
  const filtered = location ? alerts.filter((alert) => alert.locationSlug === location) : alerts;

  return NextResponse.json(
    { alerts: filtered },
    { headers: { "Cache-Control": CACHE_CONTROL } },
  );
}
