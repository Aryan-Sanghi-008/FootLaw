import React, { useState } from 'react';
import { 
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
import { Text } from '../../components/Themed';
import { useAppDispatch, useAppSelector } from '../../store';
import { login, googleLogin } from '../../store/slices/authSlice';
import { Colors, Spacing, BorderRadius, FontSize, FontFamily } from '../../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { GOOGLE_CONFIG } from '../../constants/config';
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
      className="flex-1 bg-background"
      imageStyle={{ opacity: 0.6 }}
    >
      <LinearGradient
        colors={['rgba(15,19,31,0.8)', Colors.background]}
        className="absolute inset-0"
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center p-2xl"
      >
        <View className="w-full items-center">
          
          {/* Header */}
          <View className="items-center mb-4xl">
            <Text className="font-headingBlack text-5xl text-white tracking-[-2px] uppercase mb-xs">FOOTLAW</Text>
            <View className="h-1 w-16 bg-primary rounded-full mb-xl" />
            <Text className="font-headingBold text-xl text-textPrimary">Welcome, Manager</Text>
            <Text className="font-regular text-sm text-onSurfaceVariant mt-1">Your tactical journey begins here.</Text>
          </View>

          {/* Glass Panel Form */}
          <BlurView intensity={40} tint="dark" className="w-full rounded-[32px] p-3xl overflow-hidden border border-primary/10">
            
            <View className="mb-xl">
              <Text className="font-headingBold text-[10px] text-primary tracking-[1.5px] mb-sm ml-1">TACTICAL ID / EMAIL</Text>
              <View className="relative justify-center">
                <Ionicons name="person" size={20} color={Colors.onSurfaceVariant} className="absolute left-xl z-10" />
                <TextInput
                  className="h-14 bg-surfaceContainerLow rounded-xl pl-12 pr-xl color-textPrimary font-regular text-md"
                  placeholder="manager@footlaw.com"
                  placeholderTextColor={Colors.outline}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View className="mb-xl">
              <Text className="font-headingBold text-[10px] text-primary tracking-[1.5px] mb-sm ml-1">ENCRYPTION KEY</Text>
              <View className="relative justify-center">
                <Ionicons name="lock-closed" size={20} color={Colors.onSurfaceVariant} className="absolute left-xl z-10" />
                <TextInput
                  className="h-14 bg-surfaceContainerLow rounded-xl pl-12 pr-xl color-textPrimary font-regular text-md"
                  style={{ paddingRight: 50 }}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.outline}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                   onPress={() => setShowPassword(!showPassword)}
                   className="absolute right-lg p-sm"
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color={Colors.onSurfaceVariant} 
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity className="self-end mt-sm">
                <Text className="font-semibold text-xs text-secondary">Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {error && (
              <View className="flex-row items-center justify-center bg-error/10 p-md rounded-lg mb-md gap-2">
                <Ionicons name="warning" size={16} color={Colors.error} />
                <Text className="text-error text-xs font-medium">{error}</Text>
              </View>
            )}

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={isLoading}
              className="mt-md"
            >
              <LinearGradient
                colors={['#2ae500', '#1ca600']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-[60px] rounded-xl flex-row items-center justify-center"
              >
                <Text className="font-headingBlack text-lg text-onPrimary">
                  {isLoading ? 'Decrypting...' : 'Sign In'}
                </Text>
                <Ionicons name="football" size={20} color={Colors.onPrimary} className="ml-2" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-3xl">
              <View className="flex-1 h-[1px] bg-white/5" />
              <Text className="font-bold text-[10px] text-onSurfaceVariant tracking-[2px] px-lg">SECURE CONNECT</Text>
              <View className="flex-1 h-[1px] bg-white/5" />
            </View>

            {/* Social Logins */}
            <View className="flex-row gap-md">
              <TouchableOpacity 
                className="flex-1 h-[50px] bg-white/5 rounded-xl flex-row items-center justify-center gap-sm"
                onPress={() => promptAsync()}
              >
                <Image source={{ uri: GOOGLE_ICON }} className="w-5 h-5 opacity-60" style={{ tintColor: Colors.onSurfaceVariant }} />
                <Text className="font-bold text-xs text-onSurfaceVariant tracking-wider">GOOGLE</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 h-[50px] bg-white/5 rounded-xl flex-row items-center justify-center gap-sm">
                <Ionicons name="logo-apple" size={20} color={Colors.onSurfaceVariant} />
                <Text className="font-bold text-xs text-onSurfaceVariant tracking-wider">APPLE</Text>
              </TouchableOpacity>
            </View>

          </BlurView>

          {/* Footer */}
          <View className="flex-row justify-center mt-3xl">
            <Text className="font-regular text-sm text-onSurfaceVariant">New to the dugout? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="font-bold text-sm text-primary">Establish your club</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}


