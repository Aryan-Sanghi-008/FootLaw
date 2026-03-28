import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { Colors, Spacing, FontSize, BorderRadius } from '../../theme';

export default function MoreScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { profile, club } = useAppSelector((s) => s.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    router.replace('/(auth)/login');
  };

  const menuItems = [
    { emoji: '🏆', label: 'League', desc: 'Standings & fixtures', phase: 3 },
    { emoji: '🏅', label: 'Cup', desc: 'Tournament bracket', phase: 3 },
    { emoji: '🏟️', label: 'Campus', desc: 'Facility upgrades', phase: 5 },
    { emoji: '🎒', label: 'Inventory', desc: 'Packs & items', phase: 5 },
    { emoji: '🎫', label: 'Season Pass', desc: 'Rewards & perks', phase: 5 },
    { emoji: '👥', label: 'Association', desc: 'Clan & tournaments', phase: 6 },
    { emoji: '📰', label: 'Social', desc: 'Activity feed', phase: 6 },
    { emoji: '⚙️', label: 'Settings', desc: 'Preferences', phase: 1 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.profileCard}>
        <Text style={styles.profileEmoji}>
          {profile?.avatarStyle === 'Business Suit' ? '🤵' :
           profile?.avatarStyle === 'Smart Casual' ? '👔' : '🏃'}
        </Text>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {profile?.firstName} {profile?.lastName}
          </Text>
          <Text style={styles.profileClub}>{club?.name} ({club?.abbreviation})</Text>
          <Text style={styles.profileNationality}>{profile?.nationality}</Text>
        </View>
      </View>

      {/* Menu */}
      {menuItems.map((item, i) => (
        <TouchableOpacity key={i} style={styles.menuItem} activeOpacity={0.7}>
          <Text style={styles.menuEmoji}>{item.emoji}</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuDesc}>{item.desc}</Text>
          </View>
          {item.phase > 1 && (
            <View style={styles.phaseBadge}>
              <Text style={styles.phaseText}>P{item.phase}</Text>
            </View>
          )}
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      ))}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Footlaw v0.1.0 — Phase 1</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: Spacing.xl,
    paddingTop: Spacing['6xl'],
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  profileEmoji: { fontSize: 44 },
  profileInfo: { flex: 1, gap: Spacing.xs },
  profileName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  profileClub: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  profileNationality: { fontSize: FontSize.xs, color: Colors.textMuted },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  menuEmoji: { fontSize: 22 },
  menuText: { flex: 1 },
  menuLabel: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  menuDesc: { fontSize: FontSize.xs, color: Colors.textMuted },
  phaseBadge: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  phaseText: { fontSize: 9, color: Colors.textMuted, fontWeight: '700' },
  menuArrow: { fontSize: FontSize.xl, color: Colors.textMuted },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutText: { color: Colors.danger, fontSize: FontSize.md, fontWeight: '600' },
  version: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: Spacing.xl,
    marginBottom: Spacing['4xl'],
  },
});
