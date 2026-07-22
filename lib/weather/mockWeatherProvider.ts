import type {
  ActivityRecommendation,
  AirQuality,
  ConditionCode,
  DailyForecastEntry,
  HourlyForecastEntry,
  LocationInfo,
  WeatherAlert,
  WeatherSnapshot,
} from "./types";

/** Deterministic string hash -> seeded PRNG so mock data is stable across requests/builds. */
function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h;
}

const CONDITION_LABELS: Record<ConditionCode, string> = {
  "clear-day": "Clear",
  "clear-night": "Clear",
  "partly-cloudy-day": "Partly Cloudy",
  "partly-cloudy-night": "Partly Cloudy",
  cloudy: "Cloudy",
  fog: "Foggy",
  drizzle: "Light Drizzle",
  rain: "Rain",
  "heavy-rain": "Heavy Rain",
  thunderstorm: "Thunderstorms",
  snow: "Snow",
  sleet: "Sleet",
  windy: "Windy",
};

interface CityProfile {
  slug: string;
  name: string;
  region: string;
  country: string;
  coordinates: { lat: number; lon: number };
  timezone: string;
  baseTempF: number;
  condition: ConditionCode;
  humidityPct: number;
  windMph: number;
  aqi: number;
  hasAlert?: {
    severity: WeatherAlert["severity"];
    headline: string;
    impactSummary: string;
    recommendedAction: string;
    hoursFromNow: [number, number];
  };
}

const CITY_PROFILES: CityProfile[] = [
  {
    slug: "philadelphia",
    name: "Philadelphia",
    region: "PA",
    country: "US",
    coordinates: { lat: 39.9526, lon: -75.1652 },
    timezone: "America/New_York",
    baseTempF: 84,
    condition: "partly-cloudy-day",
    humidityPct: 62,
    windMph: 9,
    aqi: 48,
  },
  {
    slug: "atlantic-city",
    name: "Atlantic City",
    region: "NJ",
    country: "US",
    coordinates: { lat: 39.3643, lon: -74.4229 },
    timezone: "America/New_York",
    baseTempF: 79,
    condition: "windy",
    humidityPct: 71,
    windMph: 22,
    aqi: 39,
    hasAlert: {
      severity: "watch",
      headline: "Coastal Flood Watch",
      impactSummary:
        "Onshore winds and a full moon high tide may bring minor to moderate flooding to low-lying shore roads and properties.",
      recommendedAction:
        "Avoid parking in flood-prone areas near the boardwalk and inlet. Monitor local tide charts through tonight.",
      hoursFromNow: [4, 16],
    },
  },
  {
    slug: "new-york",
    name: "New York",
    region: "NY",
    country: "US",
    coordinates: { lat: 40.7128, lon: -74.006 },
    timezone: "America/New_York",
    baseTempF: 85,
    condition: "cloudy",
    humidityPct: 58,
    windMph: 11,
    aqi: 55,
  },
  {
    slug: "orlando",
    name: "Orlando",
    region: "FL",
    country: "US",
    coordinates: { lat: 28.5383, lon: -81.3792 },
    timezone: "America/New_York",
    baseTempF: 93,
    condition: "thunderstorm",
    humidityPct: 78,
    windMph: 8,
    aqi: 41,
    hasAlert: {
      severity: "warning",
      headline: "Severe Thunderstorm Warning",
      impactSummary:
        "Radar-indicated storm capable of producing 60 mph wind gusts and quarter-size hail moving northeast at 25 mph.",
      recommendedAction:
        "Move indoors immediately. Avoid windows and stay away from outdoor theme park queues and open fields.",
      hoursFromNow: [0, 2],
    },
  },
  {
    slug: "cape-canaveral",
    name: "Cape Canaveral",
    region: "FL",
    country: "US",
    coordinates: { lat: 28.3922, lon: -80.6077 },
    timezone: "America/New_York",
    baseTempF: 89,
    condition: "partly-cloudy-day",
    humidityPct: 74,
    windMph: 16,
    aqi: 33,
    hasAlert: {
      severity: "advisory",
      headline: "Small Craft Advisory",
      impactSummary:
        "Sustained onshore winds of 20-25 knots and seas of 6-8 feet expected along the Space Coast through tomorrow morning.",
      recommendedAction:
        "Inexperienced boaters should remain in port. Launch pad ground crews should secure loose equipment.",
      hoursFromNow: [2, 20],
    },
  },
  {
    slug: "chicago",
    name: "Chicago",
    region: "IL",
    country: "US",
    coordinates: { lat: 41.8781, lon: -87.6298 },
    timezone: "America/Chicago",
    baseTempF: 76,
    condition: "clear-day",
    humidityPct: 49,
    windMph: 14,
    aqi: 44,
  },
  {
    slug: "seattle",
    name: "Seattle",
    region: "WA",
    country: "US",
    coordinates: { lat: 47.6062, lon: -122.3321 },
    timezone: "America/Los_Angeles",
    baseTempF: 68,
    condition: "fog",
    humidityPct: 82,
    windMph: 6,
    aqi: 22,
  },
];

