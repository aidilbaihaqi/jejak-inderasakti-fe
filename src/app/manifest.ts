import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jejak Inderasakti — Jelajah Cagar Budaya Pulau Penyengat",
    short_name: "Jejak Inderasakti",
    description: "Game kuis petualangan edukatif interaktif menjelajahi 5 situs cagar budaya Pulau Penyengat, Tanjungpinang, Kepulauan Riau.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF5E6",
    theme_color: "#FBF5E6",
    icons: [
      {
        src: "/logo.webp",
        sizes: "192x192 512x512",
        type: "image/webp",
      },
    ],
  };
}
