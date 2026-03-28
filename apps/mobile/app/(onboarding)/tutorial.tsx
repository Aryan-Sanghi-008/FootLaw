import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize } from '../../theme';

const { width } = Dimensions.get('window');

// Pre-scripted tutorial match events
const TUTORIAL_EVENTS = [
  { minute: 80, text: "⚽ Kick-off! Your team is attacking with purpose.", delay: 1000 },
  { minute: 82, text: "🎯 Great pass! Your midfielder splits the defence.", delay: 3000 },
  { minute: 84, text: "💪 Strong tackle! The opposition tries to counter.", delay: 5000 },
  { minute: 85, text: "📣 The crowd is urging you on! Time for a Touchline Shout!", delay: 7000, action: 'shout' },
  { minute: 87, text: "🔄 Your striker looks tired. Make a substitution!", delay: 12000, action: 'sub' },
  { minute: 88, text: "🏃 Fresh legs on the pitch! The substitute is eager.", delay: 16000 },
  { minute: 89, text: "⚡ Brilliant run down the wing! Cross into the box!", delay: 18000 },
  { minute: 90, text: "⚽ GOOOAL!! 1-0! The substitute scores on debut!", delay: 20000, action: 'goal' },
  { minute: 90, text: "📯 Full time! You've won your first match!", delay: 23000, action: 'end' },
];

