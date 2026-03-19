import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useBrainStore } from '../../store/useBrainStore';
import SceneEnvironment from './SceneEnvironment';
import BrainModel from './BrainModel';
import RegionLabel from './RegionLabel';

export default function BrainCanvas() {
  const isAutoRotating = useBrainStore((s) => s.isAutoRotating);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: '#0f1117' }}
      >
        <SceneEnvironment />
        <BrainModel />
        <OrbitControls
          autoRotate={isAutoRotating}
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.08}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
      <RegionLabel />
    </div>
  );
}
