'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Float,
  MeshDistortMaterial,
  Sparkles,
} from '@react-three/drei';
import { useEffect, useRef } from 'react';
import type { Group } from 'three';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, alpha: number) {
  return start + (end - start) * alpha;
}

function ScrollCameraRig() {
  const { camera } = useThree();
  const scrollProgress = useRef(0);
  const pointerX = useRef(0);
  const pointerY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      scrollProgress.current = window.scrollY / maxScroll;
    };

    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      pointerX.current = (x - 0.5) * 2;
      pointerY.current = (y - 0.5) * -2;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  useFrame((_, delta) => {
    const introProgress = clamp(scrollProgress.current / 0.22, 0, 1);

    const targetZ = lerp(5.6, 4.35, introProgress);
    const targetY = lerp(0.45, 0.08, introProgress) + pointerY.current * 0.06;
    const targetX = pointerX.current * 0.08;
    const targetFov = lerp(58, 49, introProgress);

    const smoothing = Math.min(1, delta * 2.2);
    camera.position.x += (targetX - camera.position.x) * smoothing;
    camera.position.y += (targetY - camera.position.y) * smoothing;
    camera.position.z += (targetZ - camera.position.z) * smoothing;
    camera.fov += (targetFov - camera.fov) * smoothing;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  });

  return null;
}

function AnimatedCluster() {
  const root = useRef<Group>(null);
  const scrollProgress = useRef(0);
  const pointerX = useRef(0);
  const pointerY = useRef(0);

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
    if (!root.current) return;

    const scrollShift = (scrollProgress.current - 0.5) * 0.45;
    const targetY = scrollShift;
    const targetX = Math.sin(state.clock.elapsedTime * 0.35) * 0.2 + scrollShift * 0.35 + pointerY.current * 0.2;
    const targetZ = pointerX.current * 0.18;

    root.current.rotation.y += delta * (0.16 + scrollProgress.current * 0.3);
    root.current.rotation.x += (targetX - root.current.rotation.x) * Math.min(1, delta * 2.6);
    root.current.rotation.z += (targetZ - root.current.rotation.z) * Math.min(1, delta * 2.6);
    root.current.position.y += (targetY - root.current.position.y) * Math.min(1, delta * 2.4);
    root.current.position.x += (pointerX.current * 0.24 - root.current.position.x) * Math.min(1, delta * 2.3);
  });

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      pointerX.current = (x - 0.5) * 2;
      pointerY.current = (y - 0.5) * -2;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  return (
    <group ref={root}>
      <Float speed={1.4} rotationIntensity={1.1} floatIntensity={1.2}>
        <mesh position={[-1.35, 0.2, 0]} castShadow>
          <icosahedronGeometry args={[0.75, 1]} />
          <MeshDistortMaterial
            color="#1d4ed8"
            roughness={0.26}
            metalness={0.55}
            distort={0.22}
            speed={1.4}
          />
        </mesh>
      </Float>

      <Float speed={1.2} rotationIntensity={1.1} floatIntensity={0.9}>
        <mesh position={[1.1, -0.6, -0.45]} castShadow>
          <torusKnotGeometry args={[0.45, 0.16, 160, 24]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.6} roughness={0.22} />
        </mesh>
      </Float>

      <Float speed={1} rotationIntensity={0.75} floatIntensity={0.7}>
        <mesh position={[0.15, 0.95, -0.85]} castShadow>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#93c5fd" metalness={0.45} roughness={0.24} />
        </mesh>
      </Float>
    </group>
  );
}

export function ThreeHeroScene() {
  return (
    <div className="h-full w-full rounded-3xl">
      <Canvas camera={{ position: [0, 0.1, 4.5], fov: 50 }} shadows dpr={[1, 2]}>
        <color attach="background" args={['#030712']} />
        <fog attach="fog" args={['#030712', 4, 12]} />

        <ambientLight intensity={0.38} />
        <directionalLight position={[2.8, 3.4, 2.2]} intensity={0.95} castShadow />
        <pointLight position={[-2.4, -1.8, 2.8]} intensity={0.7} color="#1d4ed8" />
        <pointLight position={[2.5, 1.1, 1.6]} intensity={0.55} color="#22d3ee" />

        <ScrollCameraRig />
        <AnimatedCluster />
        <Sparkles count={10} scale={[4.8, 2.8, 4.2]} speed={0.2} size={1.2} />
      </Canvas>
    </div>
  );
}