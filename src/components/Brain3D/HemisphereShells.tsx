import { useState, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { Hemisphere } from '../../types/brain.types';
import { useBrainStore } from '../../store/useBrainStore';
import { hemisphereProfiles } from '../../data/autismData';

/** Half-brain offset from the mid-sagittal plane — the two shells meet near x≈0. */
const GAP = 0.9;

function Shell({ side }: { side: Hemisphere }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const selectedHemisphere = useBrainStore((s) => s.selectedHemisphere);
  const selectHemisphere = useBrainStore((s) => s.selectHemisphere);

  const profile = hemisphereProfiles[side];
  const isSelected = selectedHemisphere === side;
  const active = isSelected || hovered;
  const sign = side === 'left' ? -1 : 1;

  const color = useMemo(() => new THREE.Color(profile.color), [profile.color]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    if (isSelected) {
      const pulse = (Math.sin(clock.elapsedTime * 2) + 1) / 2;
      mat.opacity = 0.2 + pulse * 0.1;
      mat.emissiveIntensity = 0.35 + pulse * 0.25;
    } else {
      mat.opacity = hovered ? 0.22 : 0.1;
      mat.emissiveIntensity = hovered ? 0.4 : 0.15;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[sign * GAP, 0, 0]}
      scale={[0.5, 0.98, 0.98]}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        selectHemisphere(isSelected ? null : side);
      }}
    >
      <sphereGeometry args={[1.7, 48, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={active ? 0.4 : 0.15}
        transparent
        opacity={active ? 0.22 : 0.1}
        roughness={0.5}
        metalness={0.1}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Two translucent half-brain shells for the hemisphere / autism lens. */
export default function HemisphereShells() {
  return (
    <group>
      <Shell side="left" />
      <Shell side="right" />
      {/* Thin mid-sagittal divider */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.015, 3.2, 3.2]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}
