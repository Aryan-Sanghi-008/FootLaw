import React from 'react';
import {
  View,
  Text as RNText,
  ScrollView,
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
import { fetchMyClub, upgradeFacility } from '../../store/slices/clubSlice';
import { Text } from '../../components/Themed';

const { width } = Dimensions.get('window');

const AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuBINf4CTlKW4Kd6m5WCapC3Z4yiR5H-JjYIRKp0caKKK-uc6Qc6oxrEsSYYyLWh0HBoKrZ4ztGlEKskIccXKmbLxlcVHd8YU7E7c12WqEBHEJIjM2kh9aKnNQa2f7t9Gz0Psvvjbf1p6r5WWZ8RjyOL90QvvnLJ-_T7OGkn6FIBEPm8Vols-nEm-yY32XGXCtzZtCYGuNDiiHJRRJ6W-H0XTEEviO6OCB--kmrCohIataqW15bv3zy3SA-VwccCuWhTB1alibLNDUWt";
const MAP_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuDd4ZwJ1SESFl3yM7zlFsTci0sheBTYCn5nqZm3YocJxeuoIO6X4XcZzp8q-tQaK1sf8i6OAufZTYv_imJkhrrGsKvoum5v0bFgr3oAmCsE4PptmOmyZx6pvJv2accNW28WlF56QfiwzhGuRBHCphVrdZ_DTct1RplQkRrsnGB0bp6fUmKwI2aSbrXXTjcNqFYYf-cyzFbWE3kgI438b6aPhpE090pvgjjBO9Y6euF8uBJ5wPvzBgDi8V-qCHrN5GGeT__eOIUX_sRP";

function FacilityCard({ facility, type }: { facility: any; type: string }) {
  const dispatch = useAppDispatch();
  
  const colorMap: any = {
    stadium: Colors.primary,
    trainingGround: Colors.secondaryContainer,
    youthAcademy: Colors.tertiary,
    medicalCenter: Colors.error
  };

  const iconMap: any = {
    stadium: 'football',
    trainingGround: 'barbell',
    youthAcademy: 'people',
    medicalCenter: 'medkit'
  };

  const colorHex = colorMap[type] || Colors.primary;
  const iconName = iconMap[type] || 'football';
  const upgradeCost = facility.level * 1000000;

  return (
    <View className="mb-md">
       <TouchableOpacity 
         activeOpacity={0.9}
         className="bg-surfaceContainerHigh rounded-[24px] p-lg flex-row items-center border border-white/5"
         onPress={() => dispatch(upgradeFacility(type))}
       >
          <View 
            className="w-16 h-16 rounded-2xl items-center justify-center" 
            style={{ backgroundColor: colorHex + '20' }}
          >
             <Ionicons name={iconName as any} size={32} color={colorHex} />
          </View>

          <View className="flex-1 ml-lg">
             <View className="flex-row justify-between items-center mb-1">
                <Text className="font-headingBold text-lg text-white uppercase">{type.replace(/([A-Z])/g, ' $1')}</Text>
                <View className="bg-surfaceContainerHighest px-2 py-0.5 rounded border border-white/5">
                   <Text className="font-headingBlack text-[10px] text-white">LV. {facility.level}</Text>
                </View>
             </View>
             
             <View className="flex-row justify-between items-end">
                <View>
                   <Text className="font-bold text-[9px] text-onSurfaceVariant tracking-wider uppercase mb-0.5">NEXT UPGRADE</Text>
                   <Text className="font-headingBlack text-[14px]" style={{ color: colorHex }}>{formatCurrency(upgradeCost)}</Text>
                </View>
                <View className="flex-row items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                   <Ionicons name="trending-up" size={12} color={Colors.primary} />
                   <Text className="font-bold text-[10px] text-primary">+12% BONUS</Text>
                </View>
             </View>
          </View>
       </TouchableOpacity>
    </View>
  );
}

export default function CampusScreen() {
  const dispatch = useAppDispatch();
  const { currentClub } = useAppSelector((state) => state.club);

  React.useEffect(() => {
    dispatch(fetchMyClub());
  }, []);

  const balance = currentClub ? formatCurrency(currentClub.cash) : '$0';
  const tokens = currentClub?.tokens || 0;
  const facilities = currentClub?.facilities || ({} as any);

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

        <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
          {/* Isometric World View */}
          <View className="w-full aspect-square bg-surfaceContainerLowest rounded-[32px] overflow-hidden border border-white/5 mb-xl relative">
             <Image source={{ uri: MAP_IMG }} className="absolute inset-0 opacity-40" resizeMode="cover" />
             <LinearGradient
               colors={['transparent', Colors.background]}
               className="absolute inset-0"
             />
             
             {/* Dynamic Pins */}
             <View className="absolute top-[25%] left-[45%]">
                <View className="items-center">
                   <View className="bg-primary px-3 py-1.5 rounded-full border-2 border-white shadow-xl">
                      <Ionicons name="football" size={16} color="white" />
                   </View>
                   <View className="w-0.5 h-4 bg-white/50" />
                </View>
             </View>

             <View className="absolute bottom-[35%] right-[25%]">
                <View className="items-center">
                   <View className="bg-secondaryContainer px-3 py-1.5 rounded-full border-2 border-white shadow-xl">
                      <Ionicons name="barbell" size={16} color="white" />
                   </View>
                   <View className="w-0.5 h-4 bg-white/50" />
                </View>
             </View>

             <View className="absolute top-[45%] right-[15%]">
                <View className="items-center">
                   <View className="bg-error px-3 py-1.5 rounded-full border-2 border-white shadow-xl">
                      <Ionicons name="medkit" size={16} color="white" />
                   </View>
                   <View className="w-0.5 h-4 bg-white/50" />
                </View>
             </View>

             <View className="absolute inset-x-xl bottom-xl">
                <BlurView intensity={80} tint="dark" className="p-lg rounded-2xl border border-white/10 overflow-hidden">
                   <View className="flex-row justify-between items-center">
                      <View>
                         <Text className="font-bold text-[10px] text-onSurfaceVariant tracking-widest mb-1 uppercase">MASTER CAMPUS VALUE</Text>
                         <Text className="font-headingBlack text-2xl text-white tracking-tighter">$142,500,000</Text>
                      </View>
                      <View className="bg-primary/20 p-2 rounded-xl">
                         <Ionicons name="stats-chart" size={24} color={Colors.primary} />
                      </View>
                   </View>
                </BlurView>
             </View>
          </View>

          {/* Infrastructure Bento */}
          <View className="mb-lg">
             <Text className="font-headingBold text-[10px] text-secondaryContainer tracking-[2px] mb-lg uppercase">INFRASTRUCTURE STATUS</Text>
             {Object.keys(facilities).map(key => (
                <FacilityCard key={key} type={key} facility={facilities[key]} />
             ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
