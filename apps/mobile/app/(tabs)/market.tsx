import React, { useState } from 'react';
import {
  View,
  Text as RNText,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize, FontFamily } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../../store';
import { formatCurrency } from '../../utils/helpers';
import { fetchLiveAuctions, placeBid, fetchEliteScouts } from '../../store/slices/marketSlice';
import { Text } from '../../components/Themed';

const AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuCIp0ZZDCK0GVWy443tybeztyhlTerTSxR53NH5b7n1mGmfeninSfOmrNed7a9kZ-n14UprxLyqJ8ImY2vYw-l2EKzCDO9orz04eRZgfEokGNAi5OelZOI-MOvpg2NeYCk-4IZUxsqKZOLLS7bjm3VFbB5j84uHKMuBSMyEyY_P71PEVFZxy5XaeK6EzfYfxvqFRAVNQMkWFQUwHJBml4HE5kTtiuEHLsCk0W7dqErUMR_g2qsV9oMVFsmprhLPwhO61lMCnNT4PV0u";




function ScoutCard({ item }: { item: any }) {
  // Use a fallback image if none provided
  const playerImg = item.img || "https://lh3.googleusercontent.com/aida-public/AB6AXuAcU1xnI9gFtbdg63oXtZ2Tg9cBoegM8mmSH7MFshYZjm6Na-88x5rBVDI-mj_qSU9VI81K6Us78tolXy_8tw3rsAARNXppP_hrX46tZ-mdFnRJpIxDiDOsb2ljJrScegEepxjpmZF_gxgHYaR9Fi0Ep-d_tt3Eef0UcLexi1oSvUergVATBi5M-5xV-2G_90iwuuslyZ285NU2yadTbaTkrOcfxB6j2thWUOJgwcy429mUb9NlBwES59iuYFUedDRblxkUzbA24yVP";
  const stars = item.starRating / 2; // Assuming 1-10 rating to 1-5 stars

  return (
    <View className="w-[280px] bg-surfaceContainerHigh rounded-[28px] overflow-hidden border border-white/5 mr-lg shadow-xl">
      <View className="absolute top-md right-md z-10 flex-row bg-black/50 px-2 py-1 rounded-md border border-white/10">
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons 
            key={i} 
            name={i < Math.floor(stars) ? "star" : i < stars ? "star-half" : "star-outline"} 
            size={12} 
            color={Colors.primary} 
          />
        ))}
      </View>
      <View className="h-40 w-full bg-surfaceContainerHighest">
        <Image source={{ uri: playerImg }} className="w-full h-full" />
        <LinearGradient
          colors={['transparent', Colors.surface]}
          className="absolute inset-0"
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>
      <View className="p-xl">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="font-headingBold text-lg text-white">{item.firstName} {item.lastName}</Text>
          <View className="bg-tertiaryContainer px-1.5 py-0.5 rounded">
            <Text className="font-bold text-[10px] text-tertiary">{item.position}</Text>
          </View>
        </View>
        <Text className="font-medium text-xs text-onSurfaceVariant mb-4">Age: {item.age} • Condition: {item.condition}%</Text>
        
        <View className="flex-row justify-between mb-xl">
          <View>
             <Text className="font-bold text-[10px] text-onSurfaceVariant tracking-wider mb-0.5">EST. VALUE</Text>
             <Text className="font-headingBlack text-lg text-primary">{formatCurrency(item.starRating * 1000000)}</Text>
          </View>
          <View className="items-end">
             <Text className="font-bold text-[10px] text-onSurfaceVariant tracking-wider mb-0.5">RATING</Text>
             <Text className="font-headingBlack text-lg text-white">{item.starRating}</Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.8}>
           <LinearGradient
              colors={[Colors.primary, Colors.onPrimaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-md rounded-xl items-center"
           >
              <Text className="font-bold text-sm text-onPrimary tracking-wider">SCOUT FULL REPORT</Text>
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
    <View className={`rounded-[28px] p-lg border-l-4 border-primary gap-lg mb-md shadow-lg ${isHot ? 'bg-surfaceContainerHigh border border-primary' : 'bg-surfaceContainerLow'}`}>
      {isHot && (
        <View className="absolute inset-0 bg-primary/5 -z-10" />
      )}
      
      <View className="flex-row items-center gap-md">
        <Image 
          source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqFlvB_JdOWyT88HBFEYDRUXsCBvda1Pots2xXzJozKnDq9MWAYQwVJ6ls1oXJiZowGKUHivnUJQjuuw_pxXNACFzTbFDKpLWMhGOkMq_-BpdlPxSp6wFL9fH82u0tuhjcQ5slngxqekxC2eEnJaL9cJpvQ5bbwpNzSyFrzjjaCPV00X8YZqUyv7r6eQZFVH_BKFcYfkiH5-CjW73dRif_g8weEWlzFFHz_kTU-5mBuThNJ-9cNnIEHpsR5RGNlnlDv2nXuVTbLBQJ" }} 
          className={`w-14 h-14 rounded-xl bg-surfaceContainerHighest ${isHot ? 'border border-primary' : ''}`}
        />
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="font-headingBold text-md text-white" numberOfLines={1}>{player?.firstName} {player?.lastName}</Text>
            <View className={`bg-surfaceVariant px-1.5 py-0.5 rounded ${isHot ? 'bg-primary/20' : ''}`}>
               <Text className={`font-bold text-[10px] text-onSurfaceVariant ${isHot ? 'text-primary' : ''}`}>{player?.position}</Text>
            </View>
            {isHot && <Text className="font-headingBlack text-[9px] text-primary">HOT BID!</Text>}
          </View>
          <Text className="font-medium text-xs text-onSurfaceVariant mt-1.5">Age: {player?.age} • Quality: {player?.starRating * 10}%</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center pt-sm border-t border-white/5">
        <View className="items-start">
          <Text className="font-bold text-[10px] text-onSurfaceVariant tracking-wider mb-0.5">ENDS IN</Text>
          <Text className={`font-headingBlack text-lg ${isHot ? 'text-error' : 'text-outline'}`}>{getTimeLeft(item.endTime)}</Text>
        </View>
        <View className="items-start">
          <Text className="font-bold text-[10px] text-onSurfaceVariant tracking-wider mb-0.5">CURRENT BID</Text>
          <Text className="font-headingBlack text-lg text-white">{formatCurrency(item.currentBid)}</Text>
          <Text className={`font-regular text-[9px] mt-0.5 ${isHighestBidder ? 'text-primary font-extrabold' : 'text-onSurfaceVariant'}`}>
            {isHighestBidder ? 'YOUR BID TOP' : `${item.bids.length} Bids Placed`}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-md mt-sm">
         <TouchableOpacity className="px-xl py-md rounded-xl bg-surfaceContainerHighest border border-primary/30 justify-center items-center">
            <Text className="font-bold text-sm text-primary">VIEW</Text>
         </TouchableOpacity>
         <TouchableOpacity 
            activeOpacity={0.8} 
            className="flex-1"
            onPress={handleBid}
          >
           <LinearGradient
              colors={[Colors.primary, Colors.onPrimaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-md rounded-xl items-center justify-center h-full"
           >
              <Text className="font-bold text-sm text-onPrimary">{isHighestBidder ? 'BID (TOP)' : 'BID NOW'}</Text>
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
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Top App Bar */}
        <View className="flex-row items-center justify-between px-xl py-md bg-surfaceContainerHighest/30 backdrop-blur-md">
          <View className="flex-row items-center gap-md">
            <View className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
              <Image source={{ uri: AVATAR }} className="w-full h-full" />
            </View>
            <RNText className="font-headingBlack text-xl text-white tracking-tighter">FOOTLAW</RNText>
          </View>
          <View className="flex-row items-center">
            <View className="bg-surfaceContainerLow px-md py-sm rounded-full border border-white/5">
               <Text className="font-headingBold text-xs text-primary tracking-[2px]">{tokens} <Ionicons name="diamond" size={10}/> • {balance}</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View className="flex-row justify-between items-end mb-xl">
            <View className="gap-1">
              <Text className="font-bold text-[10px] text-primary tracking-[2.5px] uppercase">GLOBAL NETWORK</Text>
              <Text className="font-headingBlack text-[32px] text-white tracking-tighter">Transfer Market</Text>
            </View>
            <View className="flex-row gap-md">
              <TouchableOpacity className="bg-surfaceContainerHigh p-md rounded-lg"><Ionicons name="filter" size={20} color={Colors.white} /></TouchableOpacity>
              <TouchableOpacity className="bg-surfaceContainerHigh p-md rounded-lg"><Ionicons name="swap-vertical" size={20} color={Colors.white} /></TouchableOpacity>
            </View>
          </View>

          {/* Filter Bar */}
          <View className="bg-surfaceContainer p-sm rounded-xl mb-7">
            <View className="flex-row items-center bg-surfaceContainerLowest rounded-lg h-11">
               <Ionicons name="search" size={18} color={Colors.outline} className="mx-3" />
               <TextInput 
                  className="flex-1 font-medium text-sm text-white"
                  placeholder="Search Player Name..."
                  placeholderTextColor={Colors.outline}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
               />
            </View>
          </View>

          {/* Recommended Scouts Carousel */}
          <View className="flex-row justify-between items-center mb-lg">
             <View className="flex-row items-center gap-1.5">
                <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                <Text className="font-headingBold text-lg text-white">Elite Prospects</Text>
             </View>
             <TouchableOpacity>
                <Text className="font-semibold text-sm text-secondaryContainer">View All Scouting Reports</Text>
             </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 20 }} snapToInterval={296} decelerationRate="fast">
             {eliteScouts.map(item => <ScoutCard key={item._id} item={item} />)}
          </ScrollView>

          {/* Live Auctions Vertical List */}
          <View className="flex-row justify-between items-center mb-lg">
             <View className="flex-row items-center gap-1.5">
                <Ionicons name="time" size={20} color={Colors.error} />
                <Text className="font-headingBold text-lg text-white">Live Auctions</Text>
             </View>
             <View className="bg-surfaceContainerHigh px-md py-1.5 rounded-full border border-white/5">
                <Text className="font-bold text-xs text-outline">{liveAuctions.length} Active Bidding Rooms</Text>
             </View>
          </View>

          <View className="gap-md">
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
