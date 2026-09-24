import React, { useMemo } from "react";
import { PaperCard } from "../ui/PaperCard";
import { StickerButton } from "../ui/StickerButton";
import { AvatarIcon, AVATAR_LIST } from "../assets/AvatarCollection";
import { ArrowLeft, School as SchoolIcon, User, CheckCircle2, Shuffle, GraduationCap } from "lucide-react";

interface RegistrationProps {
  name: string;
  setName: (name: string) => void;
  school: string;
  setSchool: (school: string) => void;
  schoolId?: number | null;
  setSchoolId?: (id: number | null) => void;
  gradeLevel: string;
  setGradeLevel: (level: string) => void;
  gradeClass: string;
  setGradeClass: (cls: string) => void;
  avatarId: string;
  setAvatarId: (id: string) => void;
  onReady: () => void;
  onBack: () => void;
  lang: "id" | "en";
}

export const Registration: React.FC<RegistrationProps> = ({
  name,
  setName,
  school,
  setSchool,
  setSchoolId,
  gradeLevel,
  setGradeLevel,
  gradeClass,
  setGradeClass,
  avatarId,
  setAvatarId,
  onReady,
  onBack,
  lang,
}) => {
  // Determine if participant is "Umum" based on school text input or gradeLevel
  const isUmum = useMemo(() => {
    const s = school.trim().toLowerCase();
    return s.includes("umum") || s.includes("general visitor") || gradeLevel === "UMUM";
  }, [school, gradeLevel]);

  const isFormValid =
    name.trim().length >= 2 &&
    school.trim().length >= 2 &&
    (isUmum || gradeLevel.trim().length > 0);

  const handleRandomAvatar = () => {
    const randomIdx = Math.floor(Math.random() * AVATAR_LIST.length);
    setAvatarId(AVATAR_LIST[randomIdx].id);
  };

  const handleSchoolChange = (val: string) => {
    setSchool(val);
    const lower = val.trim().toLowerCase();
    if (lower.includes("umum") || lower.includes("general visitor")) {
      setSchoolId?.(2);
      setGradeLevel("UMUM");
      setGradeClass("-");
    } else {
      setSchoolId?.(null);
      if (gradeLevel === "UMUM") {
        setGradeLevel("SMP");
        setGradeClass("8");
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between h-full max-h-full px-3 py-1.5 min-h-0 overflow-hidden pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <button
          type="button"
          onClick={onBack}
          className="px-2.5 py-1 rounded-xl border-2 border-tinta bg-kertas-putih flex items-center gap-1 text-xs font-display font-black text-tinta btn-pressable shadow-stiker-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === "id" ? "Kembali" : "Back"}</span>
        </button>

        <span className="font-label text-xs font-bold text-coklat bg-kraft/60 px-2.5 py-0.5 rounded-full border border-tinta/30">
          ✦ Profil Pemain ✦
        </span>
      </div>

      {/* Quizizz Avatar Spotlight in Center */}
      <div className="flex flex-col items-center my-0.5">
        <div className="relative">
          <AvatarIcon id={avatarId} size={54} selected />
          <button
            type="button"
            onClick={handleRandomAvatar}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-kuning border-2 border-tinta flex items-center justify-center shadow-stiker-sm btn-pressable"
            title="Acak Avatar"
          >
            <Shuffle className="w-3 h-3 text-tinta" />
          </button>
        </div>
      </div>

      {/* Form Card */}
      <div className="space-y-2 my-auto">
        <PaperCard variant="memo" className="p-3 sm:p-4 space-y-2.5">
          {/* Nickname Input */}
          <div>
            <label className="flex items-center gap-1.5 font-display font-extrabold text-xs text-tinta mb-0.5">
              <User className="w-3.5 h-3.5 text-emas" />
              <span>{lang === "id" ? "Nama Panggilan di Game" : "Your Nickname"}</span>
              <span className="text-salah">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "id" ? "Ketik nama panggilanmu (mis: Bimo)" : "Enter nickname (e.g. Bimo)"}
              maxLength={15}
              className="w-full px-3 py-1.5 rounded-xl border-2 border-tinta bg-kertas font-body font-bold text-sm text-tinta outline-none focus:bg-white focus:shadow-stiker-sm transition-all"
            />
          </div>

          {/* School Input: Pure text input, no dropdown */}
          <div>
            <label className="flex items-center gap-1.5 font-display font-extrabold text-sm text-tinta mb-1">
              <SchoolIcon className="w-4 h-4 text-emas" />
              <span>{lang === "id" ? "Asal Sekolah / Instansi / Umum" : "School / Institution / Public"}</span>
              <span className="text-salah">*</span>
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => handleSchoolChange(e.target.value)}
              placeholder={
                lang === "id"
                  ? "Ketik asal sekolah / instansi / umum"
                  : "Type school / institution / public"
              }
              maxLength={60}
              className="w-full px-3 py-1.5 rounded-xl border-2 border-tinta bg-kertas font-body font-bold text-sm text-tinta outline-none focus:bg-white focus:shadow-stiker-sm transition-all"
            />
          </div>

          {/* Level & Class Pickers: Both Text Inputs, Hidden if participant is Umum */}
          {!isUmum ? (
            <div className="grid grid-cols-2 gap-3 pt-0.5 animate-fadeIn">
              <div>
                <label className="flex items-center gap-1 font-display font-extrabold text-xs text-tinta mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emas" />
                  <span>{lang === "id" ? "Jenjang Sekolah" : "School Level"}</span>
                  <span className="text-salah">*</span>
                </label>
                <input
                  type="text"
                  value={gradeLevel === "UMUM" ? "" : gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  placeholder={lang === "id" ? "Contoh: SMP / SMA / SD" : "e.g. SMP / SMA / SD"}
                  maxLength={15}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-tinta bg-kertas font-body font-bold text-sm text-tinta outline-none focus:bg-white focus:shadow-stiker-sm transition-all"
                />
              </div>

              <div>
                <label className="block font-display font-extrabold text-xs text-tinta mb-1">
                  <span>{lang === "id" ? "Kelas" : "Class"}</span>
                  <span className="text-coklat text-[10px] ml-1 font-normal">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={gradeClass === "-" ? "" : gradeClass}
                  onChange={(e) => setGradeClass(e.target.value)}
                  placeholder={lang === "id" ? "Contoh: 7, 8A, 10" : "e.g. 7, 8A, 10"}
                  maxLength={10}
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-tinta bg-kertas font-body font-bold text-sm text-tinta outline-none focus:bg-white focus:shadow-stiker-sm transition-all"
                />
              </div>
            </div>
          ) : (
            <div className="py-1.5 px-3 rounded-xl bg-kraft/40 border border-tinta/20 flex items-center justify-between text-xs text-coklat font-semibold animate-fadeIn">
              <span>{lang === "id" ? "Kategori Peserta:" : "Category:"}</span>
              <span className="font-display font-black text-tinta px-2.5 py-0.5 rounded-lg bg-kuning border border-tinta text-[11px] shadow-xs">
                {lang === "id" ? "Pengunjung Umum" : "General Visitor"}
              </span>
            </div>
          )}
        </PaperCard>

        {/* 12 Avatar Grid Selector */}
        <PaperCard variant="memo" className="p-2 sm:p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-display font-extrabold text-xs text-tinta">
              {lang === "id" ? "Pilihan Karakter (12)" : "Avatar Options (12)"}
            </span>
            <span className="font-label text-[10px] text-coklat font-bold">
              #{avatarId} Terpilih
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1.5 justify-items-center">
            {AVATAR_LIST.map((avatar) => {
              const isSelected = avatar.id === avatarId;
              return (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setAvatarId(avatar.id)}
                  className="relative group p-0.5 rounded-full transition-transform focus:outline-none"
                  title={avatar.name}
                >
                  <AvatarIcon id={avatar.id} size={32} selected={isSelected} />
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-tinta fill-kuning absolute -bottom-1 -right-1 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </PaperCard>
      </div>

      {/* Sticky Bottom Enter Lobby Button */}
      <div className="w-full pt-1.5">
        <StickerButton
          variant="primary"
          size="md"
          className="w-full text-lg py-2 flex items-center justify-center gap-2"
          onClick={onReady}
          disabled={!isFormValid}
        >
          <span>{lang === "id" ? "Masuk ke Ruang Tunggu ➔" : "Enter Lobby ➔"}</span>
        </StickerButton>
      </div>
    </div>
  );
};
