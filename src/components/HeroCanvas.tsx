"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleSystem() {
  const ref = useRef<THREE.Points>(null);
  const count = 4000;
  
  const [positions, initialPositions] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const initialPositions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 5 + Math.random() * 25;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      const i3 = i * 3;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      initialPositions[i3] = x;
      initialPositions[i3 + 1] = y;
      initialPositions[i3 + 2] = z;
    }
    return [positions, initialPositions];
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ix = initialPositions[i3];
      const iy = initialPositions[i3 + 1];
      const iz = initialPositions[i3 + 2];
      
      // AI/neural network inspired slow breathing flow
      positions[i3] = ix + Math.sin(time * 0.15 + ix * 0.1) * 2;
      positions[i3 + 1] = iy + Math.cos(time * 0.2 + iy * 0.1) * 2;
      positions[i3 + 2] = iz + Math.sin(time * 0.15 + iz * 0.1) * 2;
    }
    
    ref.current.geometry.attributes.position.needsUpdate = true;
    
    // Slow majestic rotation
    ref.current.rotation.y = time * 0.05;
    
    // Parallax reaction to pointer
    ref.current.rotation.y += state.pointer.x * 0.1;
    ref.current.rotation.x += -state.pointer.y * 0.1;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#E1FF00"
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <ParticleSystem />
      </Canvas>
    </div>
  );
}
