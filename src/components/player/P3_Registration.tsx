import React, { useState } from "react";
import { PaperCard } from "../ui/PaperCard";
import { StickerButton } from "../ui/StickerButton";
import { AvatarIcon, AVATAR_LIST } from "../assets/AvatarCollection";
import { ArrowLeft, School, User, CheckCircle2 } from "lucide-react";

interface P3Props {
  name: string;
  setName: (name: string) => void;
  school: string;
  setSchool: (school: string) => void;
  gradeLevel: "SD" | "SMP" | "SMA" | "UMUM";
  setGradeLevel: (level: "SD" | "SMP" | "SMA" | "UMUM") => void;
  gradeClass: string;
  setGradeClass: (cls: string) => void;
  avatarId: string;
  setAvatarId: (id: string) => void;
  onReady: () => void;
  onBack: () => void;
  lang: "id" | "en";
}

const COMMON_SCHOOLS = [
  "SDN 001 Tanjungpinang Kota",
  "SDN 002 Tanjungpinang Barat",
  "SMPN 1 Tanjungpinang",
  "SMPN 2 Tanjungpinang",
  "SMAN 1 Tanjungpinang",
  "SMAN 2 Tanjungpinang",
  "Sekolah Lain",
  "Umum / Pengunjung",
];

export const P3_Registration: React.FC<P3Props> = ({
  name,
  setName,
  school,
  setSchool,
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
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);

  const isFormValid = name.trim().length >= 2 && school.trim().length >= 2;

  const classOptions =
    gradeLevel === "SD"
      ? ["4", "5", "6"]
      : gradeLevel === "SMP"
      ? ["7", "8", "9"]
      : gradeLevel === "SMA"
      ? ["10", "11", "12"]
      : ["-"];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[640px] p-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-xl border-2 border-tinta bg-kertas-putih flex items-center justify-center text-tinta btn-pressable shadow-stiker-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-label text-xs font-bold uppercase tracking-wider text-coklat bg-kraft px-3 py-1 rounded-full border border-tinta">
          {lang === "id" ? "PENDAFTARAN PESERTA" : "PLAYER REGISTRATION"}
        </span>
        <div className="w-10" />
      </div>

      {/* Registration Form Card */}
      <div className="flex-1 space-y-4">
        {/* Name & School Card */}
        <PaperCard variant="memo" className="p-4 sm:p-5 space-y-4">
          {/* Nickname Input */}
          <div>
            <label className="flex items-center gap-1.5 font-display font-extrabold text-sm text-tinta mb-1.5">
              <User className="w-4 h-4 text-emas" />
              <span>{lang === "id" ? "Nama Panggilan" : "Nickname"}</span>
              <span className="text-salah">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "id" ? "Contoh: Bimo" : "e.g. Bimo"}
              maxLength={15}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-tinta bg-kertas font-body font-bold text-base text-tinta outline-none focus:bg-white focus:shadow-stiker-sm transition-all"
            />
          </div>

          {/* School Input with Quick Picker */}
          <div className="relative">
            <label className="flex items-center gap-1.5 font-display font-extrabold text-sm text-tinta mb-1.5">
              <School className="w-4 h-4 text-emas" />
              <span>{lang === "id" ? "Asal Sekolah" : "School / Institute"}</span>
              <span className="text-salah">*</span>
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              onFocus={() => setShowSchoolDropdown(true)}
              placeholder={lang === "id" ? "Pilih atau ketik nama sekolah" : "Select or type school name"}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-tinta bg-kertas font-body font-bold text-base text-tinta outline-none focus:bg-white focus:shadow-stiker-sm transition-all"
            />

            {/* School Suggestions Dropdown */}
            {showSchoolDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-44 overflow-y-auto bg-kertas-putih border-2 border-tinta rounded-xl shadow-stiker z-30 divide-y divide-kraft">
                {COMMON_SCHOOLS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setSchool(item);
                      setShowSchoolDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left font-body text-xs sm:text-sm font-semibold text-tinta hover:bg-kuning/30 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Level & Class Pickers */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Grade Level SD/SMP/SMA */}
            <div>
              <span className="block font-display font-extrabold text-xs text-tinta mb-1.5">
                {lang === "id" ? "Jenjang" : "Level"}
              </span>
              <div className="grid grid-cols-3 gap-1">
                {(["SD", "SMP", "SMA"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setGradeLevel(lvl);
                      setGradeClass(lvl === "SD" ? "5" : lvl === "SMP" ? "8" : "11");
                    }}
                    className={`py-1.5 rounded-lg border-2 border-tinta font-display font-black text-xs transition-all btn-pressable ${
                      gradeLevel === lvl
                        ? "bg-kuning text-tinta shadow-stiker-sm"
                        : "bg-kertas hover:bg-kraft/40 text-coklat"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Class Number */}
            <div>
              <span className="block font-display font-extrabold text-xs text-tinta mb-1.5">
                {lang === "id" ? "Kelas" : "Class"}
              </span>
              <div className="grid grid-cols-3 gap-1">
                {classOptions.map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setGradeClass(cls)}
                    className={`py-1.5 rounded-lg border-2 border-tinta font-label font-bold text-xs transition-all btn-pressable ${
                      gradeClass === cls
                        ? "bg-kuning text-tinta shadow-stiker-sm"
                        : "bg-kertas hover:bg-kraft/40 text-coklat"
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PaperCard>

        {/* Avatar Picker Card (12 avatars) */}
        <PaperCard variant="memo" className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display font-extrabold text-sm text-tinta">
              {lang === "id" ? "Pilih Karakter Avatar (12)" : "Choose Avatar (12)"}
            </span>
            <span className="font-label text-xs text-coklat font-bold">
              #{avatarId} Terpilih
            </span>
          </div>

          <div className="grid grid-cols-6 gap-2 sm:gap-3 justify-items-center">
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
                  <AvatarIcon id={avatar.id} size={44} selected={isSelected} />
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-tinta fill-kuning absolute -bottom-1 -right-1 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </PaperCard>
      </div>

      {/* Sticky Bottom Ready Button */}
      <div className="w-full pt-4 mt-auto">
        <StickerButton
          variant="primary"
          size="lg"
          className="w-full text-xl"
          onClick={onReady}
          disabled={!isFormValid}
        >
          {lang === "id" ? "Siap Jelajah! ➔" : "Ready to Explore! ➔"}
        </StickerButton>
      </div>
    </div>
  );
};
