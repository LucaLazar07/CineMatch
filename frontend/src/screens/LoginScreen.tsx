import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { layoutStyles } from "../theme/layoutStyles";
import { tokens } from "../theme/tokens";
import { login, type AuthSuccessResponse } from "../services/api";

type Props = {
  onLoggedIn: (session: AuthSuccessResponse) => Promise<void>;
  onOpenRegister: () => void;
  onOpenForgot?: () => void;
};

export default function LoginScreen({
  onLoggedIn,
  onOpenRegister,
  onOpenForgot,
}: Props): React.ReactElement {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const session = await login({
        email: email.trim().toLowerCase(),
        password,
      });
      await onLoggedIn(session);
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={layoutStyles.screen}>
      <View style={layoutStyles.grainOverlay} />
      <View style={[styles.wrap, { paddingTop: insets.top + 28 }]}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in and continue your cinema journal.</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={tokens.colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={tokens.colors.textSecondary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={onSubmit}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {onOpenForgot ? (
            <Pressable onPress={onOpenForgot} style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot your password?</Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={onSubmit}
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={tokens.colors.white} />
            ) : (
              <Text style={styles.primaryText}>Log In</Text>
            )}
          </Pressable>

          <Pressable onPress={onOpenRegister} style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Don't have an account? Create one</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: tokens.spacing.screenHorizontal,
  },
  title: {
    fontFamily: tokens.fonts.playfairBold,
    fontSize: 50,
    color: tokens.colors.ink,
    lineHeight: 56,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 32,
    fontFamily: tokens.fonts.playfairItalic,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.textSecondary,
    lineHeight: 24,
  },
  form: {
    gap: 14,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.primaryRed,
    paddingVertical: 10,
    fontFamily: tokens.fonts.dmRegular,
    fontSize: 18,
    color: tokens.colors.ink,
  },
  primaryBtn: {
    marginTop: 10,
    backgroundColor: tokens.colors.primaryRed,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.65,
  },
  primaryText: {
    fontFamily: tokens.fonts.dmBold,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.white,
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    marginTop: 8,
    alignItems: "flex-start",
  },
  secondaryText: {
    fontFamily: tokens.fonts.dmMedium,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.primaryRed,
  },
  error: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.primaryRed,
  },
  forgotBtn: {
    marginTop: 8,
    alignItems: "flex-start",
  },
  forgotText: {
    fontFamily: tokens.fonts.dmMedium,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.textSecondary,
  },
});
