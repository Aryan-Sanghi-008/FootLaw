import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { Colors, FontSize, FontFamily, BorderRadius } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

function TabIcon({ name, focused, label }: { name: React.ComponentProps<typeof Ionicons>['name']; focused: boolean; label: string }) {
  if (focused && label === 'Home') {
    return (
      <View style={styles.activeTabContainer}>
        <Ionicons name="home" size={24} color={Colors.primary} />
        <Text style={styles.activeTabLabel}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={styles.inactiveTabContainer}>
      <Ionicons name={focused ? (name.replace('-outline', '') as any) : name} size={24} color={focused ? Colors.white : Colors.onSurfaceVariant} />
      <Text style={[styles.inactiveTabLabel, focused && { color: Colors.white }]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
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
        name="match"
        options={{
          title: 'Training',
          tabBarIcon: ({ focused }) => <TabIcon name="barbell-outline" focused={focused} label="Training" />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Club',
          tabBarIcon: ({ focused }) => <TabIcon name="shield-outline" focused={focused} label="Club" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: 'rgba(15,19,31,0.85)',
    height: Platform.OS === 'ios' ? 95 : 75,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  activeTabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(42,229,0,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.xl,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
  },
  activeTabLabel: {
    fontFamily: FontFamily.headingBold,
    fontSize: 10,
    color: Colors.primary,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inactiveTabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveTabLabel: {
    fontFamily: FontFamily.headingBold,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
