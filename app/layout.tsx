import type { Metadata } from "next";
import { IBM_Plex_Mono, Fraunces } from "next/font/google";
import "./globals.css";

// IBM Plex Mono for timer and factual elements
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Fraunces as editorial serif fallback for Canela
// Fraunces has that warm, editorial quality with soft curves
const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Same Time. Different Climb.",
  description: "A reflection on commitment, effort, and focus — inspired by Alex Honnold's ascent of Taipei 101.",
  openGraph: {
    title: "Same Time. Different Climb.",
    description: "1 hour and 31 minutes. What will you achieve?",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexMono.variable} ${fraunces.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
