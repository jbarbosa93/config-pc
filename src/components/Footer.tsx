"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border py-6 px-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary">
        <span>&copy; 2026 config-pc.ch — {t("footer.rights")}</span>
        <div className="flex items-center gap-4">
          <Link
            href="/support"
            className="hover:text-text transition-colors duration-150"
          >
            Support
          </Link>
          <Link
            href="/mentions-legales"
            className="hover:text-text transition-colors duration-150"
          >
            {t("footer.legal")}
          </Link>
          <Link
            href="/politique-confidentialite"
            className="hover:text-text transition-colors duration-150"
          >
            {t("footer.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
