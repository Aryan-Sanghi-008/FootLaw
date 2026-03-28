import React from 'react';
import { 
  StyleSheet, 
  View, 
  ImageBackground, 
  TouchableOpacity,
  Image,
  Text as RNText,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchNextMatch } from '../../store/slices/matchSlice';
import { fetchMyClub } from '../../store/slices/clubSlice';
import { Text } from '../../components/Themed';
import { Colors, Spacing, BorderRadius, FontSize, FontFamily } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatCurrency } from '../../utils/helpers';

const AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuB-UdCQvanlnJyonuySo03rm4Lgc-AFo-pIHf1ucRNnYtNYzUN9MTacwn_HdMpWPkeCt3kho5ROSru4QNyIUuPVIwRVaO_rkFOPvuDmol7be1_A7N3usMDhw7Fud_36J29br2Mxj3scM6V8uv1QgydkPMnaaArTAZ1rUf_1tWOaAN2lVvLusJKKxb6QbJlxZF4C2J28I1bGS-GEIm7CPMILrzM8RVZAWKMoFVF0dV_7a-ZiHSknFFq2oaWfMKbnTFtfLIWFMWZC1qco";

export default function MatchCampaignScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentClub } = useAppSelector((state) => state.club);
  const { nextMatch, isLoading } = useAppSelector((state) => state.match);

  React.useEffect(() => {
    dispatch(fetchMyClub());
    dispatch(fetchNextMatch());
  }, [dispatch]);

  const balance = currentClub ? formatCurrency(currentClub.cash) : '$0';
  const tokens = currentClub?.tokens || 0;

  const oppositionName = nextMatch 
    ? (nextMatch.homeClubId === currentClub?.id ? 'Away Team' : 'Home Team') 
    : 'Waiting...';

  return (
    <View style={styles.container}>
      {/* Background Map */}
      <View style={styles.backgroundContainer}>
         <ImageBackground 
            source={{ uri: 'https://placeholder.pics/svg/300' }} 
            style={[styles.bgImage, { opacity: 0.1 }]} 
         />
      </View>

      {/* Map Markers */}
      <View style={[styles.marker, { top: '30%', left: '20%' }]}>
        <View style={styles.markerCircleCompleted}>
           <Ionicons name="checkmark" size={16} color={Colors.primary} />
        </View>
        <View style={styles.markerLabelBox}>
           <Text style={styles.markerLabel}>Rio Carnival</Text>
        </View>
      </View>

      <View style={[styles.marker, { top: '45%', left: '50%' }]}>
        <View style={styles.pulseRing} />
        <View style={styles.markerCircleActive}>
           <Ionicons name="location" size={24} color={Colors.secondaryContainer} />
        </View>
        <View style={[styles.markerLabelBox, { borderColor: 'rgba(0,227,253,0.3)', borderWidth: 1 }]}>
           <Text style={[styles.markerLabel, { color: Colors.secondaryContainer }]}>Madrid Open</Text>
        </View>
      </View>

      <View style={[styles.marker, { top: '60%', left: '80%', opacity: 0.4 }]}>
        <View style={styles.markerCircleLocked}>
           <Ionicons name="lock-closed" size={16} color={Colors.outline} />
        </View>
        <View style={styles.markerLabelBox}>
           <Text style={styles.markerLabelLocked}>Tokyo Neon</Text>
        </View>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top App Bar */}
        <BlurView intensity={30} tint="dark" style={styles.appBar}>
          <View style={styles.appBarContent}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: AVATAR }} style={styles.avatar} />
            </View>
            <RNText style={styles.brandTitle}>FOOTLAW</RNText>
          </View>
          <View style={styles.statsPill}>
             <Text style={styles.statsText}>{tokens} <Ionicons name="diamond" size={10}/> • {balance}</Text>
          </View>
        </BlurView>

        {/* Objective Card Overlay */}
        <View style={styles.contentWrapper}>
           <BlurView intensity={20} tint="dark" style={styles.objectiveCard}>
              <View style={styles.objectiveHeader}>
                 <View>
                    <Text style={styles.stageLabel}>CURRENT STAGE</Text>
                    <Text style={styles.stageTitle}>
                      {nextMatch?.competition || 'The Madrid Crossing'}
                    </Text>
                 </View>
                 <View style={styles.iconBox}>
                    <Ionicons name="football" size={24} color={Colors.secondaryContainer} />
                 </View>
              </View>

              <Text style={styles.objectiveDesc}>
                 Face off against the capital's elite. Their high-press tactical engine requires precise passing and counter-attacking stability.
              </Text>

              <View style={styles.statsGrid}>
                 <View style={styles.statBox}>
                    <Text style={styles.statBoxLabel}>DIFFICULTY</Text>
                    <View style={{ flexDirection: 'row', gap: 2 }}>
                       <Ionicons name="star" size={14} color={Colors.primary} />
                       <Ionicons name="star" size={14} color={Colors.primary} />
                       <Ionicons name="star" size={14} color={Colors.primary} />
                       <Ionicons name="star" size={14} color={Colors.primary} />
                       <Ionicons name="star" size={14} color={Colors.surfaceBorder} />
                    </View>
                 </View>
                 <View style={styles.statBox}>
                    <Text style={styles.statBoxLabel}>OPPOSITION</Text>
                    <Text style={styles.oppText}>{oppositionName}</Text>
                 </View>
              </View>

              <View style={styles.rewardsSection}>
                 <Text style={styles.statBoxLabel}>VICTORY REWARDS</Text>
                 <View style={styles.rewardsRow}>
                    <View style={styles.rewardPillPrimary}>
                       <Ionicons name="cash" size={16} color={Colors.primary} />
                       <Text style={styles.rewardTextPrimary}>250k</Text>
                    </View>
                    <View style={styles.rewardPillTertiary}>
                       <Ionicons name="ticket" size={16} color={Colors.tertiary} />
                       <Text style={styles.rewardTextTertiary}>15 T</Text>
                    </View>
                    <View style={styles.rewardPillSecondary}>
                       <Text style={styles.rewardTextSecondary}>XP</Text>
                    </View>
                 </View>
              </View>

              <TouchableOpacity 
                activeOpacity={0.8} 
                onPress={() => nextMatch && router.push(`/sim?matchId=${nextMatch._id}`)}
                disabled={!nextMatch || isLoading}
              >
                 <LinearGradient
                   colors={['#2ae500', '#1ca600']}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 1 }}
                   style={[styles.startBtn, (!nextMatch || isLoading) && { opacity: 0.5 }]}
                 >
                    <Text style={styles.startBtnText}>
                      {isLoading ? 'PREPARING...' : (nextMatch ? 'START MATCH' : 'NO FIXTURES')}
                    </Text>
                 </LinearGradient>
              </TouchableOpacity>
           </BlurView>
        </View>

      </SafeAreaView>

      {/* Season Pass Progress Track */}
      <View style={styles.seasonPassContainer}>
         <BlurView intensity={50} tint="dark" style={styles.seasonPassBox}>
            <View style={styles.spHeader}>
               <Text style={styles.spTitle}>SEASON PASS PROGRESS</Text>
               <View style={styles.spLevelBadge}>
                  <Text style={styles.spLevelText}>Level 12 / 50</Text>
               </View>
            </View>

            <View style={styles.progressTrackWrapper}>
               <View style={styles.progressTrackBg} />
               <View style={[styles.progressTrackFill, { width: '35%' }]} />
               
               <View style={styles.nodesContainer}>
                  <View style={styles.nodeCompleted}>
                     <Ionicons name="checkmark" size={16} color={Colors.onPrimary} />
                  </View>
                  <View style={styles.nodeActive}>
                     <Ionicons name="cube" size={16} color={Colors.primary} />
                  </View>
                  <View style={styles.nodeUpcoming}>
                     <Ionicons name="gift" size={16} color={Colors.white} />
                  </View>
                  <View style={styles.nodeUpcoming}>
                     <Ionicons name="diamond" size={16} color={Colors.white} />
                  </View>
                  <View style={styles.nodePremium}>
                     <Ionicons name="ribbon" size={24} color={Colors.onSecondaryContainer} />
                  </View>
               </View>
            </View>
         </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
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
  statsPill: {
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statsText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  // Map Markers
  marker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 1,
  },
  markerCircleCompleted: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(42,229,0,0.2)',
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  markerLabelBox: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 8,
  },
  markerLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  pulseRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,227,253,0.2)',
    top: -6,
    left: -6,
  },
  markerCircleActive: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,227,253,0.2)',
    borderWidth: 4,
    borderColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.secondaryContainer,
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  markerCircleLocked: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 2,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerLabelLocked: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.outline,
    textTransform: 'uppercase',
  },
  // Objective Card
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  objectiveCard: {
    borderRadius: 24,
    padding: Spacing['xl'],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  objectiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  stageLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.secondaryContainer,
    letterSpacing: 2,
    marginBottom: 4,
  },
  stageTitle: {
    fontFamily: FontFamily.headingBlack,
    fontSize: 28,
    color: Colors.white,
    letterSpacing: -1,
  },
  iconBox: {
    backgroundColor: Colors.surfaceContainerHighest,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  objectiveDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statBoxLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  oppText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
  rewardsSection: {
    marginBottom: Spacing['2xl'],
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  rewardPillPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryContainer,
    borderWidth: 1,
    borderColor: 'rgba(42,229,0,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  rewardTextPrimary: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  rewardPillTertiary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tertiaryContainer,
    borderWidth: 1,
    borderColor: 'rgba(189,194,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  rewardTextTertiary: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.tertiary,
  },
  rewardPillSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  rewardTextSecondary: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.secondaryContainer,
  },
  startBtn: {
    height: 60,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startBtnText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.lg,
    color: Colors.onPrimary,
    letterSpacing: 2,
  },
  // Season Pass Focus
  seasonPassContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 110 : 80,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    zIndex: 20,
  },
  seasonPassBox: {
    padding: Spacing.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  spHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  spTitle: {
    fontFamily: FontFamily.headingBlack,
    fontSize: 10,
    color: Colors.primary,
    letterSpacing: 2,
  },
  spLevelBadge: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  spLevelText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  progressTrackWrapper: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  progressTrackBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 4,
  },
  progressTrackFill: {
    position: 'absolute',
    left: 0,
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  nodesContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nodeCompleted: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeActive: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeUpcoming: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  nodePremium: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.secondaryContainer,
    borderWidth: 4,
    borderColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
