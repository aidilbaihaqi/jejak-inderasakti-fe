import React, { useState, useEffect } from "react";
import { PaperCard } from "../ui/PaperCard";
import { StickerButton } from "../ui/StickerButton";
import { AvatarIcon, AVATAR_LIST } from "../assets/AvatarCollection";
import { ArrowLeft, School as SchoolIcon, User, CheckCircle2, Shuffle, Loader2 } from "lucide-react";
import { getSchools, School } from "@/lib/api";

interface RegistrationProps {
  name: string;
  setName: (name: string) => void;
  school: string;
  setSchool: (school: string) => void;
  schoolId?: number | null;
  setSchoolId?: (id: number | null) => void;
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

const FALLBACK_SCHOOLS: { id: number | null; name: string }[] = [
  { id: 1, name: "Sekolah lain" },
  { id: 2, name: "Umum / General visitor" },
  { id: null, name: "SDN 001 Tanjungpinang Kota" },
  { id: null, name: "SDN 002 Tanjungpinang Barat" },
  { id: null, name: "SMPN 1 Tanjungpinang" },
  { id: null, name: "SMPN 2 Tanjungpinang" },
  { id: null, name: "SMAN 1 Tanjungpinang" },
  { id: null, name: "SMAN 2 Tanjungpinang" },
];

export const Registration: React.FC<RegistrationProps> = ({
  name,
  setName,
  school,
  setSchool,
  schoolId,
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
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [apiSchools, setApiSchools] = useState<School[]>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingSchools(true);
    getSchools()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setApiSchools(data);
        }
      })
      .catch((err) => {
        console.warn("Could not load schools from API, using fallback:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingSchools(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const schoolList: { id: number | null; name: string; jenjang?: string | null }[] = [
    ...apiSchools,
    ...FALLBACK_SCHOOLS.filter((fb) => !apiSchools.some((as) => as.name === fb.name)),
  ];

  const filteredSchools = school.trim()
    ? schoolList.filter((s) =>
        s.name.toLowerCase().includes(school.trim().toLowerCase())
      )
    : schoolList;

  const isFormValid = name.trim().length >= 2 && school.trim().length >= 2;

  const handleRandomAvatar = () => {
    const randomIdx = Math.floor(Math.random() * AVATAR_LIST.length);
    setAvatarId(AVATAR_LIST[randomIdx].id);
  };

  const classOptions =
    gradeLevel === "SD"
      ? ["4", "5", "6"]
      : gradeLevel === "SMP"
      ? ["7", "8", "9"]
      : gradeLevel === "SMA"
      ? ["10", "11", "12"]
      : ["-"];

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

          {/* School Input */}
          <div className="relative">
            <label className="flex items-center gap-1.5 font-display font-extrabold text-sm text-tinta mb-1">
              <SchoolIcon className="w-4 h-4 text-emas" />
              <span>{lang === "id" ? "Asal Sekolah" : "School"}</span>
              <span className="text-salah">*</span>
              {isLoadingSchools && (
                <Loader2 className="w-3 h-3 text-coklat animate-spin ml-1" />
              )}
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => {
                setSchool(e.target.value);
                setSchoolId?.(null);
                setShowSchoolDropdown(true);
              }}
              onFocus={() => setShowSchoolDropdown(true)}
              placeholder={lang === "id" ? "Pilih atau ketik asal sekolah" : "Select or type school"}
              className="w-full px-3 py-1.5 rounded-xl border-2 border-tinta bg-kertas font-body font-bold text-sm text-tinta outline-none focus:bg-white focus:shadow-stiker-sm transition-all"
            />

            {showSchoolDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-44 overflow-y-auto bg-kertas-putih border-2 border-tinta rounded-xl shadow-stiker z-30 divide-y divide-kraft">
                {filteredSchools.map((item) => (
                  <button
                    key={`${item.id}-${item.name}`}
                    type="button"
                    onClick={() => {
                      setSchool(item.name);
                      setSchoolId?.(item.id);
                      setShowSchoolDropdown(false);
                    }}
                    className="w-full px-3.5 py-2 text-left font-body text-xs font-bold text-tinta hover:bg-kuning/30 transition-colors flex items-center justify-between"
                  >
                    <span>{item.name}</span>
                    {item.jenjang && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-kraft/60 font-label">
                        {item.jenjang}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Level & Class Pickers */}
          <div className="grid grid-cols-2 gap-3 pt-0.5">
            <div>
              <span className="block font-display font-extrabold text-xs text-tinta mb-1">
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

            <div>
              <span className="block font-display font-extrabold text-xs text-tinta mb-1">
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
