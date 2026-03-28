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
  SafeAreaView,
  View,
  ImageBackground
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../../components/Themed';
import { useAppDispatch, useAppSelector } from '../../store';
import { register } from '../../store/slices/authSlice';
import { Colors, Spacing, BorderRadius, FontSize, FontFamily } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { COUNTRIES } from '../../constants/countries';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GOOGLE_CONFIG } from '../../constants/config';
import { googleLogin } from '../../store/slices/authSlice';

WebBrowser.maybeCompleteAuthSession();

const STADIUM_BG = "https://lh3.googleusercontent.com/aida-public/AB6AXuC5LSaMAZ9bBX-V5Hy-h2Zw15PzAn2GN1e7ubpG29R6BXvHGct7j0lRrn65ieX4O5bnfkvcxsYPPMkwwKxr2eE1OIPzohWv7HnTbiQ-vsL0S4ZB80GurDj9a2Q_WN8uiGxCLMGrqpanlNyrs1zuGICXK8expVgdFAhXViLkkwOfVXlUI7feZovJMrd9xZ32GRGwinLnu1dSTa5kdHdxcEUbhl5zNH_SomPbXwaIssgP6HTui4mGSEnfsapsjxt1ph21WG650qLAR2fS";

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationality, setNationality] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Google Login Hook
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_CONFIG.androidClientId,
    iosClientId: GOOGLE_CONFIG.iosClientId,
    webClientId: GOOGLE_CONFIG.webClientId,
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        dispatch(googleLogin(authentication.accessToken));
      }
    }
  }, [response, dispatch]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return COUNTRIES;
    return COUNTRIES.filter(c => 
      c.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName || !nationality) return;
    await dispatch(register({ email, password, firstName, lastName, nationality }));
  };

  const selectCountry = (label: string) => {
    setNationality(label);
    setIsPickerVisible(false);
    setSearchQuery('');
  };

  return (
    <ImageBackground 
      source={{ uri: STADIUM_BG }} 
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.6 }}
    >
      <LinearGradient
        colors={['rgba(15,19,31,0.8)', Colors.background]}
        style={styles.overlayGradient}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center', paddingRight: 24 }}>
              <Text style={styles.title}>Establish Club</Text>
              <Text style={styles.subtitle}>Enter your manager details</Text>
            </View>
          </View>

          <BlurView intensity={40} tint="dark" style={styles.glassPanel}>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.label}>FIRST NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Pep"
                  placeholderTextColor={Colors.outline}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>LAST NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Guardiola"
                  placeholderTextColor={Colors.outline}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>NATIONALITY</Text>
              <TouchableOpacity 
                style={styles.countrySelector} 
                onPress={() => setIsPickerVisible(true)}
              >
                <Text style={[styles.countryText, !nationality && { color: Colors.outline }]}>
                  {nationality || 'Select your country'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>TACTICAL ID / EMAIL</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail" size={20} color={Colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="manager@footlaw.com"
                  placeholderTextColor={Colors.outline}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ENCRYPTION KEY / PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed" size={20} color={Colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={[styles.inputWithIcon, { paddingRight: 50 }]}
                  placeholder="Minimum 6 characters"
                  placeholderTextColor={Colors.outline}
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
                    color={Colors.onSurfaceVariant} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="warning" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleRegister}
              disabled={isLoading}
              style={{ marginTop: Spacing.xl }}
            >
              <LinearGradient
                colors={['#2ae500', '#1ca600']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.registerButton}
              >
                <Text style={styles.registerButtonText}>
                  {isLoading ? 'Processing...' : 'Create Account'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color={Colors.onPrimary} style={{ marginLeft: 8 }} />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR SIGN UP WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.googleButton}
              onPress={() => promptAsync()}
              disabled={!request || isLoading}
            >
              <Ionicons name="logo-google" size={20} color={Colors.white} />
              <Text style={styles.googleButtonText}>GOOGLE ACCOUNT</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have a club?</Text>
              <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </View>

          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={isPickerVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Nationality</Text>
            <TouchableOpacity onPress={() => setIsPickerVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={20} color={Colors.outline} />
            <TextInput
              style={styles.searchBar}
              placeholder="Search country..."
              placeholderTextColor={Colors.outline}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.countryItem} onPress={() => selectCountry(item.label)}>
                <Text style={styles.countryLabel}>{item.label}</Text>
                {nationality === item.label && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </SafeAreaView>
      </Modal>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, backgroundColor: Colors.background },
  overlayGradient: { ...StyleSheet.absoluteFillObject },
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing['xl'],
    paddingTop: 80,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  backButton: {
    padding: Spacing.sm,
  },
  title: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize['2xl'],
    color: Colors.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  glassPanel: {
    width: '100%',
    borderRadius: 32,
    padding: Spacing['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(121, 255, 91, 0.15)',
  },
  row: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontFamily: FontFamily.headingBold,
    fontSize: 10,
    color: Colors.primary,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  input: {
    height: 56,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.xl,
    color: Colors.textPrimary,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: Spacing.lg,
    zIndex: 1,
  },
  inputWithIcon: {
    height: 56,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    paddingLeft: 46,
    paddingRight: Spacing.xl,
    color: Colors.textPrimary,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
  },
  eyeIcon: {
    position: 'absolute',
    right: Spacing.md,
    padding: Spacing.md,
  },
  countrySelector: {
    height: 56,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  countryText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    gap: 8,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  dividerText: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: Colors.outline,
    paddingHorizontal: Spacing.md,
    letterSpacing: 2,
  },
  googleButton: {
    height: 56,
    borderRadius: BorderRadius.xl,
    backgroundColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  googleButtonText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.sm,
    color: Colors.white,
    letterSpacing: 1,
  },
  registerButton: {
    height: 60,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.lg,
    color: Colors.onPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing['2xl'],
    gap: 6,
  },
  footerText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.onSurfaceVariant,
  },
  linkText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  // Modal
  modalContainer: { flex: 1, backgroundColor: Colors.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHigh,
  },
  modalTitle: { fontFamily: FontFamily.headingBold, fontSize: FontSize.lg, color: Colors.white },
  closeText: { fontFamily: FontFamily.bold, color: Colors.primary },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    margin: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    height: 50,
  },
  searchBar: { flex: 1, marginLeft: Spacing.sm, color: Colors.textPrimary, fontFamily: FontFamily.regular },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  countryLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.md, color: Colors.textPrimary },
  separator: { height: 1, backgroundColor: Colors.surfaceContainerHigh, marginLeft: Spacing.xl },
});
