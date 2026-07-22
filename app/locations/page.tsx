import type { Metadata } from "next";
import { LocationsPageContent } from "@/components/locations/LocationsPageContent";

export const metadata: Metadata = {
  title: "Saved Locations",
  description: "Manage saved cities, set your default location, and add new locations to track.",
};

export default function LocationsPage() {
  return <LocationsPageContent />;
}
