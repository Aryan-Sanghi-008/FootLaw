import React from 'react';
import {
  View,
  Text as RNText,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize, FontFamily } from '@/theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/store';
import { formatCurrency } from '@/app/(tabs)/squad';

const { width } = Dimensions.get('window');

const AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuDc_Dz33bK75DBLTzuMnvWasnbUCxAkePfLcCO7XbeEXI39kwxgsLjKTuMDvGV1_TXAoHMKvKmVOTjhsqp4VK32j0g71phPYC8mjE-yVgMaYMHxU50CBSd-JcWPGGQKJ_11nCBuzLC1dc6F9rpGsG3dDdrt6aoE0gljCiDpDpVGhkTorNwsTK62DckRJEcjkJ93PtZ7jQ1_IuSCF-TQgDoVJYkf_GFqR8C1PLcTBMdHKJp_aK0ZBSypE5eL2J1qnxejCSPcrARV9Dmr";
const MAP_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuDd4ZwJ1SESFl3yM7zlFsTci0sheBTYCn5nqZm3YocJxeuoIO6X4XcZzp8q-tQaK1sf8i6OAufZTYv_imJkhrrGsKvoum5v0bFgr3oAmCsE4PptmOmyZx6pvJv2accNW28WlF56QfiwzhGuRBHCphVrdZ_DTct1RplQkRrsnGB0bp6fUmKwI2aSbrXXTjcNqFYYf-cyzFbWE3kgI438b6aPhpE090pvgjjBO9Y6euF8uBJ5wPvzBgDi8V-qCHrN5GGeT__eOIUX_sRP";

const Text = ({ style, ...props }: any) => <RNText style={[styles.defaultText, style]} {...props} />;

const FACILITIES = [
  {
    id: 'f1',
    title: 'Stadium',
    subtitle: 'Elite Football Arena',
    level: 5,
    icon: 'football',
    colorType: 'primary',
    bonusLabel: '+15% Attendance',
    progress: 0.85,
    cost: 2500000,
  },
  {
    id: 'f2',
    title: 'Training Hub',
    subtitle: 'Next-Gen Performance Lab',
    level: 8,
    icon: 'barbell',
    colorType: 'secondary',
    bonusLabel: '+22% XP Gain',
    progress: 0.92,
    cost: 1800000,
  },
  {
    id: 'f3',
    title: 'Youth Academy',
    subtitle: 'Talent Production Factory',
    level: 3,
    icon: 'people',
    colorType: 'tertiary',
    bonusLabel: '+10% Star Potential',
    progress: 0.45,
    cost: 850000,
  },
  {
    id: 'f4',
    title: 'Medical Hub',
    subtitle: 'Advanced Recovery Center',
    level: 4,
    icon: 'medkit',
    colorType: 'error',
    bonusLabel: '+20% Recovery Speed',
    progress: 0.65,
    cost: 1200000,
  }
];

function FacilityCard({ facility }: { facility: typeof FACILITIES[0] }) {
  const isPrimary = facility.colorType === 'primary';
  const colorHex = isPrimary 
    ? Colors.primary 
    : facility.colorType === 'secondary' 
      ? Colors.secondaryContainer 
      : facility.colorType === 'tertiary' 
        ? Colors.tertiary
        : Colors.error;

  return (
    <View style={styles.facilityCard}>
       <View style={styles.facilityHeader}>
         <View style={[styles.facilityIconBox, { backgroundColor: colorHex + '20', borderColor: colorHex + '40' }]}>
            <Ionicons name={facility.icon as any} size={24} color={colorHex} />
         </View>
         <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>LV. {facility.level}</Text>
         </View>
       </View>

       <Text style={styles.facilityTitle}>{facility.title}</Text>
       <Text style={styles.facilitySub}>{facility.subtitle}</Text>

       <View style={styles.facilityBonusBox}>
          <View style={styles.facilityBonusRow}>
             <Text style={styles.bonusLabelTop}>BONUS EFFECT</Text>
             <Text style={[styles.bonusValueTop, { color: colorHex }]}>{facility.bonusLabel}</Text>
          </View>
          <View style={styles.progressBarWrap}>
             <View style={[styles.progressBarFill, { width: `${facility.progress * 100}%`, backgroundColor: colorHex }]} />
          </View>
       </View>

       <TouchableOpacity activeOpacity={0.8} style={{ marginTop: 'auto' }}>
         {isPrimary ? (
            <LinearGradient
               colors={[Colors.primary, Colors.onPrimaryContainer]}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 0 }}
               style={styles.upgradeBtnPrimary}
            >
               <Text style={styles.upgradeBtnPrimaryText}>UPGRADE ({formatCurrency(facility.cost)})</Text>
            </LinearGradient>
         ) : (
            <View style={[styles.upgradeBtnSecondary, { borderColor: colorHex + '40' }]}>
               <Text style={styles.upgradeBtnSecondaryText}>UPGRADE ({formatCurrency(facility.cost)})</Text>
            </View>
         )}
       </TouchableOpacity>
    </View>
  );
}

