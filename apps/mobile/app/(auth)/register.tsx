import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Modal, 
  FlatList,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { useAppDispatch, useAppSelector } from '@/store';
import { register } from '@/store/slices/authSlice';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '@/theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { COUNTRIES } from '@/constants/countries';

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector((state) => state.auth);

  // ---- Form State ----
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationality, setNationality] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ---- Country Picker State ----
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return COUNTRIES;
    return COUNTRIES.filter(c => 
      c.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName || !nationality) {
      return;
    }
    
    await dispatch(register({ 
      email, 
      password, 
      firstName, 
      lastName, 
      nationality 
    }));
  };

  const selectCountry = (label: string) => {
    setNationality(label);
    setIsPickerVisible(false);
    setSearchQuery('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Join Footlaw</Text>
          <Text style={styles.subtitle}>Begin your career as a manager</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: Spacing.md }}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Cristiano"
                placeholderTextColor={Colors.textMuted}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Ronaldo"
                placeholderTextColor={Colors.textMuted}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <Text style={styles.label}>Nationality</Text>
          <TouchableOpacity 
            style={styles.countrySelector} 
            onPress={() => setIsPickerVisible(true)}
          >
            <Text style={[styles.countryText, !nationality && { color: Colors.textMuted }]}>
              {nationality || 'Select your country'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
              placeholder="Minimum 6 characters"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={20} 
                color={Colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity 
            style={[styles.registerButton, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ---- Country Picker Modal ---- */}
      <Modal
        visible={isPickerVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Nationality</Text>
            <TouchableOpacity onPress={() => setIsPickerVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={20} color={Colors.textMuted} />
            <TextInput
              style={styles.searchBar}
              placeholder="Search country..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>

          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.countryItem}
                onPress={() => selectCountry(item.label)}
              >
                <Text style={styles.countryLabel}>{item.label}</Text>
                {nationality === item.label && (
                  <Ionicons name="checkmark" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </SafeAreaView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.xl,
    paddingTop: 60,
  },
  header: {
    marginBottom: Spacing.xl,
    backgroundColor: 'transparent',
  },
  backButton: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  form: {
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    marginLeft: 4,
  },
  input: {
    height: 50,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  countrySelector: {
    height: 50,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  countryText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.lg,
  },
  eyeIcon: {
    padding: Spacing.md,
  },
  registerButton: {
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    ...Shadow.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  errorText: {
    color: Colors.danger,
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    backgroundColor: 'transparent',
  },
  footerText: {
    color: Colors.textSecondary,
    marginRight: 5,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  // ---- Modal Styles ----
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  closeText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    height: 44,
  },
  searchBar: {
    flex: 1,
    marginLeft: Spacing.xs,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: 'transparent',
  },
  countryLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.surfaceBorder,
    marginLeft: Spacing.lg,
  },
});
