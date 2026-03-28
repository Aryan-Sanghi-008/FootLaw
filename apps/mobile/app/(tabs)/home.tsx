import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchMyClub } from '../../store/slices/authSlice';
import { Colors, Spacing, BorderRadius, FontSize } from '../../theme';
import { formatCash } from '@footlaw/shared';
import { useState } from 'react';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { club, profile } = useAppSelector((s) => s.auth);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchMyClub());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchMyClub());
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Welcome back, {profile?.firstName || 'Manager'}
          </Text>
          <Text style={styles.clubName}>{club?.name || 'Loading...'}</Text>
        </View>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>TIER</Text>
            <Text style={styles.badgeValue}>{club?.tier || '-'}</Text>
          </View>
        </View>
      </View>

      {/* Currency Bar */}
      <View style={styles.currencyBar}>
        <View style={styles.currencyItem}>
          <Text style={styles.currencyIcon}>💵</Text>
          <View>
            <Text style={styles.currencyLabel}>Cash</Text>
            <Text style={styles.currencyValue}>
              {club ? formatCash(club.cash) : '---'}
            </Text>
          </View>
        </View>
        <View style={styles.currencyDivider} />
        <View style={styles.currencyItem}>
          <Text style={styles.currencyIcon}>🪙</Text>
          <View>
            <Text style={styles.currencyLabel}>Tokens</Text>
            <Text style={styles.currencyValue}>{club?.tokens ?? '---'}</Text>
          </View>
        </View>
      </View>

      {/* Next Match Card */}
      <View style={styles.card}>
        <Text style={styles.cardBadge}>NEXT MATCH</Text>
        <View style={styles.matchPreview}>
          <View style={styles.matchTeam}>
            <Text style={styles.matchEmoji}>⚽</Text>
            <Text style={styles.matchTeamName}>{club?.abbreviation || '---'}</Text>
          </View>
          <View style={styles.matchVs}>
            <Text style={styles.matchVsText}>VS</Text>
            <Text style={styles.matchTime}>Season starts soon</Text>
          </View>
          <View style={styles.matchTeam}>
            <Text style={styles.matchEmoji}>⚽</Text>
            <Text style={styles.matchTeamName}>TBD</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionGrid}>
        {[
          { emoji: '👥', label: 'Squad', desc: 'Manage players' },
          { emoji: '🏋️', label: 'Training', desc: 'Coming soon' },
          { emoji: '💰', label: 'Market', desc: 'Find talent' },
          { emoji: '🏟️', label: 'Campus', desc: 'Upgrade facilities' },
        ].map((action, i) => (
          <TouchableOpacity key={i} style={styles.actionCard} activeOpacity={0.7}>
            <Text style={styles.actionEmoji}>{action.emoji}</Text>
            <Text style={styles.actionLabel}>{action.label}</Text>
            <Text style={styles.actionDesc}>{action.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Season Info */}
      <View style={styles.card}>
        <Text style={styles.cardBadge}>SEASON</Text>
        <View style={styles.seasonInfo}>
          <Text style={styles.seasonDay}>Day 1 of 28</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '3.5%' }]} />
          </View>
          <Text style={styles.seasonHint}>League matches begin on Day 3</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
    paddingTop: Spacing['6xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing['2xl'],
  },
  greeting: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  clubName: {
    fontSize: FontSize['2xl'],
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  badge: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  badgeLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 1,
  },
  badgeValue: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.gold,
  },
  currencyBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing['2xl'],
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  currencyItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  currencyIcon: {
    fontSize: 24,
  },
  currencyLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  currencyValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  currencyDivider: {
    width: 1,
    backgroundColor: Colors.surfaceBorder,
    marginVertical: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing['2xl'],
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  cardBadge: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: Spacing.lg,
  },
  matchPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  matchTeam: {
    alignItems: 'center',
    flex: 1,
  },
  matchEmoji: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  matchTeamName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  matchVs: {
    alignItems: 'center',
    flex: 1,
  },
  matchVsText: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  matchTime: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  actionCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: Spacing.sm,
  },
  actionLabel: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  actionDesc: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  seasonInfo: {
    gap: Spacing.md,
  },
  seasonDay: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  seasonHint: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
