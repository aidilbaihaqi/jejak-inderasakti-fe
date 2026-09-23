import React, { useState } from "react";
import { LogoInderasakti } from "../assets/LogoInderasakti";
import { PaperCard } from "../ui/PaperCard";
import { StickerButton } from "../ui/StickerButton";
import { KeyRound, Mail, ShieldCheck, ArrowRight } from "lucide-react";

interface HostLoginProps {
  onLoginSuccess: (hostEmail: string) => void;
  onBackToPlayer: () => void;
}

export const HostLogin: React.FC<HostLoginProps> = ({
  onLoginSuccess,
  onBackToPlayer,
}) => {
  const [email, setEmail] = useState("guru.sejarah@penyengat.id");
  const [password, setPassword] = useState("indrasakti2026");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      onLoginSuccess(email);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[600px] p-5">
      {/* Top Header */}
      <div className="w-full text-center pt-2">
        <LogoInderasakti variant="full" />
      </div>

      {/* Login Card */}
      <div className="my-auto w-full py-4">
        <PaperCard
          variant="memo"
          washiTape
          washiTapeText="PORTAL GURU / HOST SESI"
          className="p-6 sm:p-7"
        >
          <div className="text-center mb-5">
            <h2 className="font-display font-black text-2xl text-tinta">
              Masuk Akun Host
            </h2>
            <p className="font-body text-xs text-coklat font-semibold mt-1">
              Gunakan akun panitia / guru yang telah didaftarkan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="flex items-center gap-1.5 font-display font-extrabold text-xs text-tinta mb-1.5">
                <Mail className="w-3.5 h-3.5 text-emas" />
                <span>Email Panitia / Guru</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border-2 border-tinta bg-kertas font-body font-bold text-sm text-tinta outline-none focus:bg-white focus:shadow-stiker-sm transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="flex items-center gap-1.5 font-display font-extrabold text-xs text-tinta mb-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emas" />
                <span>Kata Sandi (Password)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border-2 border-tinta bg-kertas font-body font-bold text-sm text-tinta outline-none focus:bg-white focus:shadow-stiker-sm transition-all"
              />
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-kraft/40 border border-tinta/30 text-[11px] font-body font-bold text-coklat">
              <ShieldCheck className="w-4 h-4 text-benar flex-shrink-0" />
              <span>Sesi terenkripsi & siap terhubung ke proyektor kelas.</span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <StickerButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full text-lg"
              >
                Masuk Dashboard Host ➔
              </StickerButton>
            </div>
          </form>
        </PaperCard>
      </div>

      {/* Switch to Player Mode */}
      <div className="w-full text-center pt-2">
        <button
          type="button"
          onClick={onBackToPlayer}
          className="font-body text-xs font-bold text-coklat hover:text-tinta underline decoration-dashed"
        >
          ← Kembali ke Halaman Peserta Kuis
        </button>
      </div>
    </div>
  );
};
