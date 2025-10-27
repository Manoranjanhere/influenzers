import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface RadialEngagementChartProps {
  platforms: Array<{ platform: string; engagement: number; followers: number }>;
}

function PlatformRings({ platforms }: RadialEngagementChartProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {platforms.map((platform, index) => {
        const radius = 1 + index * 0.5;
        const height = platform.engagement / 100;
        const angle = (Math.PI * 2 * index) / platforms.length;

        return (
          <group key={platform.platform} rotation={[0, angle, 0]}>
            <mesh position={[radius, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, height, 8]} />
              <meshStandardMaterial color={platform.platform === 'instagram' ? '#ec4899' : platform.platform === 'youtube' ? '#ef4444' : '#3b82f6'} />
            </mesh>
            <Text
              position={[radius, 0.5, 0]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {platform.platform}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export default function RadialEngagementChart({ platforms }: RadialEngagementChartProps) {
  if (platforms.length === 0) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-white">Connect platforms to see 3D visualization</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 5, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} color="#8b5cf6" />
        <Suspense fallback={null}>
          <PlatformRings platforms={platforms} />
        </Suspense>
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
}

