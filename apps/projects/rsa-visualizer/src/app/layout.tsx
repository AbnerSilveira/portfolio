import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RSA Visualizer",
  description:
    "Visualização didática de RSA e aritmética modular (Matemática Discreta — 2023/1).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
