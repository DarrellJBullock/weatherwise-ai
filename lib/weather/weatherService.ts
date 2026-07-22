import type { LocationInfo, WeatherAlert, WeatherSnapshot } from "./types";
import {
  getAllAlerts,
  getAllLocations,
  getLocationBySlug,
  getMockSnapshot,
} from "./mockWeatherProvider";

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

class MockWeatherProvider implements WeatherProvider {
  name = "mock";

  async listLocations(): Promise<LocationInfo[]> {
    return getAllLocations();
  }

  async getLocation(slug: string): Promise<LocationInfo | undefined> {
    return getLocationBySlug(slug);
  }

  async getSnapshot(slug: string): Promise<WeatherSnapshot | undefined> {
    return getMockSnapshot(slug);
  }

  async listAlerts(): Promise<WeatherAlert[]> {
    return getAllAlerts();
  }
}

/**
 * Active provider for the app. Because MVP rules forbid requiring a paid API
 * key, this always resolves to the mock provider today. A future
 * `LiveWeatherProvider` reading `WEATHER_API_KEY` can be swapped in here.
 */
const activeProvider: WeatherProvider = new MockWeatherProvider();

export const weatherService = {
  listLocations: () => activeProvider.listLocations(),
  getLocation: (slug: string) => activeProvider.getLocation(slug),
  getSnapshot: (slug: string) => activeProvider.getSnapshot(slug),
  listAlerts: () => activeProvider.listAlerts(),
  providerName: activeProvider.name,
};
