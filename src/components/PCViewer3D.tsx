"use client";

import { useRef, useState, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
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
      <mesh ref={ringRef} castShadow>
        <torusGeometry args={[radius, 0.006, 8, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} emissive="#000" emissiveIntensity={0} />
      </mesh>
      {/* Blades */}
      <group ref={groupRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, 0, (i / 3) * Math.PI * 2]}>
            <boxGeometry args={[radius * 0.8, 0.015, 0.004]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
          </mesh>
        ))}
        <mesh>
          <cylinderGeometry args={[0.01, 0.01, 0.006, 12]} />
          <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

/* ─── Case (mid-tower, realistic proportions) ─── */
// Real mid-tower: ~450mm H × 210mm W × 470mm D → ratio 2.14:1 H/W
// Scale: W=0.21, H=0.45, D=0.47

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

  const W = 0.21, H = 0.45, D = 0.47;
  const thick = 0.007;

  return (
    <group>
      {/* Back panel */}
      <mesh position={[0, 0, -D / 2]} receiveShadow castShadow>
        <boxGeometry args={[W, H, thick]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Front panel — brushed mesh effect */}
      <mesh position={[0, 0, D / 2]} receiveShadow castShadow>
        <boxGeometry args={[W, H, thick]} />
        <meshStandardMaterial color="#141414" metalness={0.7} roughness={0.45} />
      </mesh>
      {/* Top panel */}
      <mesh position={[0, H / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[W, thick, D]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Bottom panel */}
      <mesh position={[0, -H / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[W, thick, D]} />
        <meshStandardMaterial color="#181818" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Right panel (solid steel) */}
      <mesh position={[W / 2, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[thick, H, D]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Left panel — tempered glass with tint */}
      <mesh position={[-W / 2 - 0.001, 0, 0]}>
        <boxGeometry args={[0.005, H - 0.025, D - 0.025]} />
        <meshPhysicalMaterial
          color="#b8d8ff"
          transparent
          opacity={0.15}
          roughness={0}
          metalness={0}
          transmission={0.92}
          thickness={0.5}
          ior={1.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Glass frame (thin bezel) */}
      {[
        { pos: [0, (H - 0.025) / 2, 0], size: [D - 0.025, 0.008] as [number, number] },
        { pos: [0, -(H - 0.025) / 2, 0], size: [D - 0.025, 0.008] as [number, number] },
        { pos: [(D - 0.025) / 2, 0, 0], size: [0.008, H - 0.025] as [number, number] },
        { pos: [-(D - 0.025) / 2, 0, 0], size: [0.008, H - 0.025] as [number, number] },
      ].map(({ pos, size }, i) => (
        <mesh key={i} position={[-W / 2 - 0.003, pos[0], pos[1]]}>
          <boxGeometry args={[0.004, size[1], size[0]]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {/* Front RGB strip channel */}
      <mesh ref={stripRef} position={[W / 2 - 0.005, 0, D / 2 - 0.002]}>
        <boxGeometry args={[0.004, H * 0.6, 0.006]} />
        <meshStandardMaterial color="#111" emissive="#000" emissiveIntensity={0} />
      </mesh>
      {/* Front intake mesh area */}
      {[-0.1, 0, 0.1].map((z, i) => (
        <mesh key={i} position={[0, z, D / 2 - 0.003]}>
          <boxGeometry args={[W * 0.6, 0.006, 0.003]} />
          <meshStandardMaterial color="#222" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}
      {/* Feet */}
      {[[-0.07, -0.08], [-0.07, 0.08], [0.07, -0.08], [0.07, 0.08]].map(([x, z], i) => (
        <mesh key={i} position={[x as number, -H / 2 - 0.015, z as number]} castShadow receiveShadow>
          <cylinderGeometry args={[0.013, 0.016, 0.03, 8]} />
          <meshStandardMaterial color="#111" roughness={0.9} metalness={0.2} />
        </mesh>
      ))}
      {/* Front fans */}
      <Fan position={[-W / 2 + 0.025, 0.07, D / 2 - 0.025]} led={led} zone="fans" />
      <Fan position={[-W / 2 + 0.025, -0.07, D / 2 - 0.025]} led={led} zone="fans" />
      {/* Rear exhaust fan */}
      <Fan position={[-W / 2 + 0.025, 0.14, -D / 2 + 0.025]} radius={0.04} led={led} zone="fans" />
      {/* Power button */}
      <mesh position={[0.04, H / 2 - 0.025, D / 2 - 0.003]}>
        <cylinderGeometry args={[0.008, 0.008, 0.006, 16]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

/* ─── Motherboard (ATX) ─── */

function Motherboard() {
  return (
    <group position={[0.04, 0, -0.04]}>
      {/* PCB */}
      <mesh castShadow>
        <boxGeometry args={[0.005, 0.35, 0.305]} />
        <meshStandardMaterial color="#1a3820" roughness={0.65} metalness={0.25} />
      </mesh>
      {/* PCB traces (cosmetic lines) */}
      {[-0.05, 0, 0.05].map((z, i) => (
        <mesh key={i} position={[0.003, 0, z]}>
          <boxGeometry args={[0.001, 0.34, 0.002]} />
          <meshStandardMaterial color="#0d2a0d" roughness={0.8} />
        </mesh>
      ))}
      {/* RAM slots */}
      {[0.07, 0.04, -0.02, -0.05].map((z, i) => (
        <mesh key={i} position={[0.006, 0.09, z]} castShadow>
          <boxGeometry args={[0.004, 0.145, 0.013]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.7} />
        </mesh>
      ))}
      {/* CPU socket */}
      <mesh position={[0.005, 0.05, 0.06]}>
        <boxGeometry args={[0.004, 0.065, 0.065]} />
        <meshStandardMaterial color="#2a2800" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* PCIe slot */}
      <mesh position={[0.005, -0.08, -0.03]}>
        <boxGeometry args={[0.003, 0.012, 0.24]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Chipset heatsink */}
      <mesh position={[0.006, -0.02, -0.06]}>
        <boxGeometry args={[0.012, 0.028, 0.028]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* I/O shield */}
      <mesh position={[0.006, 0.09, -0.145]}>
        <boxGeometry args={[0.004, 0.085, 0.042]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.35} />
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

  const offsets = count === 4 ? [-0.055, -0.025, 0.015, 0.045] : [-0.025, 0.015];

  return (
    <group position={[0.065, 0.09, 0]}>
      {offsets.map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          {/* PCB */}
          <mesh castShadow>
            <boxGeometry args={[0.003, 0.145, 0.013]} />
            <meshStandardMaterial color="#0d0d0d" roughness={0.5} metalness={0.4} />
          </mesh>
          {/* Heatspreader */}
          <mesh position={[0, 0.005, 0]} castShadow>
            <boxGeometry args={[0.005, 0.135, 0.015]} />
            <meshStandardMaterial color="#1a1a2e" metalness={0.85} roughness={0.15} />
          </mesh>
          {/* LED bar top */}
          <mesh
            position={[0, 0.078, 0]}
            ref={(el) => { refs.current[i] = el; }}
          >
            <boxGeometry args={[0.006, 0.01, 0.016]} />
            <meshStandardMaterial color="#111" emissive="#000" emissiveIntensity={0} />
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
        {/* Waterblock */}
        <mesh position={[0.068, 0.05, 0.06]} castShadow>
          <boxGeometry args={[0.012, 0.052, 0.052]} />
          <meshStandardMaterial color="#111" metalness={0.92} roughness={0.08} />
        </mesh>
        {/* Tubes */}
        <mesh position={[0.065, 0.13, 0.06]} rotation={[0, 0, Math.PI / 7]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.18, 10]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
        </mesh>
        {/* Radiator */}
        <mesh position={[0.01, 0.185, 0.04]} castShadow>
          <boxGeometry args={[0.006, 0.022, 0.26]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.45} />
        </mesh>
        <Fan position={[0.01, 0.185, 0.05]} radius={0.04} led={led} zone="cpu" />
        <Fan position={[0.01, 0.185, -0.04]} radius={0.04} led={led} zone="cpu" />
      </group>
    );
  }

  // Air cooler tower
  return (
    <group position={[0.068, 0.065, 0.06]}>
      {/* Heatsink base */}
      <mesh castShadow>
        <boxGeometry args={[0.01, 0.008, 0.06]} />
        <meshStandardMaterial color="#888" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Fins */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[0.002 + i * 0.004, (i - 4.5) * 0.008 * 0.5, 0]} castShadow>
          <boxGeometry args={[0.003, 0.004, 0.058]} />
          <meshStandardMaterial color="#aaa" metalness={0.92} roughness={0.18} />
        </mesh>
      ))}
      {/* Heatpipes */}
      {[-0.016, 0, 0.016].map((z, i) => (
        <mesh key={i} position={[0.005, 0, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.003, 0.003, 0.065, 8]} />
          <meshStandardMaterial color="#999" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}
      {/* Fan ring */}
      <mesh ref={ringRef} position={[-0.014, 0, 0]}>
        <torusGeometry args={[0.032, 0.004, 8, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} emissive="#000" emissiveIntensity={0} />
      </mesh>
      {/* Fan blades */}
      <group ref={fanRef} position={[-0.014, 0, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, (i / 4) * Math.PI * 2, 0]}>
            <boxGeometry args={[0.003, 0.024, 0.011]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
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

  const fanPositions: number[] = fanCount >= 3 ? [-0.08, 0, 0.08] : [-0.05, 0.05];

  return (
    <group position={[0.025, -0.09, 0]}>
      {/* PCB */}
      <mesh castShadow>
        <boxGeometry args={[0.012, 0.042, 0.26]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.55} metalness={0.3} />
      </mesh>
      {/* Main shroud */}
      <mesh position={[-0.009, 0.007, 0]} castShadow>
        <boxGeometry args={[0.007, 0.04, 0.24]} />
        <meshStandardMaterial color="#161616" metalness={0.55} roughness={0.28} />
      </mesh>
      {/* Backplate */}
      <mesh position={[0.01, 0, 0]} castShadow>
        <boxGeometry args={[0.004, 0.04, 0.24]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.88} roughness={0.12} />
      </mesh>
      {/* GPU fans */}
      {fanPositions.map((z, i) => (
        <Fan key={i} position={[-0.009, 0.007, z]} radius={0.032} led={led} zone="fans" />
      ))}
      {/* LED underglow strip */}
      <mesh ref={logoRef} position={[-0.009, -0.016, 0]}>
        <boxGeometry args={[0.004, 0.005, 0.22]} />
        <meshStandardMaterial color="#111" emissive="#000" emissiveIntensity={0} />
      </mesh>
      {/* I/O bracket */}
      <mesh position={[0.009, 0, -0.13]} castShadow>
        <boxGeometry args={[0.005, 0.042, 0.012]} />
        <meshStandardMaterial color="#333" metalness={0.75} roughness={0.25} />
      </mesh>
      {/* PCIe power connector */}
      <mesh position={[0.008, 0.015, 0.12]}>
        <boxGeometry args={[0.01, 0.018, 0.022]} />
        <meshStandardMaterial color="#222" roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ─── PSU ─── */

function PSU() {
  const noLed: LedState = { on: false, color: "#000", mode: "static", zones: { fans: false, strip: false, ram: false, cpu: false, gpu: false } };
  return (
    <group position={[0, -0.175, -0.12]}>
      {/* Shroud */}
      <mesh castShadow>
        <boxGeometry args={[0.013, 0.07, 0.155]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.55} roughness={0.4} />
      </mesh>
      {/* Grille face */}
      <mesh position={[0.007, 0, 0]}>
        <boxGeometry args={[0.002, 0.068, 0.153]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.35} />
      </mesh>
      <Fan position={[0.007, 0, 0]} radius={0.028} led={noLed} zone="fans" />
      {/* Cables coming out */}
      {[-0.02, 0, 0.02].map((z, i) => (
        <mesh key={i} position={[-0.009, 0, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.003, 0.003, 0.06, 6]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Cables ─── */

function Cables() {
  return (
    <group>
      {[
        { pos: [0.03, -0.06, -0.02] as [number, number, number], rot: [0.3, 0, 0.2] as [number, number, number], len: 0.13 },
        { pos: [0.04, -0.11, 0.04] as [number, number, number], rot: [-0.2, 0.1, 0.3] as [number, number, number], len: 0.11 },
        { pos: [0.02, 0.02, -0.06] as [number, number, number], rot: [0.1, 0, -0.4] as [number, number, number], len: 0.10 },
      ].map((c, i) => (
        <mesh key={i} position={c.pos} rotation={c.rot}>
          <cylinderGeometry args={[0.003, 0.003, c.len, 6]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
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
      ref.current.intensity = active ? (led.mode === "pulse" ? ((Math.sin(Date.now() * 0.003) + 1) / 2) * 0.6 : 0.4) : 0;
      ref.current.color.copy(ledColor);
    });
  });

  return (
    <>
      <pointLight ref={light1Ref} position={[-0.06, -0.15, 0.12]} intensity={0} distance={0.45} />
      <pointLight ref={light2Ref} position={[-0.06, 0.06, -0.06]} intensity={0} distance={0.45} />
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
    <group rotation={[0, Math.PI / 10, 0]}>
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

function CameraRig({ view }: { view: CameraView | null }) {
  const { camera } = useThree();
  const targetRef = useRef<{ pos: THREE.Vector3 } | null>(null);
  const progressRef = useRef(0);

  const views: Record<CameraView, THREE.Vector3> = {
    front: new THREE.Vector3(0, 0, 1.2),
    side:  new THREE.Vector3(-1.2, 0.1, 0),
    back:  new THREE.Vector3(0, 0, -1.2),
    top:   new THREE.Vector3(0, 1.3, 0.3),
  };

  useEffect(() => {
    if (view) {
      targetRef.current = { pos: views[view] };
      progressRef.current = 0;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  useFrame((_, delta) => {
    if (targetRef.current && progressRef.current < 1) {
      progressRef.current = Math.min(progressRef.current + delta * 3, 1);
      const t = 1 - Math.pow(1 - progressRef.current, 3);
      camera.position.lerp(targetRef.current.pos, t * 0.12);
      if (progressRef.current >= 1) targetRef.current = null;
    }
  });

  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.08}
      minDistance={0.6}
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
    <div className="absolute right-4 top-4 bottom-4 w-60 flex flex-col gap-3 pointer-events-auto overflow-y-auto" style={{ zIndex: 10 }}>
      <div className="rounded-2xl p-4 flex flex-col gap-4" style={{ background: "rgba(15,15,20,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)" }}>
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
    <div className="relative w-full h-full flex flex-col bg-white">
      {/* Top bar */}
      <div className="shrink-0 px-6 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #E5E5E5" }}>
        <div>
          <h2 className="font-bold text-base text-[#0A0A0A]">Votre configuration 3D</h2>
          <p className="text-[11px] text-[#888] mt-0.5">
            {cpu && <span>CPU: {cpu.name} · </span>}
            {gpu && <span>GPU: {gpu.name} · </span>}
            {ram && <span>RAM: {ram.name}</span>}
          </p>
        </div>
        <button type="button" onClick={onBack} className="text-xs text-[#666] hover:text-[#0A0A0A] transition-colors px-3 py-1.5 rounded-lg" style={{ border: "1px solid #E5E5E5" }}>
          ← Retour
        </button>
      </div>

      {/* Canvas area */}
      <div className="flex-1 relative overflow-hidden">
        <Canvas
          shadows
          camera={{ position: [0.75, 0.3, 1.0], fov: 48 }}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
        >
          {/* Light background */}
          <color attach="background" args={["#f0f0f0"]} />

          {/* Key light from upper-left front */}
          <directionalLight
            position={[1.5, 2.5, 2]}
            intensity={1.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.1}
            shadow-camera-far={10}
            shadow-camera-left={-1}
            shadow-camera-right={1}
            shadow-camera-top={1}
            shadow-camera-bottom={-1}
            shadow-bias={-0.0005}
          />
          {/* Fill light from right */}
          <directionalLight position={[-2, 1, -1]} intensity={0.5} color="#dde8ff" />
          {/* Rim light from back */}
          <directionalLight position={[0, 0.5, -2]} intensity={0.3} color="#ffffff" />
          {/* Soft ambient */}
          <ambientLight intensity={0.55} color="#f5f5ff" />

          {/* Contact shadows on ground */}
          <ContactShadows
            position={[0, -0.23, 0]}
            opacity={0.45}
            scale={1.2}
            blur={1.8}
            far={0.5}
            color="#000000"
          />

          <Suspense fallback={null}>
            <PCScene config={config} led={led} />
          </Suspense>

          <Environment preset="apartment" />
          <CameraRig view={cameraView} />
        </Canvas>

        {/* LED Panel overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <LedPanel led={led} setLed={setLed} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="shrink-0 px-6 py-3 flex items-center justify-between" style={{ borderTop: "1px solid #E5E5E5" }}>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#888] mr-1">Vue :</span>
          {VIEW_BUTTONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => { setCameraView(key); setTimeout(() => setCameraView(null), 100); }}
              className="text-[11px] px-3 py-1.5 rounded-lg transition-all hover:text-[#0A0A0A] hover:border-[#CCC]"
              style={{ background: "#F5F5F5", color: "#666", border: "1px solid #E5E5E5" }}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="text-[11px] px-3 py-1.5 rounded-lg transition-all hover:text-[#0A0A0A] flex items-center gap-1.5"
          style={{ background: "#F5F5F5", color: "#666", border: "1px solid #E5E5E5" }}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 11v3h12v-3M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Exporter PNG
        </button>
      </div>
    </div>
  );
}
