import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppProviders } from "@/components/portfolio/AppProviders";
import { Footer } from "@/components/portfolio/Footer";
import { Navbar } from "@/components/portfolio/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Portfolio — Cibersegurança",
    template: "%s | Portfolio",
  },
  description:
    "Portfólio de projetos em cibersegurança: scanners, honeypots, IDS, threat intelligence e mais.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Portfolio Cibersegurança",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      {
        url: "/favicon-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
      { url: "/favicon-dark.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon-dark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full min-w-0 flex-col overflow-x-clip bg-background text-foreground">
        <AppProviders>
          <Navbar />
          <div className="min-w-0 flex-1">{children}</div>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
