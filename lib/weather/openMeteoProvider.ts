import type {
  AirQuality,
  ConditionCode,
  CurrentConditions,
  DailyForecastEntry,
  HourlyForecastEntry,
  LocationInfo,
  WeatherSnapshot,
} from "./types";
import { fetchNwsAlerts } from "./nwsAlertsProvider";

/**
 * Live weather via Open-Meteo (https://open-meteo.com) — free, keyless REST
 * API, consistent with the geocoding API already used in app/api/geocode.
 * Open-Meteo has no severe weather alerts, so alerts come from a separate
 * NWS fetch (see nwsAlertsProvider.ts) run alongside it.
 */

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

const CURRENT_PARAMS = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "is_day",
  "weather_code",
  "pressure_msl",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
].join(",");

const HOURLY_PARAMS = [
  "temperature_2m",
  "precipitation_probability",
  "weather_code",
  "wind_speed_10m",
  "uv_index",
  "visibility",
].join(",");

const DAILY_PARAMS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_probability_max",
  "wind_speed_10m_max",
  "uv_index_max",
  "sunrise",
  "sunset",
].join(",");

const AIR_QUALITY_CURRENT_PARAMS = [
  "us_aqi",
  "us_aqi_pm2_5",
  "us_aqi_pm10",
  "us_aqi_ozone",
  "us_aqi_no2",
  "us_aqi_so2",
  "us_aqi_co",
].join(",");

interface OpenMeteoForecastResponse {
  utc_offset_seconds: number;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    weather_code: number;
    pressure_msl: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    uv_index: number[];
    visibility: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

interface OpenMeteoAirQualityResponse {
  current: {
    us_aqi: number | null;
    us_aqi_pm2_5?: number | null;
    us_aqi_pm10?: number | null;
    us_aqi_ozone?: number | null;
    us_aqi_no2?: number | null;
    us_aqi_so2?: number | null;
    us_aqi_co?: number | null;
  };
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

/** WMO weather codes -> app condition codes. https://open-meteo.com/en/docs#weathervariables */
function mapWeatherCode(code: number, isDay: boolean): ConditionCode {
  if (code === 0) return isDay ? "clear-day" : "clear-night";
  if (code === 1 || code === 2) return isDay ? "partly-cloudy-day" : "partly-cloudy-night";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code === 51 || code === 53 || code === 55) return "drizzle";
  if (code === 56 || code === 57 || code === 66 || code === 67) return "sleet";
  if (code === 61 || code === 63 || code === 80 || code === 81) return "rain";
  if (code === 65 || code === 82) return "heavy-rain";
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) return "snow";
  if (code === 95 || code === 96 || code === 99) return "thunderstorm";
  return isDay ? "partly-cloudy-day" : "partly-cloudy-night";
}

const WIND_OVERRIDABLE: ConditionCode[] = [
  "clear-day",
  "clear-night",
  "partly-cloudy-day",
  "partly-cloudy-night",
  "cloudy",
];

/** Surface "windy" as the primary condition once sustained wind dominates a mild sky. */
function applyWindOverride(condition: ConditionCode, windMph: number): ConditionCode {
  return windMph >= 25 && WIND_OVERRIDABLE.includes(condition) ? "windy" : condition;
}

