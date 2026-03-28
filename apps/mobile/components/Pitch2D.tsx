import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from './Themed';
import { Colors } from '../theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface Player {
  id: string;
  name: string;
  position: [number, number, number]; // [x, y, z] from 3D coords
  color?: string;
}

interface Pitch2DProps {
  players: Player[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PITCH_WIDTH = SCREEN_WIDTH - 40; // 20px padding on each side
const PITCH_HEIGHT = PITCH_WIDTH * 1.4; // Approximating 105:68 ratio

export default function Pitch2D({ players = [] }: Pitch2DProps) {
  
  // Mapping 3D coordinates [-5 to 5 for x] and [-10 to 10 for z] to 0-100%
  const getPositionStyles = (pos: [number, number, number]) => {
    const x = ((pos[0] + 5) / 10) * 100;
    const y = ((pos[2] + 10) / 20) * 100; 
    
    return {
      left: `${x}%` as any,
      top: `${y}%` as any,
    };
  };

  return (
    <View style={[styles.container, { height: PITCH_HEIGHT }]}>
      {/* Field Background with Grass Texture Effect */}
      <LinearGradient
        colors={['#1a4331', '#2d6a4f', '#1a4331']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Pitch Lines */}
      <View style={styles.pitchLines}>
        {/* Outlines */}
        <View style={styles.outerBorder} />
        {/* Halfway Line */}
        <View style={styles.halfwayLine} />
        {/* Center Circle */}
        <View style={styles.centerCircle} />
        {/* Penalty Areas */}
        <View style={[styles.penaltyArea, styles.topPenaltyArea]} />
        <View style={[styles.penaltyArea, styles.bottomPenaltyArea]} />
      </View>

      {/* Render Players */}
      {players.map((player) => {
        const coords = getPositionStyles(player.position);
        return (
          <View 
            key={player.id} 
            style={[styles.playerContainer, coords]}
          >
            <View style={[styles.playerIcon, { backgroundColor: player.color || Colors.primary }]}>
               <View style={styles.playerGlow} />
               <Ionicons name="shirt" size={14} color="white" />
            </View>
            <View style={styles.nameBadge}>
               <Text className="font-headingBold text-[8px] text-white uppercase text-center" numberOfLines={1}>
                 {player.name}
               </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  pitchLines: {
    ...StyleSheet.absoluteFillObject,
    padding: 10,
  },
  outerBorder: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  halfwayLine: {
    position: 'absolute',
    top: '50%',
    left: 10,
    right: 10,
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  centerCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 60,
    height: 60,
    marginLeft: -30,
    marginTop: -30,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  penaltyArea: {
    position: 'absolute',
    width: '50%',
    height: '18%',
    left: '25%',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  topPenaltyArea: {
    top: 10,
    borderTopWidth: 0,
  },
  bottomPenaltyArea: {
    bottom: 10,
    borderBottomWidth: 0,
  },
  playerContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    marginLeft: -30,
    marginTop: -30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  playerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  playerGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  nameBadge: {
    marginTop: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'center',
  }
});
