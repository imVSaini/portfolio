import type { Metadata, Viewport } from "next";
import { Caveat, DM_Sans, Kalam } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Landscape } from "@/components/layout/landscape";
import { Preloader } from "@/components/layout/preloader";
import { profile } from "@/data/profile";
import { themeBootScript } from "@/store/use-theme-store";
import "./globals.css";

const kalam = Kalam({ variable: "--font-kalam", weight: ["400", "700"], subsets: ["latin"] });
const caveat = Caveat({ variable: "--font-caveat", weight: ["500", "700"], subsets: ["latin"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });

const description = `${profile.name}, ${profile.role} in ${profile.location}. ${profile.intro}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: `${profile.name} — ${profile.role}`,
  description,
  authors: [{ name: profile.name }],
  keywords: [
    "Full-stack engineer",
    "Lead software engineer",
    "Next.js",
    "React",
    "FastAPI",
    "Python",
    "PostgreSQL",
    "SaaS",
    "Bengaluru",
  ],
  openGraph: {
    title: profile.name,
    description,
    type: "website",
    images: [{ url: "/projects/workos.jpg", width: 1600, height: 1000 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#faf9f5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${kalam.variable} ${caveat.variable} ${dmSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking on purpose: sets data-theme before first paint, so there is no theme flash.
            (next/script's beforeInteractive defers inline code until the runtime loads.) */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="grain">
        <a
          href="#index"
          className="sr-only z-80 border-2 border-ink bg-signal px-4 py-2 text-on-clay focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <Preloader />
        <Landscape />
        <Header />
        {children}
      </body>
    </html>
  );
}
