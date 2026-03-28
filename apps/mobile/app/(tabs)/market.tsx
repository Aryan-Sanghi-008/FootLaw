import React, { useState } from 'react';
import {
  View,
  Text as RNText,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize, FontFamily } from '@/theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '@/store';
import { formatCurrency } from '@/app/(tabs)/squad';
import { fetchLiveAuctions, placeBid, fetchEliteScouts } from '@/store/slices/marketSlice';

const AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuCIp0ZZDCK0GVWy443tybeztyhlTerTSxR53NH5b7n1mGmfeninSfOmrNed7a9kZ-n14UprxLyqJ8ImY2vYw-l2EKzCDO9orz04eRZgfEokGNAi5OelZOI-MOvpg2NeYCk-4IZUxsqKZOLLS7bjm3VFbB5j84uHKMuBSMyEyY_P71PEVFZxy5XaeK6EzfYfxvqFRAVNQMkWFQUwHJBml4HE5kTtiuEHLsCk0W7dqErUMR_g2qsV9oMVFsmprhLPwhO61lMCnNT4PV0u";

const Text = ({ style, ...props }: any) => <RNText style={[styles.defaultText, style]} {...props} />;

const MOCK_SCOUTS = [
  {
    id: 's1',
    name: 'Luka Modric II',
    position: 'CAM',
    age: 19,
    potential: 94,
    rating: 89,
    value: 12500000,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcU1xnI9gFtbdg63oXtZ2Tg9cBoegM8mmSH7MFshYZjm6Na-88x5rBVDI-mj_qSU9VI81K6Us78tolXy_8tw3rsAARNXppP_hrX46tZ-mdFnRJpIxDiDOsb2ljJrScegEepxjpmZF_gxgHYaR9Fi0Ep-d_tt3Eef0UcLexi1oSvUergVATBi5M-5xV-2G_90iwuuslyZ285NU2yadTbaTkrOcfxB6j2thWUOJgwcy429mUb9NlBwES59iuYFUedDRblxkUzbA24yVP",
    stars: 5,
  },
  {
    id: 's2',
    name: 'Bastoni Junior',
    position: 'CB',
    age: 21,
    potential: 91,
    rating: 84,
    value: 8200000,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBI-vWDNUBjmgOmHz843_e8UjaR31bBcg6tpN_Vr0vvXoAq2R4fnkTd_NdjnSSjEAIYHw1drm3SeTuQ-Idduq_CHPf14G7SuqnxJ4dUssa7jDR7n_13PEEXukO3nQoPz66pKBJ5fQicfebKPl56UNcBQPttz_0Wj2CHEZZLXmdBRk9JTJKhdVoVsGa4PByavj0tQWBeso6x2lIj_VPmYDmvNkz_5KSn8qazGjDMKx-K0bp9S3eVHioFiek1BnIFYA5ONgEpUOylLbrA",
    stars: 4.5,
  },
  {
    id: 's3',
    name: 'Xavi Simons III',
    position: 'LW',
    age: 18,
    potential: 96,
    rating: 91,
    value: 15900000,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNJVuFJLBGCeUM9TNAC_BQ7k-Rz88dqj6wBo7uHKPysJ1_1FDg2E5wpztmn1vCBumjW01GDeFGo1jzCdQSGyTxOx_jXn1QSWU3Kia32Xkh32uQZvFvHt1OTa2fKoJSGpDdAZkanZ-g2hhkRP15KaRJ-0XJgj_l2Th2duwzrxzaqQ5c-iSnaIKuEssm1I9b27Oxf1P8O87c4iZALk_-NhaxJmLVdjHka4xJ4XsTVsWF0ObQugiEFREGcRpN6fKUsbcBWBktG9TRJh15",
    stars: 5,
  }
];

