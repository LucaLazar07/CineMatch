import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { layoutStyles } from "../theme/layoutStyles";
import { tokens } from "../theme/tokens";
import { forgotPassword } from "../services/api";

type Props = {
  onDone: () => void;
  onGoBack: () => void;
};

export default function ForgotPasswordScreen({ onDone, onGoBack }: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await forgotPassword(email.trim().toLowerCase());
      setMessage("If that email is registered, a reset link was sent.");
    } catch {
      setMessage("Unable to send reset link. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={layoutStyles.screen}>
      <View style={layoutStyles.grainOverlay} />
      <View style={[styles.wrap, { paddingTop: insets.top + 28 }]}>
        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.subtitle}>Enter your email and we'll send a link to reset your password.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={tokens.colors.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={onSubmit}
        />

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <Pressable onPress={onSubmit} style={[styles.primaryBtn, loading && styles.btnDisabled]} disabled={loading}>
          {loading ? <ActivityIndicator color={tokens.colors.white} /> : <Text style={styles.primaryText}>Send reset link</Text>}
        </Pressable>

        <Pressable onPress={onGoBack} style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>Back to login</Text>
        </Pressable>
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
    fontSize: 42,
    color: tokens.colors.ink,
    lineHeight: 48,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontFamily: tokens.fonts.playfairItalic,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.textSecondary,
    lineHeight: 24,
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
    marginTop: 20,
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
  },
  secondaryBtn: {
    marginTop: 12,
    alignItems: "flex-start",
  },
  secondaryText: {
    fontFamily: tokens.fonts.dmMedium,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.primaryRed,
  },
  message: {
    marginTop: 12,
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.textSecondary,
  },
});
