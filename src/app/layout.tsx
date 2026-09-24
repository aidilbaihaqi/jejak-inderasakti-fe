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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://penyengatadventure.tech";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jejak Inderasakti — Game Kuis Cagar Budaya Pulau Penyengat",
    template: "%s | Jejak Inderasakti",
  },
  description:
    "Game kuis petualangan edukatif multiplayer real-time menjelajahi 5 situs cagar budaya Pulau Penyengat, Tanjungpinang, Kepulauan Riau. Belajar sejarah dan warisan Melayu dengan seru!",
  applicationName: "Jejak Inderasakti",
  keywords: [
    "Jejak Inderasakti",
    "Pulau Penyengat",
    "Cagar Budaya Pulau Penyengat",
    "Kuis Sejarah Melayu",
    "Masjid Raya Sultan Riau",
    "Istana Kantor",
    "Gedung Tabib",
    "Perigi Puteri",
    "Makam Raja Ali Haji",
    "Gurindam Dua Belas",
    "Game Edukasi Budaya",
    "Wisata Edukasi Tanjungpinang",
    "Warisan Budaya Melayu",
    "Kuis Interaktif Budaya",
  ],
  authors: [{ name: "Tim Jejak Inderasakti" }],
  creator: "Tim Jejak Inderasakti",
  publisher: "Jejak Inderasakti",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Jejak Inderasakti",
    title: "Jejak Inderasakti — Game Kuis Cagar Budaya Pulau Penyengat",
    description:
      "Petualangan kuis edukatif interaktif menjelajahi 5 situs cagar budaya Pulau Penyengat, Tanjungpinang, Kepulauan Riau.",
    images: [
      {
        url: "/peta.webp",
        width: 1200,
        height: 630,
        alt: "Peta Petualangan Jejak Inderasakti Pulau Penyengat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jejak Inderasakti — Game Kuis Cagar Budaya Pulau Penyengat",
    description:
      "Petualangan kuis edukatif interaktif menjelajahi 5 situs cagar budaya Pulau Penyengat.",
    images: ["/peta.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.webp", type: "image/webp" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/logo.webp",
    apple: [{ url: "/logo.webp", sizes: "180x180", type: "image/webp" }],
  },
  verification: {
    google: "RjgNEbyKbt1Gv3yPwxe55d8P8o9ZZDiGpREZUOHDFiQ",
  },
  category: "education",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Jejak Inderasakti",
      description: "Game kuis petualangan edukatif cagar budaya Pulau Penyengat",
      inLanguage: "id-ID",
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#app`,
      name: "Jejak Inderasakti",
      applicationCategory: "EducationalApplication",
      genre: "Educational Quiz Game",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      description:
        "Platform kuis interaktif multiplayer real-time tentang sejarah dan 5 situs cagar budaya Pulau Penyengat.",
      offers: {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "IDR",
      },
    },
  ],
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
      <head>
        <link rel="icon" href="/logo.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="/logo.webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full font-body bg-kertas text-tinta selection:bg-kuning selection:text-tinta">
        {children}
      </body>
    </html>
  );
}

