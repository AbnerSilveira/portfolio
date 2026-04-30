import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer, Navbar } from "@portfolio/ui";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar
          brand={{ label: "Portfolio", href: "/" }}
          links={[
            { label: "Projetos", href: "/projetos" },
            { label: "TCC", href: "/tcc" },
            { label: "Sobre", href: "/sobre" },
          ]}
        />
        <div className="flex-1">{children}</div>
        <Footer
          copyright={`© ${new Date().getFullYear()} — Portfólio Cibersegurança`}
          links={[
            { label: "GitHub", href: "https://github.com/" },
            { label: "LinkedIn", href: "https://www.linkedin.com/" },
          ]}
        />
      </body>
    </html>
  );
}
