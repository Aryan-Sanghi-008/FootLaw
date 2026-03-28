import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text as RNText,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  Platform
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchSquad } from '@/store/slices/squadSlice';
import { Colors, Spacing, BorderRadius, FontSize, FontFamily } from '@/theme/tokens';
import type { IPlayer } from '@footlaw/shared';
import Pitch3D from '@/components/3d/Pitch3D';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

export const formatCurrency = (value: number) => {
  return '$' + (value / 1000000).toFixed(1) + 'M';
};

const AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuCbQFfGWaaFBEsMVCD32vduNrpNHxh2QLnlWvfklrl4u10wsZ86R076e7ApLipN3V_L9OPn7DlkWBK0Tr08dtz3GDhUOZEe5DXelbCJPJb7dBNRldPhj4dqoTxrepd-iV07iyLZ0Trnz1FdnjRi9TrdfabvfehD1LJpZEUQdSV68nxlrW5ssmKa_LwiI8QxDjmpA7ufwCkG5dcZqS4I3TViAcoaSiRGNhAQjrv_k0M8rB_O7MyE_Q9_CgLTICwBasM4PW_95iDKLOMO";

export const getPitchPosition = (pos: string, index: number): [number, number, number] => {
  switch(pos) {
    case 'GK': return [0, 0, -8];
    case 'DL': return [-4, 0, -5];
    case 'DC': return [index % 2 === 0 ? -1.5 : 1.5, 0, -5];
    case 'DR': return [4, 0, -5];
    case 'DMC': return [0, 0, -2];
    case 'ML': return [-4, 0, 1];
    case 'MC': return [index % 2 === 0 ? -1.5 : 1.5, 0, 1];
    case 'MR': return [4, 0, 1];
    case 'AML': return [-3, 0, 4];
    case 'AMC': return [0, 0, 4];
    case 'AMR': return [3, 0, 4];
    case 'ST': return [index % 2 === 0 ? -1.5 : 1.5, 0, 7];
    default: return [0, 0, 0];
  }
};

const Text = ({ style, ...props }: any) => <RNText style={[styles.defaultText, style]} {...props} />;

function TacticSlider({ label, value, type }: { label: string; value: string; type: 'primary' | 'secondary' | 'error' }) {
  const colorMap: Record<string, string[]> = {
    primary: [Colors.primary, Colors.onPrimaryContainer],
    secondary: [Colors.secondaryContainer, '#00b4d8'],
    error: [Colors.error, Colors.onErrorContainer],
  };
  const colors = colorMap[type];

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <View style={[styles.sliderBadge, { backgroundColor: colors[0] + '20' }]}>
          <Text style={[styles.sliderBadgeText, { color: colors[0] }]}>{value}</Text>
        </View>
      </View>
      <View style={styles.sliderTrack}>
        <LinearGradient
          colors={colors as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.sliderFill, { width: type === 'primary' ? '75%' : type === 'secondary' ? '50%' : '90%' }]}
        />
      </View>
    </View>
  );
}

