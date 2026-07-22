import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/ui/AppShell";
import { ServiceWorkerRegister } from "@/components/ui/ServiceWorkerRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "WeatherWise AI — Storm Operations Console",
    template: "%s · WeatherWise AI",
  },
  description:
    "A mobile-first weather intelligence dashboard with radar-driven UI, severe alert triage, saved locations, and offline-first forecasting.",
  manifest: "/manifest.json",
  applicationName: "WeatherWise AI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WeatherWise AI",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppShell>{children}</AppShell>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
