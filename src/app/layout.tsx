import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito, Space_Mono } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FBF5E6",
};


const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jejak Inderasakti — Jelajah Pulau Penyengat",
  description: "Game kuis petualangan edukatif menjelajahi 5 situs cagar budaya Pulau Penyengat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${baloo.variable} ${nunito.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-body bg-kertas text-tinta selection:bg-kuning selection:text-tinta">
        {children}
      </body>
    </html>
  );
}

