import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Text as RNText,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontFamily } from '@/theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

const AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuA2HoaGWyyHaBvxE3Zt-EtBZh_i_i6c5cvN5m2qFWDHJr7Mx-yCZc-taxe_L_jyjtrBvvRjuyWYx1Gjkr7wnzIWessUov6gW45c5ZD2J76Hx1rGYg1jzEVJJtcPQyWLIWGdc6wJB1e_zhBjD0R7OGBECgCbWk3d3wccoDe5mXg4DRBbmCu-5PK9mggtvlsfqISJjmPa537BV7p-4fYNiLmZegrMhYyTwxpUZ1BvSrWDSfn_yXdM9MkG4I1bPJAStoy1osNrMCpdPl8S";

const Text = ({ style, ...props }: any) => <RNText style={[styles.defaultText, style]} {...props} />;

export default function LiveMatchSimulationScreen() {
  const router = useRouter();
  const [minute, setMinute] = useState(64);

  // Fake match ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setMinute((m) => (m >= 90 ? 90 : m + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Stadium Background Layer */}
      <View style={styles.bgContainer}>
         <LinearGradient
            colors={['#1b3a1b', '#0f131f']}
            start={{ x: 0.5, y: 0.2 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
         />
      </View>

      {/* Floating Particles Simulation */}
      <View style={styles.particlesLayer} pointerEvents="none">
         <View style={[styles.particle, { top: '25%', left: '25%', backgroundColor: Colors.primary, opacity: 0.2 }]} />
         <View style={[styles.particle, { bottom: '33%', right: '25%', backgroundColor: Colors.secondaryContainer, width: 8, height: 8, opacity: 0.1 }]} />
         <View style={[styles.particle, { top: '50%', right: '50%', backgroundColor: Colors.white, opacity: 0.2 }]} />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Top App Bar : Scoreboard */}
        <BlurView intensity={40} tint="dark" style={styles.appBar}>
          {/* Back btn / Profile */}
          <TouchableOpacity onPress={() => router.back()} style={styles.appBarLeft}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>

          {/* Center Scoreboard */}
          <View style={styles.scoreboardCenter}>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.teamName}>London FC</Text>
              <Text style={styles.teamScore}>2</Text>
            </View>
            
            <View style={styles.timeBox}>
              <Text style={styles.timeMinute}>{minute}'</Text>
              <Text style={styles.timeLabel}>LIVE MATCH</Text>
            </View>

            <View style={{ alignItems: 'flex-start' }}>
              <Text style={styles.teamName}>Madrid Utd</Text>
              <Text style={styles.teamScore}>1</Text>
            </View>
          </View>

          {/* Settings */}
          <TouchableOpacity style={styles.appBarRight}>
            <Ionicons name="settings-outline" size={24} color={Colors.outline} />
          </TouchableOpacity>
        </BlurView>

        {/* Main tactical View */}
        <View style={styles.mainTacticalWrapper}>
          <View style={styles.pitchBoard}>
             <View style={styles.pitchLines}>
                {/* Center Circle */}
                <View style={styles.centerCircle} />
                <View style={styles.halfwayLine} />
                {/* Penalty Areas */}
                <View style={styles.penaltyAreaTop} />
                <View style={styles.penaltyAreaBottom} />
             </View>

             {/* Simulated Home Team Dots */}
             <View style={[styles.playerDot, styles.homeDot, { top: '25%', left: '25%' }]}><Text style={styles.dotText}>9</Text></View>
             <View style={[styles.playerDot, styles.homeDot, { top: '33%', left: '50%' }]}><Text style={styles.dotText}>10</Text></View>
             <View style={[styles.playerDot, styles.homeDot, { top: '25%', right: '25%' }]}><Text style={styles.dotText}>7</Text></View>
             
             {/* Simulated Away Team Dots */}
             <View style={[styles.playerDot, styles.awayDot, { bottom: '25%', left: '33%' }]}><Text style={styles.dotText}>4</Text></View>
             <View style={[styles.playerDot, styles.awayDot, { bottom: '33%', right: '50%' }]}><Text style={styles.dotText}>5</Text></View>
             
             {/* The Ball */}
             <View style={styles.ball} />
          </View>

          {/* Quick Widgets */}
          <View style={styles.floatingSubs}>
             <TouchableOpacity style={styles.widgetBtn}>
                <Ionicons name="swap-horizontal" size={28} color={Colors.primary} />
                <Text style={styles.widgetLabel}>SUBS</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.widgetBtn}>
                <Ionicons name="options" size={28} color={Colors.secondaryContainer} />
                <Text style={styles.widgetLabel}>TACTICS</Text>
             </TouchableOpacity>
          </View>

          <View style={styles.floatingMentality}>
             <View style={styles.mentalityBox}>
                <Text style={[styles.widgetLabel, { transform: [{ rotate: '-90deg' }], width: 60 }]}>MENTALITY</Text>
                <View style={styles.mentalityTrack}>
                   <LinearGradient 
                      colors={['#f97316', Colors.primary]}
                      style={{ position: 'absolute', bottom: 0, width: '100%', height: '70%' }}
                   />
                </View>
                <Text style={[styles.widgetLabel, { color: Colors.primary }]}>ATTACK</Text>
             </View>
          </View>
        </View>

        {/* Commentary & Controls Section */}
        <View style={styles.bottomControls}>
          <BlurView intensity={40} tint="dark" style={styles.commentaryPanel}>
             {/* Live indicator */}
             <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE FEED</Text>
             </View>
             
             <View style={styles.commentRow}>
                <Text style={styles.commentTime}>62'</Text>
                <View style={styles.commentBody}>
                   <Text style={styles.commentMain}>
                      <Text style={{ color: Colors.primary }}>GOAL! </Text> 
                      London FC - Julian Alvarez with a clinical finish after a defensive error. Stadium is erupting!
                   </Text>
                   <Text style={styles.commentSub}>Madrid Utd defenders look shell-shocked.</Text>
                </View>
             </View>
          </BlurView>

          <View style={styles.actionButtonsRow}>
             <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8}>
                <LinearGradient
                   colors={['#2ae500', '#1ca600']}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 1 }}
                   style={styles.boostBtn}
                >
                   <Ionicons name="flash" size={20} color={Colors.onPrimary} />
                   <Text style={styles.boostBtnText}>BOOST MORALE</Text>
                </LinearGradient>
             </TouchableOpacity>

             <TouchableOpacity style={styles.statsBtn} activeOpacity={0.8}>
                <Ionicons name="analytics" size={20} color={Colors.white} />
                <Text style={styles.statsBtnText}>LIVE STATS</Text>
             </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  defaultText: { fontFamily: FontFamily.regular, color: Colors.textPrimary },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  bgContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    opacity: 0.8,
  },
  particlesLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  safeArea: {
    flex: 1,
    zIndex: 2,
    justifyContent: 'space-between',
  },
  // Top App Bar
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  appBarLeft: {
    padding: Spacing.sm,
  },
  scoreboardCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -120 }],
  },
  teamName: {
    fontFamily: FontFamily.headingBold,
    fontSize: 10,
    color: Colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  teamScore: {
    fontFamily: FontFamily.headingBlack,
    fontSize: 32,
    color: Colors.white,
    lineHeight: 40,
  },
  timeBox: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  timeMinute: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.xl,
    color: Colors.primary,
    letterSpacing: -1,
  },
  timeLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 8,
    color: Colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  appBarRight: {
    padding: Spacing.sm,
  },
  // Tactical Board
  mainTacticalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pitchBoard: {
    width: '85%',
    maxWidth: 400,
    aspectRatio: 3 / 4,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 20,
  },
  pitchLines: {
    ...StyleSheet.absoluteFillObject,
    margin: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
  },
  centerCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  halfwayLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: [{ translateY: -1 }],
  },
  penaltyAreaTop: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 150,
    height: 60,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: 'rgba(255,255,255,0.1)',
    transform: [{ translateX: -75 }],
  },
  penaltyAreaBottom: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 150,
    height: 60,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: 'rgba(255,255,255,0.1)',
    transform: [{ translateX: -75 }],
  },
  playerDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeDot: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  awayDot: {
    backgroundColor: Colors.secondaryContainer,
    shadowColor: Colors.secondaryContainer,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  dotText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: 8,
    color: Colors.surface,
  },
  ball: {
    position: 'absolute',
    top: '42%',
    left: '48%',
    width: 10,
    height: 10,
    backgroundColor: Colors.white,
    borderRadius: 5,
    shadowColor: Colors.white,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  // Widgets
  floatingSubs: {
    position: 'absolute',
    left: Spacing.lg,
    top: '50%',
    transform: [{ translateY: -60 }],
    gap: Spacing.md,
  },
  widgetBtn: {
    backgroundColor: 'rgba(49,52,66,0.6)',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  widgetLabel: {
    fontFamily: FontFamily.headingBlack,
    fontSize: 7,
    color: Colors.outline,
    marginTop: 4,
  },
  floatingMentality: {
    position: 'absolute',
    right: Spacing.lg,
    top: '50%',
    transform: [{ translateY: -70 }],
  },
  mentalityBox: {
    backgroundColor: 'rgba(49,52,66,0.6)',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: Spacing.md,
  },
  mentalityTrack: {
    width: 6,
    height: 80,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  // Bottom Controls
  bottomControls: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.xl,
  },
  commentaryPanel: {
    borderRadius: 24,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
  },
  liveIndicator: {
    position: 'absolute',
    top: -10,
    left: Spacing.xl,
    backgroundColor: Colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    backgroundColor: Colors.white,
    borderRadius: 3,
  },
  liveText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: 8,
    color: Colors.white,
    letterSpacing: 1,
  },
  commentRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
    marginTop: 8,
  },
  commentTime: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  commentBody: {
    flex: 1,
  },
  commentMain: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.white,
    lineHeight: 20,
  },
  commentSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.outline,
    fontStyle: 'italic',
    marginTop: 4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  boostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  boostBtnText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.sm,
    color: Colors.onPrimary,
    letterSpacing: 2,
  },
  statsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surfaceContainerHighest,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(42,229,0,0.2)',
  },
  statsBtnText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.sm,
    color: Colors.white,
    letterSpacing: 2,
  }
});