function aqiCategory(aqi: number): AirQuality["category"] {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function resolvePrimaryPollutant(current: OpenMeteoAirQualityResponse["current"] | undefined): string {
  const candidates: [string, number | null | undefined][] = [
    ["PM2.5", current?.us_aqi_pm2_5],
    ["PM10", current?.us_aqi_pm10],
    ["Ozone", current?.us_aqi_ozone],
    ["NO2", current?.us_aqi_no2],
    ["SO2", current?.us_aqi_so2],
    ["CO", current?.us_aqi_co],
  ];
  let best = "Ozone";
  let bestVal = -Infinity;
  for (const [label, val] of candidates) {
    if (val != null && val > bestVal) {
      bestVal = val;
      best = label;
    }
  }
  return best;
}

function windDirectionFromDegrees(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

/** hPa -> inHg */
function toInHg(hPa: number): number {
  return Math.round(hPa * 0.02953 * 100) / 100;
}

/** meters -> miles */
function toMiles(meters: number): number {
  return Math.round((meters / 1609.34) * 10) / 10;
}

function formatUtcOffset(utcOffsetSeconds: number): string {
  const sign = utcOffsetSeconds >= 0 ? "+" : "-";
  const abs = Math.abs(utcOffsetSeconds);
  const hh = String(Math.floor(abs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((abs % 3600) / 60)).padStart(2, "0");
  return `${sign}${hh}:${mm}`;
}

/** Open-Meteo returns local wall-clock strings (no offset) when timezone=auto; attach the real offset so `new Date(...)` yields the correct absolute instant. */
function toAbsoluteIso(localTime: string, offset: string): string {
  return `${localTime}:00${offset}`;
}

function formatClock(localTime: string): string {
  const hm = localTime.split("T")[1];
  if (!hm) return localTime;
  const [hStr, mStr] = hm.split(":");
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${mStr} ${period}`;
}

function dayLabel(index: number, dateStr: string): string {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" });
}

/** Nearest hourly index to the current reading (Open-Meteo rounds "current" to the nearest 15 min, hourly entries land on the hour). */
function findClosestHourlyIndex(times: string[], targetIso: string): number {
  const exact = times.indexOf(targetIso);
  if (exact !== -1) return exact;
  const target = new Date(targetIso).getTime();
  let closest = 0;
  let minDiff = Infinity;
  for (let i = 0; i < times.length; i++) {
    const diff = Math.abs(new Date(times[i]).getTime() - target);
    if (diff < minDiff) {
      minDiff = diff;
      closest = i;
    }
  }
  return closest;
}

function buildHourly(forecast: OpenMeteoForecastResponse, offset: string): HourlyForecastEntry[] {
  const startIdx = findClosestHourlyIndex(forecast.hourly.time, forecast.current.time);
  const entries: HourlyForecastEntry[] = [];
  const endIdx = Math.min(startIdx + 24, forecast.hourly.time.length);
  for (let i = startIdx; i < endIdx; i++) {
    const hour = parseInt(forecast.hourly.time[i].split("T")[1].split(":")[0], 10);
    const isDay = hour >= 6 && hour < 20;
    const condition = applyWindOverride(
      mapWeatherCode(forecast.hourly.weather_code[i], isDay),
      forecast.hourly.wind_speed_10m[i],
    );
    entries.push({
      time: toAbsoluteIso(forecast.hourly.time[i], offset),
      temperatureF: Math.round(forecast.hourly.temperature_2m[i]),
      condition,
      conditionLabel: CONDITION_LABELS[condition],
      rainChancePct: Math.round(forecast.hourly.precipitation_probability[i] ?? 0),
      windMph: Math.round(forecast.hourly.wind_speed_10m[i]),
    });
  }
  return entries;
}

function buildDaily(forecast: OpenMeteoForecastResponse): DailyForecastEntry[] {
  return forecast.daily.time.map((date, i) => {
    const condition = mapWeatherCode(forecast.daily.weather_code[i], true);
    return {
      date,
      dayLabel: dayLabel(i, date),
      condition,
      conditionLabel: CONDITION_LABELS[condition],
      highF: Math.round(forecast.daily.temperature_2m_max[i]),
      lowF: Math.round(forecast.daily.temperature_2m_min[i]),
      rainChancePct: Math.round(forecast.daily.precipitation_probability_max[i] ?? 0),
      windMph: Math.round(forecast.daily.wind_speed_10m_max[i]),
      uvIndex: Math.round(forecast.daily.uv_index_max[i] ?? 0),
      sunrise: formatClock(forecast.daily.sunrise[i]),
      sunset: formatClock(forecast.daily.sunset[i]),
    };
  });
}

export async function fetchOpenMeteoSnapshot(location: LocationInfo): Promise<WeatherSnapshot | undefined> {
  const { lat, lon } = location.coordinates;

  const forecastUrl = new URL(FORECAST_URL);
  forecastUrl.searchParams.set("latitude", String(lat));
  forecastUrl.searchParams.set("longitude", String(lon));
  forecastUrl.searchParams.set("current", CURRENT_PARAMS);
  forecastUrl.searchParams.set("hourly", HOURLY_PARAMS);
  forecastUrl.searchParams.set("daily", DAILY_PARAMS);
  forecastUrl.searchParams.set("temperature_unit", "fahrenheit");
  forecastUrl.searchParams.set("wind_speed_unit", "mph");
  forecastUrl.searchParams.set("timezone", "auto");
  forecastUrl.searchParams.set("forecast_days", "7");

  const airQualityUrl = new URL(AIR_QUALITY_URL);
  airQualityUrl.searchParams.set("latitude", String(lat));
  airQualityUrl.searchParams.set("longitude", String(lon));
  airQualityUrl.searchParams.set("current", AIR_QUALITY_CURRENT_PARAMS);
  airQualityUrl.searchParams.set("timezone", "auto");

  const airQualityPromise = fetch(airQualityUrl, { next: { revalidate: 300 } })
    .then((res) => (res.ok ? (res.json() as Promise<OpenMeteoAirQualityResponse>) : undefined))
    .catch(() => undefined);
  const alertsPromise = fetchNwsAlerts(location);

  let forecastRes: Response;
  try {
    forecastRes = await fetch(forecastUrl, { next: { revalidate: 300 } });
  } catch {
    return undefined;
  }
  if (!forecastRes.ok) return undefined;

  const forecast = (await forecastRes.json()) as OpenMeteoForecastResponse;
  const offset = formatUtcOffset(forecast.utc_offset_seconds);

  const [airQuality, alerts] = await Promise.all([airQualityPromise, alertsPromise]);

  const hIdx = findClosestHourlyIndex(forecast.hourly.time, forecast.current.time);
  const isDay = forecast.current.is_day === 1;
  const condition = applyWindOverride(
    mapWeatherCode(forecast.current.weather_code, isDay),
    forecast.current.wind_speed_10m,
  );

  const aqi = Math.round(airQuality?.current.us_aqi ?? 0);

  const current: CurrentConditions = {
    observedAt: new Date().toISOString(),
    temperatureF: Math.round(forecast.current.temperature_2m),
    feelsLikeF: Math.round(forecast.current.apparent_temperature),
    condition,
    conditionLabel: CONDITION_LABELS[condition],
    humidityPct: Math.round(forecast.current.relative_humidity_2m),
    windMph: Math.round(forecast.current.wind_speed_10m),
    windDirection: windDirectionFromDegrees(forecast.current.wind_direction_10m),
    windGustMph: Math.round(forecast.current.wind_gusts_10m),
    pressureInHg: toInHg(forecast.current.pressure_msl),
    visibilityMi: toMiles(forecast.hourly.visibility[hIdx] ?? 16093),
    uvIndex: Math.round(forecast.hourly.uv_index[hIdx] ?? 0),
    rainChancePct: Math.round(forecast.hourly.precipitation_probability[hIdx] ?? 0),
    sunrise: formatClock(forecast.daily.sunrise[0]),
    sunset: formatClock(forecast.daily.sunset[0]),
    airQuality: {
      aqi,
      category: aqiCategory(aqi),
      primaryPollutant: resolvePrimaryPollutant(airQuality?.current),
    },
  };

  return {
    location,
    current,
    hourly: buildHourly(forecast, offset),
    daily: buildDaily(forecast),
    alerts,
    fetchedAt: new Date().toISOString(),
  };
}
