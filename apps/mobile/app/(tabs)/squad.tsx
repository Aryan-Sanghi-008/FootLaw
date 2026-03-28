import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text as RNText,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchSquad } from '../../store/slices/squadSlice';
import { Text } from '../../components/Themed';
import { Colors } from '../../theme/tokens';
import { IPlayer, Position, Morale } from '@footlaw/shared';
import Pitch3D from '../../components/3d/Pitch3D';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatCurrency } from '../../utils/helpers';



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

function TacticSlider({ label, value, type }: { label: string; value: string; type: 'primary' | 'secondary' | 'error' }) {
  const colorMap: Record<string, string[]> = {
    primary: [Colors.primary, Colors.onPrimaryContainer],
    secondary: [Colors.secondaryContainer, '#00b4d8'],
    error: [Colors.error, Colors.onErrorContainer],
  };
  const colors = colorMap[type];

  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-end mb-2">
        <Text className="font-bold text-xs text-white tracking-widest">{label}</Text>
        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: colors[0] + '20' }}>
          <Text className="font-bold text-xs" style={{ color: colors[0] }}>{value}</Text>
        </View>
      </View>
      <View className="h-2 bg-surfaceContainer rounded-full overflow-hidden">
        <LinearGradient
          colors={colors as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-full rounded-full"
          style={{ width: type === 'primary' ? '75%' : type === 'secondary' ? '50%' : '90%' }}
        />
      </View>
    </View>
  );
}

