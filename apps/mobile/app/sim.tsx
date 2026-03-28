import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Text as RNText
} from 'react-native';
import { useAppSelector, useAppDispatch } from '@/store';
import { simulateMatch, clearSimulation } from '@/store/slices/matchSlice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  FadeIn, 
  FadeOut, 
  ZoomIn 
} from 'react-native-reanimated';

const AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuBINf4CTlKW4Kd6m5WCapC3Z4yiR5H-JjYIRKp0caKKK-uc6Qc6oxrEsSYYyLWh0HBoKrZ4ztGlEKskIccXKmbLxlcVHd8YU7E7c12WqEBHEJIjM2kh9aKnNQa2f7t9Gz0Psvvjbf1p6r5WWZ8RjyOL90QvvnLJ-_T7OGkn6FIBEPm8Vols-nEm-yY32XGXCtzZtCYGuNDiiHJRRJ6W-H0XTEEviO6OCB--kmrCohIataqW15bv3zy3SA-VwccCuWhTB1alibLNDUWt";

function GoalOverlay({ teamName }: { teamName: string }) {
  return (
    <Animated.View 
      entering={ZoomIn.duration(500)} 
      exiting={FadeOut}
      className="absolute inset-x-0 top-[40%] z-[100] items-center"
    >
       <BlurView intensity={90} tint="dark" className="px-10 py-6 rounded-[32px] border-2 border-primary/50 overflow-hidden items-center">
          <Text className="font-headingBlack text-[64px] text-primary tracking-tighter leading-[70px]">GOAL!</Text>
          <Text className="font-headingBold text-xl text-white uppercase tracking-[4px]">{teamName}</Text>
          <View className="h-1 w-full bg-primary/30 mt-4 rounded-full" />
       </BlurView>
    </Animated.View>
  );
}

const Text = ({ style, className, ...props }: any) => <RNText className={`font-regular text-textPrimary ${className || ''}`} style={style} {...props} />;

