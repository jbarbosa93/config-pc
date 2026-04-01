"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { PCConfig3D } from "@/components/PCViewer3D";

const PCViewer3D = dynamic(() => import("@/components/PCViewer3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center" style={{ background: "#0d0d14" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin" />
        <p className="text-gray-400 text-sm">Chargement du visualiseur 3D…</p>
      </div>
    </div>
  ),
});

function VisualiserContent() {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<PCConfig3D | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Config passed via sessionStorage (set before navigating here)
    try {
      const raw = sessionStorage.getItem("pc3d_config");
      if (raw) {
        setConfig(JSON.parse(raw));
        return;
      }
    } catch {}

    // Fallback: try query param
    const encoded = searchParams.get("config");
    if (encoded) {
      try {
        setConfig(JSON.parse(decodeURIComponent(encoded)));
        return;
      } catch {}
    }

    setError(true);
  }, [searchParams]);

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center" style={{ background: "#0d0d14" }}>
        <div className="text-center">
          <p className="text-gray-300 mb-4">Aucune configuration trouvée.</p>
          <a href="/" className="text-blue-400 hover:text-blue-300 text-sm underline">
            Retour au configurateur
          </a>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="w-full h-screen flex items-center justify-center" style={{ background: "#0d0d14" }}>
        <div className="w-10 h-10 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <PCViewer3D
        config={config}
        onBack={() => window.history.back()}
      />
    </div>
  );
}

export default function VisualiserPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center" style={{ background: "#0d0d14" }}>
        <div className="w-10 h-10 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin" />
      </div>
    }>
      <VisualiserContent />
    </Suspense>
  );
}
