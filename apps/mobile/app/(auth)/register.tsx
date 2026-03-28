import React, { useState, useMemo } from 'react';
import { 
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
      className="flex-1 bg-background"
      imageStyle={{ opacity: 0.6 }}
    >
      <LinearGradient
        colors={['rgba(15,19,31,0.8)', Colors.background]}
        className="absolute inset-0"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 80, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
          
          <View className="flex-row items-center mb-3xl">
            <TouchableOpacity onPress={() => router.back()} className="p-sm">
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <View className="flex-1 items-center pr-6">
              <Text className="font-headingBold text-2xl text-white tracking-tighter">Establish Club</Text>
              <Text className="font-regular text-sm text-onSurfaceVariant mt-0.5">Enter your manager details</Text>
            </View>
          </View>

          <BlurView intensity={40} tint="dark" className="w-full rounded-[32px] p-2xl overflow-hidden border border-primary/15">
            
            <View className="flex-row">
              <View className="flex-1 mr-md mb-xl">
                <Text className="font-headingBold text-[10px] text-primary tracking-[1.5px] mb-sm ml-1">FIRST NAME</Text>
                <TextInput
                  className="h-14 bg-surfaceContainerLow rounded-xl px-xl color-textPrimary font-regular text-md"
                  placeholder="Pep"
                  placeholderTextColor={Colors.outline}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View className="flex-1 mb-xl">
                <Text className="font-headingBold text-[10px] text-primary tracking-[1.5px] mb-sm ml-1">LAST NAME</Text>
                <TextInput
                  className="h-14 bg-surfaceContainerLow rounded-xl px-xl color-textPrimary font-regular text-md"
                  placeholder="Guardiola"
                  placeholderTextColor={Colors.outline}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <View className="mb-xl">
              <Text className="font-headingBold text-[10px] text-primary tracking-[1.5px] mb-sm ml-1">NATIONALITY</Text>
              <TouchableOpacity 
                className="h-14 bg-surfaceContainerLow rounded-xl flex-row items-center justify-between px-xl" 
                onPress={() => setIsPickerVisible(true)}
              >
                <Text className={`font-regular text-md ${!nationality ? 'text-outline' : 'text-textPrimary'}`}>
                  {nationality || 'Select your country'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <View className="mb-xl">
              <Text className="font-headingBold text-[10px] text-primary tracking-[1.5px] mb-sm ml-1">TACTICAL ID / EMAIL</Text>
              <View className="relative justify-center">
                <Ionicons name="mail" size={20} color={Colors.onSurfaceVariant} className="absolute left-lg z-10" />
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
              <Text className="font-headingBold text-[10px] text-primary tracking-[1.5px] mb-sm ml-1">ENCRYPTION KEY / PASSWORD</Text>
              <View className="relative justify-center">
                <Ionicons name="lock-closed" size={20} color={Colors.onSurfaceVariant} className="absolute left-lg z-10" />
                <TextInput
                  className="h-14 bg-surfaceContainerLow rounded-xl pl-12 pr-xl color-textPrimary font-regular text-md"
                  style={{ paddingRight: 50 }}
                  placeholder="Minimum 6 characters"
                  placeholderTextColor={Colors.outline}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                   onPress={() => setShowPassword(!showPassword)}
                   className="absolute right-md p-md"
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
              <View className="flex-row items-center justify-center bg-error/10 p-md rounded-lg mt-md gap-2">
                <Ionicons name="warning" size={16} color={Colors.error} />
                <Text className="text-error text-xs font-medium">{error}</Text>
              </View>
            )}

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleRegister}
              disabled={isLoading}
              className="mt-xl"
            >
              <LinearGradient
                colors={['#2ae500', '#1ca600']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-[60px] rounded-xl flex-row items-center justify-center"
              >
                <Text className="font-headingBlack text-lg text-onPrimary">
                  {isLoading ? 'Processing...' : 'Create Account'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color={Colors.onPrimary} className="ml-2" />
              </LinearGradient>
            </TouchableOpacity>

            <View className="flex-row items-center my-xl">
              <View className="flex-1 h-[1px] bg-white/5" />
              <Text className="font-bold text-[9px] text-outline px-md tracking-[2px]">OR SIGN UP WITH</Text>
              <View className="flex-1 h-[1px] bg-white/5" />
            </View>

            <TouchableOpacity 
              className="h-14 rounded-xl bg-white/5 flex-row items-center justify-center gap-3 border border-white/10"
              onPress={() => promptAsync()}
              disabled={!request || isLoading}
            >
              <Ionicons name="logo-google" size={20} color={Colors.white} />
              <Text className="font-headingBlack text-sm text-white tracking-wider">GOOGLE ACCOUNT</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-2xl gap-1.5">
              <Text className="font-regular text-sm text-onSurfaceVariant">Already have a club?</Text>
              <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                <Text className="font-bold text-sm text-primary">Sign In</Text>
              </TouchableOpacity>
            </View>

          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={isPickerVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-background">
          <View className="flex-row justify-between items-center p-xl border-b border-surfaceContainerHigh">
            <Text className="font-headingBold text-lg text-white">Select Nationality</Text>
            <TouchableOpacity onPress={() => setIsPickerVisible(false)}>
              <Text className="font-bold text-primary">Close</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center bg-surfaceContainerLow m-lg px-lg rounded-xl h-[50px]">
            <Ionicons name="search" size={20} color={Colors.outline} />
            <TextInput
              className="flex-1 ml-sm color-textPrimary font-regular"
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
              <TouchableOpacity className="flex-row justify-between items-center p-xl" onPress={() => selectCountry(item.label)}>
                <Text className="font-medium text-md text-textPrimary">{item.label}</Text>
                {nationality === item.label && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View className="h-[1px] bg-surfaceContainerHigh ml-xl" />}
          />
        </SafeAreaView>
      </Modal>

    </ImageBackground>
  );
}


