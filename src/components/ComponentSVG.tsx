"use client";

import { useState } from "react";

/**
 * Shared animated SVG icons — one per component type.
 * Used as fallback everywhere a product image is missing.
 */
export function ComponentSVG({ type, size = 80 }: { type: string; size?: number }) {
  const key = type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const s = size;

  if (key.includes("cpu") || key.includes("processeur")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="20" y="20" width="40" height="40" rx="5" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5"/>
      <rect x="28" y="28" width="24" height="24" rx="3" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1"/>
      <rect x="34" y="34" width="12" height="12" rx="2" fill="#3B82F6" opacity="0.3" stroke="#3B82F6" strokeWidth="0.8">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite"/>
      </rect>
      {[30,40,50].map(x => <line key={`t${x}`} x1={x} y1="20" x2={x} y2="11" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>)}
      {[30,40,50].map(x => <line key={`b${x}`} x1={x} y1="60" x2={x} y2="69" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>)}
      {[30,40,50].map(y => <line key={`l${y}`} x1="20" y1={y} x2="11" y2={y} stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>)}
      {[30,40,50].map(y => <line key={`r${y}`} x1="60" y1={y} x2="69" y2={y} stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>)}
    </svg>
  );

  if (key.includes("gpu") || key.includes("graphi") || key.includes("carte graph")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="8" y="22" width="64" height="36" rx="5" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5"/>
      <rect x="8" y="17" width="22" height="5" rx="2" fill="#10B981" opacity="0.2" stroke="#10B981" strokeWidth="0.8"/>
      <g className="animate-spin-slow" style={{transformOrigin:"28px 40px"}}>
        <circle cx="28" cy="40" r="11" stroke="#10B981" strokeWidth="1"/>
        <circle cx="28" cy="40" r="5" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="28" y1="29" x2="28" y2="34" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="28" y1="46" x2="28" y2="51" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="17" y1="40" x2="22" y2="40" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="34" y1="40" x2="39" y2="40" stroke="#10B981" strokeWidth="0.8"/>
      </g>
      <g className="animate-spin-slow" style={{transformOrigin:"54px 40px"}}>
        <circle cx="54" cy="40" r="11" stroke="#10B981" strokeWidth="1"/>
        <circle cx="54" cy="40" r="5" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="54" y1="29" x2="54" y2="34" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="54" y1="46" x2="54" y2="51" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="43" y1="40" x2="48" y2="40" stroke="#10B981" strokeWidth="0.8"/>
        <line x1="60" y1="40" x2="65" y2="40" stroke="#10B981" strokeWidth="0.8"/>
      </g>
      {[18,28,38].map(x => <line key={x} x1={x} y1="58" x2={x} y2="66" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round"/>)}
    </svg>
  );

  if (key.includes("ram") || key.includes("memoire") || key.includes("memory")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="10" y="24" width="60" height="32" rx="4" fill="#F5F3FF" stroke="#8B5CF6" strokeWidth="1.5"/>
      <rect x="10" y="19" width="12" height="5" rx="2" fill="#8B5CF6" opacity="0.15" stroke="#8B5CF6" strokeWidth="0.8"/>
      {[16,28,40,52].map((x,i) => (
        <rect key={x} x={x} y="30" width="8" height="16" rx="1.5" fill="#8B5CF6" stroke="#8B5CF6" strokeWidth="0.6" opacity="0.15">
          <animate attributeName="opacity" values="0.1;0.3;0.1" dur="1.5s" begin={`${i*0.3}s`} repeatCount="indefinite"/>
        </rect>
      ))}
      {[16,24,32,40,48,56,64].map(x => <line key={x} x1={x} y1="56" x2={x} y2="63" stroke="#8B5CF6" strokeWidth="1" strokeLinecap="round"/>)}
    </svg>
  );

  if (key.includes("ssd") || key.includes("stockage") || key.includes("storage") || key.includes("nvme") || key.includes("m.2")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="12" y="28" width="56" height="24" rx="4" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.5"/>
      <rect x="18" y="33" width="18" height="14" rx="2" fill="#F59E0B" opacity="0.15" stroke="#F59E0B" strokeWidth="0.8"/>
      <rect x="42" y="35" width="10" height="10" rx="1.5" fill="#F59E0B" opacity="0.1" stroke="#F59E0B" strokeWidth="0.8"/>
      <circle cx="60" cy="40" r="3.5" stroke="#F59E0B" strokeWidth="0.8"/>
      <circle cx="60" cy="40" r="1" fill="#F59E0B">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite"/>
      </circle>
      <path d="M22 34L28 34L28 39" stroke="#F59E0B" strokeWidth="0.6" opacity="0.5"/>
      <path d="M20 43L32 43" stroke="#F59E0B" strokeWidth="0.6" opacity="0.5"/>
    </svg>
  );

  if (key.includes("carte mere") || key.includes("motherboard")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="14" y="10" width="52" height="60" rx="4" fill="#ECFDF5" stroke="#065F46" strokeWidth="1.5"/>
      <rect x="22" y="16" width="20" height="14" rx="2.5" fill="#065F46" opacity="0.1" stroke="#065F46" strokeWidth="1"/>
      <rect x="27" y="20" width="10" height="6" rx="1.5" fill="#065F46" opacity="0.2"/>
      <rect x="22" y="38" width="10" height="8" rx="1.5" fill="#065F46" opacity="0.08" stroke="#065F46" strokeWidth="0.8"/>
      <rect x="36" y="38" width="10" height="8" rx="1.5" fill="#065F46" opacity="0.08" stroke="#065F46" strokeWidth="0.8"/>
      <rect x="22" y="52" width="24" height="10" rx="2" stroke="#065F46" strokeWidth="0.8" strokeDasharray="3 2"/>
      <circle cx="54" cy="20" r="3" fill="#065F46" opacity="0.15" stroke="#065F46" strokeWidth="0.8"/>
      <circle cx="54" cy="32" r="3" fill="#065F46" opacity="0.15" stroke="#065F46" strokeWidth="0.8"/>
      {[42,46,50].map(y => <line key={y} x1="50" y1={y} x2="58" y2={y} stroke="#065F46" strokeWidth="0.8" strokeLinecap="round"/>)}
    </svg>
  );

  if (key.includes("alimentation") || key.includes("power") || key.includes("psu")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="14" y="18" width="52" height="44" rx="5" fill="#FEFCE8" stroke="#EAB308" strokeWidth="1.5"/>
      <circle cx="40" cy="40" r="15" fill="#EAB308" opacity="0.08" stroke="#EAB308" strokeWidth="1"/>
      <path d="M43 30L37 41H43L37 52" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
      </path>
      <rect x="14" y="62" width="10" height="4" rx="1.5" fill="#EAB308" opacity="0.2" stroke="#EAB308" strokeWidth="0.8"/>
      <rect x="28" y="62" width="10" height="4" rx="1.5" fill="#EAB308" opacity="0.2" stroke="#EAB308" strokeWidth="0.8"/>
      <circle cx="58" cy="24" r="2" fill="#EAB308" opacity="0.4"/>
    </svg>
  );

  if (key.includes("boitier") || key.includes("boîtier") || key.includes("case") || key.includes("tour")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="20" y="8" width="40" height="64" rx="5" fill="#F9FAFB" stroke="#6B7280" strokeWidth="1.5"/>
      <rect x="26" y="14" width="28" height="24" rx="3" fill="#6B7280" opacity="0.05" stroke="#6B7280" strokeWidth="0.8"/>
      <rect x="30" y="18" width="20" height="16" rx="2" fill="#6B7280" opacity="0.08">
        <animate attributeName="opacity" values="0.05;0.15;0.05" dur="3s" repeatCount="indefinite"/>
      </rect>
      <line x1="26" y1="44" x2="54" y2="44" stroke="#6B7280" strokeWidth="0.8" opacity="0.3"/>
      <rect x="28" y="48" width="24" height="3" rx="1" fill="#6B7280" opacity="0.1" stroke="#6B7280" strokeWidth="0.5"/>
      <rect x="28" y="54" width="24" height="3" rx="1" fill="#6B7280" opacity="0.1" stroke="#6B7280" strokeWidth="0.5"/>
      <circle cx="40" cy="66" r="2.5" stroke="#6B7280" strokeWidth="1"/>
      <circle cx="27" cy="12" r="1.2" fill="#6B7280" opacity="0.4"/>
    </svg>
  );

  if (key.includes("refroidissement") || key.includes("cooler") || key.includes("ventil") || key.includes("cooling")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="28" fill="#ECFEFF" stroke="#06B6D4" strokeWidth="1.5"/>
      <g className="animate-spin-slow" style={{transformOrigin:"40px 40px"}}>
        <circle cx="40" cy="40" r="7" fill="#06B6D4" opacity="0.15" stroke="#06B6D4" strokeWidth="1"/>
        <path d="M40 12C40 12 45 26 40 33" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M40 68C40 68 35 54 40 47" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 40C12 40 26 35 33 40" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M68 40C68 40 54 45 47 40" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 20C20 20 30 27 34 34" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M60 60C60 60 50 53 46 46" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M60 20C60 20 53 30 46 34" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 60C20 60 27 50 34 46" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    </svg>
  );

  if (key.includes("moniteur") || key.includes("ecran") || key.includes("monitor")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="10" y="12" width="60" height="40" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5"/>
      <rect x="14" y="16" width="52" height="32" rx="2" fill="#3B82F6" opacity="0.08"/>
      <line x1="14" y1="44" x2="66" y2="44" stroke="#3B82F6" strokeWidth="0.8" opacity="0.3"/>
      <rect x="30" y="52" width="20" height="4" rx="1.5" fill="#3B82F6" opacity="0.15" stroke="#3B82F6" strokeWidth="0.8"/>
      <rect x="25" y="56" width="30" height="3" rx="1.5" fill="#3B82F6" opacity="0.1" stroke="#3B82F6" strokeWidth="0.6"/>
      <circle cx="40" cy="32" r="6" fill="#3B82F6" opacity="0.1">
        <animate attributeName="opacity" values="0.05;0.15;0.05" dur="2s" repeatCount="indefinite"/>
      </circle>
      <rect x="18" y="20" width="8" height="5" rx="1" fill="#3B82F6" opacity="0.12"/>
    </svg>
  );

  if (key.includes("souris") || key.includes("mouse")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="24" y="12" width="32" height="52" rx="16" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5"/>
      <line x1="40" y1="12" x2="40" y2="32" stroke="#10B981" strokeWidth="1" opacity="0.3"/>
      <rect x="36" y="18" width="8" height="12" rx="4" fill="#10B981" opacity="0.12" stroke="#10B981" strokeWidth="0.8"/>
      <circle cx="40" cy="24" r="2" fill="#10B981" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <ellipse cx="40" cy="48" rx="10" ry="8" fill="#10B981" opacity="0.05"/>
      <circle cx="32" cy="40" r="1.5" fill="#10B981" opacity="0.2"/>
      <circle cx="48" cy="40" r="1.5" fill="#10B981" opacity="0.2"/>
    </svg>
  );

  if (key.includes("clavier") || key.includes("keyboard")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="6" y="26" width="68" height="32" rx="5" fill="#F5F3FF" stroke="#8B5CF6" strokeWidth="1.5"/>
      {[14,22,30,38,46,54,62].map((x,i) => (
        <rect key={`k1${x}`} x={x} y="32" width="6" height="6" rx="1" fill="#8B5CF6" opacity="0.12" stroke="#8B5CF6" strokeWidth="0.5">
          <animate attributeName="opacity" values="0.08;0.2;0.08" dur="2s" begin={`${i*0.2}s`} repeatCount="indefinite"/>
        </rect>
      ))}
      {[18,26,34,42,50,58].map(x => (
        <rect key={`k2${x}`} x={x} y="40" width="6" height="6" rx="1" fill="#8B5CF6" opacity="0.1" stroke="#8B5CF6" strokeWidth="0.5"/>
      ))}
      <rect x="22" y="48" width="36" height="5" rx="1.5" fill="#8B5CF6" opacity="0.08" stroke="#8B5CF6" strokeWidth="0.5"/>
    </svg>
  );

  if (key.includes("casque") || key.includes("headset") || key.includes("headphone")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <path d="M20 42C20 28.745 30.745 18 44 18H36C49.255 18 60 28.745 60 42" stroke="#EF4444" strokeWidth="2" fill="none"/>
      <rect x="16" y="38" width="10" height="18" rx="5" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5"/>
      <rect x="54" y="38" width="10" height="18" rx="5" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5"/>
      <rect x="18" y="42" width="6" height="10" rx="3" fill="#EF4444" opacity="0.15">
        <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2s" repeatCount="indefinite"/>
      </rect>
      <rect x="56" y="42" width="6" height="10" rx="3" fill="#EF4444" opacity="0.15">
        <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2s" begin="0.5s" repeatCount="indefinite"/>
      </rect>
      <path d="M22 56L22 62C22 64 24 66 26 66L30 66" stroke="#EF4444" strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
    </svg>
  );

  if (key.includes("chaise") || key.includes("chair") || key.includes("siege")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <path d="M28 16C28 14 30 12 32 12H48C50 12 52 14 52 16V44H28V16Z" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.5"/>
      <rect x="26" y="44" width="28" height="8" rx="2" fill="#F59E0B" opacity="0.15" stroke="#F59E0B" strokeWidth="1"/>
      <path d="M30 52V60" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M50 52V60" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M26 60L30 60" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M50 60L54 60" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="28" cy="62" r="2" fill="#F59E0B" opacity="0.3"/>
      <circle cx="52" cy="62" r="2" fill="#F59E0B" opacity="0.3"/>
      <rect x="24" y="20" width="4" height="16" rx="2" fill="#F59E0B" opacity="0.1" stroke="#F59E0B" strokeWidth="0.8"/>
      <rect x="52" y="20" width="4" height="16" rx="2" fill="#F59E0B" opacity="0.1" stroke="#F59E0B" strokeWidth="0.8"/>
    </svg>
  );

  if (key.includes("tapis") || key.includes("mousepad") || key.includes("deskpad")) return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="8" y="24" width="64" height="32" rx="4" fill="#F9FAFB" stroke="#6B7280" strokeWidth="1.5"/>
      <rect x="12" y="28" width="56" height="24" rx="2" fill="#6B7280" opacity="0.04"/>
      {[20,32,44,56].map((x,i) => (
        <line key={x} x1={x} y1="30" x2={x} y2="50" stroke="#6B7280" strokeWidth="0.3" opacity="0.15">
          <animate attributeName="opacity" values="0.1;0.2;0.1" dur="3s" begin={`${i*0.5}s`} repeatCount="indefinite"/>
        </line>
      ))}
      <rect x="48" y="32" width="14" height="20" rx="7" stroke="#6B7280" strokeWidth="0.8" opacity="0.2"/>
    </svg>
  );

  // Default fallback
  return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <rect x="20" y="20" width="40" height="40" rx="5" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.5"/>
      <rect x="30" y="30" width="20" height="20" rx="3" fill="#9CA3AF" opacity="0.1" stroke="#9CA3AF" strokeWidth="1"/>
      {[30,40,50].map(x => <line key={`t${x}`} x1={x} y1="20" x2={x} y2="12" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round"/>)}
      {[30,50].map(x => <line key={`b${x}`} x1={x} y1="60" x2={x} y2="68" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round"/>)}
    </svg>
  );
}

/**
 * Tries to show a real product image URL.
 * Falls back to ComponentSVG on load error or when no URL is provided.
 */
export function ComponentImage({
  url,
  alt,
  type,
  size = 80,
  className = "",
}: {
  url?: string | null;
  alt: string;
  type: string;
  size?: number;
  className?: string;
}) {
  const [error, setError] = useState(false);

  if (!url || error) {
    return <ComponentSVG type={type} size={size} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className={className || "w-full h-full object-contain"}
      onError={() => setError(true)}
    />
  );
}
