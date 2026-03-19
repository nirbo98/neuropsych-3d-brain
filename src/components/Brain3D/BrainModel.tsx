import { brainRegions } from '../../data/brainRegions';
import { useBrainStore } from '../../store/useBrainStore';
import BrainRegionMesh from './BrainRegionMesh';

export default function BrainModel() {
  const brainOpacity = useBrainStore((s) => s.brainOpacity);

  return (
    <group>
      {brainRegions.map((region) => (
        <BrainRegionMesh key={region.id} region={region} />
      ))}

      {/* Transparent outer brain shell */}
      <mesh>
        <sphereGeometry args={[1.8, 48, 32]} />
        <meshStandardMaterial
          color="#8b9dc3"
          transparent
          opacity={brainOpacity * 0.15}
          wireframe
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}
