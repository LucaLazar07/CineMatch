import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { layoutStyles } from "../theme/layoutStyles";
import { tokens } from "../theme/tokens";
import { MOVIE_GENRES } from "../constants/movieGenres";
import {
  register,
  type AuthSuccessResponse,
} from "../services/api";

type Props = {
  onRegistered: (session: AuthSuccessResponse) => Promise<void>;
  onOpenLogin: () => void;
};

export default function RegisterScreen({
  onRegistered,
  onOpenLogin,
}: Props): React.ReactElement {
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pickedGenres, setPickedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      email.trim().length > 0 &&
      password.trim().length >= 8 &&
      pickedGenres.length > 0
    );
  }, [firstName, lastName, email, password, pickedGenres.length]);

  const toggleGenre = (genreId: number) => {
    setPickedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const onSubmit = async () => {
    if (!canSubmit) {
      setError("Please complete all fields and choose at least one genre.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        preferred_genre_ids: pickedGenres,
      };

      const session = await register(payload);
      await onRegistered(session);
    } catch {
      setError("We couldn't create your account. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={layoutStyles.screen}>
      <View style={layoutStyles.grainOverlay} />
      <ScrollView
        contentContainerStyle={[
          styles.wrap,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Tell us what you like and we'll personalize your Home hero film.</Text>

        <TextInput
          style={styles.input}
          placeholder="First name"
          placeholderTextColor={tokens.colors.textSecondary}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last name"
          placeholderTextColor={tokens.colors.textSecondary}
          value={lastName}
          onChangeText={setLastName}
        />
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
          placeholder="Password (minimum 8 characters)"
          placeholderTextColor={tokens.colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.genreTitle}>Preferred genres</Text>
        <View style={styles.genreGrid}>
          {MOVIE_GENRES.map((genre) => {
            const active = pickedGenres.includes(genre.id);
            return (
              <Pressable
                key={genre.id}
                onPress={() => toggleGenre(genre.id)}
                style={[styles.genreChip, active && styles.genreChipActive]}
              >
                <Text style={[styles.genreText, active && styles.genreTextActive]}>
                  {genre.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          onPress={onSubmit}
          style={[styles.primaryBtn, (!canSubmit || loading) && styles.btnDisabled]}
          disabled={!canSubmit || loading}
        >
          {loading ? (
            <ActivityIndicator color={tokens.colors.white} />
          ) : (
            <Text style={styles.primaryText}>Create account</Text>
          )}
        </Pressable>

        <Pressable onPress={onOpenLogin} style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>Already have an account? Log in</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
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
    marginBottom: 20,
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
    fontSize: 17,
    color: tokens.colors.ink,
    marginBottom: 10,
  },
  genreTitle: {
    marginTop: 14,
    marginBottom: 12,
    fontFamily: tokens.fonts.playfairBold,
    fontSize: 24,
    color: tokens.colors.ink,
  },
  genreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genreChip: {
    borderWidth: 1,
    borderColor: tokens.colors.divider,
    backgroundColor: tokens.colors.warmSand,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  genreChipActive: {
    borderColor: tokens.colors.primaryRed,
    backgroundColor: tokens.colors.primaryRed,
  },
  genreText: {
    fontFamily: tokens.fonts.dmMedium,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.ink,
  },
  genreTextActive: {
    color: tokens.colors.white,
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
    marginTop: 10,
    alignItems: "flex-start",
  },
  secondaryText: {
    fontFamily: tokens.fonts.dmMedium,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.primaryRed,
  },
  error: {
    marginTop: 12,
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.primaryRed,
  },
});
