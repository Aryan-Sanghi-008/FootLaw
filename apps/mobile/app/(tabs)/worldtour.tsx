import React from 'react';
import {
  View,
  Text as RNText,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize, FontFamily } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../../store';
import { formatCurrency } from '../../utils/helpers';
import { useRouter } from 'expo-router';
import { Text } from '../../components/Themed';

const { width } = Dimensions.get('window');

const WORLD_MAP = "https://lh3.googleusercontent.com/aida-public/AB6AXuD9nZf3vY3x7yPzE3B_R6bQ_-a8D_yFw_S_M1H5fN9yZ8M_7e_U6b9z_S8M_xN9yZ8M_7e_U6b9z_S8M_xN9yZ8M_7e_U6b9z_S8M_xN9yZ8M_7e_U6b9z_S8M_xN9yZ8M_7e_U6b9z_S8M_xN9y"; // High res map

const REGIONS = [
  { id: 'eu', name: 'EUROPE ELITE', status: 'active', matches: 12, completed: 4, icon: 'boat' },
  { id: 'na', name: 'NORTH AMERICA', status: 'locked', matches: 8, completed: 0, icon: 'airplane' },
  { id: 'sa', name: 'SOUTH AMERICA', status: 'locked', matches: 10, completed: 0, icon: 'earth' },
  { id: 'as', name: 'ASIA PACIFIC', status: 'locked', matches: 8, completed: 0, icon: 'compass' },
];

function RegionNode({ region, index }: { region: any; index: number }) {
  const isActive = region.status === 'active';
  const progress = (region.completed / region.matches) * 100;

  return (
    <View className="mb-8 relative">
       {index < REGIONS.length - 1 && (
         <View className="absolute left-[45px] top-[90px] w-0.5 h-[60px] bg-white/10" />
       )}
       
       <TouchableOpacity 
         activeOpacity={0.9}
         className={`flex-row items-center p-lg rounded-[24px] border ${isActive ? 'bg-surfaceContainerHigh border-primary/50 shadow-xl shadow-primary/20' : 'bg-surfaceContainerLow border-white/5 opacity-60'}`}
       >
          <View className={`w-[90px] h-[90px] rounded-[20px] items-center justify-center ${isActive ? 'bg-primary/20' : 'bg-surfaceVariant'}`}>
             <Ionicons name={region.icon as any} size={40} color={isActive ? Colors.primary : Colors.outline} />
             {isActive && (
               <View className="absolute inset-0 rounded-[20px] border border-primary/30" />
             )}
          </View>

          <View className="flex-1 ml-lg">
             <View className="flex-row justify-between items-center mb-1">
                <Text className={`font-headingBlack text-xl tracking-tighter uppercase ${isActive ? 'text-white' : 'text-outline'}`}>{region.name}</Text>
                {!isActive && <Ionicons name="lock-closed" size={18} color={Colors.outline} />}
             </View>
             
             <View className="flex-row items-center gap-2 mb-3">
                <Text className="font-bold text-[10px] text-onSurfaceVariant uppercase">REWARD PROGRESS</Text>
                <Text className="font-headingBold text-[10px] text-secondaryContainer">{region.completed}/{region.matches} CHALLENGES</Text>
             </View>

             <View className="h-1.5 bg-background rounded-full overflow-hidden">
                <View 
                  className={`h-full rounded-full ${isActive ? 'bg-primary' : 'bg-outline'}`} 
                  style={{ width: `${progress}%` }} 
                />
             </View>
          </View>
       </TouchableOpacity>
    </View>
  );
}

