import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../../theme';

export default function MarketScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transfer Market</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.emoji}>💰</Text>
          <Text style={styles.heading}>Market Opening Soon</Text>
          <Text style={styles.subtext}>
            The transfer auction house with real-time bidding,{'\n'}
            knockout phases, and scouting is coming in Phase 4.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['6xl'],
    paddingBottom: Spacing.lg,
  },
  title: { fontSize: FontSize['2xl'], fontWeight: '800', color: Colors.textPrimary },
  content: { flex: 1, justifyContent: 'center', padding: Spacing.xl },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing['3xl'],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  emoji: { fontSize: 56, marginBottom: Spacing.lg },
  heading: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  subtext: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
});
