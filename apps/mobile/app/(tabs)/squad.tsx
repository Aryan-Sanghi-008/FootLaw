import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchSquad } from '../../store/slices/squadSlice';
import { Colors, Spacing, BorderRadius, FontSize } from '../../theme';
import type { IPlayer } from '@footlaw/shared';
import { useState } from 'react';

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={starStyles.container}>
      {Array.from({ length: 10 }, (_, i) => (
        <Text key={i} style={[starStyles.star, i < rating && starStyles.starActive]}>
          ★
        </Text>
      ))}
    </View>
  );
}

const starStyles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 1 },
  star: { fontSize: 10, color: Colors.surfaceBorder },
  starActive: { color: Colors.gold },
});

function ConditionBar({ value }: { value: number }) {
  const color = value > 70 ? Colors.success : value > 40 ? Colors.warning : Colors.danger;
  return (
    <View style={condStyles.bar}>
      <View style={[condStyles.fill, { width: `${value}%`, backgroundColor: color }]} />
    </View>
  );
}

const condStyles = StyleSheet.create({
  bar: {
    height: 4,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 2,
    overflow: 'hidden',
    width: 60,
  },
  fill: { height: '100%', borderRadius: 2 },
});

function MoraleBadge({ morale }: { morale: string }) {
  const moraleColors: Record<string, string> = Colors.morale;
  const color = moraleColors[morale] || Colors.textMuted;
  return (
    <View style={[moraleStyles.badge, { borderColor: color }]}>
      <Text style={[moraleStyles.text, { color }]}>{morale}</Text>
    </View>
  );
}

const moraleStyles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  text: { fontSize: FontSize.xs, fontWeight: '600' },
});

function PositionBadge({ position }: { position: string }) {
  const posColors: Record<string, string> = Colors.position;
  const color = posColors[position] || Colors.textMuted;
  return (
    <View style={[posStyles.badge, { backgroundColor: color + '20', borderColor: color }]}>
      <Text style={[posStyles.text, { color }]}>{position}</Text>
    </View>
  );
}

const posStyles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    minWidth: 36,
    alignItems: 'center',
  },
  text: { fontSize: FontSize.xs, fontWeight: '700' },
});

function PlayerCard({ player, onPress }: { player: IPlayer; onPress: () => void }) {
  return (
    <TouchableOpacity style={playerStyles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={playerStyles.left}>
        <PositionBadge position={player.position} />
        <View style={playerStyles.nameCol}>
          <Text style={playerStyles.name}>
            {player.firstName} {player.lastName}
          </Text>
          <StarRating rating={player.starRating} />
        </View>
      </View>
      <View style={playerStyles.right}>
        <View style={playerStyles.statCol}>
          <Text style={playerStyles.statLabel}>AGE</Text>
          <Text style={playerStyles.statValue}>{player.age}</Text>
        </View>
        <View style={playerStyles.statCol}>
          <Text style={playerStyles.statLabel}>COND</Text>
          <ConditionBar value={player.condition} />
        </View>
        <MoraleBadge morale={player.morale} />
      </View>
    </TouchableOpacity>
  );
}

const playerStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  nameCol: {
    gap: Spacing.xs,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  statCol: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

export default function SquadScreen() {
  const dispatch = useAppDispatch();
  const { players, isLoading } = useAppSelector((s) => s.squad);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayer | null>(null);

  useEffect(() => {
    dispatch(fetchSquad());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchSquad());
    setRefreshing(false);
  };

  if (isLoading && players.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading squad...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Squad</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{players.length} Players</Text>
        </View>
      </View>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <View style={styles.detailOverlay}>
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <PositionBadge position={selectedPlayer.position} />
              <Text style={styles.detailName}>
                {selectedPlayer.firstName} {selectedPlayer.lastName}
              </Text>
              <TouchableOpacity onPress={() => setSelectedPlayer(null)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <StarRating rating={selectedPlayer.starRating} />

            <View style={styles.detailMeta}>
              <Text style={styles.detailMetaItem}>Age: {selectedPlayer.age}</Text>
              <MoraleBadge morale={selectedPlayer.morale} />
            </View>

            <View style={styles.statsGrid}>
              {Object.entries(selectedPlayer.stats).map(([key, value]) => (
                <View key={key} style={styles.statItem}>
                  <Text style={styles.statName}>{key.toUpperCase()}</Text>
                  <View style={styles.statBarOuter}>
                    <View style={[styles.statBarInner, { width: `${value}%` }]} />
                  </View>
                  <Text style={styles.statNumber}>{value as number}</Text>
                </View>
              ))}
            </View>

            {selectedPlayer.mastery && (
              <View style={styles.masteryBadge}>
                <Text style={styles.masteryText}>⭐ {selectedPlayer.mastery}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Player List */}
      <FlatList
        data={players}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PlayerCard player={item} onPress={() => setSelectedPlayer(item)} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: Spacing.lg,
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['6xl'],
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  countBadge: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  countText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  list: {
    padding: Spacing.xl,
    paddingTop: 0,
  },
  detailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    zIndex: 100,
  },
  detailCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.lg,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  detailName: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
  },
  closeButton: {
    fontSize: FontSize.xl,
    color: Colors.textMuted,
    padding: Spacing.sm,
  },
  detailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  detailMetaItem: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  statsGrid: {
    gap: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  statName: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '700',
    width: 72,
    letterSpacing: 0.5,
  },
  statBarOuter: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  statBarInner: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  statNumber: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
    width: 28,
    textAlign: 'right',
  },
  masteryBadge: {
    backgroundColor: Colors.goldGlow,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  masteryText: {
    color: Colors.gold,
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
});
