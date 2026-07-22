/** Rough continental US bounding box used to project lat/lon onto the console's SVG scope. */
const BOUNDS = { minLon: -125, maxLon: -66, minLat: 24, maxLat: 50 };

export function projectToPercent(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * 100;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x: Math.min(98, Math.max(2, x)), y: Math.min(98, Math.max(2, y)) };
}

const COMPASS_DIRECTIONS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];

export function compassToDegrees(direction: string): number {
  const index = COMPASS_DIRECTIONS.indexOf(direction);
  return index === -1 ? 0 : index * 22.5;
}

export interface MapLocationSummary {
  slug: string;
  name: string;
  lat: number;
  lon: number;
  temperatureF: number;
  windMph: number;
  windDirection: string;
  hasAlert: boolean;
  isDefault?: boolean;
}
