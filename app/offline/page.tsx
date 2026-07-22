import type { Metadata } from "next";
import { OfflinePageContent } from "@/components/locations/OfflinePageContent";

export const metadata: Metadata = {
  title: "Offline",
  description: "WeatherWise AI offline mode — view cached forecasts and reconnect when ready.",
};

export default function OfflinePage() {
  return <OfflinePageContent />;
}
