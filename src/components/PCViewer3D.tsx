"use client";

import { useRef, useState, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Component } from "@/lib/types";

/* ─── Types ─── */

export interface PCConfig3D {
  components: Component[];
  configName: string;
}

interface LedZones {
  fans: boolean;
  strip: boolean;
  ram: boolean;
  cpu: boolean;
  gpu: boolean;
}

type LedMode = "static" | "pulse" | "rainbow";

interface LedState {
  on: boolean;
  color: string;
  mode: LedMode;
  zones: LedZones;
}

/* ─── Helpers ─── */

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

function useLedColor(led: LedState): THREE.Color {
  const colorRef = useRef(new THREE.Color());
  const hueRef = useRef(0);

  useFrame((_, delta) => {
    if (!led.on) { colorRef.current.set(0x000000); return; }
    if (led.mode === "rainbow") {
      hueRef.current = (hueRef.current + delta * 0.3) % 1;
      colorRef.current.setHSL(hueRef.current, 1, 0.5);
    } else {
      const [r, g, b] = hexToRgb(led.color);
      colorRef.current.setRGB(r, g, b);
    }
  });

  return colorRef.current;
}

/* ─── Fan component (animated) ─── */

function Fan({ position, radius = 0.055, led, zone }: {
  position: [number, number, number];
  radius?: number;
  led: LedState;
  zone: keyof LedZones;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ledColor = useLedColor(led);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.z -= delta * 3;
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshStandardMaterial;
      const active = led.on && led.zones[zone];
      if (led.mode === "pulse" && active) {
        const t = (Math.sin(Date.now() * 0.003) + 1) / 2;
        mat.emissiveIntensity = t * 2;
      } else {
        mat.emissiveIntensity = active ? 1.5 : 0;
      }
      if (active) mat.emissive.copy(ledColor);
      else mat.emissive.set(0x000000);
    }
  });

  return (
    <group position={position}>
      {/* Ring LED */}
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, 0.006, 8, 32]} />
        <meshStandardMaterial color="#333" emissive="#000" emissiveIntensity={0} />
      </mesh>
      {/* Blades */}
      <group ref={groupRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, 0, (i / 3) * Math.PI * 2]}>
            <boxGeometry args={[radius * 0.8, 0.015, 0.004]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        ))}
        <mesh>
          <cylinderGeometry args={[0.01, 0.01, 0.006, 12]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
    </group>
  );
}

/* ─── Case (mid-tower) ─── */