export default function WorldTourScreen() {
  const router = useRouter();
  const { currentClub } = useAppSelector((state) => state.club);
  
  const balance = currentClub ? formatCurrency(currentClub.cash) : '$0';
  const tokens = currentClub?.tokens || 0;

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Top App Bar */}
        <BlurView intensity={30} tint="dark" className="flex-row items-center justify-between px-xl py-md">
          <View className="flex-row items-center gap-md">
            <View className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
              <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBINf4CTlKW4Kd6m5WCapC3Z4yiR5H-JjYIRKp0caKKK-uc6Qc6oxrEsSYYyLWh0HBoKrZ4ztGlEKskIccXKmbLxlcVHd8YU7E7c12WqEBHEJIjM2kh9aKnNQa2f7t9Gz0Psvvjbf1p6r5WWZ8RjyOL90QvvnLJ-_T7OGkn6FIBEPm8Vols-nEm-yY32XGXCtzZtCYGuNDiiHJRRJ6W-H0XTEEviO6OCB--kmrCohIataqW15bv3zy3SA-VwccCuWhTB1alibLNDUWt" }} className="w-full h-full" />
            </View>
            <RNText className="font-headingBlack text-xl text-white tracking-tighter">FOOTLAW</RNText>
          </View>
          <View className="flex-row items-center">
            <View className="bg-surfaceContainerLow px-md py-sm rounded-full border border-white/5">
               <Text className="font-headingBold text-xs text-primary tracking-[2px]">{tokens} <Ionicons name="diamond" size={10}/> • {balance}</Text>
            </View>
          </View>
        </BlurView>

        <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="mb-xl">
             <Text className="font-bold text-[10px] text-primary tracking-[2.5px] uppercase mb-1">GLOBAL CONQUEST</Text>
             <Text className="font-headingBlack text-[32px] text-white tracking-tighter">World Tour</Text>
          </View>

          {/* Map Feature Card */}
          <View className="h-[280px] rounded-[32px] overflow-hidden border border-white/10 mb-xl relative">
             <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd4ZwJ1SESFl3yM7zlFsTci0sheBTYCn5nqZm3YocJxeuoIO6X4XcZzp8q-tQaK1sf8i6OAufZTYv_imJkhrrGsKvoum5v0bFgr3oAmCsE4PptmOmyZx6pvJv2accNW28WlF56QfiwzhGuRBHCphVrdZ_DTct1RplQkRrsnGB0bp6fUmKwI2aSbrXXTjcNqFYYf-cyzFbWE3kgI438b6aPhpE090pvgjjBO9Y6euF8uBJ5wPvzBgDi8V-qCHrN5GGeT__eOIUX_sRP" }} className="w-full h-full" resizeMode="cover" />
             <LinearGradient
               colors={['rgba(0,0,0,0.8)', 'transparent', 'rgba(0,0,0,0.9)']}
               className="absolute inset-0"
             />
             <View className="absolute inset-0 p-xl justify-between">
                <View className="flex-row items-center self-start bg-secondaryContainer/20 px-3 py-1.5 rounded-full border border-secondaryContainer/30">
                   <View className="w-2 h-2 rounded-full bg-secondaryContainer mr-2" />
                   <Text className="font-headingBlack text-[8px] text-secondaryContainer tracking-[1.5px] uppercase">REGION CHALLENGE ACTIVE</Text>
                </View>
                
                <View>
                   <Text className="font-headingBold text-2xl text-white mb-lg">Next Stop: Madrid El Clasico Invitation</Text>
                   <TouchableOpacity 
                     activeOpacity={0.8}
                     className="bg-primary h-12 rounded-xl justify-center items-center shadow-xl shadow-primary/40"
                   >
                      <Text className="font-headingBlack text-sm text-onPrimary tracking-[2px] uppercase">ENTER TOUR MATCH</Text>
                   </TouchableOpacity>
                </View>
             </View>
          </View>

          {/* Progress List */}
          <View className="mb-lg">
             <Text className="font-headingBold text-[10px] text-secondaryContainer tracking-[2px] mb-lg uppercase">REGION PROGRESS</Text>
             {REGIONS.map((r, i) => <RegionNode key={r.id} region={r} index={i} />)}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
