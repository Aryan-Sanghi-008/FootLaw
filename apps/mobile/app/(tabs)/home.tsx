import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  ImageBackground, 
  TouchableOpacity,
  Image,
  Text as RNText 
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchClub } from '@/store/slices/clubSlice';
import { Text } from '@/components/Themed';
import { Colors, Spacing, BorderRadius, FontSize, FontFamily, Shadow } from '@/theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatCurrency } from '@/utils/helpers';
import { useRouter } from 'expo-router';

const STADIUM_BG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCEcpuFsXaIT_jLAfkxWLC-QVK-rJJZH9cBr5335KDKNKphxHmnpWH6O9P2V9gbdw737PzPXv1EJYzl9EfWSxJkDe0Jyxk5yZ-Yoe_-GS4L1-a0eaVx8WzaT4h3KZLKe_cM_8J9FoTNwSP1jWbHGzTK_EtKF-6NvUXeYoIbH68fDFvcNGH3CLIyDhZZb4Z_boagT8MsrIa4_5vstuhLTYYxRQYIqSGtqw8xKhMlqpVSWoAPTJ9dhrAwZkaPbRZdd6gP64bqHBhybxRR";
const AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuBINf4CTlKW4Kd6m5WCapC3Z4yiR5H-JjYIRKp0caKKK-uc6Qc6oxrEsSYYyLWh0HBoKrZ4ztGlEKskIccXKmbLxlcVHd8YU7E7c12WqEBHEJIjM2kh9aKnNQa2f7t9Gz0Psvvjbf1p6r5WWZ8RjyOL90QvvnLJ-_T7OGkn6FIBEPm8Vols-nEm-yY32XGXCtzZtCYGuNDiiHJRRJ6W-H0XTEEviO6OCB--kmrCohIataqW15bv3zy3SA-VwccCuWhTB1alibLNDUWt";
const PLAYER_SPOTLIGHT = "https://lh3.googleusercontent.com/aida-public/AB6AXuAk2MOfOfnKRUPJKMhLZR0xGilUMdcRuGsMks0j4fGMuIJZNgftQGl6a5vWnasc7a0wI9toaMfoutNs2Wbsr21n5Oj2XvnAZmZVR3zyE46YUZWQP1RHDBOeDNUg6ve19k4YBF1d4VLEacNLufH_rwXaEcON40lnn5wFlga6odMe2JcZ1XbdQb8iNNSaYa8JlS70lMS4NI94lPEA5adPUhzcWHZE1oFyJqRWqCILTjPXoFkMzv6S5_hCiQBaqIUg3LqDFGMGrFRPCWTl";

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentClub, isLoading } = useAppSelector((state) => state.club);

  useEffect(() => {
    dispatch(fetchClub());
  }, [dispatch]);

  const clubName = currentClub?.name || 'Football Club';
  const balance = currentClub ? formatCurrency(currentClub.balance) : '$0';
  const tokens = currentClub?.tokens || 0;

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['rgba(15,19,31,0.2)', Colors.background]}
          style={styles.bgGradient}
        />
        <Image source={{ uri: STADIUM_BG }} style={styles.bgImage} />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top App Bar */}
        <BlurView intensity={30} tint="dark" style={styles.appBar}>
          <View style={styles.appBarContent}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: AVATAR }} style={styles.avatar} />
              <View style={styles.avatarBadge}>
                <Ionicons name="checkmark" size={10} color={Colors.onPrimary} style={{ fontWeight: 'bold' }} />
              </View>
            </View>
            <RNText style={styles.brandTitle}>FOOTLAW</RNText>
          </View>
          <View style={styles.appBarRight}>
            <View style={styles.statsPill}>
              <Text style={styles.statsText}>{tokens} <Ionicons name="diamond" size={10}/> • {balance} • 85%</Text>
            </View>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications" size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </BlurView>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Main Focus: Next Match */}
          <BlurView intensity={20} tint="dark" style={styles.matchCard}>
            <View style={styles.matchCardGlow} />
            
            <View style={styles.matchHeader}>
              <View style={styles.matchBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.matchBadgeText}>MATCHDAY 24 • LEAGUE</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.kickoffLabel}>KICKOFF IN</Text>
                <Text style={styles.kickoffTime}>00:42:15</Text>
              </View>
            </View>

            <View style={styles.teamsContainer}>
              {/* Home Team */}
              <View style={styles.team}>
                <View style={[styles.shieldContainer, { borderColor: 'rgba(42,229,0,0.2)' }]}>
                  <Ionicons name="shield" size={40} color={Colors.primary} />
                </View>
                <Text style={styles.teamName} numberOfLines={1}>{clubName}</Text>
                <Text style={styles.teamHomeAway}>HOME</Text>
              </View>

              <View style={styles.vsContainer}>
                <Text style={styles.vsText}>VS</Text>
                <LinearGradient
                  colors={['transparent', 'rgba(42,229,0,0.5)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.vsLine}
                />
              </View>

              {/* Away Team */}
              <View style={styles.team}>
                <View style={[styles.shieldContainer, { borderColor: 'rgba(0,227,253,0.2)' }]}>
                  <Ionicons name="shield" size={40} color={Colors.secondaryContainer} />
                </View>
                <Text style={styles.teamName} numberOfLines={1}>Madrid Galac..</Text>
                <Text style={styles.teamHomeAway}>AWAY</Text>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.8} style={styles.matchBtnWrapper}>
              <LinearGradient
                colors={['#2ae500', '#1ca600']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.matchBtn}
              >
                <Text style={styles.matchBtnText}>GO TO MATCH</Text>
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>

          {/* Quick Links */}
          <View style={styles.quickLinksGrid}>
             <TouchableOpacity style={styles.quickLinkCard}>
               <View style={styles.quickLinkLeft}>
                 <View style={[styles.quickLinkIconBox, { backgroundColor: 'rgba(42,229,0,0.1)' }]}>
                   <Ionicons name="barbell" size={24} color={Colors.primary} />
                 </View>
                 <View style={{ flex: 1, marginLeft: Spacing.md }}>
                   <Text style={styles.quickLinkTitle}>TRAINING PROGRESS</Text>
                   <Text style={styles.quickLinkSub}>8 players reached elite level</Text>
                 </View>
               </View>
               <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
             </TouchableOpacity>

             <TouchableOpacity style={styles.quickLinkCard}>
               <View style={styles.quickLinkLeft}>
                 <View style={[styles.quickLinkIconBox, { backgroundColor: 'rgba(0,227,253,0.1)' }]}>
                   <Ionicons name="swap-horizontal" size={24} color={Colors.secondaryContainer} />
                 </View>
                 <View style={{ flex: 1, marginLeft: Spacing.md }}>
                   <Text style={styles.quickLinkTitle}>TRANSFER NEWS</Text>
                   <Text style={styles.quickLinkSub}>Scouts found 3 prospects</Text>
                 </View>
               </View>
               <Ionicons name="chevron-forward" size={20} color={Colors.secondaryContainer} />
             </TouchableOpacity>
          </View>

          {/* League Stats Overview */}
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { borderLeftColor: Colors.primary }]}>
              <Text style={styles.statLabel}>POSITION</Text>
              <Text style={styles.statValue}>2nd</Text>
              <Text style={styles.statMeta}>+1 from last week</Text>
            </View>
            <View style={[styles.statBox, { borderLeftColor: Colors.secondaryContainer }]}>
              <Text style={styles.statLabel}>WIN RATE</Text>
              <Text style={styles.statValue}>78%</Text>
              <View style={styles.formRow}>
                <View style={[styles.formDot, { backgroundColor: Colors.primary }]} />
                <View style={[styles.formDot, { backgroundColor: Colors.primary }]} />
                <View style={[styles.formDot, { backgroundColor: Colors.danger }]} />
                <View style={[styles.formDot, { backgroundColor: Colors.primary }]} />
                <View style={[styles.formDot, { backgroundColor: Colors.primary }]} />
              </View>
            </View>
          </View>

          {/* Player Spotlight */}
          <View style={styles.spotlightContainer}>
             <Image source={{ uri: PLAYER_SPOTLIGHT }} style={styles.spotlightImage} />
             <LinearGradient
               colors={['transparent', Colors.surfaceContainerHighest]}
               style={styles.spotlightGradient}
             />
             <View style={styles.spotlightBadge}>
               <Text style={styles.spotlightBadgeText}>PLAYER SPOTLIGHT</Text>
             </View>
             
             <View style={styles.spotlightInfo}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                  <Text style={styles.spotlightName}>MARCUS VANE</Text>
                  <Text style={styles.spotlightPos}>ST</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.statLabel}>GOALS</Text>
                    <Text style={styles.spotlightStat}>18</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.statLabel}>ASSISTS</Text>
                    <Text style={styles.spotlightStat}>5</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.statLabel}>RATING</Text>
                    <Text style={[styles.spotlightStat, { color: Colors.secondaryContainer }]}>8.4</Text>
                  </View>
                </View>
             </View>
          </View>

          {/* Bottom Padding for the TabBar */}
          <View style={{ height: 100 }} />

        </ScrollView>
      </SafeAreaView>
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
    zIndex: -1,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    resizeMode: 'cover',
  },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  appBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
    gap: Spacing.md,
  },
  statsPill: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statsText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: '#a3e635', // lime-400
  },
  iconBtn: {
    padding: Spacing.xs,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  matchCard: {
    borderRadius: 24,
    padding: Spacing.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(121, 255, 91, 0.1)',
    marginBottom: Spacing.xl,
  },
  matchCardGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    backgroundColor: 'rgba(42,229,0,0.1)',
    borderRadius: 100,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
    zIndex: 2,
  },
  matchBadge: {
    backgroundColor: 'rgba(42,229,0,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  matchBadgeText: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
    fontSize: 10,
    letterSpacing: 2,
  },
  kickoffLabel: {
    color: Colors.onSurfaceVariant,
    fontFamily: FontFamily.bold,
    fontSize: 10,
    letterSpacing: 1,
    textAlign: 'right',
  },
  kickoffTime: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize['3xl'],
    color: Colors.white,
    letterSpacing: -1,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    zIndex: 2,
  },
  team: {
    alignItems: 'center',
    width: '40%',
  },
  shieldContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: Spacing.md,
  },
  teamName: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.md,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  teamHomeAway: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  vsContainer: {
    alignItems: 'center',
    width: '20%',
  },
  vsText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize['4xl'],
    color: 'rgba(255,255,255,0.2)',
    fontStyle: 'italic',
    letterSpacing: -2,
    marginBottom: Spacing.xs,
  },
  vsLine: {
    height: 1,
    width: 60,
  },
  matchBtnWrapper: {
    zIndex: 2,
  },
  matchBtn: {
    height: 56,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchBtnText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.lg,
    color: Colors.onPrimary,
    letterSpacing: 3,
  },
  quickLinksGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  quickLinkCard: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quickLinkIconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLinkTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
  quickLinkSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderLeftWidth: 4,
  },
  statLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize['3xl'],
    color: Colors.white,
  },
  statMeta: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.primary,
    marginTop: 4,
  },
  formRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
  },
  formDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  spotlightContainer: {
    height: 250,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 24,
    overflow: 'hidden',
  },
  spotlightImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  spotlightGradient: {
    ...StyleSheet.absoluteFillObject,
    top: '50%',
  },
  spotlightBadge: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: 'rgba(0,227,253,0.3)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  spotlightBadgeText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: 8,
    color: Colors.secondaryContainer,
    letterSpacing: 1.5,
  },
  spotlightInfo: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: 'rgba(15,19,31,0.8)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  spotlightName: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.lg,
    color: Colors.white,
  },
  spotlightPos: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  spotlightStat: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.xl,
    color: Colors.white,
  }
});
