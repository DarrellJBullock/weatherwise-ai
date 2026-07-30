import type { LocationInfo, WeatherAlert, WeatherSnapshot } from "./types";
import { getAllLocations, getLocationBySlug } from "./mockWeatherProvider";
import { fetchOpenMeteoSnapshot } from "./openMeteoProvider";
import { fetchNwsAlerts } from "./nwsAlertsProvider";

/**
 * Provider-agnostic interface. Swap `mockWeatherProvider` for a real API
 * client (e.g. NWS, Open-Meteo, Tomorrow.io) by implementing this interface
 * and changing the `activeProvider` below — no consumer code changes.
 */
export interface WeatherProvider {
  name: string;
  listLocations(): Promise<LocationInfo[]>;
  getLocation(slug: string): Promise<LocationInfo | undefined>;
  getSnapshot(slug: string): Promise<WeatherSnapshot | undefined>;
  listAlerts(): Promise<WeatherAlert[]>;
}

class OpenMeteoWeatherProvider implements WeatherProvider {
  name = "open-meteo";

  async listLocations(): Promise<LocationInfo[]> {
    return getAllLocations();
  }

  async getLocation(slug: string): Promise<LocationInfo | undefined> {
    return getLocationBySlug(slug);
  }

  async getSnapshot(slug: string): Promise<WeatherSnapshot | undefined> {
    const location = await this.getLocation(slug);
    if (!location) return undefined;
    return fetchOpenMeteoSnapshot(location);
  }

  async listAlerts(): Promise<WeatherAlert[]> {
    // Open-Meteo has no alerts feed; pull live NWS alerts (US-only, keyless)
    // for each curated location and flatten. Custom/searched locations get
    // their own alerts inline via getSnapshot instead.
    const locations = await this.listLocations();
    const perLocation = await Promise.all(locations.map((loc) => fetchNwsAlerts(loc)));
    return perLocation.flat();
  }
}

/**
 * Active provider for the app. Free, keyless Open-Meteo API — no paid key
 * required, consistent with the geocoding API already in app/api/geocode.
 */
const activeProvider: WeatherProvider = new OpenMeteoWeatherProvider();

export const weatherService = {
  listLocations: () => activeProvider.listLocations(),
  getLocation: (slug: string) => activeProvider.getLocation(slug),
  getSnapshot: (slug: string) => activeProvider.getSnapshot(slug),
  listAlerts: () => activeProvider.listAlerts(),
  providerName: activeProvider.name,
};
