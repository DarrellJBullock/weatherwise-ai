import type { AlertSeverity, LocationInfo, WeatherAlert } from "./types";

/**
 * Live severe weather alerts via the National Weather Service's free,
 * keyless API (api.weather.gov). US-only — points outside NWS coverage
 * simply return no alerts rather than an error.
 *
 * NWS asks API consumers to identify themselves in the User-Agent header
 * (app name + a way to reach the maintainer); we point at the repo instead
 * of a personal email to avoid publishing one in committed source.
 */
const NWS_USER_AGENT = "weatherwise-ai (https://github.com/DarrellJBullock/weatherwise-ai)";

interface NwsAlertFeature {
  properties: {
    id: string;
    event: string;
    headline: string | null;
    description: string | null;
    instruction: string | null;
    areaDesc: string;
    severity: string;
    onset: string | null;
    effective: string | null;
    ends: string | null;
    expires: string | null;
    senderName: string | null;
  };
}

interface NwsAlertsResponse {
  features: NwsAlertFeature[];
}

/** NWS event names are self-describing ("Severe Thunderstorm Warning", "Coastal Flood Watch"); fall back to the coarse `severity` field when they aren't. */
function mapSeverity(event: string, nwsSeverity: string): AlertSeverity {
  const e = event.toLowerCase();
  if (e.includes("emergency")) return "emergency";
  if (e.includes("warning")) return "warning";
  if (e.includes("watch")) return "watch";
  if (e.includes("advisory")) return "advisory";
  if (nwsSeverity === "Extreme" || nwsSeverity === "Severe") return "warning";
  if (nwsSeverity === "Moderate") return "watch";
  return "advisory";
}

function truncate(text: string | null, maxLen = 280): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= maxLen ? clean : `${clean.slice(0, maxLen).trim()}…`;
}

export async function fetchNwsAlerts(location: LocationInfo): Promise<WeatherAlert[]> {
  const { lat, lon } = location.coordinates;
  const url = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "User-Agent": NWS_USER_AGENT, Accept: "application/geo+json" },
      next: { revalidate: 300 },
    });
  } catch {
    return [];
  }
  if (!res.ok) return [];

  const data = (await res.json()) as NwsAlertsResponse;

  return data.features.map(({ properties: p }) => ({
    id: p.id,
    locationSlug: location.slug,
    severity: mapSeverity(p.event, p.severity),
    headline: p.headline ?? p.event,
    impactSummary: truncate(p.description),
    recommendedAction: truncate(p.instruction) || "Monitor local conditions and follow official guidance.",
    affectedArea: p.areaDesc,
    startsAt: p.onset ?? p.effective ?? new Date().toISOString(),
    endsAt: p.ends ?? p.expires ?? new Date().toISOString(),
    source: p.senderName || "National Weather Service",
    sourceId: p.id,
  }));
}
