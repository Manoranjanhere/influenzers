import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface InfluenceTerrainProps {
  data: Array<{ x: number; y: number; z: number; value: number; label: string }>;
}

function Terrain({ data }: InfluenceTerrainProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group>
      {data.map((point, index) => (
        <mesh key={index} position={[point.x, point.y, point.z]} ref={meshRef}>
          <sphereGeometry args={[point.value * 0.1, 16, 16]} />
          <meshStandardMaterial
            color={point.value > 50 ? '#4a54e8' : point.value > 25 ? '#8b5cf6' : '#ec4899'}
            emissive={point.value > 50 ? '#4a54e8' : point.value > 25 ? '#8b5cf6' : '#ec4899'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function InfluenceTerrain({ data }: InfluenceTerrainProps) {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} color="#8b5cf6" />
        <Suspense fallback={null}>
          <Terrain data={data} />
        </Suspense>
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
}