export default function LiveMatchSimulationScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const { matchId } = params;

  const { activeSimulation, isSimulating } = useAppSelector((state) => state.match);
  const { currentClub } = useAppSelector((state) => state.club);

  const [currentMinute, setCurrentMinute] = useState(0);
  const [displayedEvents, setDisplayedEvents] = useState<any[]>([]);
  const [showGoalOverlay, setShowGoalOverlay] = useState<string | null>(null);

  useEffect(() => {
    if (matchId) {
      dispatch(simulateMatch(matchId as string));
    }
    return () => {
      dispatch(clearSimulation());
    };
  }, [matchId]);

  useEffect(() => {
    if (!activeSimulation || isSimulating) return;

    const interval = setInterval(() => {
      setCurrentMinute((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        
        const nextMin = prev + 1;
        const newEvents = activeSimulation.events.filter(e => e.minute === nextMin);
        
        if (newEvents.length > 0) {
          const goalEvent = newEvents.find(e => e.type === 'goal');
          if (goalEvent) {
             const teamName = goalEvent.clubId === activeSimulation.homeClubId 
               ? (currentClub?.name || 'Home') 
               : 'Opponent';
             setShowGoalOverlay(teamName);
             setTimeout(() => setShowGoalOverlay(null), 3500);
          }
          setDisplayedEvents(prevEvents => [...newEvents, ...prevEvents].slice(0, 5));
        }
        
        return nextMin;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSimulation, isSimulating, currentClub]);

  const homeTeamName = activeSimulation?.homeClubId === currentClub?.id ? currentClub?.name : 'Opponent';
  const awayTeamName = activeSimulation?.awayClubId === currentClub?.id ? currentClub?.name : 'Opponent';
  
  const homeScore = activeSimulation?.events
    .filter(e => e.minute <= currentMinute && e.type === 'goal' && e.clubId === activeSimulation.homeClubId)
    .length || 0;
  
  const awayScore = activeSimulation?.events
    .filter(e => e.minute <= currentMinute && e.type === 'goal' && e.clubId === activeSimulation.awayClubId)
    .length || 0;

  const latestEvent = displayedEvents[0];

  return (
    <View className="flex-1 bg-background">
      <View className="absolute inset-0 z-0 opacity-80">
         <LinearGradient
            colors={['#1b3a1b', '#0f131f']}
            start={{ x: 0.5, y: 0.2 }}
            end={{ x: 0.5, y: 1 }}
            className="absolute inset-0"
         />
      </View>

      <View className="absolute inset-0 z-10" pointerEvents="none">
         <View className="absolute w-1.5 h-1.5 rounded-full opacity-20" style={{ top: '25%', left: '25%', backgroundColor: Colors.primary }} />
         <View className="absolute w-2 h-2 rounded-full opacity-10" style={{ bottom: '33%', right: '25%', backgroundColor: Colors.secondaryContainer }} />
         <View className="absolute w-1.5 h-1.5 rounded-full opacity-20" style={{ top: '50%', right: '50%', backgroundColor: Colors.white }} />
      </View>

      <SafeAreaView className="flex-1 z-20 justify-between" edges={['top', 'bottom']}>
        <BlurView intensity={40} tint="dark" className="flex-row items-center justify-between px-xl py-md border-b border-white/5">
          <TouchableOpacity onPress={() => router.back()} className="p-sm">
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>

          <View className="flex-row items-center gap-xl absolute left-1/2 -translate-x-[120px]">
            <View className="items-end">
              <Text className="font-headingBold text-[10px] text-outline uppercase tracking-[2px]">{homeTeamName}</Text>
              <Text className="font-headingBlack text-[32px] text-white leading-10">{homeScore}</Text>
            </View>
            
            <View className="items-center bg-surfaceContainerHighest px-md py-1 rounded-full border border-white/5">
              <Text className="font-headingBlack text-xl text-primary tracking-tighter">{currentMinute}'</Text>
              <Text className="font-bold text-[8px] text-outline uppercase tracking-wider">{currentMinute === 90 ? 'FULL TIME' : 'LIVE MATCH'}</Text>
            </View>
 
            <View className="items-start">
              <Text className="font-headingBold text-[10px] text-outline uppercase tracking-[2px]">{awayTeamName}</Text>
              <Text className="font-headingBlack text-[32px] text-white leading-10">{awayScore}</Text>
            </View>
          </View>

          <TouchableOpacity className="p-sm">
            <Ionicons name="settings-outline" size={24} color={Colors.outline} />
          </TouchableOpacity>
        </BlurView>
        {/* Main tactical View */}
        <View className="flex-1 justify-center items-center relative">
          {showGoalOverlay && <GoalOverlay teamName={showGoalOverlay} />}
          
          <View className="w-[85%] max-w-[400px] aspect-[3/4] bg-surfaceContainer rounded-[40px] border border-white/10 relative overflow-hidden shadow-2xl shadow-black">
             <View className="absolute inset-4 border-2 border-white/10 rounded-[24px]">
                {/* Center Circle */}
                <View className="absolute top-1/2 left-1/2 w-[100px] h-[100px] rounded-full border-2 border-white/10 -translate-x-[50px] -translate-y-[50px]" />
                <View className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-px" />
                {/* Penalty Areas */}
                <View className="absolute top-0 left-1/2 w-[150px] h-[60px] border-2 border-t-0 border-white/10 -translate-x-[75px]" />
                <View className="absolute bottom-0 left-1/2 w-[150px] h-[60px] border-2 border-b-0 border-white/10 -translate-x-[75px]" />
             </View>

             {/* Simulated Home Team Dots */}
             <Animated.View entering={FadeIn.delay(200)} className="absolute w-4 h-4 rounded-full items-center justify-center bg-primary shadow-lg shadow-primary" style={{ top: '25%', left: '25%' }}><Text className="font-headingBlack text-[8px] text-surface">9</Text></Animated.View>
             <Animated.View entering={FadeIn.delay(300)} className="absolute w-4 h-4 rounded-full items-center justify-center bg-primary shadow-lg shadow-primary" style={{ top: '33%', left: '50%' }}><Text className="font-headingBlack text-[8px] text-surface">10</Text></Animated.View>
             <Animated.View entering={FadeIn.delay(400)} className="absolute w-4 h-4 rounded-full items-center justify-center bg-primary shadow-lg shadow-primary" style={{ top: '25%', right: '25%' }}><Text className="font-headingBlack text-[8px] text-surface">7</Text></Animated.View>
             
             {/* Simulated Away Team Dots */}
             <Animated.View entering={FadeIn.delay(500)} className="absolute w-4 h-4 rounded-full items-center justify-center bg-secondaryContainer shadow-lg shadow-secondaryContainer" style={{ bottom: '25%', left: '33%' }}><Text className="font-headingBlack text-[8px] text-surface">4</Text></Animated.View>
             <Animated.View entering={FadeIn.delay(600)} className="absolute w-4 h-4 rounded-full items-center justify-center bg-secondaryContainer shadow-lg shadow-secondaryContainer" style={{ bottom: '33%', right: '50%' }}><Text className="font-headingBlack text-[8px] text-surface">5</Text></Animated.View>
             
             {/* The Ball */}
             <View className="absolute top-[42%] left-[48%] w-2.5 h-2.5 bg-white rounded-full shadow-lg shadow-white" />
          </View>

          {/* Quick Widgets */}
          <View className="absolute left-lg top-1/2 -translate-y-[60px] gap-md">
             <TouchableOpacity className="bg-slate-800/60 p-md rounded-xl items-center border border-white/10">
                <Ionicons name="swap-horizontal" size={28} color={Colors.primary} />
                <Text className="font-headingBlack text-[7px] text-outline mt-1">SUBS</Text>
             </TouchableOpacity>
             <TouchableOpacity className="bg-slate-800/60 p-md rounded-xl items-center border border-white/10">
                <Ionicons name="options" size={28} color={Colors.secondaryContainer} />
                <Text className="font-headingBlack text-[7px] text-outline mt-1">TACTICS</Text>
             </TouchableOpacity>
          </View>

          <View className="absolute right-lg top-1/2 -translate-y-[70px]">
             <View className="bg-slate-800/60 py-lg px-2 rounded-xl items-center border border-white/10 gap-md">
                <Text className="font-headingBlack text-[7px] text-outline mt-1 -rotate-90 w-[60px]">MENTALITY</Text>
                <View className="w-1.5 h-20 bg-surfaceContainerLowest rounded-full overflow-hidden relative">
                   <LinearGradient 
                      colors={['#f97316', Colors.primary]}
                      className="absolute bottom-0 w-full h-[70%]"
                   />
                </View>
                <Text className="font-headingBlack text-[7px] text-primary mt-1">ATTACK</Text>
             </View>
          </View>
        </View>

        {/* Commentary & Controls Section */}
        <View className="px-xl pb-xl gap-xl">
          <BlurView intensity={40} tint="dark" className="rounded-[24px] p-lg border border-white/10 relative">
             {/* Live indicator */}
             <View className="absolute -top-2.5 left-xl bg-error flex-row items-center gap-1 px-md py-0.5 rounded-full">
                <View className="w-1.5 h-1.5 bg-white rounded-full" />
                <Text className="font-headingBlack text-[8px] text-white tracking-wider">LIVE FEED</Text>
             </View>
             
             {latestEvent ? (
               <View className="flex-row gap-md items-start mt-2">
                  <Text className="font-headingBlack text-sm text-primary">{latestEvent.minute}'</Text>
                  <View className="flex-1">
                     <Text className="font-bold text-sm text-white leading-5">
                        {latestEvent.type === 'goal' && <Text className="text-primary">GOAL! </Text>}
                        {latestEvent.text}
                     </Text>
                  </View>
               </View>
             ) : (
               <View className="flex-row gap-md items-start mt-2">
                  <Text className="font-headingBlack text-sm text-primary">{currentMinute}'</Text>
                  <View className="flex-1">
                     <Text className="font-bold text-sm text-white leading-5">Match is underway. Both teams looking for an opening.</Text>
                  </View>
               </View>
             )}
          </BlurView>

          <View className="flex-row gap-md">
             <TouchableOpacity className="flex-1" activeOpacity={0.8}>
                <LinearGradient
                   colors={['#2ae500', '#1ca600']}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 1 }}
                   className="flex-row items-center justify-center gap-2 py-lg rounded-xl"
                >
                   <Ionicons name="flash" size={20} color={Colors.onPrimary} />
                   <Text className="font-headingBlack text-sm text-onPrimary tracking-widest">BOOST MORALE</Text>
                </LinearGradient>
             </TouchableOpacity>

             <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 bg-surfaceContainerHighest py-lg rounded-xl border border-primary/20" activeOpacity={0.8}>
                <Ionicons name="analytics" size={20} color={Colors.white} />
                <Text className="font-headingBlack text-sm text-white tracking-widest">LIVE STATS</Text>
             </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}