export default function MoreScreen() {
  const { currentClub } = useAppSelector((state) => state.club);

  const balance = currentClub ? formatCurrency(currentClub.balance) : '$0';
  const tokens = currentClub?.tokens || 0;

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

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerArea}>
            <View style={styles.headerTextCol}>
              <Text style={styles.pageTitle}>Club Campus</Text>
              <View style={styles.rankRow}>
                 <View style={styles.pulseDot} />
                 <Text style={styles.rankText}>GLOBAL INFRASTRUCTURE RANKING: #12</Text>
              </View>
            </View>
          </View>

          {/* Master Plan Summary */}
          <View style={styles.masterPlanCard}>
             <View style={{ flex: 1 }}>
                <Text style={styles.mpLabel}>CAMPUS VALUE</Text>
                <Text style={styles.mpValue}>$142.5M</Text>
             </View>
             <View style={styles.mpDivider} />
             <View style={{ flex: 1 }}>
                <Text style={styles.mpLabel}>DAILY MAINTENANCE</Text>
                <Text style={styles.mpExpense}>-$45.2K</Text>
             </View>
             <TouchableOpacity style={styles.mpIconBtn}>
                <Ionicons name="build" size={20} color={Colors.secondaryContainer} />
             </TouchableOpacity>
          </View>

          {/* Isometric Map */}
          <View style={styles.mapContainer}>
             <LinearGradient
                colors={[Colors.primary + '10', 'transparent', Colors.secondaryContainer + '10']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFillObject}
             />
             <Image source={{ uri: MAP_IMG }} style={styles.mapImg} resizeMode="cover" />
             
             {/* Map Hover Point 1 */}
             <View style={[styles.mapPoint, { top: '30%', left: '35%' }]}>
                <View style={[styles.mapPointCore, { backgroundColor: Colors.primary }]} />
                <View style={[styles.mapPointRing, { backgroundColor: Colors.primary + '50' }]} />
             </View>

             {/* Map Hover Point 2 */}
             <View style={[styles.mapPoint, { bottom: '30%', right: '35%' }]}>
                <View style={[styles.mapPointCore, { backgroundColor: Colors.secondaryContainer }]} />
                <View style={[styles.mapPointRing, { backgroundColor: Colors.secondaryContainer + '50' }]} />
             </View>
          </View>

          {/* Facility Bento Grid */}
          <View style={styles.gridContainer}>
             {FACILITIES.map(fac => <FacilityCard key={fac.id} facility={fac} />)}
          </View>

          <View style={{ height: 120 }} />
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
  headerArea: {
    marginBottom: Spacing.xl,
  },
  headerTextCol: {
    gap: 4,
  },
  pageTitle: {
    fontFamily: FontFamily.headingBlack,
    fontSize: 32,
    color: Colors.white,
    letterSpacing: -1,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  rankText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  // Master Plan
  masterPlanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(49, 52, 66, 0.6)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: Spacing.lg,
  },
  mpLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
    marginBottom: 4,
  },
  mpValue: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  mpExpense: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.xl,
    color: Colors.error,
  },
  mpDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.outlineVariant,
    opacity: 0.3,
    marginHorizontal: Spacing.lg,
  },
  mpIconBtn: {
    backgroundColor: Colors.surfaceContainerHighest,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  // Map
  mapContainer: {
    width: '100%',
    aspectRatio: 21 / 9,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: Spacing['2xl'],
    position: 'relative',
  },
  mapImg: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  mapPoint: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPointCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.white,
    zIndex: 2,
  },
  mapPointRing: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    zIndex: 1,
  },
  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  facilityCard: {
    width: (width - Spacing.xl * 2 - Spacing.md) / 2, // 2 columns
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 20,
    padding: Spacing.lg,
    minHeight: 240,
  },
  facilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  facilityIconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  levelBadge: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  levelBadgeText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: 10,
    color: Colors.white,
  },
  facilityTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.lg,
    color: Colors.white,
    marginBottom: 4,
  },
  facilitySub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.xl,
  },
  facilityBonusBox: {
    backgroundColor: 'rgba(10, 14, 26, 0.5)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  facilityBonusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bonusLabelTop: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  bonusValueTop: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
  },
  progressBarWrap: {
    height: 4,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  upgradeBtnPrimary: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  upgradeBtnPrimaryText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: 10,
    color: Colors.onPrimary,
    letterSpacing: 1.5,
  },
  upgradeBtnSecondary: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1,
  },
  upgradeBtnSecondaryText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: 10,
    color: Colors.white,
    letterSpacing: 1.5,
  }
});
