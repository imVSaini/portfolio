import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Preloader } from "@/components/layout/preloader";
import { profile } from "@/data/profile";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const description = `${profile.name}, ${profile.role} in ${profile.location}. ${profile.intro}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: `${profile.name} — ${profile.role}`,
  description,
  authors: [{ name: profile.name }],
  keywords: ["Backend engineer", "FastAPI", "Python", "PostgreSQL", "SaaS", "Bengaluru"],
  openGraph: {
    title: profile.name,
    description,
    type: "website",
    images: [{ url: "/projects/workos.jpg", width: 1600, height: 1000 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#121311",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrument.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="grain">
        <a
          href="#index"
          className="sr-only z-80 bg-signal px-3 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Preloader />
        <Header />
        {children}
      </body>
    </html>
  );
}
