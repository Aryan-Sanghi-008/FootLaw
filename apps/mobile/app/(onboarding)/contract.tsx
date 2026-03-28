import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '../../store';
import { setProfileCompleted, fetchMyClub } from '../../store/slices/authSlice';
import { Colors, Spacing, BorderRadius, FontSize } from '../../theme';
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
            <Text style={styles.sectionTitle}>📋 CLAUSE 1: Manager Identity</Text>
            <Text style={styles.clauseText}>
              The undersigned hereby accepts the position of Head Manager and agrees to the terms set forth in this contract.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter first name"
                placeholderTextColor={Colors.textMuted}
                value={managerFirstName}
                onChangeText={setManagerFirstName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
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
            <Text style={styles.sectionTitle}>🏟️ CLAUSE 2: Club Foundation</Text>
            <Text style={styles.clauseText}>
              The Manager shall establish a football club under the following designation, to compete across all sanctioned tournaments.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Club Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Footlaw United"
                placeholderTextColor={Colors.textMuted}
                value={clubName}
                onChangeText={setClubName}
                maxLength={20}
              />
              <Text style={styles.charCount}>{clubName.length}/20</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Abbreviation (3 Letters)</Text>
              <TextInput
                style={[styles.input, styles.abbreviationInput]}
                placeholder="FLW"
                placeholderTextColor={Colors.textMuted}
                value={abbreviation}
                onChangeText={(text) => setAbbreviation(text.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3))}
                maxLength={3}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nationality</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowNationalityPicker(!showNationalityPicker)}
              >
                <Text style={nationality ? styles.inputText : styles.placeholderText}>
                  {nationality || 'Select nationality'}
                </Text>
              </TouchableOpacity>
              {showNationalityPicker && (
                <ScrollView style={styles.pickerList} nestedScrollEnabled>
                  {NATIONALITIES.map((nat) => (
                    <TouchableOpacity
                      key={nat}
                      style={[styles.pickerItem, nationality === nat && styles.pickerItemActive]}
                      onPress={() => { setNationality(nat); setShowNationalityPicker(false); }}
                    >
                      <Text style={[styles.pickerItemText, nationality === nat && styles.pickerItemTextActive]}>
                        {nat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={styles.sectionTitle}>👔 CLAUSE 3: Manager Style</Text>
            <Text style={styles.clauseText}>
              Select the official attire the Manager shall wear during all match-day proceedings.
            </Text>

            <View style={styles.avatarGrid}>
              {AVATAR_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.style}
                  style={[
                    styles.avatarCard,
                    avatarStyle === option.style && styles.avatarCardActive,
                  ]}
                  onPress={() => setAvatarStyle(option.style)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.avatarEmoji}>{option.emoji}</Text>
                  <Text style={[
                    styles.avatarLabel,
                    avatarStyle === option.style && styles.avatarLabelActive,
                  ]}>
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
            <Text style={styles.sectionTitle}>✍️ FINAL CONFIRMATION</Text>
            <Text style={styles.clauseText}>
              By signing below, you confirm all details and accept the appointment as Head Manager.
            </Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Manager</Text>
                <Text style={styles.summaryValue}>{managerFirstName} {managerLastName}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Club</Text>
                <Text style={styles.summaryValue}>{clubName} ({abbreviation})</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Nationality</Text>
                <Text style={styles.summaryValue}>{nationality}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Style</Text>
                <Text style={styles.summaryValue}>{avatarStyle}</Text>
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Contract Header */}
      <View style={styles.header}>
        <Text style={styles.headerBadge}>OFFICIAL DOCUMENT</Text>
        <Text style={styles.headerTitle}>Manager's Contract</Text>
        <Text style={styles.headerSubtitle}>FOOTLAW FOOTBALL ASSOCIATION</Text>
      </View>

      {/* Progress Dots */}
      <View style={styles.progressRow}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, i <= step && styles.dotActive]} />
        ))}
      </View>

      {/* Contract Body */}
      <View style={styles.contractBody}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {renderStep()}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonRow}>
        {step > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={() => { setStep(step - 1); setError(''); }}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.nextButton, isSubmitting && styles.nextButtonDisabled]}
          onPress={step === 3 ? handleSubmit : handleNext}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.nextButtonText}>
              {step === 3 ? '✍️  Sign Contract' : 'Continue →'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing['2xl'],
    paddingTop: Spacing['5xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  headerBadge: {
    fontSize: FontSize.xs,
    color: Colors.gold,
    letterSpacing: 3,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize['3xl'],
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing['3xl'],
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.surfaceBorder,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
    borderRadius: 5,
  },
  contractBody: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    minHeight: 300,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.gold,
    marginBottom: Spacing.md,
  },
  clauseText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.xl,
    fontStyle: 'italic',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  inputText: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
  },
  placeholderText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
  abbreviationInput: {
    textAlign: 'center',
    fontSize: FontSize['2xl'],
    fontWeight: '800',
    letterSpacing: 8,
  },
  charCount: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  pickerList: {
    maxHeight: 180,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  pickerItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  pickerItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  pickerItemText: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
  },
  pickerItemTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  avatarGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'center',
  },
  avatarCard: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surfaceBorder,
  },
  avatarCardActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  avatarEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  avatarLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  avatarLabelActive: {
    color: Colors.primary,
  },
  summaryCard: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  summaryLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceBorder,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: Colors.danger,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing['2xl'],
    marginBottom: Spacing['4xl'],
  },
  backButton: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  backButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
