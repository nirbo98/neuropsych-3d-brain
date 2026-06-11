import { useRef, useState, useCallback, useMemo } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { BrainRegion } from '../../types/brain.types';
import { useBrainStore } from '../../store/useBrainStore';

interface BrainRegionMeshProps {
  region: BrainRegion;
}

export default function BrainRegionMesh({ region }: BrainRegionMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const selectedRegionId = useBrainStore((s) => s.selectedRegionId);
  const activeLesions = useBrainStore((s) => s.activeLesions);
  const selectRegion = useBrainStore((s) => s.selectRegion);
  const setHoveredRegion = useBrainStore((s) => s.setHoveredRegion);
  const highlightedRegionIds = useBrainStore((s) => s.highlightedRegionIds);

  const isSelected = selectedRegionId === region.id;
  const isHighlighted = highlightedRegionIds.includes(region.id);
  const lesion = activeLesions.find((l) => l.regionId === region.id);
  const hasLesion = !!lesion;

  const baseColor = useMemo(() => new THREE.Color(region.color), [region.color]);
  const brightColor = useMemo(() => {
    const c = baseColor.clone();
    c.offsetHSL(0, 0.1, 0.15);
    return c;
  }, [baseColor]);

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(true);
      document.body.style.cursor = 'pointer';
      setHoveredRegion(region.id, {
        regionId: region.id,
        regionName: region.name,
        screenPosition: { x: e.clientX, y: e.clientY },
      });
    },
    [region.id, region.name, setHoveredRegion],
  );

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'auto';
    setHoveredRegion(null);
  }, [setHoveredRegion]);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      selectRegion(region.id);
    },
    [region.id, selectRegion],
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;

    if (hasLesion) {
      const pulse = (Math.sin(clock.elapsedTime * 3) + 1) / 2;
      mat.emissive.set('#ff0000');
      mat.emissiveIntensity = 0.3 + pulse * 0.5;
    } else if (isHighlighted) {
      // "Live example" demonstration glow (hemisphere / autism lens)
      const pulse = (Math.sin(clock.elapsedTime * 4) + 1) / 2;
      mat.emissive.set('#22d3ee');
      mat.emissiveIntensity = 0.4 + pulse * 0.6;
    } else if (isSelected) {
      mat.emissive.copy(baseColor);
      mat.emissiveIntensity = 0.4;
    } else {
      mat.emissive.set('#000000');
      mat.emissiveIntensity = 0;
    }

    const targetScale = hovered ? 1.08 : isHighlighted ? 1.14 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(
        region.scale[0] * targetScale,
        region.scale[1] * targetScale,
        region.scale[2] * targetScale,
      ),
      0.15,
    );
  });

  return (
    <mesh
      ref={meshRef}
      position={region.position}
      scale={region.scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <sphereGeometry args={[0.3, 32, 24]} />
      <meshStandardMaterial
        color={hovered ? brightColor : baseColor}
        roughness={0.4}
        metalness={0.3}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}
