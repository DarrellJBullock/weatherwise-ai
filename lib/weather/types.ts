/**
 * Core weather domain types shared by every provider implementation.
 * Shapes are modeled after common REST weather API responses (Open-Meteo /
 * NWS style) so a real provider can be swapped in without touching consumers.
 */

export type ConditionCode =
  | "clear-day"
  | "clear-night"
  | "partly-cloudy-day"
  | "partly-cloudy-night"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "heavy-rain"
  | "thunderstorm"
  | "snow"
  | "sleet"
  | "windy";

export type AlertSeverity = "advisory" | "watch" | "warning" | "emergency";

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface LocationInfo {
  slug: string;
  name: string;
  region: string;
  country: string;
  coordinates: Coordinates;
  timezone: string;
}

export interface AirQuality {
  aqi: number;
  category: "Good" | "Moderate" | "Unhealthy for Sensitive Groups" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
  primaryPollutant: string;
}

export interface CurrentConditions {
  observedAt: string;
  temperatureF: number;
  feelsLikeF: number;
  condition: ConditionCode;
  conditionLabel: string;
  humidityPct: number;
  windMph: number;
  windDirection: string;
  windGustMph: number;
  pressureInHg: number;
  visibilityMi: number;
  uvIndex: number;
  rainChancePct: number;
  sunrise: string;
  sunset: string;
  airQuality: AirQuality;
}

export interface HourlyForecastEntry {
  time: string;
  temperatureF: number;
  condition: ConditionCode;
  conditionLabel: string;
  rainChancePct: number;
  windMph: number;
}

export interface DailyForecastEntry {
  date: string;
  dayLabel: string;
  condition: ConditionCode;
  conditionLabel: string;
  highF: number;
  lowF: number;
  rainChancePct: number;
  windMph: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherAlert {
  id: string;
  locationSlug: string;
  severity: AlertSeverity;
  headline: string;
  impactSummary: string;
  recommendedAction: string;
  affectedArea: string;
  startsAt: string;
  endsAt: string;
  source: string;
  sourceId: string;
}

export interface WeatherSnapshot {
  location: LocationInfo;
  current: CurrentConditions;
  hourly: HourlyForecastEntry[];
  daily: DailyForecastEntry[];
  alerts: WeatherAlert[];
  fetchedAt: string;
}

export interface ActivityRecommendation {
  label: string;
  verdict: "great" | "fair" | "poor";
  reason: string;
}