function BenchPlayer({ player }: { player: IPlayer }) {
  return (
    <TouchableOpacity className="w-[100px] bg-surfaceContainer rounded-xl p-md border border-white/5 mr-md">
      <View className="relative mb-sm">
        <View className="h-[60px] rounded-lg justify-center items-center bg-surfaceContainerHighest">
           <Ionicons name="person" size={32} color={Colors.outline} />
        </View>
        <View className="absolute top-1 right-1 bg-surfaceContainerHighest px-1.5 py-0.5 rounded-full border border-white/10">
          <Text className="font-bold text-[10px] text-white">{Math.floor(player.starRating * 10) + 40}</Text>
        </View>
      </View>
      <Text className="font-bold text-[10px] text-white text-center uppercase mb-1" numberOfLines={1}>{player.lastName}</Text>
      <View className="flex-row justify-between items-center">
        <Ionicons 
          name={player.morale === 'Superb' ? "happy" : player.morale === 'Terrible' ? "sad" : "partly-sunny"} 
          size={14} 
          color={Colors.primary} 
        />
        <Text className="font-bold text-[9px] text-outline">{player.position}</Text>
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

  const squadStats = useMemo(() => {
    if (startingEleven.length === 0) return { quality: '0%', morale: 'Low' };
    const avgQuality = startingEleven.reduce((acc, p) => acc + (p.starRating * 10), 0) / startingEleven.length;
    return {
      quality: `${avgQuality.toFixed(1)}%`,
      morale: 'High', // Simplified for now
    };
  }, [startingEleven]);

  const pitchPlayers = useMemo(() => {
    return startingEleven.map((p, idx) => ({
      id: p._id,
      name: p.lastName,
      position: getPitchPosition(p.position, idx),
    }));
  }, [startingEleven]);

  const balance = currentClub ? formatCurrency(currentClub.cash) : '$0';
  const tokens = currentClub?.tokens || 0;

  if (isLoading && players.length === 0) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Top App Bar */}
        <BlurView intensity={30} tint="dark" className="flex-row items-center justify-between px-xl py-md">
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
        </BlurView>

        <ScrollView 
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        >
          {/* Management Tabs */}
          <View className="flex-row bg-surfaceContainer rounded-xl p-1 mb-xl">
             {['squad', 'formation', 'roles'].map((tab) => (
                <TouchableOpacity 
                  key={tab} 
                  className={`flex-1 py-md items-center rounded-lg ${activeTab === tab ? 'bg-primary/10 shadow-lg shadow-primary/15' : ''}`}
                  onPress={() => setActiveTab(tab as any)}
                >
                  <Text className={`font-headingBold text-sm tracking-wider uppercase ${activeTab === tab ? 'text-primary' : 'text-outline'}`}>
                    {tab}
                  </Text>
                </TouchableOpacity>
             ))}
          </View>

          {/* Current Squad Stats */}
          <View className="bg-surfaceContainerHigh rounded-[24px] p-lg border border-white/5 mb-xl overflow-hidden">
            <View className="absolute -top-[40px] -right-[40px] w-[120px] h-[120px] bg-primary/10 rounded-full" />
            <Text className="font-headingBold text-[10px] text-secondaryContainer tracking-[2px] mb-lg uppercase">CURRENT SQUAD STATS</Text>
            <View className="flex-row gap-4">
              <View className="flex-1 bg-surfaceContainer p-lg rounded-xl border-l-2 border-primary">
                <Text className="font-bold text-[10px] text-outline tracking-wider mb-1 uppercase">TOTAL QUALITY</Text>
                <Text className="font-headingBlack text-2xl text-white">{squadStats.quality}</Text>
              </View>
              <View className="flex-1 bg-surfaceContainer p-lg rounded-xl border-l-2 border-secondaryContainer">
                <Text className="font-bold text-[10px] text-outline tracking-wider mb-1 uppercase">MORALE AVG.</Text>
                <Text className="font-headingBlack text-2xl text-white">{squadStats.morale}</Text>
              </View>
            </View>
          </View>

          {/* Tactical Sliders */}
          <View className="bg-surfaceContainerHigh rounded-[24px] p-lg border border-white/5 mb-xl">
            <Text className="font-headingBold text-[10px] text-secondaryContainer tracking-[2px] mb-lg uppercase">MATCH TACTICS</Text>
            <View className="gap-xl">
              <TacticSlider label="TEAM MENTALITY" value="Attacking" type="primary" />
              <TacticSlider label="PASSING STYLE" value="Mixed" type="secondary" />
              <TacticSlider label="PRESSING INTENSITY" value="High" type="error" />
            </View>
          </View>

          <TouchableOpacity className="mb-xl">
             <LinearGradient
                colors={['#2ae500', '#1ca600']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-14 rounded-xl justify-center items-center"
             >
                <Text className="font-headingBlack text-sm text-onPrimary tracking-[3px]">SUBMIT STRATEGY</Text>
             </LinearGradient>
          </TouchableOpacity>

          {/* 3D Pitch View */}
          <View className="aspect-[3/4] rounded-[32px] overflow-hidden border border-white/5 mb-xl">
            <LinearGradient
               colors={[Colors.surfaceContainerLow, Colors.surface]}
               className="absolute inset-0"
            />
            {/* The actual 3D engine rendered above the gradient background */}
            <Pitch3D players={pitchPlayers} />
            
            <View className="absolute top-lg left-lg flex-row items-center gap-2 bg-black/80 px-md py-2 rounded-full border border-white/10">
               <View className="w-2 h-2 bg-primary rounded-full" />
               <Text className="font-headingBlack text-[10px] text-white tracking-[2px]">LIVE MATCH LOGIC ACTIVE</Text>
            </View>
          </View>

          {/* Substitutes */}
          <View className="bg-surfaceContainerHigh rounded-[24px] p-lg border border-white/5">
            <View className="flex-row justify-between items-center mb-md">
              <Text className="font-headingBold text-[10px] text-secondaryContainer tracking-[2px] mb-lg uppercase">SUBSTITUTES</Text>
              <TouchableOpacity>
                <Text className="font-headingBlack text-[10px] text-white tracking-[2px]">SWAP BENCH</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
               {benchPlayers.map(p => <BenchPlayer key={p._id} player={p} />)}
               {benchPlayers.length === 0 && <Text className="text-outline">No substitutes available.</Text>}
            </ScrollView>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