function Case({ led }: { led: LedState }) {
  const stripRef = useRef<THREE.Mesh>(null);
  const ledColor = useLedColor(led);

  useFrame(() => {
    if (stripRef.current) {
      const mat = stripRef.current.material as THREE.MeshStandardMaterial;
      const active = led.on && led.zones.strip;
      if (led.mode === "pulse" && active) {
        const t = (Math.sin(Date.now() * 0.003) + 1) / 2;
        mat.emissiveIntensity = t * 3;
      } else {
        mat.emissiveIntensity = active ? 2 : 0;
      }
      if (active) mat.emissive.copy(ledColor);
      else mat.emissive.set(0x000000);
    }
  });

  // Dimensions: W=0.22, H=0.45, D=0.44
  const W = 0.22, H = 0.45, D = 0.44;

  return (
    <group>
      {/* Back panel */}
      <mesh position={[0, 0, -D / 2]}>
        <boxGeometry args={[W, H, 0.008]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Front panel */}
      <mesh position={[0, 0, D / 2]}>
        <boxGeometry args={[W, H, 0.008]} />
        <meshStandardMaterial color="#111" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Top */}
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[W, 0.008, D]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -H / 2, 0]}>
        <boxGeometry args={[W, 0.008, D]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Right panel (solid) */}
      <mesh position={[W / 2, 0, 0]}>
        <boxGeometry args={[0.008, H, D]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Left panel — tempered glass */}
      <mesh position={[-W / 2, 0, 0]}>
        <boxGeometry args={[0.006, H - 0.02, D - 0.02]} />
        <meshPhysicalMaterial
          color="#a0c8ff"
          transparent
          opacity={0.18}
          roughness={0}
          metalness={0}
          transmission={0.9}
          thickness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Front mesh grille */}
      {[-0.06, 0, 0.06].map((z, i) => (
        <mesh key={i} position={[0, 0.1, D / 2 + 0.002]}>
          <boxGeometry args={[W * 0.5, 0.01, 0.002]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      ))}
      {/* Feet */}
      {[[-0.07, -0.07], [-0.07, 0.07], [0.07, -0.07], [0.07, 0.07]].map(([x, z], i) => (
        <mesh key={i} position={[x, -H / 2 - 0.012, z]}>
          <cylinderGeometry args={[0.012, 0.015, 0.025, 8]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
      ))}
      {/* LED strip at bottom interior */}
      <mesh ref={stripRef} position={[0, -H / 2 + 0.01, 0]}>
        <boxGeometry args={[W * 0.8, 0.006, D * 0.8]} />
        <meshStandardMaterial color="#111" emissive="#000" emissiveIntensity={0} />
      </mesh>
      {/* Front case fans */}
      <Fan position={[-W / 2 + 0.02, 0.08, D / 2 - 0.02]} led={led} zone="fans" />
      <Fan position={[-W / 2 + 0.02, -0.08, D / 2 - 0.02]} led={led} zone="fans" />
      {/* Rear exhaust fan */}
      <Fan position={[-W / 2 + 0.02, 0.12, -D / 2 + 0.02]} radius={0.04} led={led} zone="fans" />
    </group>
  );
}

/* ─── Motherboard ─── */

