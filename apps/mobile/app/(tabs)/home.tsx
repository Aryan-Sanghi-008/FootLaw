import React, { useEffect, useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Text as RNText } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchMyClub } from '../../store/slices/clubSlice';
import { Text } from '../../components/Themed';
import { Colors } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatCurrency } from '../../utils/helpers';
import { useRouter } from 'expo-router';
import { fetchNextMatch } from '../../store/slices/matchSlice';
import { fetchSquad } from '../../store/slices/squadSlice';

const STADIUM_BG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCEcpuFsXaIT_jLAfkxWLC-QVK-rJJZH9cBr5335KDKNKphxHmnpWH6O9P2V9gbdw737PzPXv1EJYzl9EfWSxJkDe0Jyxk5yZ-Yoe_-GS4L1-a0eaVx8WzaT4h3KZLKe_cM_8J9FoTNwSP1jWbHGzTK_EtKF-6NvUXeYoIbH68fDFvcNGH3CLIyDhZZb4Z_boagT8MsrIa4_5vstuhLTYYxRQYIqSGtqw8xKhMlqpVSWoAPTJ9dhrAwZkaPbRZdd6gP64bqHBhybxRR";
const AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuBINf4CTlKW4Kd6m5WCapC3Z4yiR5H-JjYIRKp0caKKK-uc6Qc6oxrEsSYYyLWh0HBoKrZ4ztGlEKskIccXKmbLxlcVHd8YU7E7c12WqEBHEJIjM2kh9aKnNQa2f7t9Gz0Psvvjbf1p6r5WWZ8RjyOL90QvvnLJ-_T7OGkn6FIBEPm8Vols-nEm-yY32XGXCtzZtCYGuNDiiHJRRJ6W-H0XTEEviO6OCB--kmrCohIataqW15bv3zy3SA-VwccCuWhTB1alibLNDUWt";
const PLAYER_SPOTLIGHT = "https://lh3.googleusercontent.com/aida-public/AB6AXuAk2MOfOfnKRUPJKMhLZR0xGilUMdcRuGsMks0j4fGMuIJZNgftQGl6a5vWnasc7a0wI9toaMfoutNs2Wbsr21n5Oj2XvnAZmZVR3zyE46YUZWQP1RHDBOeDNUg6ve19k4YBF1d4VLEacNLufH_rwXaEcON40lnn5wFlga6odMe2JcZ1XbdQb8iNNSaYa8JlS70lMS4NI94lPEA5adPUhzcWHZE1oFyJqRWqCILTjPXoFkMzv6S5_hCiQBaqIUg3LqDFGMGrFRPCWTl";

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentClub, isLoading } = useAppSelector((state) => state.club);

  useEffect(() => {
    dispatch(fetchMyClub());
    dispatch(fetchNextMatch());
    dispatch(fetchSquad());
  }, [dispatch]);

  const { nextMatch } = useAppSelector((state) => state.match);
  const { players } = useAppSelector((state) => state.squad);

  // Calculations
  const clubName = currentClub?.name || 'Football Club';
  const balance = currentClub ? formatCurrency(currentClub.cash) : '$0';
  const tokens = currentClub?.tokens || 0;
  
  const spotlightPlayer = useMemo(() => {
    if (!players || players.length === 0) return null;
    return [...players].sort((a, b) => b.starRating - a.starRating)[0];
  }, [players]);

  const [timeLeft, setTimeLeft] = React.useState('00:00:00');

  useEffect(() => {
    if (!nextMatch?.date) return;
    
    const interval = setInterval(() => {
      const diff = new Date(nextMatch.date).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('LIVE');
        clearInterval(interval);
      } else {
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setTimeLeft(`${h}:${m}:${s}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextMatch]);

  return (
    <View className="flex-1 bg-background">
      {/* Background */}
      <View className="absolute inset-0 -z-10">
        <LinearGradient
          colors={['rgba(15,19,31,0.2)', Colors.background]}
          className="absolute inset-0 z-10"
        />
        <Image source={{ uri: STADIUM_BG }} className="absolute inset-0 opacity-15" resizeMode="cover" />
      </View>

      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Top App Bar */}
        <BlurView intensity={30} tint="dark" className="flex-row items-center justify-between px-xl py-md border-b border-white/5">
          <View className="flex-row items-center gap-md">
            <View className="relative">
              <Image source={{ uri: AVATAR }} className="w-10 h-10 rounded-full border-2 border-primary" />
              <View className="absolute -bottom-0.5 -right-0.5 bg-primary w-4 h-4 rounded-full items-center justify-center">
                <Ionicons name="checkmark" size={10} color={Colors.onPrimary} style={{ fontWeight: 'bold' }} />
              </View>
            </View>
            <RNText className="font-headingBlack text-xl text-white tracking-tighter">FOOTLAW</RNText>
          </View>
          <View className="flex-row items-center gap-md">
            <View className="bg-surfaceContainerHighest px-md py-sm rounded-full border border-white/5">
              <Text className="font-bold text-xs text-[#a3e635]">{tokens} <Ionicons name="diamond" size={10}/> • {balance} • 85%</Text>
            </View>
            <TouchableOpacity className="p-xs">
              <Ionicons name="notifications" size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </BlurView>

        <ScrollView 
          contentContainerStyle={{ padding: 20 }} 
          showsVerticalScrollIndicator={false}
        >
          {/* Main Focus: Next Match */}
          <View className="bg-surfaceContainerHigh rounded-[28px] p-lg overflow-hidden border border-white/5 mb-xl">
            <LinearGradient
               colors={['rgba(42, 229, 0, 0.1)', 'transparent']}
               className="absolute inset-0"
            />
            
            <View className="flex-row justify-between items-start mb-xl z-10">
              <View className="bg-primary/20 flex-row items-center px-lg py-1.5 rounded-full gap-2">
                <View className="w-2 h-2 rounded-full bg-primary" />
                <Text className="text-primary font-bold text-[10px] tracking-[2px] uppercase">
                  {nextMatch?.competition || 'LEAGUE'} • MATCHDAY 1
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-onSurfaceVariant font-bold text-[10px] tracking-wider text-right uppercase">
                  {timeLeft === 'LIVE' ? 'MATCH STATUS' : 'KICKOFF IN'}
                </Text>
                <Text className="font-headingBlack text-3xl text-white tracking-tighter">{timeLeft}</Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center mb-xl z-20">
              {/* Home Team */}
              <View className="items-center w-[40%]">
                <View className="w-20 h-20 bg-surfaceContainerHighest rounded-full justify-center items-center border-[3px] border-primary/20 mb-md shadow-xl shadow-primary/20">
                  <Ionicons name="shield" size={40} color={Colors.primary} />
                </View>
                <Text className="font-headingBold text-md text-white uppercase tracking-tighter text-center h-10" numberOfLines={2}>
                  {nextMatch?.homeClubId === currentClub?.id ? clubName : 'Opponent'}
                </Text>
              </View>

              <View className="items-center w-[20%]">
                <Text className="font-headingBlack text-4xl text-white/20 italic tracking-[-2px] mb-xs">VS</Text>
                <LinearGradient
                  colors={['transparent', Colors.primary, 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="h-[1px] w-[60px]"
                />
              </View>

              {/* Away Team */}
              <View className="items-center w-[40%]">
                <View className="w-20 h-20 bg-surfaceContainerHighest rounded-full justify-center items-center border-[3px] border-secondaryContainer/20 mb-md shadow-xl shadow-secondaryContainer/20">
                  <Ionicons name="shield" size={40} color={Colors.secondaryContainer} />
                </View>
                <Text className="font-headingBold text-md text-white uppercase tracking-tighter text-center h-10" numberOfLines={2}>
                  {nextMatch?.awayClubId === currentClub?.id ? clubName : 'Opponent'}
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              activeOpacity={0.8} 
              className="z-10"
              onPress={() => router.push(timeLeft === 'LIVE' ? '/sim' : '/(tabs)/match')}
            >
              <LinearGradient
                colors={timeLeft === 'LIVE' ? ['#ef4444', '#b91c1c'] : ['#2ae500', '#1ca600']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-14 rounded-xl justify-center items-center"
              >
                <Text className="font-headingBlack text-lg text-onPrimary tracking-[3px]">
                  {timeLeft === 'LIVE' ? 'ENTER MATCH' : 'GO TO PREVIEW'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Quick Links */}
          <View className="gap-md mb-xl">
             <TouchableOpacity className="bg-surfaceContainerHigh rounded-xl p-lg flex-row justify-between items-center">
               <View className="flex-row items-center flex-1">
                 <View className="w-12 h-12 rounded-md justify-center items-center bg-primary/10">
                   <Ionicons name="barbell" size={24} color={Colors.primary} />
                 </View>
                 <View className="flex-1 ml-md">
                   <Text className="font-headingBold text-sm text-white">TRAINING PROGRESS</Text>
                   <Text className="font-regular text-xs text-onSurfaceVariant mt-0.5">8 players reached elite level</Text>
                 </View>
               </View>
               <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
             </TouchableOpacity>

             <TouchableOpacity className="bg-surfaceContainerHigh rounded-xl p-lg flex-row justify-between items-center">
               <View className="flex-row items-center flex-1">
                 <View className="w-12 h-12 rounded-md justify-center items-center bg-secondaryContainer/10">
                   <Ionicons name="swap-horizontal" size={24} color={Colors.secondaryContainer} />
                 </View>
                 <View className="flex-1 ml-md">
                   <Text className="font-headingBold text-sm text-white">TRANSFER NEWS</Text>
                   <Text className="font-regular text-xs text-onSurfaceVariant mt-0.5">Scouts found 3 prospects</Text>
                 </View>
               </View>
               <Ionicons name="chevron-forward" size={20} color={Colors.secondaryContainer} />
             </TouchableOpacity>
          </View>

          {/* League Stats Overview */}
          <View className="flex-row gap-md mb-xl">
            <View className="flex-1 bg-surfaceContainerLow rounded-xl p-lg border-l-4 border-primary">
              <Text className="font-bold text-[10px] text-onSurfaceVariant tracking-[1.5px] mb-1">POSITION</Text>
              <Text className="font-headingBlack text-3xl text-white">2nd</Text>
              <Text className="font-bold text-[10px] text-primary mt-1">+1 from last week</Text>
            </View>
            <View className="flex-1 bg-surfaceContainerLow rounded-xl p-lg border-l-4 border-secondaryContainer">
              <Text className="font-bold text-[10px] text-onSurfaceVariant tracking-[1.5px] mb-1">WIN RATE</Text>
              <Text className="font-headingBlack text-3xl text-white">78%</Text>
              <View className="flex-row gap-1 mt-1.5">
                <View className="w-2 h-2 rounded-full bg-primary" />
                <View className="w-2 h-2 rounded-full bg-primary" />
                <View className="w-2 h-2 rounded-full bg-danger" />
                <View className="w-2 h-2 rounded-full bg-primary" />
                <View className="w-2 h-2 rounded-full bg-primary" />
              </View>
            </View>
          </View>

          {/* Player Spotlight */}
          <View className="h-[280px] bg-surfaceContainerHigh rounded-[28px] border border-white/5 overflow-hidden">
             <Image source={{ uri: PLAYER_SPOTLIGHT }} className="absolute inset-0" resizeMode="cover" />
             <LinearGradient
               colors={['transparent', Colors.surfaceContainerHighest]}
               className="absolute inset-0 top-[30%]"
             />
             <View className="absolute top-lg left-lg bg-secondaryContainer/30 px-md py-1.5 rounded-full border border-secondaryContainer/20">
               <Text className="font-headingBlack text-[8px] text-secondaryContainer tracking-[1.5px] uppercase">PROJECTIVE STAR SPOTLIGHT</Text>
             </View>
             
             <View className="absolute bottom-lg left-lg right-lg bg-black/80 rounded-lg p-lg border border-white/5">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-headingBlack text-lg text-white uppercase">
                    {spotlightPlayer ? `${spotlightPlayer.firstName} ${spotlightPlayer.lastName}` : 'PROSPECTING...'}
                  </Text>
                  <Text className="font-bold text-md text-primary">{spotlightPlayer?.position || '--'}</Text>
                </View>
                <View className="flex-row justify-between">
                  <View className="items-center">
                    <Text className="font-bold text-[10px] text-onSurfaceVariant tracking-[1.5px] mb-1">AGE</Text>
                    <Text className="font-headingBold text-xl text-white">{spotlightPlayer?.age || '--'}</Text>
                  </View>
                  <View className="items-center">
                    <Text className="font-bold text-[10px] text-onSurfaceVariant tracking-[1.5px] mb-1">CONDITION</Text>
                    <Text className="font-headingBold text-xl text-white">{spotlightPlayer?.condition || 0}%</Text>
                  </View>
                  <View className="items-center">
                    <Text className="font-bold text-[10px] text-onSurfaceVariant tracking-[1.5px] mb-1">STAR RATING</Text>
                    <Text className="font-headingBold text-xl text-secondaryContainer">{spotlightPlayer?.starRating || 0.0}</Text>
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


