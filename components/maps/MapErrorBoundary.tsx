"use client";

import { Component, type ReactNode } from "react";
import { MapFallback } from "./MapFallback";
import type { MapLocationSummary } from "./geo";

interface Props {
  locations: MapLocationSummary[];
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * The map is a portfolio focal point but must never take the rest of the
 * dashboard down with it. Any render error inside the client map falls back
 * to a static radar summary instead of an app-wide crash.
 */
export class MapErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("WeatherMap failed to render, falling back to radar summary.", error);
  }

  render() {
    if (this.state.hasError) {
      return <MapFallback locations={this.props.locations} reason="error" />;
    }
    return this.props.children;
  }
}