export default function TutorialScreen() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [events, setEvents] = useState<Array<{ minute: number; text: string }>>([]);
  const [showShoutPrompt, setShowShoutPrompt] = useState(false);
  const [showSubPrompt, setShowSubPrompt] = useState(false);
  const [shoutDone, setShoutDone] = useState(false);
  const [subDone, setSubDone] = useState(false);
  const [matchComplete, setMatchComplete] = useState(false);
  const [score, setScore] = useState({ home: 0, away: 0 });
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  useEffect(() => {
    // Pulse animation for prompts
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Progress through events
    if (currentEventIndex >= TUTORIAL_EVENTS.length) return;

    const event = TUTORIAL_EVENTS[currentEventIndex];
    const timer = setTimeout(() => {
      setEvents((prev) => [...prev, { minute: event.minute, text: event.text }]);

      if (event.action === 'shout' && !shoutDone) {
        setShowShoutPrompt(true);
        return; // Wait for user action
      }
      if (event.action === 'sub' && !subDone) {
        setShowSubPrompt(true);
        return;
      }
      if (event.action === 'goal') {
        setScore({ home: 1, away: 0 });
      }
      if (event.action === 'end') {
        setMatchComplete(true);
        return;
      }

      setCurrentEventIndex((prev) => prev + 1);
    }, currentEventIndex === 0 ? 1000 : 2500);

    return () => clearTimeout(timer);
  }, [currentEventIndex, shoutDone, subDone]);

  const handleShout = () => {
    setShowShoutPrompt(false);
    setShoutDone(true);
    setCurrentEventIndex((prev) => prev + 1);
  };

  const handleSub = () => {
    setShowSubPrompt(false);
    setSubDone(true);
    setCurrentEventIndex((prev) => prev + 1);
  };

  const handleFinish = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      {/* Score Bar */}
      <View style={styles.scoreBar}>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>YOUR TEAM</Text>
          <Text style={styles.scoreText}>{score.home}</Text>
        </View>
        <View style={styles.matchClock}>
          <Text style={styles.clockText}>
            {events.length > 0 ? `${events[events.length - 1].minute}'` : '80\''}
          </Text>
          <Text style={styles.clockLabel}>TUTORIAL MATCH</Text>
        </View>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>OPPONENT</Text>
          <Text style={styles.scoreText}>{score.away}</Text>
        </View>
      </View>

      {/* Pitch Placeholder */}
      <View style={styles.pitchArea}>
        <View style={styles.pitch}>
          <View style={styles.pitchCenter}>
            <View style={styles.centerCircle} />
            <View style={styles.halfwayLine} />
          </View>
          <Text style={styles.pitchLabel}>🏟️ Live Match View</Text>
          <Text style={styles.pitchSublabel}>Full 2D radar coming in Phase 2</Text>
        </View>
      </View>

      {/* Commentary Feed */}
      <View style={styles.commentaryBox}>
        <Text style={styles.commentaryTitle}>LIVE COMMENTARY</Text>
        {events.slice(-4).map((event, i) => (
          <View key={i} style={styles.eventRow}>
            <Text style={styles.eventMinute}>{event.minute}'</Text>
            <Text style={styles.eventText}>{event.text}</Text>
          </View>
        ))}
      </View>

      {/* Touchline Shout Prompt */}
      {showShoutPrompt && (
        <Animated.View style={[styles.promptOverlay, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.promptTitle}>📣 TOUCHLINE SHOUT</Text>
          <Text style={styles.promptText}>Tap to demand more from your players!</Text>
          <TouchableOpacity style={styles.shoutButton} onPress={handleShout}>
            <Text style={styles.shoutButtonText}>💪 DEMAND MORE!</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Substitution Prompt */}
      {showSubPrompt && (
        <Animated.View style={[styles.promptOverlay, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.promptTitle}>🔄 SUBSTITUTION</Text>
          <Text style={styles.promptText}>Bring on a fresh player for the final push!</Text>
          <TouchableOpacity style={styles.subButton} onPress={handleSub}>
            <Text style={styles.shoutButtonText}>🔄 MAKE SUB</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Match Complete */}
      {matchComplete && (
        <View style={styles.resultOverlay}>
          <Text style={styles.resultEmoji}>🏆</Text>
          <Text style={styles.resultTitle}>VICTORY!</Text>
          <Text style={styles.resultScore}>1 - 0</Text>
          <Text style={styles.resultText}>
            Congratulations, Manager! Your squad is ready.
          </Text>
          <TouchableOpacity style={styles.continueButton} onPress={handleFinish}>
            <Text style={styles.continueButtonText}>Meet Your Squad →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scoreBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['5xl'],
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  teamInfo: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 1,
  },
  scoreText: {
    fontSize: FontSize['4xl'],
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  matchClock: {
    alignItems: 'center',
    flex: 1,
  },
  clockText: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.success,
  },
  clockLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },
  pitchArea: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  pitch: {
    flex: 1,
    backgroundColor: Colors.pitchGreen,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    maxHeight: 250,
  },
  pitchCenter: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  halfwayLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  pitchLabel: {
    fontSize: FontSize.xl,
    color: Colors.white,
    fontWeight: '700',
    zIndex: 1,
  },
  pitchSublabel: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.5)',
    marginTop: Spacing.xs,
    zIndex: 1,
  },
  commentaryBox: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
    padding: Spacing.lg,
    maxHeight: 200,
  },
  commentaryTitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  eventRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    alignItems: 'flex-start',
  },
  eventMinute: {
    fontSize: FontSize.xs,
    color: Colors.success,
    fontWeight: '700',
    width: 32,
  },
  eventText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 18,
  },
  promptOverlay: {
    position: 'absolute',
    bottom: 220,
    left: Spacing.xl,
    right: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  promptTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.gold,
    marginBottom: Spacing.sm,
  },
  promptText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  shoutButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing['3xl'],
  },
  subButton: {
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing['3xl'],
  },
  shoutButtonText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 14, 26, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['3xl'],
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: Spacing.xl,
  },
  resultTitle: {
    fontSize: FontSize['4xl'],
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 4,
  },
  resultScore: {
    fontSize: FontSize['5xl'],
    fontWeight: '800',
    color: Colors.textPrimary,
    marginVertical: Spacing.lg,
  },
  resultText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing['3xl'],
  },
  continueButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['4xl'],
  },
  continueButtonText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});
