import React from 'react';
import { 
  View, 
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
import { Colors } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    <View className="flex-1 bg-background">
      {/* Background Effect */}
      <View className="absolute inset-0 z-0 justify-center items-center">
         <LinearGradient
            colors={[Colors.surfaceContainerLow, Colors.background]}
            className="absolute inset-0"
         />
         <View className="absolute inset-0 opacity-10 bg-primary/5" />
      </View>

      {/* Map Markers */}
      <View className="absolute items-center z-10" style={{ top: '30%', left: '20%' }}>
        <View className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary items-center justify-center shadow-lg shadow-primary/50">
           <Ionicons name="checkmark" size={16} color={Colors.primary} />
        </View>
        <View className="bg-surfaceContainer px-2 py-0.5 rounded mt-2">
           <Text className="font-bold text-[10px] text-onSurfaceVariant uppercase">Rio Carnival</Text>
        </View>
      </View>

      <View className="absolute items-center z-10" style={{ top: '45%', left: '50%' }}>
        <View className="absolute w-[60px] h-[60px] rounded-full bg-secondaryContainer/20 -top-1.5 -left-1.5" />
        <View className="w-12 h-12 rounded-full bg-secondaryContainer/20 border-4 border-secondaryContainer items-center justify-center shadow-2xl shadow-secondaryContainer/60">
           <Ionicons name="location" size={24} color={Colors.secondaryContainer} />
        </View>
        <View className="bg-surfaceContainer px-2 py-0.5 rounded mt-2 border border-secondaryContainer/30">
           <Text className="font-bold text-[10px] text-secondaryContainer uppercase">Madrid Open</Text>
        </View>
      </View>

      <SafeAreaView className="flex-1 z-10" edges={['top']}>
        {/* Top App Bar */}
        <View className="flex-row items-center justify-between px-xl py-md bg-surfaceContainerHighest/30 backdrop-blur-md">
          <View className="flex-row items-center gap-md">
            <View className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
              <Image source={{ uri: AVATAR }} className="w-full h-full" />
            </View>
            <RNText className="font-headingBlack text-xl text-white tracking-tighter">FOOTLAW</RNText>
          </View>
          <View className="bg-surfaceContainerLow px-md py-sm rounded-full border border-white/5">
             <Text className="font-bold text-xs text-onSurfaceVariant">{tokens} <Ionicons name="diamond" size={10}/> • {balance}</Text>
          </View>
        </View>

        {/* Objective Card Overlay */}
        <View className="flex-1 justify-center px-xl">
           <View className="bg-surfaceContainerHigh rounded-[28px] p-lg border border-white/5 overflow-hidden">
              <LinearGradient
                 colors={['rgba(0, 227, 253, 0.05)', 'transparent']}
                 className="absolute inset-0"
              />
              <View className="flex-row justify-between items-start mb-xl">
                 <View>
                    <Text className="font-bold text-[10px] text-secondaryContainer tracking-[2px] mb-1">CURRENT STAGE</Text>
                    <Text className="font-headingBlack text-[28px] text-white tracking-tighter">
                      {nextMatch?.competition || 'The Madrid Crossing'}
                    </Text>
                 </View>
                 <View className="bg-surfaceContainerHighest p-md rounded-lg">
                    <Ionicons name="football" size={24} color={Colors.secondaryContainer} />
                 </View>
              </View>

              <Text className="font-regular text-sm text-onSurfaceVariant leading-5 mb-xl">
                 Face off against the capital's elite. Their high-press tactical engine requires precise passing and counter-attacking stability.
              </Text>

              <View className="flex-row gap-md mb-xl">
                 <View className="flex-1 bg-surfaceContainerLow p-md rounded-lg border border-white/5">
                    <Text className="font-bold text-[10px] text-onSurfaceVariant tracking-[1.5px] mb-2 uppercase">DIFFICULTY</Text>
                    <View className="flex-row gap-0.5">
                       <Ionicons name="star" size={14} color={Colors.primary} />
                       <Ionicons name="star" size={14} color={Colors.primary} />
                       <Ionicons name="star" size={14} color={Colors.primary} />
                       <Ionicons name="star" size={14} color={Colors.primary} />
                       <Ionicons name="star" size={14} color={Colors.outline} />
                    </View>
                 </View>
                 <View className="flex-1 bg-surfaceContainerLow p-md rounded-lg border border-white/5">
                    <Text className="font-bold text-[10px] text-onSurfaceVariant tracking-[1.5px] mb-2 uppercase">OPPOSITION</Text>
                    <Text className="font-bold text-sm text-white">{oppositionName}</Text>
                 </View>
              </View>

              <View className="mb-8">
                 <Text className="font-bold text-[10px] text-onSurfaceVariant tracking-[1.5px] mb-2 uppercase">VICTORY REWARDS</Text>
                 <View className="flex-row gap-2">
                    <View className="flex-row items-center bg-primary/10 border border-primary/20 px-md py-sm rounded-md gap-1.5">
                       <Ionicons name="cash" size={16} color={Colors.primary} />
                       <Text className="font-bold text-sm text-primary">250k</Text>
                    </View>
                    <View className="flex-row items-center bg-tertiary/10 border border-tertiary/20 px-md py-sm rounded-md gap-1.5">
                       <Ionicons name="ticket" size={16} color={Colors.tertiary} />
                       <Text className="font-bold text-sm text-tertiary">15 T</Text>
                    </View>
                 </View>
              </View>

              <TouchableOpacity 
                activeOpacity={0.8} 
                onPress={() => nextMatch && router.push(`/sim?matchId=${nextMatch._id}`)}
                disabled={!nextMatch || isLoading}
                className={(!nextMatch || isLoading) ? 'opacity-50' : ''}
              >
                 <LinearGradient
                   colors={['#2ae500', '#1ca600']}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 1 }}
                   className="h-[60px] rounded-xl justify-center items-center"
                 >
                    <Text className="font-headingBlack text-lg text-onPrimary tracking-widest">
                      {isLoading ? 'PREPARING...' : (nextMatch ? 'START MATCH' : 'NO FIXTURES')}
                    </Text>
                 </LinearGradient>
              </TouchableOpacity>
           </View>
        </View>
      </SafeAreaView>

      {/* Season Pass Progress Track */}
      <View className={`absolute left-0 right-0 px-xl z-20 ${Platform.OS === 'ios' ? 'bottom-[120px]' : 'bottom-[90px]'}`}>
         <View className="bg-surfaceContainerHigh p-lg rounded-[28px] border border-white/10 overflow-hidden shadow-2xl">
            <View className="flex-row justify-between items-center mb-lg">
               <Text className="font-headingBlack text-[10px] text-primary tracking-[2px] uppercase">SEASON PASS PROGRESS</Text>
               <View className="bg-surfaceContainerHighest px-md py-1 rounded-full">
                  <Text className="font-bold text-[10px] text-onSurfaceVariant">Level 12 / 50</Text>
               </View>
            </View>

            <View className="h-10 justify-center relative">
               <View className="absolute left-0 right-0 h-2 bg-surfaceContainerHighest rounded-full" />
               <View className="absolute left-0 h-2 bg-primary rounded-full" style={{ width: '35%' }} />
               
               <View className="absolute inset-0 flex-row justify-between items-center">
                  <View className="w-9 h-9 rounded-xl bg-primary border-2 border-surface justify-center items-center">
                     <Ionicons name="checkmark" size={16} color={Colors.onPrimary} />
                  </View>
                  <View className="w-9 h-9 rounded-xl bg-surfaceContainerHigh border-2 border-primary justify-center items-center">
                     <Ionicons name="cube" size={16} color={Colors.primary} />
                  </View>
                  <View className="w-9 h-9 rounded-xl bg-surfaceContainerHigh border-2 border-white/10 justify-center items-center opacity-60">
                     <Ionicons name="gift" size={16} color={Colors.white} />
                  </View>
                  <View className="w-12 h-12 rounded-2xl bg-secondaryContainer border-4 border-surface justify-center items-center">
                     <Ionicons name="ribbon" size={24} color={Colors.onSecondaryContainer} />
                  </View>
               </View>
            </View>
         </View>
      </View>
    </View>
  );
}
