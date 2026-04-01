"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage, LANGUAGES, type Lang } from "@/lib/i18n";

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  function selectLang(code: Lang) {
    console.log("[LanguageSelector] switching to:", code);
    setLang(code);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs font-medium text-text-secondary hover:text-text hover:border-border-hover transition-colors duration-150"
      >
        <span>{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <svg
          className={`ml-0.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          width="10" height="10" viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-bg border border-border rounded-xl overflow-hidden shadow-lg z-[100] min-w-[160px]">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                selectLang(l.code);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-left transition-colors duration-150 ${
                lang === l.code
                  ? "bg-accent text-white"
                  : "hover:bg-card text-text"
              }`}
            >
              <span>{l.flag}</span>
              <span className="font-medium">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