function BenchPlayer({ player }: { player: IPlayer }) {
  return (
    <TouchableOpacity style={styles.benchCard}>
      <View style={styles.benchImgContainer}>
        {/* Mock profile image generation based on name length for visual variety */}
        <View style={[styles.benchPlaceholder, { backgroundColor: Colors.surfaceContainerHighest }]}>
           <Ionicons name="person" size={32} color={Colors.outline} />
        </View>
        <View style={styles.benchRatingBadge}>
          <Text style={styles.benchRatingText}>{Math.floor(player.starRating * 10) + 40}</Text>
        </View>
      </View>
      <Text style={styles.benchName} numberOfLines={1}>{player.lastName}</Text>
      <View style={styles.benchMeta}>
        <Ionicons 
          name={player.morale === 'Superb' ? "happy" : player.morale === 'Terrible' ? "sad" : "partly-sunny"} 
          size={14} 
          color={Colors.primary} 
        />
        <Text style={styles.benchPos}>{player.position}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SquadScreen() {
  const dispatch = useAppDispatch();
  const { currentClub } = useAppSelector((state) => state.club);
  const { players, isLoading } = useAppSelector((s) => s.squad);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'squad' | 'formation' | 'roles'>('squad');

  useEffect(() => {
    dispatch(fetchSquad());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchSquad());
    setRefreshing(false);
  };

  const startingEleven = useMemo(() => players.slice(0, 11), [players]);
  const benchPlayers = useMemo(() => players.slice(11), [players]);

  const pitchPlayers = useMemo(() => {
    return startingEleven.map((p, idx) => ({
      id: p._id,
      name: p.lastName,
      position: getPitchPosition(p.position, idx),
    }));
  }, [startingEleven]);

  const balance = currentClub ? formatCurrency(currentClub.balance) : '$0';
  const tokens = currentClub?.tokens || 0;

  if (isLoading && players.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top App Bar */}
        <BlurView intensity={30} tint="dark" style={styles.appBar}>
          <View style={styles.appBarContent}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: AVATAR }} style={styles.avatar} />
            </View>
            <RNText style={styles.brandTitle}>FOOTLAW</RNText>
          </View>
          <View style={styles.appBarRight}>
            <View style={styles.statsPill}>
              <Text style={styles.statsText}>{tokens} <Ionicons name="diamond" size={10}/> • {balance}</Text>
            </View>
          </View>
        </BlurView>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        >
          {/* Management Tabs */}
          <View style={styles.tabsContainer}>
             {['squad', 'formation', 'roles'].map((tab) => (
                <TouchableOpacity 
                  key={tab} 
                  style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
                  onPress={() => setActiveTab(tab as any)}
                >
                  <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
                    {tab.toUpperCase()}
                  </Text>
                </TouchableOpacity>
             ))}
          </View>

          {/* Current Squad Stats */}
          <View style={styles.statsCard}>
            <View style={styles.statsCardGlow} />
            <Text style={styles.sectionTitle}>CURRENT SQUAD STATS</Text>
            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { borderLeftColor: Colors.primary }]}>
                <Text style={styles.statBoxLabel}>TOTAL QUALITY</Text>
                <Text style={styles.statBoxValue}>104.2%</Text>
              </View>
              <View style={[styles.statBox, { borderLeftColor: Colors.secondaryContainer }]}>
                <Text style={styles.statBoxLabel}>MORAL AVG.</Text>
                <Text style={styles.statBoxValue}>High</Text>
              </View>
            </View>
          </View>

          {/* Tactical Sliders */}
          <View style={styles.tacticsCard}>
            <Text style={styles.sectionTitle}>MATCH TACTICS</Text>
            <View style={styles.slidersWrapper}>
              <TacticSlider label="TEAM MENTALITY" value="Attacking" type="primary" />
              <TacticSlider label="PASSING STYLE" value="Mixed" type="secondary" />
              <TacticSlider label="PRESSING INTENSITY" value="High" type="error" />
            </View>
          </View>

          <TouchableOpacity style={styles.submitBtn}>
             <LinearGradient
                colors={['#2ae500', '#1ca600']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitBtnGradient}
             >
                <Text style={styles.submitBtnText}>SUBMIT STRATEGY</Text>
             </LinearGradient>
          </TouchableOpacity>

          {/* 3D Pitch View */}
          <View style={styles.pitchContainer}>
            <LinearGradient
               colors={[Colors.surfaceContainerLow, Colors.surface]}
               style={StyleSheet.absoluteFillObject}
            />
            {/* The actual 3D engine rendered above the gradient background */}
            <Pitch3D players={pitchPlayers} />
            
            <View style={styles.pitchOverlayBadge}>
               <View style={styles.pulseDot} />
               <Text style={styles.pitchOverlayText}>LIVE MATCH LOGIC ACTIVE</Text>
            </View>
          </View>

          {/* Substitutes */}
          <View style={styles.benchContainer}>
            <View style={styles.benchHeader}>
              <Text style={styles.sectionTitle}>SUBSTITUTES</Text>
              <TouchableOpacity>
                <Text style={styles.swapBtnText}>SWAP BENCH</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.benchScroll}>
               {benchPlayers.map(p => <BenchPlayer key={p._id} player={p} />)}
               {benchPlayers.length === 0 && <Text style={{ color: Colors.outline }}>No substitutes available.</Text>}
            </ScrollView>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
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
  safeArea: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  appBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.xl,
    color: Colors.white,
    letterSpacing: -1,
  },
  appBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsPill: {
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statsText: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.xs,
    color: Colors.primary,
    letterSpacing: 2,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.xl,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(42,229,0,0.1)',
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  tabLabel: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.sm,
    color: Colors.outline,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
  statsCard: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 24,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  statsCardGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    backgroundColor: 'rgba(42,229,0,0.1)',
    borderRadius: 60,
  },
  sectionTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.xs,
    color: Colors.secondaryContainer,
    letterSpacing: 2,
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surfaceContainer,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderLeftWidth: 2,
  },
  statBoxLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.outline,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statBoxValue: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize['2xl'],
    color: Colors.white,
  },
  tacticsCard: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 24,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: Spacing.xl,
  },
  slidersWrapper: {
    gap: Spacing.xl,
  },
  sliderContainer: {},
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.sm,
  },
  sliderLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.white,
    letterSpacing: 1,
  },
  sliderBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  sliderBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  submitBtn: {
    marginBottom: Spacing.xl,
  },
  submitBtnGradient: {
    height: 56,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.sm,
    color: Colors.onPrimary,
    letterSpacing: 3,
  },
  pitchContainer: {
    aspectRatio: 3 / 4,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: Spacing.xl,
  },
  pitchOverlayBadge: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(10,14,26,0.8)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pulseDot: {
    width: 8,
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  pitchOverlayText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: 10,
    color: Colors.white,
    letterSpacing: 2,
  },
  benchContainer: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 24,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  benchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  swapBtnText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: 10,
    color: Colors.white,
    letterSpacing: 2,
  },
  benchScroll: {
    gap: Spacing.md,
  },
  benchCard: {
    width: 100,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginRight: Spacing.md,
  },
  benchImgContainer: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  benchPlaceholder: {
    height: 60,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benchRatingBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  benchRatingText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.white,
  },
  benchName: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  benchMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  benchPos: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: Colors.outline,
  }
});