function aqiCategory(aqi: number): AirQuality["category"] {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function windDirectionFromDegrees(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

function buildHourly(profile: CityProfile, rand: () => number): HourlyForecastEntry[] {
  const now = new Date();
  const entries: HourlyForecastEntry[] = [];
  for (let i = 0; i < 24; i++) {
    const t = new Date(now.getTime() + i * 60 * 60 * 1000);
    const diurnalSwing = Math.sin(((t.getHours() - 6) / 24) * Math.PI * 2) * 8;
    const temp = Math.round(profile.baseTempF + diurnalSwing - 4 + rand() * 3);
    const rainChance = Math.max(0, Math.min(100, Math.round(rand() * (profile.condition.includes("rain") || profile.condition === "thunderstorm" ? 70 : 25))));
    entries.push({
      time: t.toISOString(),
      temperatureF: temp,
      condition: profile.condition,
      conditionLabel: CONDITION_LABELS[profile.condition],
      rainChancePct: rainChance,
      windMph: Math.round(profile.windMph + rand() * 6 - 3),
    });
  }
  return entries;
}

const DAY_LABELS = ["Today", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildDaily(profile: CityProfile, rand: () => number): DailyForecastEntry[] {
  const now = new Date();
  const entries: DailyForecastEntry[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const wobble = rand() * 6 - 3;
    entries.push({
      date: d.toISOString().slice(0, 10),
      dayLabel:
        i < 2
          ? DAY_LABELS[i]
          : d.toLocaleDateString("en-US", { weekday: "short" }),
      condition: profile.condition,
      conditionLabel: CONDITION_LABELS[profile.condition],
      highF: Math.round(profile.baseTempF + 4 + wobble),
      lowF: Math.round(profile.baseTempF - 12 + wobble),
      rainChancePct: Math.round(rand() * (profile.condition === "thunderstorm" ? 80 : 30)),
      windMph: Math.round(profile.windMph + rand() * 5),
      uvIndex: Math.round(4 + rand() * 7),
      sunrise: "6:1" + Math.floor(rand() * 9) + " AM",
      sunset: "8:0" + Math.floor(rand() * 9) + " PM",
    });
  }
  return entries;
}

function buildAlert(profile: CityProfile): WeatherAlert[] {
  if (!profile.hasAlert) return [];
  const now = Date.now();
  const [startH, endH] = profile.hasAlert.hoursFromNow;
  return [
    {
      id: `${profile.slug}-alert-1`,
      locationSlug: profile.slug,
      severity: profile.hasAlert.severity,
      headline: profile.hasAlert.headline,
      impactSummary: profile.hasAlert.impactSummary,
      recommendedAction: profile.hasAlert.recommendedAction,
      affectedArea: `${profile.name}, ${profile.region}`,
      startsAt: new Date(now + startH * 60 * 60 * 1000).toISOString(),
      endsAt: new Date(now + endH * 60 * 60 * 1000).toISOString(),
      source: "National Weather Service (mock)",
      sourceId: `NWS-MOCK-${profile.slug.toUpperCase()}-001`,
    },
  ];
}

function toLocationInfo(profile: CityProfile): LocationInfo {
  return {
    slug: profile.slug,
    name: profile.name,
    region: profile.region,
    country: profile.country,
    coordinates: profile.coordinates,
    timezone: profile.timezone,
  };
}

export function getAllLocations(): LocationInfo[] {
  return CITY_PROFILES.map(toLocationInfo);
}

export function getLocationBySlug(slug: string): LocationInfo | undefined {
  const profile = CITY_PROFILES.find((c) => c.slug === slug);
  return profile ? toLocationInfo(profile) : undefined;
}

export function getMockSnapshot(slug: string): WeatherSnapshot | undefined {
  const profile = CITY_PROFILES.find((c) => c.slug === slug);
  if (!profile) return undefined;

  const rand = mulberry32(hashSeed(profile.slug + new Date().toISOString().slice(0, 13)));
  const now = new Date();
  const sunriseHour = 6 + Math.floor(rand() * 2);
  const sunsetHour = 19 + Math.floor(rand() * 2);

  const current = {
    observedAt: now.toISOString(),
    temperatureF: profile.baseTempF,
    feelsLikeF: profile.baseTempF + (profile.humidityPct > 70 ? 4 : -1),
    condition: profile.condition,
    conditionLabel: CONDITION_LABELS[profile.condition],
    humidityPct: profile.humidityPct,
    windMph: profile.windMph,
    windDirection: windDirectionFromDegrees(rand() * 360),
    windGustMph: Math.round(profile.windMph * 1.6),
    pressureInHg: Math.round((29.7 + rand() * 0.6) * 100) / 100,
    visibilityMi: profile.condition === "fog" ? 2 : 10,
    uvIndex: Math.round(3 + rand() * 8),
    rainChancePct: profile.condition.includes("rain") || profile.condition === "thunderstorm" ? 60 : Math.round(rand() * 20),
    sunrise: `${sunriseHour}:${rand() > 0.5 ? "12" : "48"} AM`,
    sunset: `${sunsetHour - 12}:${rand() > 0.5 ? "05" : "37"} PM`,
    airQuality: {
      aqi: profile.aqi,
      category: aqiCategory(profile.aqi),
      primaryPollutant: profile.aqi > 40 ? "PM2.5" : "Ozone",
    } satisfies AirQuality,
  };

  return {
    location: toLocationInfo(profile),
    current,
    hourly: buildHourly(profile, rand),
    daily: buildDaily(profile, rand),
    alerts: buildAlert(profile),
    fetchedAt: now.toISOString(),
  };
}

export function getAllAlerts(): WeatherAlert[] {
  return CITY_PROFILES.flatMap(buildAlert);
}

export function getActivityRecommendations(snapshot: WeatherSnapshot): ActivityRecommendation[] {
  const { current } = snapshot;
  const recs: ActivityRecommendation[] = [];

  recs.push(
    current.rainChancePct < 30 && current.windMph < 20
      ? { label: "Outdoor Run", verdict: "great", reason: `Low rain chance (${current.rainChancePct}%) and manageable wind.` }
      : { label: "Outdoor Run", verdict: current.rainChancePct < 60 ? "fair" : "poor", reason: `${current.rainChancePct}% rain chance and ${current.windMph} mph wind.` },
  );

  recs.push(
    current.uvIndex >= 7
      ? { label: "Beach / Sun Exposure", verdict: "poor", reason: `UV index ${current.uvIndex} — use SPF 50+ and seek shade midday.` }
      : { label: "Beach / Sun Exposure", verdict: "great", reason: `UV index ${current.uvIndex} is manageable with standard SPF.` },
  );

  recs.push(
    current.airQuality.aqi <= 50
      ? { label: "Sensitive Groups Outdoors", verdict: "great", reason: `Air quality is ${current.airQuality.category.toLowerCase()} (AQI ${current.airQuality.aqi}).` }
      : { label: "Sensitive Groups Outdoors", verdict: "fair", reason: `AQI ${current.airQuality.aqi} — ${current.airQuality.category.toLowerCase()}.` },
  );

  return recs;
}
