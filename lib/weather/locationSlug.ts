import type { LocationInfo } from "./types";

/**
 * Locations outside the curated city roster are identified by a
 * self-describing slug instead of a database row: the slug itself is a
 * URL-safe, UTF-8-safe base64 encoding of the location's data. This keeps
 * the app database-free while still supporting "any city" without a paid
 * geocoding/weather API — decode the slug, synthesize mock weather from it.
 */
const CUSTOM_SLUG_PREFIX = "geo-";

interface EncodedLocation {
  n: string; // name
  r: string; // region
  c: string; // country
  a: number; // lat
  o: number; // lon
  z: string; // timezone
}

function utf8ToBase64Url(input: string): string {
  const base64 = btoa(unescape(encodeURIComponent(input)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUtf8(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return decodeURIComponent(escape(atob(padded)));
}

export function isCustomSlug(slug: string): boolean {
  return slug.startsWith(CUSTOM_SLUG_PREFIX);
}

export function encodeCustomLocationSlug(location: Omit<LocationInfo, "slug">): string {
  const payload: EncodedLocation = {
    n: location.name,
    r: location.region,
    c: location.country,
    a: Math.round(location.coordinates.lat * 100) / 100,
    o: Math.round(location.coordinates.lon * 100) / 100,
    z: location.timezone,
  };
  return `${CUSTOM_SLUG_PREFIX}${utf8ToBase64Url(JSON.stringify(payload))}`;
}

export function decodeCustomLocationSlug(slug: string): LocationInfo | undefined {
  if (!isCustomSlug(slug)) return undefined;
  try {
    const raw = slug.slice(CUSTOM_SLUG_PREFIX.length);
    const payload = JSON.parse(base64UrlToUtf8(raw)) as EncodedLocation;
    if (
      typeof payload.n !== "string" ||
      typeof payload.a !== "number" ||
      typeof payload.o !== "number"
    ) {
      return undefined;
    }
    return {
      slug,
      name: payload.n,
      region: payload.r ?? "",
      country: payload.c ?? "",
      coordinates: { lat: payload.a, lon: payload.o },
      timezone: payload.z || "UTC",
    };
  } catch {
    return undefined;
  }
}
