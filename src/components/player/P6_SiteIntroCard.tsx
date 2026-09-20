import React, { useState, useEffect } from "react";
import { SITES_DATA } from "../assets/PulauPenyengatMap";
import { MascotSakti } from "../assets/MascotSakti";
import { StickerButton } from "../ui/StickerButton";
import { PaperCard } from "../ui/PaperCard";
import { BookOpen, FastForward } from "lucide-react";

interface P6Props {
  stageId: number; // 1 to 5
  onStartQuiz: () => void;
  lang: "id" | "en";
}

const SITE_INTROS: Record<
  number,
  {
    titleId: string;
    titleEn: string;
    briefId: string;
    briefEn: string;
    points: string[];
  }
> = {
  1: {
    titleId: "Masjid Raya Sultan Riau",
    titleEn: "Sultan Riau Grand Mosque",
    briefId:
      "Dibangun megah pada tahun 1832 dengan kubah berwarna kuning keemasan dan hijau. Dikenal di seluruh Nusantara karena menggunakan campuran putih telur sebagai bahan perekat bangunannya.",
    briefEn:
      "Erected in 1832 with golden-yellow and emerald domes. Renowned across the archipelago for using egg white mortar to bind its sturdy foundations.",
    points: [
      "13 kubah & 4 menara (simbol 17 rakaat)",
      "Rumah Sotoh sebagai ruang musyawarah & madrasah",
      "Menyimpan Al-Qur'an kuno tulisan tangan abad ke-18",
    ],
  },
  2: {
    titleId: "Makam Engku Putri & Raja Ali Haji",
    titleEn: "Tomb of Engku Putri & Raja Ali Haji",
    briefId:
      "Tempat peristirahatan abadi Engku Putri Raja Hamidah (pemilik mahar Pulau Penyengat) dan Raja Ali Haji, sastrawan agung pencipta Gurindam Dua Belas.",
    briefEn:
      "The eternal sanctuary of Engku Putri Raja Hamidah and Raja Ali Haji, the great Malay literary figure who authored Gurindam Dua Belas.",
    points: [
      "Dinding makam dihiasi bait-bait Gurindam 12",
      "Penyengat adalah mas kawin Sultan Mahmud Shah III",
      "Pahlawan Nasional Bahasa Indonesia",
    ],
  },
  3: {
    titleId: "Istana Kantor",
    titleEn: "Kantor Palace",
    briefId:
      "Kediaman resmi Yang Dipertuan Muda Riau VIII Raja Ali (1844-1857) yang memadukan fungsi istana kediaman bangsawan dan kantor administrasi kesultanan.",
    briefEn:
      "Official residence of Viceroy Raja Ali (1844-1857), combining palace luxury with sultanate administrative headquarters.",
    points: [
      "Bangunan bertingkat dengan arsitektur Melayu-Eropa",
      "Tembok tebal dan sisa parit benteng pertahanan",
      "Pusat kebijakan maritim kerajaan Riau-Lingga",
    ],
  },
  4: {
    titleId: "Gedung Tabib",
    titleEn: "Physician's House",
    briefId:
      "Saksi sejarah tingginya ilmu kesehatan tradisional Melayu. Kediaman tabib istana yang meracik obat-obatan untuk sultan dan kerabat istana.",
    briefEn:
      "Testament to royal Malay traditional medicine. Home of the royal healer formulating herbal remedies for the royal family.",
    points: [
      "Reruntuhan dinding bata antik yang diselimuti akar pohon",
      "Kebun obat herbal tradisional khas pulau",
      "Warisan manuskrip pengobatan kuno Melayu",
    ],
  },
  5: {
    titleId: "Perigi Puteri",
    titleEn: "The Princess Well",
    briefId:
      "Mata air alami keramat di tepi pantai Pulau Penyengat yang airnya senantiasa tawar, dingin, dan jernih walau pasang laut naik mengelilinginya.",
    briefEn:
      "Sacred natural spring located at the seashore whose water miraculously remains sweet, cool, and crystalline even at high tide.",
    points: [
      "Bangunan kubah perlindungan berbentuk setengah silinder",
      "Tak pernah kering bahkan saat kemarau panjang",
      "Sumber air bersih permaisuri dan penduduk pulau",
    ],
  },
};

export const P6_SiteIntroCard: React.FC<P6Props> = ({
  stageId = 1,
  onStartQuiz,
  lang,
}) => {
  const [countdown, setCountdown] = useState(10);
  const site = SITES_DATA[stageId - 1] || SITES_DATA[0];
  const info = SITE_INTROS[stageId] || SITE_INTROS[1];

  useEffect(() => {
    if (countdown <= 0) {
      onStartQuiz();
      return;
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onStartQuiz]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[640px] p-5">
      {/* Top Banner with Countdown */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emas" />
          <span className="font-label text-xs font-bold text-coklat tracking-wide uppercase">
            {lang === "id" ? "SEKILAS SEJARAH" : "HERITAGE BRIEF"}
          </span>
        </div>

        <div className="px-3 py-1 bg-kuning rounded-xl border-2 border-tinta font-label font-bold text-xs text-tinta shadow-stiker-sm">
          {countdown}s
        </div>
      </div>

      {/* Main Historical Intro Card */}
      <div className="my-auto w-full space-y-4">
        <PaperCard
          variant="memo"
          washiTape
          washiTapeColor={site.color}
          washiTapeText={`SITUS #${stageId} DARI 5`}
          className="p-6"
        >
          {/* Site Title */}
          <div className="mb-3 text-center">
            <span
              className="inline-block px-3 py-0.5 rounded-full font-label text-[11px] font-bold text-white mb-1.5 shadow-xs"
              style={{ backgroundColor: site.color }}
            >
              Stage {stageId}/5
            </span>
            <h2 className="font-display font-black text-2xl text-tinta leading-tight">
              {lang === "id" ? info.titleId : info.titleEn}
            </h2>
          </div>

          {/* Narrative Paragraph */}
          <p className="font-body text-sm text-tinta font-medium leading-relaxed mb-4 bg-kertas/60 p-3 rounded-xl border border-tinta/20">
            {lang === "id" ? info.briefId : info.briefEn}
          </p>

          {/* Key Bullet Facts */}
          <div className="space-y-2">
            <span className="font-label text-[11px] font-bold text-coklat uppercase tracking-wider block">
              ✦ Fakta Kunci:
            </span>
            {info.points.map((pt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 font-body text-xs font-bold text-tinta"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emas mt-1.5 flex-shrink-0" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </PaperCard>

        {/* Mascot Sakti Pointing Hint */}
        <div className="flex justify-center">
          <MascotSakti
            pose="pointing"
            size={110}
            speechBubble={
              lang === "id"
                ? "Simak baik-baik, soal kuis ada di sini lho!"
                : "Read closely, quiz questions are based on this!"
            }
          />
        </div>
      </div>

      {/* Start Button / Skip Countdown */}
      <div className="w-full pt-4">
        <StickerButton
          variant="primary"
          size="lg"
          className="w-full text-xl flex items-center justify-center gap-2"
          onClick={onStartQuiz}
        >
          <span>{lang === "id" ? "Mulai Jawab Soal" : "Start Answering"}</span>
          <FastForward className="w-5 h-5" />
        </StickerButton>
      </div>
    </div>
  );
};
