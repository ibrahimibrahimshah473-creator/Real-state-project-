"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Environment, Html } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function House() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={group} position={[0, -0.5, 0]}>
        {/* Base/Foundation */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3, 0.2, 2.5]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
        {/* Walls */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[2.8, 1.4, 2.3]} />
          <meshStandardMaterial color="#f5f1e8" />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 1.85, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[2.2, 1, 4]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
        {/* Door */}
        <mesh position={[0, 0.5, 1.16]}>
          <boxGeometry args={[0.5, 0.9, 0.05]} />
          <meshStandardMaterial color="#5d3a1a" />
        </mesh>
        {/* Windows */}
        <mesh position={[-0.8, 0.9, 1.16]}>
          <boxGeometry args={[0.5, 0.5, 0.05]} />
          <meshStandardMaterial color="#87ceeb" emissive="#87ceeb" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0.8, 0.9, 1.16]}>
          <boxGeometry args={[0.5, 0.5, 0.05]} />
          <meshStandardMaterial color="#87ceeb" emissive="#87ceeb" emissiveIntensity={0.2} />
        </mesh>
        {/* Trees */}
        <group position={[-2.5, 0, 0]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 1]} />
            <meshStandardMaterial color="#5d3a1a" />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[0.5, 1.2, 8]} />
            <meshStandardMaterial color="#2d5016" />
          </mesh>
        </group>
        <group position={[2.5, 0, 0]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 1]} />
            <meshStandardMaterial color="#5d3a1a" />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[0.5, 1.2, 8]} />
            <meshStandardMaterial color="#2d5016" />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

export default function ThreeScene() {
  return (
    <Canvas className="three-canvas" camera={{ position: [0, 2, 6], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-10, -5, -10]} intensity={0.4} color="#d4a017" />
      <House />
      <Environment preset="sunset" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}