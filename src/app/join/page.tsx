"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function JoinRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const pin = searchParams.get("pin");
    if (pin) {
      router.replace(`/?pin=${pin}`);
    } else {
      router.replace("/");
    }
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-kertas p-4 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-tinta border-t-emas rounded-full animate-spin" />
        <p className="font-display font-bold text-sm text-tinta">Menghubungkan ke Ruang Kuis...</p>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinRedirectInner />
    </Suspense>
  );
}