function Motherboard() {
  return (
    <group position={[0.04, 0, -0.05]}>
      {/* PCB */}
      <mesh>
        <boxGeometry args={[0.005, 0.34, 0.30]} />
        <meshStandardMaterial color="#1a3a1a" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* RAM slots area */}
      {[0.06, 0.03, -0.03, -0.06].map((z, i) => (
        <mesh key={i} position={[0.005, 0.08, z]}>
          <boxGeometry args={[0.003, 0.14, 0.012]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
      {/* I/O shield */}
      <mesh position={[0.005, 0.08, -0.14]}>
        <boxGeometry args={[0.003, 0.08, 0.04]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* CPU socket area */}
      <mesh position={[0.005, 0.04, 0.04]}>
        <boxGeometry args={[0.003, 0.06, 0.06]} />
        <meshStandardMaterial color="#2a2a00" roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ─── RAM sticks ─── */

function RAM({ count = 2, led }: { count?: number; led: LedState }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const ledColor = useLedColor(led);

  useFrame(() => {
    refs.current.forEach((mesh) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const active = led.on && led.zones.ram;
      if (led.mode === "pulse" && active) {
        const t = (Math.sin(Date.now() * 0.003) + 1) / 2;
        mat.emissiveIntensity = t * 2;
      } else {
        mat.emissiveIntensity = active ? 1.5 : 0;
      }
      if (active) mat.emissive.copy(ledColor);
      else mat.emissive.set(0x000000);
    });
  });

  const offsets = count === 4 ? [-0.06, -0.03, 0.03, 0.06] : [-0.03, 0.03];

  return (
    <group position={[0.06, 0.08, 0]}>
      {offsets.map((z, i) => (
        <group key={i}>
          {/* Stick body */}
          <mesh>
            <boxGeometry args={[0.003, 0.14, 0.012]} />
            <meshStandardMaterial color="#111" roughness={0.5} metalness={0.3} />
          </mesh>
          {/* LED top bar */}
          <mesh
            position={[0, 0.075, 0]}
            ref={(el) => { refs.current[i] = el; }}
          >
            <boxGeometry args={[0.004, 0.012, 0.012]} />
            <meshStandardMaterial color="#222" emissive="#000" emissiveIntensity={0} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ─── CPU Cooler ─── */

function CPUCooler({ type = "air", led }: { type?: "air" | "water"; led: LedState }) {
  const fanRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ledColor = useLedColor(led);

  useFrame((_, delta) => {
    if (fanRef.current) fanRef.current.rotation.z -= delta * 2.5;
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshStandardMaterial;
      const active = led.on && led.zones.cpu;
      if (led.mode === "pulse" && active) {
        const t = (Math.sin(Date.now() * 0.003) + 1) / 2;
        mat.emissiveIntensity = t * 2;
      } else {
        mat.emissiveIntensity = active ? 1.5 : 0;
      }
      if (active) mat.emissive.copy(ledColor);
      else mat.emissive.set(0x000000);
    }
  });

  if (type === "water") {
    return (
      <group>
        {/* Waterblock on CPU */}
        <mesh position={[0.07, 0.04, 0.04]}>
          <boxGeometry args={[0.01, 0.05, 0.05]} />
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Tubes */}
        <mesh position={[0.07, 0.12, 0.04]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.005, 0.005, 0.15, 8]} />
          <meshStandardMaterial color="#111" roughness={0.8} />
        </mesh>
        {/* Radiator (top of case) */}
        <mesh position={[0.01, 0.16, 0.04]}>
          <boxGeometry args={[0.006, 0.02, 0.24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
        </mesh>
        <Fan position={[0.01, 0.16, 0.04]} radius={0.04} led={led} zone="cpu" />
        <Fan position={[0.01, 0.16, -0.04]} radius={0.04} led={led} zone="cpu" />
      </group>
    );
  }

  // Air cooler tower
  return (
    <group position={[0.07, 0.06, 0.04]}>
      {/* Heatsink fins */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, (i - 3.5) * 0.008, 0]}>
          <boxGeometry args={[0.009, 0.004, 0.055]} />
          <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {/* Heatpipes */}
      {[-0.015, 0, 0.015].map((z, i) => (
        <mesh key={i} position={[0, 0, z]}>
          <cylinderGeometry args={[0.003, 0.003, 0.07, 8]} rotation-z={Math.PI / 2} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {/* Fan ring */}
      <mesh ref={ringRef} position={[-0.012, 0, 0]}>
        <torusGeometry args={[0.03, 0.004, 8, 32]} />
        <meshStandardMaterial color="#333" emissive="#000" emissiveIntensity={0} />
      </mesh>
      {/* Fan blades */}
      <group ref={fanRef} position={[-0.012, 0, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, (i / 4) * Math.PI * 2, 0]}>
            <boxGeometry args={[0.003, 0.022, 0.01]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ─── GPU ─── */

function GPU({ fanCount = 2, led }: { fanCount?: number; led: LedState }) {
  const logoRef = useRef<THREE.Mesh>(null);
  const ledColor = useLedColor(led);

  useFrame(() => {
    if (logoRef.current) {
      const mat = logoRef.current.material as THREE.MeshStandardMaterial;
      const active = led.on && led.zones.gpu;
      if (led.mode === "pulse" && active) {
        const t = (Math.sin(Date.now() * 0.003) + 1) / 2;
        mat.emissiveIntensity = t * 2;
      } else {
        mat.emissiveIntensity = active ? 1.5 : 0;
      }
      if (active) mat.emissive.copy(ledColor);
      else mat.emissive.set(0x000000);
    }
  });

  const fanPositions = fanCount >= 3
    ? [-0.075, 0, 0.075]
    : [-0.045, 0.045];

  return (
    <group position={[0.02, -0.08, 0]}>
      {/* PCB */}
      <mesh>
        <boxGeometry args={[0.012, 0.04, 0.22]} />
        <meshStandardMaterial color="#111" roughness={0.6} />
      </mesh>
      {/* Shroud */}
      <mesh position={[-0.008, 0.006, 0]}>
        <boxGeometry args={[0.006, 0.038, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Fans */}
      {fanPositions.map((z, i) => (
        <Fan key={i} position={[-0.008, 0.006, z]} radius={0.03} led={led} zone="fans" />
      ))}
      {/* LED strip under shroud */}
      <mesh ref={logoRef} position={[-0.008, -0.014, 0]}>
        <boxGeometry args={[0.003, 0.004, 0.18]} />
        <meshStandardMaterial color="#111" emissive="#000" emissiveIntensity={0} />
      </mesh>
      {/* IO bracket */}
      <mesh position={[0.008, 0, -0.11]}>
        <boxGeometry args={[0.005, 0.04, 0.01]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── PSU ─── */

function PSU() {
  return (
    <group position={[0, -0.17, -0.1]}>
      <mesh>
        <boxGeometry args={[0.012, 0.065, 0.14]} />
        <meshStandardMaterial color="#111" metalness={0.5} roughness={0.4} />
      </mesh>
      <Fan position={[0, 0, 0]} radius={0.025} led={{ on: false, color: "#000", mode: "static", zones: { fans: false, strip: false, ram: false, cpu: false, gpu: false } }} zone="fans" />
    </group>
  );
}

/* ─── Cables (decorative) ─── */

function Cables() {
  return (
    <group>
      {[
        { pos: [0.03, -0.05, -0.02] as [number, number, number], rot: [0.3, 0, 0.2] as [number, number, number] },
        { pos: [0.04, -0.1, 0.03] as [number, number, number], rot: [-0.2, 0.1, 0.3] as [number, number, number] },
        { pos: [0.02, 0.02, -0.05] as [number, number, number], rot: [0.1, 0, -0.4] as [number, number, number] },
      ].map((c, i) => (
        <mesh key={i} position={c.pos} rotation={c.rot}>
          <cylinderGeometry args={[0.003, 0.003, 0.12, 6]} />
          <meshStandardMaterial color="#222" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Point lights for LED glow ─── */

function LedLights({ led }: { led: LedState }) {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const ledColor = useLedColor(led);

  useFrame(() => {
    [light1Ref, light2Ref].forEach((ref) => {
      if (!ref.current) return;
      const active = led.on;
      ref.current.intensity = active ? (led.mode === "pulse" ? ((Math.sin(Date.now() * 0.003) + 1) / 2) * 0.8 : 0.5) : 0;
      ref.current.color.copy(ledColor);
    });
  });

  return (
    <>
      <pointLight ref={light1Ref} position={[-0.05, -0.15, 0.1]} intensity={0} distance={0.4} />
      <pointLight ref={light2Ref} position={[-0.05, 0.05, -0.05]} intensity={0} distance={0.4} />
    </>
  );
}

/* ─── Full PC scene ─── */

function PCScene({ config, led }: { config: PCConfig3D; led: LedState }) {
  const gpu = config.components.find((c) => c.type === "GPU");
  const cooler = config.components.find((c) => c.type === "Refroidissement");
  const ram = config.components.find((c) => c.type === "RAM");

  const fanCount = gpu?.specs?.["Ventilateurs"] ? parseInt(gpu.specs["Ventilateurs"]) : 2;
  const ramCount = ram?.name?.toLowerCase().includes("4x") ? 4 : 2;
  const coolerType: "air" | "water" = cooler?.name?.toLowerCase().includes("aio") || cooler?.name?.toLowerCase().includes("360") || cooler?.name?.toLowerCase().includes("240") ? "water" : "air";

  return (
    <group rotation={[0, Math.PI / 8, 0]}>
      <Case led={led} />
      <Motherboard />
      <RAM count={ramCount} led={led} />
      <CPUCooler type={coolerType} led={led} />
      <GPU fanCount={fanCount} led={led} />
      <PSU />
      <Cables />
      <LedLights led={led} />
    </group>
  );
}

/* ─── Camera controller ─── */

type CameraView = "front" | "side" | "back" | "top";

function CameraRig({ view, onReset }: { view: CameraView | null; onReset: () => void }) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const targetRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const progressRef = useRef(0);

  const views: Record<CameraView, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
    front: { pos: new THREE.Vector3(0, 0, 1.2), target: new THREE.Vector3(0, 0, 0) },
    side: { pos: new THREE.Vector3(-1.2, 0, 0), target: new THREE.Vector3(0, 0, 0) },
    back: { pos: new THREE.Vector3(0, 0, -1.2), target: new THREE.Vector3(0, 0, 0) },
    top: { pos: new THREE.Vector3(0, 1.2, 0.3), target: new THREE.Vector3(0, 0, 0) },
  };

  useEffect(() => {
    if (view) {
      targetRef.current = views[view];
      progressRef.current = 0;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  useFrame((_, delta) => {
    if (targetRef.current && progressRef.current < 1) {
      progressRef.current = Math.min(progressRef.current + delta * 3, 1);
      const t = 1 - Math.pow(1 - progressRef.current, 3);
      camera.position.lerp(targetRef.current.pos, t * 0.1);
      if (progressRef.current >= 1) targetRef.current = null;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={0.5}
      maxDistance={3}
      makeDefault
    />
  );
}

/* ─── LED Control Panel ─── */

const COLOR_PRESETS = [
  { color: "#4f8ef7", label: "Bleu" },
  { color: "#ff3333", label: "Rouge" },
  { color: "#00ff88", label: "Vert" },
  { color: "#9b59b6", label: "Violet" },
  { color: "#ffffff", label: "Blanc" },
  { color: "#ff6600", label: "Orange" },
];

function LedPanel({ led, setLed }: { led: LedState; setLed: React.Dispatch<React.SetStateAction<LedState>> }) {
  const zones: { key: keyof LedZones; label: string }[] = [
    { key: "fans", label: "Ventilateurs" },
    { key: "strip", label: "Strip boîtier" },
    { key: "ram", label: "RAM" },
    { key: "cpu", label: "Refroidisseur CPU" },
    { key: "gpu", label: "Carte graphique" },
  ];

  return (
    <div className="absolute right-4 top-4 bottom-4 w-64 flex flex-col gap-3 pointer-events-auto overflow-y-auto" style={{ zIndex: 10 }}>
      <div className="rounded-2xl p-4 flex flex-col gap-4" style={{ background: "rgba(15,15,20,0.85)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Master toggle */}
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold text-sm">LEDs RGB</span>
          <button
            type="button"
            onClick={() => setLed((l) => ({ ...l, on: !l.on }))}
            className="relative w-12 h-6 rounded-full transition-colors duration-200"
            style={{ background: led.on ? "#4f8ef7" : "#333" }}
          >
            <span
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
              style={{ left: led.on ? "calc(100% - 20px)" : "4px" }}
            />
          </button>
        </div>

        {/* Color presets */}
        <div>
          <p className="text-[11px] text-gray-400 mb-2 uppercase tracking-wider">Couleur</p>
          <div className="grid grid-cols-3 gap-1.5">
            {COLOR_PRESETS.map((p) => (
              <button
                key={p.color}
                type="button"
                onClick={() => setLed((l) => ({ ...l, color: p.color, mode: "static" }))}
                className="h-8 rounded-lg transition-all hover:scale-105 text-[10px] font-medium"
                style={{
                  background: p.color,
                  border: led.color === p.color && led.mode !== "rainbow" ? "2px solid white" : "2px solid transparent",
                  color: p.color === "#ffffff" ? "#000" : "#fff",
                }}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setLed((l) => ({ ...l, mode: "rainbow" }))}
              className="h-8 rounded-lg text-[10px] font-medium col-span-3"
              style={{
                background: "linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff)",
                border: led.mode === "rainbow" ? "2px solid white" : "2px solid transparent",
                color: "#fff",
              }}
            >
              🌈 Arc-en-ciel
            </button>
          </div>
          {/* Custom color picker */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="color"
              value={led.color}
              onChange={(e) => setLed((l) => ({ ...l, color: e.target.value, mode: "static" }))}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-[11px] text-gray-400">Couleur custom</span>
          </div>
        </div>

        {/* Animation mode */}
        <div>
          <p className="text-[11px] text-gray-400 mb-2 uppercase tracking-wider">Animation</p>
          <div className="flex gap-1.5">
            {(["static", "pulse", "rainbow"] as LedMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setLed((l) => ({ ...l, mode: m }))}
                className="flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                style={{
                  background: led.mode === m ? "#4f8ef7" : "rgba(255,255,255,0.06)",
                  color: led.mode === m ? "#fff" : "#aaa",
                }}
              >
                {m === "static" ? "Fixe" : m === "pulse" ? "Pulsation" : "Rainbow"}
              </button>
            ))}
          </div>
        </div>

        {/* Zone toggles */}
        <div>
          <p className="text-[11px] text-gray-400 mb-2 uppercase tracking-wider">Zones</p>
          <div className="flex flex-col gap-1.5">
            {zones.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs text-gray-300">{label}</span>
                <button
                  type="button"
                  onClick={() => setLed((l) => ({ ...l, zones: { ...l.zones, [key]: !l.zones[key] } }))}
                  className="relative w-9 h-5 rounded-full transition-colors duration-200"
                  style={{ background: led.zones[key] ? "#4f8ef7" : "#333" }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                    style={{ left: led.zones[key] ? "calc(100% - 18px)" : "2px" }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main exported component ─── */

export default function PCViewer3D({ config, onBack }: { config: PCConfig3D; onBack: () => void }) {
  const [led, setLed] = useState<LedState>({
    on: true,
    color: "#4f8ef7",
    mode: "static",
    zones: { fans: true, strip: true, ram: true, cpu: true, gpu: true },
  });
  const [cameraView, setCameraView] = useState<CameraView | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cpu = config.components.find((c) => c.type === "CPU");
  const gpu = config.components.find((c) => c.type === "GPU");
  const ram = config.components.find((c) => c.type === "RAM");

  const handleExport = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "ma-config-pc.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  const VIEW_BUTTONS: { key: CameraView; label: string }[] = [
    { key: "front", label: "Face" },
    { key: "side", label: "Côté" },
    { key: "back", label: "Arrière" },
    { key: "top", label: "Dessus" },
  ];

  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: "#0a0a0f" }}>
      {/* Top bar */}
      <div className="shrink-0 px-6 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <h2 className="text-white font-bold text-base">Votre configuration</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {cpu && <span>CPU: {cpu.name} · </span>}
            {gpu && <span>GPU: {gpu.name} · </span>}
            {ram && <span>RAM: {ram.name}</span>}
          </p>
        </div>
        <button type="button" onClick={onBack} className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          ← Retour
        </button>
      </div>

      {/* Canvas area */}
      <div className="flex-1 relative overflow-hidden">
        <Canvas
          ref={canvasRef}
          shadows
          camera={{ position: [0.8, 0.4, 1], fov: 50 }}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <color attach="background" args={["#0d0d14"]} />
          <fog attach="fog" args={["#0d0d14", 3, 8]} />

          <ambientLight intensity={0.15} />
          <directionalLight position={[2, 3, 2]} intensity={0.6} castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-2, 1, -2]} intensity={0.2} color="#6080ff" />

          <Suspense fallback={null}>
            <PCScene config={config} led={led} />
          </Suspense>

          <Environment preset="city" />
          <CameraRig view={cameraView} onReset={() => setCameraView("front")} />
        </Canvas>

        {/* LED Panel overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <LedPanel led={led} setLed={setLed} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="shrink-0 px-6 py-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500 mr-1">Vue :</span>
          {VIEW_BUTTONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => { setCameraView(key); setTimeout(() => setCameraView(null), 100); }}
              className="text-[11px] px-3 py-1.5 rounded-lg transition-all hover:text-white"
              style={{ background: "rgba(255,255,255,0.06)", color: "#aaa", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="text-[11px] px-3 py-1.5 rounded-lg transition-all hover:text-white flex items-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.06)", color: "#aaa", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 11v3h12v-3M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Exporter PNG
          </button>
        </div>
      </div>
    </div>
  );
}
