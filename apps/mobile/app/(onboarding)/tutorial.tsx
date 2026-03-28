import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
    <View className="flex-1 bg-background">
      {/* Score Bar */}
      <View className="flex-row justify-between items-center px-6 pt-16 pb-6 bg-surface border-b border-white/5">
        <View className="items-center flex-1">
          <Text className="text-[10px] text-textSecondary font-semibold tracking-wider">YOUR TEAM</Text>
          <Text className="text-[32px] font-black text-textPrimary">{score.home}</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-2xl font-bold text-success">
            {events.length > 0 ? `${events[events.length - 1].minute}'` : '80\''}
          </Text>
          <Text className="text-[8px] text-textMuted tracking-wider mt-0.5">TUTORIAL MATCH</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-[10px] text-textSecondary font-semibold tracking-wider">OPPONENT</Text>
          <Text className="text-[32px] font-black text-textPrimary">{score.away}</Text>
        </View>
      </View>

      {/* Pitch Placeholder */}
      <View className="flex-1 p-6 justify-center">
        <View className="flex-1 bg-emerald-900 rounded-2xl justify-center items-center border-2 border-white/10 max-h-[250px] relative overflow-hidden">
          <View className="absolute inset-0 justify-center items-center">
            <View className="w-16 h-16 rounded-full border border-white/20" />
            <View className="absolute w-full h-px bg-white/20" />
          </View>
          <Text className="text-xl text-white font-bold z-10">🏟️ Live Match View</Text>
          <Text className="text-xs text-white/50 mt-2 z-10">Full 2D radar coming in Phase 2</Text>
        </View>
      </View>

      {/* Commentary Feed */}
      <View className="bg-surface border-t border-white/5 p-6 max-h-[200px]">
        <Text className="text-[10px] text-textMuted font-bold tracking-[2px] mb-4">LIVE COMMENTARY</Text>
        {events.slice(-4).map((event, i) => (
          <View key={i} className="flex-row mb-2 items-start">
            <Text className="text-xs text-success font-bold w-8">{event.minute}'</Text>
            <Text className="text-sm text-textPrimary flex-1 leading-5">{event.text}</Text>
          </View>
        ))}
      </View>

      {/* Touchline Shout Prompt */}
      {showShoutPrompt && (
        <Animated.View 
          className="absolute bottom-[220px] left-6 right-6 bg-surface rounded-3xl p-8 items-center border-2 border-gold shadow-2xl" 
          style={{ transform: [{ scale: pulseAnim }] }}
        >
          <Text className="text-xl font-black text-gold mb-2">📣 TOUCHLINE SHOUT</Text>
          <Text className="text-sm text-textSecondary mb-6 text-center">Tap to demand more from your players!</Text>
          <TouchableOpacity className="bg-primary rounded-xl py-4 px-10" onPress={handleShout}>
            <Text className="text-white text-lg font-bold">💪 DEMAND MORE!</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Substitution Prompt */}
      {showSubPrompt && (
        <Animated.View 
          className="absolute bottom-[220px] left-6 right-6 bg-surface rounded-3xl p-8 items-center border-2 border-gold shadow-2xl" 
          style={{ transform: [{ scale: pulseAnim }] }}
        >
          <Text className="text-xl font-black text-gold mb-2">🔄 SUBSTITUTION</Text>
          <Text className="text-sm text-textSecondary mb-6 text-center">Bring on a fresh player for the final push!</Text>
          <TouchableOpacity className="bg-success rounded-xl py-4 px-10" onPress={handleSub}>
            <Text className="text-white text-lg font-bold">🔄 MAKE SUB</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Match Complete */}
      {matchComplete && (
        <View className="absolute inset-0 bg-black/95 justify-center items-center p-8 z-[100]">
          <Text className="text-[80px] mb-8">🏆</Text>
          <Text className="text-[40px] font-black text-gold tracking-[4px]">VICTORY!</Text>
          <Text className="text-5xl font-black text-textPrimary my-6">1 - 0</Text>
          <Text className="text-base text-textSecondary text-center mb-10">
            Congratulations, Manager! Your squad is ready.
          </Text>
          <TouchableOpacity className="bg-primary rounded-xl py-4 px-12" onPress={handleFinish}>
            <Text className="text-white text-lg font-bold">Meet Your Squad →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = {};
