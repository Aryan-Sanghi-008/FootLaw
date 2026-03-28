import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '../../store';
import { setProfileCompleted, fetchMyClub } from '../../store/slices/authSlice';
import { Colors } from '../../theme';
import { AvatarStyle, NATIONALITIES } from '@footlaw/shared';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const AVATAR_OPTIONS = [
  { style: AvatarStyle.TRACKSUIT, emoji: '🏃', label: 'Tracksuit' },
  { style: AvatarStyle.BUSINESS_SUIT, emoji: '🤵', label: 'Business Suit' },
  { style: AvatarStyle.SMART_CASUAL, emoji: '👔', label: 'Smart Casual' },
];

export default function ContractScreen() {
  const [step, setStep] = useState(0); // 0: manager, 1: club, 2: style, 3: confirm
  const [managerFirstName, setManagerFirstName] = useState('');
  const [managerLastName, setManagerLastName] = useState('');
  const [clubName, setClubName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [nationality, setNationality] = useState('');
  const [avatarStyle, setAvatarStyle] = useState(AvatarStyle.TRACKSUIT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showNationalityPicker, setShowNationalityPicker] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleNext = () => {
    if (step === 0) {
      if (!managerFirstName.trim() || !managerLastName.trim()) {
        setError('Please enter your full name');
        return;
      }
    }
    if (step === 1) {
      if (!clubName.trim()) { setError('Club name is required'); return; }
      if (clubName.length > 20) { setError('Club name must be 20 characters or less'); return; }
      if (!/^[A-Z]{3}$/.test(abbreviation)) { setError('Abbreviation must be exactly 3 uppercase letters'); return; }
      if (!nationality) { setError('Please select your nationality'); return; }
    }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const { data } = await api.post('/clubs/create', {
        managerFirstName: managerFirstName.trim(),
        managerLastName: managerLastName.trim(),
        clubName: clubName.trim(),
        abbreviation: abbreviation.toUpperCase(),
        nationality,
        avatarStyle,
      });

      if (data.success) {
        dispatch(setProfileCompleted());
        await dispatch(fetchMyClub());
        router.replace('/(onboarding)/tutorial');
      } else {
        setError(data.error || 'Failed to create club');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View>
            <Text className="text-lg font-bold text-gold mb-4">📋 CLAUSE 1: Manager Identity</Text>
            <Text className="text-sm text-textSecondary italic leading-5 mb-8">
              The undersigned hereby accepts the position of Head Manager and agrees to the terms set forth in this contract.
            </Text>

            <View className="mb-6">
              <Text className="text-[10px] font-semibold text-textSecondary uppercase tracking-wider mb-2">First Name</Text>
              <TextInput
                className="bg-slate-800/40 rounded-md p-4 text-base text-textPrimary border border-white/5"
                placeholder="Enter first name"
                placeholderTextColor={Colors.textMuted}
                value={managerFirstName}
                onChangeText={setManagerFirstName}
                autoCapitalize="words"
              />
            </View>

            <View className="mb-6">
              <Text className="text-[10px] font-semibold text-textSecondary uppercase tracking-wider mb-2">Last Name</Text>
              <TextInput
                className="bg-slate-800/40 rounded-md p-4 text-base text-textPrimary border border-white/5"
                placeholder="Enter last name"
                placeholderTextColor={Colors.textMuted}
                value={managerLastName}
                onChangeText={setManagerLastName}
                autoCapitalize="words"
              />
            </View>
          </View>
        );

      case 1:
        return (
          <View>
            <Text className="text-lg font-bold text-gold mb-4">🏟️ CLAUSE 2: Club Foundation</Text>
            <Text className="text-sm text-textSecondary italic leading-5 mb-8">
              The Manager shall establish a football club under the following designation, to compete across all sanctioned tournaments.
            </Text>

            <View className="mb-6">
              <Text className="text-[10px] font-semibold text-textSecondary uppercase tracking-wider mb-2">Club Name</Text>
              <TextInput
                className="bg-slate-800/40 rounded-md p-4 text-base text-textPrimary border border-white/5"
                placeholder="e.g. Footlaw United"
                placeholderTextColor={Colors.textMuted}
                value={clubName}
                onChangeText={setClubName}
                maxLength={20}
              />
              <Text className="text-[10px] text-textMuted text-right mt-1">{clubName.length}/20</Text>
            </View>

            <View className="mb-6">
              <Text className="text-[10px] font-semibold text-textSecondary uppercase tracking-wider mb-2">Abbreviation (3 Letters)</Text>
              <TextInput
                className="bg-slate-800/40 rounded-md p-4 text-2xl font-black text-textPrimary border border-white/5 text-center tracking-[8px]"
                placeholder="FLW"
                placeholderTextColor={Colors.textMuted}
                value={abbreviation}
                onChangeText={(text) => setAbbreviation(text.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3))}
                maxLength={3}
                autoCapitalize="characters"
              />
            </View>

            <View className="mb-6">
              <Text className="text-[10px] font-semibold text-textSecondary uppercase tracking-wider mb-2">Nationality</Text>
              <TouchableOpacity
                className="bg-slate-800/40 rounded-md p-4 border border-white/5"
                onPress={() => setShowNationalityPicker(!showNationalityPicker)}
              >
                <Text className={`text-base ${nationality ? 'text-textPrimary' : 'text-textMuted'}`}>
                  {nationality || 'Select nationality'}
                </Text>
              </TouchableOpacity>
              {showNationalityPicker && (
                <View className="max-h-[180px] bg-slate-800 rounded-md mt-2 border border-white/10 overflow-hidden">
                  <ScrollView nestedScrollEnabled>
                    {NATIONALITIES.map((nat) => (
                      <TouchableOpacity
                        key={nat}
                        className={`p-4 border-b border-white/5 ${nationality === nat ? 'bg-primary/20' : ''}`}
                        onPress={() => { setNationality(nat); setShowNationalityPicker(false); }}
                      >
                        <Text className={`text-sm ${nationality === nat ? 'text-primary font-bold' : 'text-textPrimary'}`}>
                          {nat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        );

      case 2:
        return (
          <View>
            <Text className="text-lg font-bold text-gold mb-4">👔 CLAUSE 3: Manager Style</Text>
            <Text className="text-sm text-textSecondary italic leading-5 mb-8">
              Select the official attire the Manager shall wear during all match-day proceedings.
            </Text>

            <View className="flex-row gap-4 justify-center">
              {AVATAR_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.style}
                  className={`flex-1 bg-slate-800/40 rounded-xl p-6 items-center border-2 ${avatarStyle === option.style ? 'border-primary bg-primary/10' : 'border-white/5'}`}
                  onPress={() => setAvatarStyle(option.style)}
                  activeOpacity={0.7}
                >
                  <Text className="text-[40px] mb-2">{option.emoji}</Text>
                  <Text className={`text-[10px] font-bold text-center ${avatarStyle === option.style ? 'text-primary' : 'text-textSecondary'}`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View>
            <Text className="text-lg font-bold text-gold mb-4">✍️ FINAL CONFIRMATION</Text>
            <Text className="text-sm text-textSecondary italic leading-5 mb-8">
              By signing below, you confirm all details and accept the appointment as Head Manager.
            </Text>

            <View className="bg-slate-800/40 rounded-xl p-6">
              <View className="flex-row justify-between py-3">
                <Text className="text-sm text-textSecondary font-medium">Manager</Text>
                <Text className="text-sm text-textPrimary font-bold">{managerFirstName} {managerLastName}</Text>
              </View>
              <View className="h-px bg-white/5" />
              <View className="flex-row justify-between py-3">
                <Text className="text-sm text-textSecondary font-medium">Club</Text>
                <Text className="text-sm text-textPrimary font-bold">{clubName} ({abbreviation})</Text>
              </View>
              <View className="h-px bg-white/5" />
              <View className="flex-row justify-between py-3">
                <Text className="text-sm text-textSecondary font-medium">Nationality</Text>
                <Text className="text-sm text-textPrimary font-bold">{nationality}</Text>
              </View>
              <View className="h-px bg-white/5" />
              <View className="flex-row justify-between py-3">
                <Text className="text-sm text-textSecondary font-medium">Style</Text>
                <Text className="text-sm text-textPrimary font-bold">{avatarStyle}</Text>
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 32, paddingTop: 80 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="items-center mb-10">
        <Text className="text-xs text-gold font-bold tracking-[3px] mb-2">OFFICIAL DOCUMENT</Text>
        <Text className="text-[32px] font-black text-textPrimary mb-1">Manager's Contract</Text>
        <Text className="text-[10px] text-textMuted tracking-[2px]">FOOTLAW FOOTBALL ASSOCIATION</Text>
      </View>

      <View className="flex-row justify-center gap-2 mb-10">
        {[0, 1, 2, 3].map((i) => (
          <View key={i} className={`h-2.5 rounded-full ${i <= step ? 'bg-primary w-6' : 'bg-slate-700 w-2.5'}`} />
        ))}
      </View>

      <View className="bg-surface rounded-3xl p-6 border border-white/5 min-h-[300px]">
        {error ? (
          <View className="bg-red-500/10 rounded-md p-4 mb-6 border border-red-500/20">
            <Text className="text-red-500 text-sm text-center">{error}</Text>
          </View>
        ) : null}

        {renderStep()}
      </View>

      <View className="flex-row gap-4 mt-8 mb-16">
        {step > 0 && (
          <TouchableOpacity 
            className="flex-1 bg-slate-800/60 rounded-xl p-4 items-center border border-white/5" 
            onPress={() => { setStep(step - 1); setError(''); }}
          >
            <Text className="text-textSecondary text-base font-semibold">← Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className={`flex-[2] bg-primary rounded-xl p-4 items-center ${isSubmitting ? 'opacity-60' : ''}`}
          onPress={step === 3 ? handleSubmit : handleNext}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text className="text-white text-base font-bold">
              {step === 3 ? '✍️  Sign Contract' : 'Continue →'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