const MOCK_AUCTIONS = [
  {
    id: 'a1',
    name: 'Jan Oblak Jr.',
    position: 'GK',
    age: 24,
    quality: 88,
    nat: 'SLO',
    timeLeft: '00:42',
    currentBid: 3200000,
    bidsCount: 8,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqFlvB_JdOWyT88HBFEYDRUXsCBvda1Pots2xXzJozKnDq9MWAYQwVJ6ls1oXJiZowGKUHivnUJQjuuw_pxXNACFzTbFDKpLWMhGOkMq_-BpdlPxSp6wFL9fH82u0tuhjcQ5slngxqekxC2eEnJaL9cJpvQ5bbwpNzSyFrzjjaCPV00X8YZqUyv7r6eQZFVH_BKFcYfkiH5-CjW73dRif_g8weEWlzFFHz_kTU-5mBuThNJ-9cNnIEHpsR5RGNlnlDv2nXuVTbLBQJ",
    state: 'normal'
  },
  {
    id: 'a2',
    name: 'Endrick Felipe',
    position: 'ST',
    age: 18,
    quality: 95,
    nat: 'BRA',
    timeLeft: '00:08',
    currentBid: 14200000,
    bidsCount: 22,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRbbB5xD5OdBysP3d4cxN-lLJ5fFi0jiyoDUnZlhjGl9_vR7PcWItGkb-LhOAShwPCaTaNXiC0XsMfhj3HlrXnQOEbY4hGvymRIM_9scHlH0Xq8V06fWCasxY7L16PgmAEN_oKWUJwnYjlwM1cl190TCvAmlyJNqRTD3qT_Fm6mvLgb1NbkKNSs0br0CH6HDQGCbZNDuZgB7RKea0SaS_5hHkJ2CuHRpjXiVMFaPPaUnf_Vjd_lIai1STBFDvpJ1SGjhMA-HqKRnQm",
    state: 'hot_outbid'
  },
  {
    id: 'a3',
    name: 'Ruben Dias II',
    position: 'CB',
    age: 25,
    quality: 85,
    nat: 'POR',
    timeLeft: '04:45',
    currentBid: 2500000,
    bidsCount: 2,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZuaxjxD5fINQowKp7_VVQYwPZr3eeuuWF5M8Gzd5F1wKJEHO6w60_YUSSbwNGyQVAm4vj8ofHKU4xj-JdzQPPDRtv2ucJCEKNpWvooTUuVW5bES7ZOIOmx9Hr6_NyBDpzOcDRvwoZcKPYPQLwznok9qjrsdp4F4dDgqcC-KYhA-DnEjivIaZ9QvV-1FO1iikl01brNMzR9GCg0c3OsO9ARfFiKd4DLt15xe_Kp2ZOC_1SKtDyrt609LEvIIRvh6CFE7oCOmR9K0ZT",
    state: 'normal'
  }
];

