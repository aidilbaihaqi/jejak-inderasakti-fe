import React, { useState } from "react";
import { SITES_DATA, SiteLocation } from "../assets/PulauPenyengatMap";
import { RotateCcw, Award } from "lucide-react";

interface SiteHeritageCardProps {
  siteId: number; // 1 to 5
  lang?: "id" | "en";
  className?: string;
}

export const SiteHeritageCard: React.FC<SiteHeritageCardProps> = ({
  siteId,
  lang = "id",
  className = "",
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const site = SITES_DATA.find((s) => s.id === siteId) || SITES_DATA[0];

  const siteFacts: Record<
    number,
    { titleId: string; titleEn: string; factId: string; factEn: string }
  > = {
    1: {
      titleId: "Keunikan Perekat Putih Telur",
      titleEn: "Egg White Mortar Mystery",
      factId:
        "Masjid Raya Sultan Riau dibangun pada tahun 1832 dengan campuran putih telur, kapur, pasir, dan tanah liat yang konon membuatnya kokoh bertahan hingga kini. Memiliki 13 kubah dan 4 menara yang melambangkan 17 rakaat salat.",
      factEn:
        "The Sultan Riau Mosque was built in 1832 using a unique mortar containing egg whites, lime, and clay. Its 13 domes and 4 minarets symbolize the 17 units of Islamic daily prayer.",
    },
    2: {
      titleId: "Pujangga Gurindam Dua Belas",
      titleEn: "Poet of the Twelve Aphorisms",
      factId:
        "Raja Ali Haji adalah pahlawan nasional yang menggubah karya sastra monumental 'Gurindam Dua Belas' pada tahun 1847 dan merintis standarisasi bahasa Melayu yang menjadi cikal bakal Bahasa Indonesia.",
      factEn:
        "Raja Ali Haji composed the famous 'Gurindam Dua Belas' in 1847 and helped standardize the Malay language, which later became the foundation of modern Indonesian.",
    },
    3: {
      titleId: "Pusat Pemerintahan Yang Dipertuan Muda",
      titleEn: "Center of Malay Governance",
      factId:
        "Istana Kantor berfungsi ganda sebagai kediaman resmi dan pusat pemerintahan Yang Dipertuan Muda Riau VIII Raja Ali (1844-1857), dilindungi benteng dan parit pertahanan.",
      factEn:
        "Istana Kantor was the administrative seat and private residence of Viceroy Raja Ali (1844-1857), protected by defensive earthen moats and ramparts.",
    },
    4: {
      titleId: "Tradisi Pengobatan Herbal Kesultanan",
      titleEn: "Royal Herbal Medicine Tradition",
      factId:
        "Gedung Tabib adalah tempat tinggal tabib kerajaan yang meracik obat-obatan herbal tradisional Melayu dari tanaman rempah yang ditanam langsung di sekitar pekarangan.",
      factEn:
        "The Physician's House was home to royal herbal healers who formulated natural Malay remedies from native botanical gardens on the island.",
    },
    5: {
      titleId: "Mata Air Suci Perigi Puteri",
      titleEn: "The Sacred Freshwater Well",
      factId:
        "Perigi Puteri adalah sumur mata air tawar alami yang berada tepat di tepi laut Pulau Penyengat, namun airnya tetap tawar dan tak pernah kering sepanjang masa.",
      factEn:
        "Perigi Puteri is an ancient freshwater well located right beside the seawater shore, yet its water remains sweet, crystal clear, and never dries up.",
    },
  };

  const fact = siteFacts[siteId] || siteFacts[1];

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className={`relative w-full max-w-sm h-72 cursor-pointer perspective-1000 select-none ${className}`}
      title={lang === "id" ? "Ketuk untuk membalik kartu" : "Tap to flip postcard"}
    >
      <div
        className={`w-full h-full relative transform-style-3d transition-transform duration-500 rounded-3xl ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT: Postcard View */}
        <div className="absolute inset-0 backface-hidden bg-kertas-putih rounded-3xl border-3 border-tinta shadow-stiker p-5 flex flex-col justify-between overflow-hidden">
          {/* Postcard Header: Postage Stamp */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full border-2 border-tinta"
                style={{ backgroundColor: site.color }}
              />
              <span className="font-label text-xs font-bold uppercase tracking-wider text-coklat">
                KARTU WARISAN NO. 0{site.id}
              </span>
            </div>

            {/* Vintage Stamp Graphic */}
            <div className="w-14 h-16 rounded-md border-2 border-dashed border-emas bg-kuning/30 p-1 flex flex-col items-center justify-between shadow-xs -rotate-3">
              <Award className="w-5 h-5 text-emas" />
              <span className="font-label text-[8px] font-bold text-tinta">
                RI-1832
              </span>
              <span className="font-label text-[7px] text-coklat">PENYENGAT</span>
            </div>
          </div>

          {/* Site Illustration Placeholder / Title */}
          <div className="my-auto text-center py-2">
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-label font-bold text-white mb-2 shadow-xs"
              style={{ backgroundColor: site.color }}
            >
              SITUS CAGAR BUDAYA #{site.id}
            </div>
            <h3 className="font-display font-black text-xl text-tinta leading-tight">
              {lang === "id" ? site.name : site.nameEn}
            </h3>
            <p className="font-body text-xs text-coklat font-semibold mt-1 max-w-[260px] mx-auto line-clamp-2">
              {site.desc}
            </p>
          </div>

          {/* Bottom Flip Hint */}
          <div className="flex items-center justify-between pt-2 border-t border-dashed border-kraft text-coklat text-[11px] font-bold font-body">
            <span className="flex items-center gap-1 text-emas">
              ✦ Warisan Budaya Riau
            </span>
            <span className="flex items-center gap-1 text-tinta/70 hover:text-tinta">
              <RotateCcw className="w-3.5 h-3.5" />
              {lang === "id" ? "Ketuk untuk balik" : "Tap to flip"}
            </span>
          </div>
        </div>

        {/* BACK: Historical Facts */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#FFF9ED] rounded-3xl border-3 border-tinta shadow-stiker p-5 flex flex-col justify-between overflow-hidden">
          {/* Card Back Header */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-tinta/20">
            <span className="font-label text-xs font-bold text-emas tracking-wider uppercase">
              ✦ FAKTA SEJARAH
            </span>
            <span className="font-label text-[11px] font-bold text-tinta bg-kuning px-2 py-0.5 rounded border border-tinta">
              Pulau Penyengat
            </span>
          </div>

          {/* Fact Content */}
          <div className="my-auto py-2">
            <h4 className="font-display font-extrabold text-lg text-tinta mb-1.5">
              {lang === "id" ? fact.titleId : fact.titleEn}
            </h4>
            <p className="font-body text-sm text-tinta font-medium leading-relaxed">
              {lang === "id" ? fact.factId : fact.factEn}
            </p>
          </div>

          {/* Back Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-dashed border-kraft text-coklat text-[11px] font-bold font-body">
            <span className="text-coklat">Disbudpar Tanjungpinang</span>
            <span className="flex items-center gap-1 text-tinta/70">
              <RotateCcw className="w-3.5 h-3.5" />
              {lang === "id" ? "Kembali" : "Flip back"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
