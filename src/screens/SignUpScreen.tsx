import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useResponsive } from '../utils/responsive';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { logoImage } from '../data/images';

export const SignUpScreen: React.FC<RootStackScreenProps<'SignUp'>> = ({ navigation }) => {
  const { colors } = useTheme();
  const { formMaxWidth, width, isDesktop } = useResponsive();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): string | null => {
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      return 'Full name is required.';
    }
    if (trimmedName.length < 2) {
      return 'Please enter your full name.';
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return 'Email address is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return 'Please enter a valid email address.';
    }

    if (!password) {
      return 'Password is required.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    if (!confirmPassword) {
      return 'Please confirm your password.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return null;
  };

  const handleSignUp = async () => {
    setErrorMessage(null);
    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp(fullName.trim(), email.trim().toLowerCase(), password);
      // Navigate to main tabs after account creation
      navigation.replace('MainTabs');
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to create account. Please check your details.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const logoSize = width <= 340 ? 70 : width < 600 ? 90 : isDesktop ? 110 : 100;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.innerContainer, { maxWidth: formMaxWidth }]}>
            {/* Header with back navigation */}
            {navigation.canGoBack() && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[styles.backBtn, { backgroundColor: colors.surface }]}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="chevron-back" size={22} color={colors.text} />
              </TouchableOpacity>
            )}

            {/* Logo and Branding */}
            <View style={styles.brandSection}>
              <Image
                source={logoImage}
                style={[styles.logo, { width: logoSize, height: logoSize }]}
                resizeMode="contain"
                accessible
                accessibilityRole="image"
                accessibilityLabel="TeaLeaf Tracker Logo"
              />
              <Text
                style={[
                  styles.brandTitle,
                  {
                    color: colors.primary,
                    fontSize: width <= 340 ? 22 : isDesktop ? 28 : 24,
                  },
                ]}
              >
                TeaLeaf Tracker
              </Text>
              <Text style={[styles.brandSubtitle, { color: colors.textMuted }]}>
                Create your offline tea journey account
              </Text>
            </View>

            {/* Sign Up Card */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.cardTitle,
                  {
                    color: colors.text,
                    fontSize: width <= 340 ? 18 : typography.sizes.xl,
                  },
                ]}
              >
                Create Account
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                Join and explore Sri Lanka's tea heritage offline
              </Text>

              {/* Inline Error Banner */}
              {errorMessage ? (
                <View style={[styles.errorBox, { backgroundColor: colors.error + '15', borderColor: colors.error }]}>
                  <Ionicons name="alert-circle" size={18} color={colors.error} style={styles.errorIcon} />
                  <Text style={[styles.errorText, { color: colors.error }]}>{errorMessage}</Text>
                </View>
              ) : null}

              {/* Full Name Input */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Full Name</Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={colors.textMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={fullName}
                    onChangeText={(val) => {
                      setFullName(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="e.g. Maya Fernando"
                    placeholderTextColor={colors.textLight}
                    autoCapitalize="words"
                    autoCorrect={false}
                    textContentType="name"
                    style={[styles.input, { color: colors.text }]}
                  />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Email Address</Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={colors.textMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="name@example.com"
                    placeholderTextColor={colors.textLight}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    style={[styles.input, { color: colors.text }]}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Password</Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.textMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={password}
                    onChangeText={(val) => {
                      setPassword(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="At least 6 characters"
                    placeholderTextColor={colors.textLight}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="newPassword"
                    style={[styles.input, { color: colors.text }]}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={styles.eyeBtn}
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Confirm Password</Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color={colors.textMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(val) => {
                      setConfirmPassword(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Re-enter password"
                    placeholderTextColor={colors.textLight}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="newPassword"
                    style={[styles.input, { color: colors.text }]}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword((prev) => !prev)}
                    style={styles.eyeBtn}
                    accessibilityRole="button"
                    accessibilityLabel={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Create Account Action Button */}
              <TouchableOpacity
                onPress={handleSignUp}
                disabled={isSubmitting}
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: isSubmitting ? 0.7 : 1,
                  },
                ]}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Create Account"
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              {/* Switch to Login */}
              <View style={styles.switchRow}>
                <Text style={[styles.switchPrompt, { color: colors.textMuted }]}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setErrorMessage(null);
                    navigation.navigate('Login');
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Navigate to Log In"
                >
                  <Text style={[styles.switchLink, { color: colors.primary }]}>Log In</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Offline Badge */}
            <View style={styles.offlineFooter}>
              <Ionicons name="shield-checkmark-outline" size={15} color={colors.accent} />
              <Text style={[styles.offlineText, { color: colors.textMuted }]}>
                100% Offline • Salted SHA-256 local security
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  innerContainer: {
    width: '100%',
    alignSelf: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    marginBottom: spacing.xs,
  },
  brandTitle: {
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    marginTop: 2,
  },
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardTitle: {
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginTop: spacing.xxs,
    marginBottom: spacing.lg,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  errorIcon: {
    marginRight: spacing.xs,
  },
  errorText: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.medium,
    flex: 1,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.semiBold,
    marginBottom: spacing.xxs + 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    height: 48,
    paddingHorizontal: spacing.sm,
  },
  inputIcon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.sm + 1,
    paddingVertical: 0,
    height: '100%',
  },
  eyeBtn: {
    padding: spacing.xs,
  },
  submitButton: {
    height: 50,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.md,
    letterSpacing: 0.3,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  switchPrompt: {
    fontSize: typography.sizes.sm,
  },
  switchLink: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  offlineFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  offlineText: {
    fontSize: typography.sizes.xs,
  },
});
