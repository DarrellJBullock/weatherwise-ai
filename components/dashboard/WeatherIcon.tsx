import {
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  Cloud,
  Moon,
  Sun,
  Wind,
  type LucideProps,
} from "lucide-react";
import type { ConditionCode } from "@/lib/weather/types";

const ICON_MAP: Record<ConditionCode, typeof Sun> = {
  "clear-day": Sun,
  "clear-night": Moon,
  "partly-cloudy-day": CloudSun,
  "partly-cloudy-night": CloudMoon,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  "heavy-rain": CloudRainWind,
  thunderstorm: CloudLightning,
  snow: CloudSnow,
  sleet: CloudSnow,
  windy: Wind,
};

const COLOR_MAP: Record<ConditionCode, string> = {
  "clear-day": "text-(--color-accent-amber)",
  "clear-night": "text-(--color-accent-blue)",
  "partly-cloudy-day": "text-(--color-accent-amber)",
  "partly-cloudy-night": "text-(--color-accent-blue)",
  cloudy: "text-(--color-text-secondary)",
  fog: "text-(--color-text-secondary)",
  drizzle: "text-(--color-accent-blue)",
  rain: "text-(--color-accent-blue)",
  "heavy-rain": "text-(--color-accent-blue)",
  thunderstorm: "text-(--color-accent-orange)",
  snow: "text-(--color-text-primary)",
  sleet: "text-(--color-accent-cyan)",
  windy: "text-(--color-accent-cyan)",
};

interface WeatherIconProps extends Omit<LucideProps, "ref"> {
  condition: ConditionCode;
}

export function WeatherIcon({ condition, className, ...props }: WeatherIconProps) {
  const Icon = ICON_MAP[condition];
  return <Icon className={`${COLOR_MAP[condition]} ${className ?? ""}`} aria-hidden="true" {...props} />;
}