function ScoutCard({ item }: { item: any }) {
  // Use a fallback image if none provided
  const playerImg = item.img || "https://lh3.googleusercontent.com/aida-public/AB6AXuAcU1xnI9gFtbdg63oXtZ2Tg9cBoegM8mmSH7MFshYZjm6Na-88x5rBVDI-mj_qSU9VI81K6Us78tolXy_8tw3rsAARNXppP_hrX46tZ-mdFnRJpIxDiDOsb2ljJrScegEepxjpmZF_gxgHYaR9Fi0Ep-d_tt3Eef0UcLexi1oSvUergVATBi5M-5xV-2G_90iwuuslyZ285NU2yadTbaTkrOcfxB6j2thWUOJgwcy429mUb9NlBwES59iuYFUedDRblxkUzbA24yVP";
  const stars = item.starRating / 2; // Assuming 1-10 rating to 1-5 stars

  return (
    <View style={styles.scoutCard}>
      <View style={styles.scoutCardStars}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons 
            key={i} 
            name={i < Math.floor(stars) ? "star" : i < stars ? "star-half" : "star-outline"} 
            size={12} 
            color={Colors.primary} 
          />
        ))}
      </View>
      <View style={styles.scoutImgWrapper}>
        <Image source={{ uri: playerImg }} style={styles.scoutImg} />
        <LinearGradient
          colors={['transparent', Colors.surface]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>
      <View style={styles.scoutDetails}>
        <View style={styles.scoutHeader}>
          <Text style={styles.scoutName}>{item.firstName} {item.lastName}</Text>
          <View style={styles.scoutPosBadge}>
            <Text style={styles.scoutPosText}>{item.position}</Text>
          </View>
        </View>
        <Text style={styles.scoutSubText}>Age: {item.age} • Condition: {item.condition}%</Text>
        
        <View style={styles.scoutMetaRow}>
          <View>
             <Text style={styles.scoutMetaLabel}>EST. VALUE</Text>
             <Text style={styles.scoutValue}>{formatCurrency(item.starRating * 1000000)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
             <Text style={styles.scoutMetaLabel}>RATING</Text>
             <Text style={styles.scoutRating}>{item.starRating}</Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.8}>
           <LinearGradient
              colors={[Colors.primary, Colors.onPrimaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.scoutBtn}
           >
              <Text style={styles.scoutBtnText}>SCOUT FULL REPORT</Text>
           </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AuctionRow({ item, currentClubId }: { item: any; currentClubId?: string }) {
  const dispatch = useAppDispatch();
  const isHighestBidder = currentClubId === item.highestBidderId;
  const isHot = !isHighestBidder && item.bids.length > 5;

  const getTimeLeft = (endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    if (diff <= 0) return 'ENDED';
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleBid = () => {
    const nextBid = Math.floor(item.currentBid * 1.1); // 10% increase
    dispatch(placeBid({ auctionId: item._id, amount: nextBid }));
  };

  const player = item.playerId;

  return (
    <View style={[styles.auctionRow, isHot && styles.auctionRowHot]}>
      {isHot && (
        <View style={styles.hotFlameBox}>
           <Ionicons name="flame" size={12} color={Colors.primary} />
        </View>
      )}
      
      <View style={styles.auctionPlayerInfo}>
        <Image 
          source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqFlvB_JdOWyT88HBFEYDRUXsCBvda1Pots2xXzJozKnDq9MWAYQwVJ6ls1oXJiZowGKUHivnUJQjuuw_pxXNACFzTbFDKpLWMhGOkMq_-BpdlPxSp6wFL9fH82u0tuhjcQ5slngxqekxC2eEnJaL9cJpvQ5bbwpNzSyFrzjjaCPV00X8YZqUyv7r6eQZFVH_BKFcYfkiH5-CjW73dRif_g8weEWlzFFHz_kTU-5mBuThNJ-9cNnIEHpsR5RGNlnlDv2nXuVTbLBQJ" }} 
          style={[styles.auctionImg, isHot && { borderColor: Colors.primary, borderWidth: 1 }]} 
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.auctionName} numberOfLines={1}>{player?.firstName} {player?.lastName}</Text>
            <View style={[styles.auctionPosBadge, isHot && { backgroundColor: Colors.primaryContainer }]}>
               <Text style={[styles.auctionPosText, isHot && { color: Colors.primary }]}>{player?.position}</Text>
            </View>
            {isHot && <Text style={styles.hotTextFlash}>HOT BID!</Text>}
          </View>
          <Text style={styles.auctionSubText}>Age: {player?.age} • Quality: {player?.starRating * 10}%</Text>
        </View>
      </View>

      <View style={styles.auctionRowRight}>
        <View style={styles.auctionTimerCol}>
          <Text style={styles.auctionMetaLabel}>ENDS IN</Text>
          <Text style={[styles.auctionTime, isHot && { color: Colors.error }]}>{getTimeLeft(item.endTime)}</Text>
        </View>
        <View style={styles.auctionBidCol}>
          <Text style={styles.auctionMetaLabel}>CURRENT BID</Text>
          <Text style={styles.auctionBidVal}>{formatCurrency(item.currentBid)}</Text>
          <Text style={[styles.auctionBidCount, isHighestBidder && { color: Colors.primary, fontWeight: '800' }]}>
            {isHighestBidder ? 'YOUR BID TOP' : `${item.bids.length} Bids Placed`}
          </Text>
        </View>
      </View>

      <View style={styles.auctionActionBtns}>
         <TouchableOpacity style={styles.auctionViewBtn}>
            <Text style={styles.auctionViewText}>VIEW</Text>
         </TouchableOpacity>
         <TouchableOpacity 
            activeOpacity={0.8} 
            style={{ flex: 1 }}
            onPress={handleBid}
          >
           <LinearGradient
              colors={[Colors.primary, Colors.onPrimaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.auctionBidBtn}
           >
              <Text style={styles.auctionBidBtnText}>{isHighestBidder ? 'BID (TOP)' : 'BID NOW'}</Text>
           </LinearGradient>
         </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TransferMarketScreen() {
  const dispatch = useAppDispatch();
  const { currentClub } = useAppSelector((state) => state.club);
  const { liveAuctions, eliteScouts } = useAppSelector((state) => state.market);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    dispatch(fetchLiveAuctions());
    dispatch(fetchEliteScouts());
  }, []);

  const balance = currentClub ? formatCurrency(currentClub.cash) : '$0';
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
          {/* Header Section */}
          <View style={styles.headerArea}>
            <View style={styles.headerTextCol}>
              <Text style={styles.overline}>GLOBAL NETWORK</Text>
              <Text style={styles.pageTitle}>Transfer Market</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn}><Ionicons name="filter" size={20} color={Colors.white} /></TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}><Ionicons name="swap-vertical" size={20} color={Colors.white} /></TouchableOpacity>
            </View>
          </View>

          {/* Filter Bar */}
          <View style={styles.filterWrap}>
            <View style={styles.searchBox}>
               <Ionicons name="search" size={18} color={Colors.outline} style={{ marginHorizontal: 12 }} />
               <TextInput 
                  style={styles.searchInput}
                  placeholder="Search Player Name..."
                  placeholderTextColor={Colors.outline}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
               />
            </View>
          </View>

          {/* Recommended Scouts Carousel */}
          <View style={styles.sectionHeader}>
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Elite Prospects</Text>
             </View>
             <TouchableOpacity>
                <Text style={styles.viewAllText}>View All Scouting Reports</Text>
             </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContainer} snapToInterval={296} decelerationRate="fast">
             {eliteScouts.map(item => <ScoutCard key={item._id} item={item} />)}
          </ScrollView>

          {/* Live Auctions Vertical List */}
          <View style={styles.sectionHeader}>
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="time" size={20} color={Colors.error} />
                <Text style={styles.sectionTitle}>Live Auctions</Text>
             </View>
             <View style={styles.activeRoomsBadge}>
                <Text style={styles.activeRoomsText}>{liveAuctions.length} Active Bidding Rooms</Text>
             </View>
          </View>

          <View style={styles.auctionsList}>
             {liveAuctions.map(item => (
               <AuctionRow 
                  key={item._id} 
                  item={item} 
                  currentClubId={currentClub?.id}
               />
             ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.xl,
  },
  headerTextCol: {
    gap: 4,
  },
  overline: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.primary,
    letterSpacing: 2.5,
  },
  pageTitle: {
    fontFamily: FontFamily.headingBlack,
    fontSize: 32,
    color: Colors.white,
    letterSpacing: -1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconBtn: {
    backgroundColor: Colors.surfaceContainerHigh,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  filterWrap: {
    backgroundColor: Colors.surfaceContainer,
    padding: Spacing.sm,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing['2xl'],
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.lg,
    color: Colors.white,
  },
  viewAllText: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.sm,
    color: Colors.secondaryContainer,
  },
  activeRoomsBadge: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  activeRoomsText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.outline,
  },
  // Scout Carousel
  carouselContainer: {
    gap: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  scoutCard: {
    width: 280,
    backgroundColor: 'rgba(49, 52, 66, 0.4)',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  scoutCardStars: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    zIndex: 10,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  scoutImgWrapper: {
    height: 160,
    width: '100%',
    backgroundColor: Colors.surfaceContainerHighest,
  },
  scoutImg: {
    width: '100%',
    height: '100%',
  },
  scoutDetails: {
    padding: Spacing.xl,
  },
  scoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scoutName: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.lg,
    color: Colors.white,
  },
  scoutPosBadge: {
    backgroundColor: Colors.tertiaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scoutPosText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.tertiary,
  },
  scoutSubText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.lg,
  },
  scoutMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  scoutMetaLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
    marginBottom: 2,
  },
  scoutValue: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.lg,
    color: Colors.primary,
  },
  scoutRating: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.lg,
    color: Colors.white,
  },
  scoutBtn: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  scoutBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.onPrimary,
    letterSpacing: 1,
  },
  // Auctions List
  auctionsList: {
    gap: Spacing.md,
  },
  auctionRow: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 24,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    gap: Spacing.lg,
  },
  auctionRowHot: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  hotFlameBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(42,229,0,0.05)',
    zIndex: -1,
  },
  auctionPlayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  auctionImg: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  auctionName: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.md,
    color: Colors.white,
  },
  auctionPosBadge: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  auctionPosText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  hotTextFlash: {
    fontFamily: FontFamily.headingBlack,
    fontSize: 9,
    color: Colors.primary,
  },
  auctionSubText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 6,
  },
  auctionRowRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  auctionTimerCol: {
    alignItems: 'flex-start',
  },
  auctionMetaLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
    marginBottom: 2,
  },
  auctionTime: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.lg,
    color: Colors.outline,
  },
  auctionBidCol: {
    alignItems: 'flex-start',
  },
  auctionBidVal: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.lg,
    color: Colors.white,
  },
  auctionBidCount: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  auctionActionBtns: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  auctionViewBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: 'rgba(42,229,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  auctionViewText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  auctionBidBtn: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  auctionBidBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.onPrimary,
  }
});
