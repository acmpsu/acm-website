'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import type { Group } from 'three';

type AccentVariant = 'committees' | 'events';

function AccentMesh({ variant }: { variant: AccentVariant }) {
  const group = useRef<Group>(null);
  const scrollProgress = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      scrollProgress.current = window.scrollY / maxScroll;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;

    const targetY = (scrollProgress.current - 0.5) * 0.45;
    group.current.position.y += (targetY - group.current.position.y) * Math.min(1, delta * 2.4);
    group.current.rotation.y += delta * 0.24;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.65) * 0.1;
  });

  if (variant === 'events') {
    return (
      <group ref={group}>
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.4}>
          <mesh position={[0.9, -0.1, 0]}>
            <torusGeometry args={[0.62, 0.08, 18, 80]} />
            <meshStandardMaterial color="#334155" wireframe />
          </mesh>
        </Float>
        <Float speed={1.2} rotationIntensity={0.7} floatIntensity={0.45}>
          <mesh position={[-0.7, 0.35, -0.2]}>
            <octahedronGeometry args={[0.24, 0]} />
            <meshStandardMaterial color="#2563eb" metalness={0.25} roughness={0.45} />
          </mesh>
        </Float>
      </group>
    );
  }

  return (
    <group ref={group}>
      <Float speed={1.15} rotationIntensity={0.7} floatIntensity={0.45}>
        <mesh position={[-0.7, 0.05, -0.1]}>
          <icosahedronGeometry args={[0.27, 0]} />
          <meshStandardMaterial color="#2563eb" metalness={0.2} roughness={0.45} />
        </mesh>
      </Float>
      <Float speed={0.95} rotationIntensity={0.6} floatIntensity={0.35}>
        <mesh position={[0.85, -0.18, 0]}>
          <torusKnotGeometry args={[0.17, 0.05, 90, 14]} />
          <meshStandardMaterial color="#334155" metalness={0.45} roughness={0.35} />
        </mesh>
      </Float>
    </group>
  );
}

export function SectionAccent3D({ variant }: { variant: AccentVariant }) {
  const cameraPosition = useMemo<[number, number, number]>(() => [0, 0, 2.9], []);

  return (
    <div className="pointer-events-none h-full w-full">
      <Canvas
        dpr={[1, 1.2]}
        camera={{ position: cameraPosition, fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2.2, 1.6, 2.4]} intensity={0.5} />
        <AccentMesh variant={variant} />
      </Canvas>
    </div>
  );
}