import React, { Suspense } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { Colors } from '@/theme/tokens';

interface PlayerMarkerProps {
  position: [number, number, number];
  color?: string;
  name: string;
}

const PlayerMarker: React.FC<PlayerMarkerProps> = ({ position, color = '#ff3366', name }) => {
  return (
    <group position={position}>
      {/* Player Body (Cylinder) */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Player Head (Sphere) */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#fcd5ce" />
      </mesh>
      
      {/* In a real scenario, you can add 3D text or a View overlay for the name */}
    </group>
  );
};

interface Pitch3DProps {
  players?: { id: string; name: string; position: [number, number, number]; color?: string }[];
}

export default function Pitch3D({ players = [] }: Pitch3DProps) {
  return (
    <View style={styles.container}>
      <Canvas shadows>
        {/* Camera Setup */}
        <PerspectiveCamera 
          makeDefault 
          position={[0, 10, 12]} // Looking from the "stands" diagonally down
          fov={45} 
        />
        
        {/* Controls so the user can pan around their squad */}
        <OrbitControls 
          enablePan={false}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.5} // Prevent going below the ground
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />

        {/* The Pitch (Green Plane) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[12, 20]} /> {/* Typical 68x105 ratio approximated */}
          <meshStandardMaterial color="#2d6a4f" />
        </mesh>

        {/* Pitch Lines MVP (White borders) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[11.6, 19.6]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>

        {/* Render Players */}
        {players.map((p) => (
          <PlayerMarker key={p.id} position={p.position} name={p.name} color={p.color} />
        ))}

      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: 'hidden', // to keep canvas inside bounds
  },
});
