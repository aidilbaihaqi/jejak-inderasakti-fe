import React, { useState } from "react";
import { LogoInderasakti } from "../assets/LogoInderasakti";
import { PaperCard } from "../ui/PaperCard";
import { StickerButton } from "../ui/StickerButton";
import { KeyRound, Mail, ShieldCheck, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { hostLogin } from "@/lib/api";

interface HostLoginProps {
  onLoginSuccess: (hostEmail: string, token: string) => void;
  onBackToPlayer: () => void;
}

export const HostLogin: React.FC<HostLoginProps> = ({
  onLoginSuccess,
  onBackToPlayer,
}) => {
  const [email, setEmail] = useState("host0@email.com");
  const [password, setPassword] = useState("host123456");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await hostLogin(email.trim(), password);
      onLoginSuccess(email.trim(), res.token);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal masuk. Periksa kembali email dan kata sandi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center min-h-full py-4 px-2 sm:px-4 space-y-4">
      {/* Top Header */}
      <div className="w-full flex justify-center pt-1">
        <LogoInderasakti variant="horizontal" />
      </div>

      {/* Login Card */}
      <div className="w-full">
        <PaperCard
          variant="memo"
          washiTape
          washiTapeText="PORTAL GURU / HOST SESI"
          className="p-4 sm:p-5"
        >
          <div className="text-center mb-3">
            <h2 className="font-display font-black text-xl sm:text-2xl text-tinta">
              Masuk Akun Host
            </h2>
            <p className="font-body text-xs text-coklat font-semibold mt-0.5">
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

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-salah/10 border-2 border-salah text-salah text-xs font-body font-bold flex items-center gap-1.5 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

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
                disabled={isLoading}
                className="w-full text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Menghubungkan...</span>
                  </>
                ) : (
                  <span>Masuk Dashboard Host ➔</span>
                )}
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
