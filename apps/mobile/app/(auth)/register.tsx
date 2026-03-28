import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { useAppDispatch, useAppSelector } from '@/store';
import { register } from '@/store/slices/authSlice';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '@/theme/tokens';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      // Handle password mismatch locally or via state
      return;
    }
    await dispatch(register({ email, password }));
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
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Minimum 6 characters"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Repeat your password"
            placeholderTextColor={Colors.textMuted}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />

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
    justifyContent: 'center',
  },
  header: {
    marginBottom: Spacing['4xl'],
    backgroundColor: 'transparent',
  },
  backButton: {
    marginBottom: Spacing.xl,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.lg,
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
});
