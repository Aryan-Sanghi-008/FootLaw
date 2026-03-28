import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, Platform } from 'react-native';
import { Colors, FontSize, FontFamily, BorderRadius } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

function TabIcon({ name, focused, label }: { name: React.ComponentProps<typeof Ionicons>['name']; focused: boolean; label: string }) {
  if (focused && label === 'Home') {
    return (
      <View className="items-center justify-center bg-primary/10 px-4 py-2 rounded-xl mt-2.5 ios:mt-2.5 android:mt-0">
        <Ionicons name="home" size={24} color={Colors.primary} />
        <Text className="font-headingBold text-[10px] text-primary mt-1 uppercase tracking-wider">{label}</Text>
      </View>
    );
  }

  return (
    <View className="items-center justify-center">
      <Ionicons name={focused ? (name.replace('-outline', '') as any) : name} size={24} color={focused ? Colors.white : Colors.onSurfaceVariant} />
      <Text className={`font-headingBold text-[10px] mt-1 uppercase tracking-wider ${focused ? 'text-white' : 'text-onSurfaceVariant'}`}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'rgba(15,19,31,0.85)',
          height: Platform.OS === 'ios' ? 95 : 75,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        },
        tabBarBackground: () => (
          <View className="absolute inset-0">
            <BlurView intensity={30} tint="dark" className="absolute inset-0" />
          </View>
        ),
        tabBarShowLabel: false, // We render the label inside the custom TabIcon
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="home-outline" focused={focused} label="Home" />,
        }}
      />
      <Tabs.Screen
        name="squad"
        options={{
          title: 'Squad',
          tabBarIcon: ({ focused }) => <TabIcon name="people-outline" focused={focused} label="Squad" />,
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: 'Transfers',
          tabBarIcon: ({ focused }) => <TabIcon name="swap-horizontal-outline" focused={focused} label="Transfers" />,
        }}
      />
      <Tabs.Screen
        name="worldtour"
        options={{
          title: 'Tour',
          tabBarIcon: ({ focused }) => <TabIcon name="globe-outline" focused={focused} label="Tour" />,
        }}
      />
      <Tabs.Screen
        name="campus"
        options={{
          title: 'Campus',
          tabBarIcon: ({ focused }) => <TabIcon name="business-outline" focused={focused} label="Campus" />,
        }}
      />
    </Tabs>
  );
}


