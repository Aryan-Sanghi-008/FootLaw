import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  View,
  ImageBackground,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Text } from '@/components/Themed';
import { useAppDispatch, useAppSelector } from '@/store';
import { login, googleLogin } from '@/store/slices/authSlice';
import { Colors, Spacing, BorderRadius, FontSize, FontFamily } from '@/theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { GOOGLE_CONFIG } from '@/constants/config';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

WebBrowser.maybeCompleteAuthSession();

// Hardcoded background from Stitch design
const STADIUM_BG = "https://lh3.googleusercontent.com/aida-public/AB6AXuC5LSaMAZ9bBX-V5Hy-h2Zw15PzAn2GN1e7ubpG29R6BXvHGct7j0lRrn65ieX4O5bnfkvcxsYPPMkwwKxr2eE1OIPzohWv7HnTbiQ-vsL0S4ZB80GurDj9a2Q_WN8uiGxCLMGrqpanlNyrs1zuGICXK8expVgdFAhXViLkkwOfVXlUI7feZovJMrd9xZ32GRGwinLnu1dSTa5kdHdxcEUbhl5zNH_SomPbXwaIssgP6HTui4mGSEnfsapsjxt1ph21WG650qLAR2fS";
const GOOGLE_ICON = "https://lh3.googleusercontent.com/aida-public/AB6AXuDecDQ78A3vXDLkPhT-30fWIzBl2A3aX7pphzdU1oUZ5z_4m1YbhC9mSNHdO7IxtWdb9RBLS0LEbudFgPEWNAB-g-ta4M52E6gdzB2rHTlFlcPTi_KLctSPQUDLFulQ18p1sNl5WSamQXwdz2t6KdUyxFCNp1SYeLQkaBSlpk_2WB6vRiD2oJ7PRDTFdLn_kM6RayFmxB33rB6X-HZlxWAAbROqrp0US4oAXt2rVxm2W5KQfRRe-n-8umfR2HclIqQWN3XUWoz7kF3C";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleLogin = async () => {
    if (!email || !password) return;
    await dispatch(login({ email, password }));
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
        <View style={styles.content}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logoText}>FOOTLAW</Text>
            <View style={styles.separator} />
            <Text style={styles.title}>Welcome, Manager</Text>
            <Text style={styles.subtitle}>Your tactical journey begins here.</Text>
          </View>

          {/* Glass Panel Form */}
          <BlurView intensity={40} tint="dark" style={styles.glassPanel}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>TACTICAL ID / EMAIL</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person" size={20} color={Colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
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
              <Text style={styles.label}>ENCRYPTION KEY</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed" size={20} color={Colors.onSurfaceVariant} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingRight: 50 }]}
                  placeholder="••••••••"
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
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={isLoading}
              style={{ marginTop: Spacing.md }}
            >
              <LinearGradient
                colors={['#2ae500', '#1ca600']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Decrypting...' : 'Sign In'}
                </Text>
                <Ionicons name="football" size={20} color={Colors.onPrimary} style={{ marginLeft: 8 }} />
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>SECURE CONNECT</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Logins */}
            <View style={styles.socialGrid}>
              <TouchableOpacity 
                style={styles.socialBtn}
                onPress={() => promptAsync()}
              >
                <Image source={{ uri: GOOGLE_ICON }} style={styles.socialLogo} />
                <Text style={styles.socialText}>GOOGLE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-apple" size={20} color={Colors.onSurfaceVariant} />
                <Text style={styles.socialText}>APPLE</Text>
              </TouchableOpacity>
            </View>

          </BlurView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New to the dugout? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.linkText}>Establish your club</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  overlayGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing['2xl'],
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
  },
  logoText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize['5xl'],
    color: Colors.white,
    letterSpacing: -2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  separator: {
    height: 4,
    width: 64,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  glassPanel: {
    width: '100%',
    borderRadius: 32,
    padding: Spacing['3xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(121, 255, 91, 0.15)', // inner glow approximation
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
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: Spacing.xl,
    zIndex: 1,
  },
  input: {
    height: 56,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    paddingLeft: 48,
    paddingRight: Spacing.xl,
    color: Colors.textPrimary,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
  },
  eyeIcon: {
    position: 'absolute',
    right: Spacing.lg,
    padding: Spacing.sm,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: Spacing.sm,
  },
  forgotText: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.xs,
    color: Colors.secondary,
  },
  errorText: {
    color: Colors.danger,
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
    textAlign: 'center',
    fontFamily: FontFamily.medium,
  },
  loginButton: {
    height: 60,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontFamily: FontFamily.headingBlack,
    fontSize: FontSize.lg,
    color: Colors.onPrimary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing['3xl'],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  dividerText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    paddingHorizontal: Spacing.lg,
  },
  socialGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  socialBtn: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  socialLogo: {
    width: 20,
    height: 20,
    tintColor: Colors.onSurfaceVariant, // Starts grayed out to match the HTML design
  },
  socialText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing['3xl'],
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
});
