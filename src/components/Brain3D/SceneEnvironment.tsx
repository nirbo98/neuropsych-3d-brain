import { Stars } from '@react-three/drei';

export default function SceneEnvironment() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#e0e7ff" />
      <directionalLight position={[-3, 2, -4]} intensity={0.3} color="#818cf8" />
      <pointLight position={[-2, -1, 3]} intensity={0.4} color="#6366f1" />
      <Stars radius={80} depth={60} count={1500} factor={3} saturation={0.2} fade speed={0.5} />
      <fog attach="fog" args={['#0f1117', 8, 25]} />
    </>
  );
}
