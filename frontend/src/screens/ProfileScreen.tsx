import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Polygon } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import { layoutStyles } from "../theme/layoutStyles";
import { tokens } from "../theme/tokens";
import { getProfileSummary, type ProfileSummary } from "../services/api";
import { useAuth } from "../storage/AuthContext";

export default function ProfileScreen(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const { session, logout } = useAuth();
  const [summary, setSummary] = useState<ProfileSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const s = await getProfileSummary();
      setSummary(s);
    } catch {
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSummary();
    }, [loadSummary])
  );

  const user = session?.user;
  const initials = user
    ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
    : "—";
  const displayName = user?.display_name ?? `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();

  return (
    <View style={layoutStyles.screen}>
      <View style={layoutStyles.grainOverlay} />
      <ScrollView
        contentContainerStyle={[
          layoutStyles.scrollContent,
          { paddingTop: insets.top + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.diamondWrap}>
            <Svg width={88} height={88} viewBox="0 0 100 100">
              <Polygon
                points="50,10 85,50 50,90 15,50"
                fill="none"
                stroke={tokens.colors.primaryRed}
                strokeWidth={2}
              />
            </Svg>
            <Text style={styles.initials}>{initials}</Text>
          </View>
          <View style={styles.cornerDiamond}>
            <Svg width={12} height={12} viewBox="0 0 24 24">
              <Polygon
                points="12,2 22,12 12,22 2,12"
                fill={tokens.colors.primaryRed}
              />
            </Svg>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.tag}>Film Enthusiast</Text>
        </View>

        <Text style={styles.collectionTitle}>Your Collection</Text>

        <View style={styles.rowDivider} />
        <View style={styles.collectionRow}>
          <View>
            <Text style={styles.rowTitle}>Films Saved</Text>
            <Text style={styles.rowSub}>Bookmarked for later</Text>
          </View>
          {summaryLoading ? (
            <ActivityIndicator size="small" color={tokens.colors.primaryRed} />
          ) : (
            <Text style={styles.countBadge}>{summary?.saved_count ?? 0}</Text>
          )}
        </View>
        <View style={styles.rowDivider} />
        <View style={styles.collectionRow}>
          <View>
            <Text style={styles.rowTitle}>Films Seen</Text>
            <Text style={styles.rowSub}>Your viewing history</Text>
          </View>
          {summaryLoading ? (
            <ActivityIndicator size="small" color={tokens.colors.primaryRed} />
          ) : (
            <Text style={styles.countBadge}>{summary?.watched_count ?? 0}</Text>
          )}
        </View>
        <View style={styles.rowDivider} />
        <View style={styles.collectionRow}>
          <View>
            <Text style={styles.rowTitle}>Notes Written</Text>
            <Text style={styles.rowSub}>Personal thoughts</Text>
          </View>
          {summaryLoading ? (
            <ActivityIndicator size="small" color={tokens.colors.primaryRed} />
          ) : (
            <Text style={styles.countBadge}>{summary?.notes_count ?? 0}</Text>
          )}
        </View>
        <View style={styles.rowDivider} />

        <View style={styles.databaseBox}>
          <Feather name="film" size={20} color={tokens.colors.ink} />
          <View style={styles.databaseTextCol}>
            <Text style={styles.databaseTitle}>Database</Text>
            <Text style={styles.databaseBody}>
              Millions of films at your fingertips. Every detail powered by
              TMDB.
            </Text>
          </View>
        </View>

        <Pressable onPress={logout} style={styles.logoutBtn}>
          <Feather name="log-out" size={16} color={tokens.colors.primaryRed} />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontFamily: tokens.fonts.playfairItalic,
    fontSize: tokens.fontSize.profileHeader,
    color: tokens.colors.ink,
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 20,
  },
  profileCard: {
    marginHorizontal: tokens.spacing.screenHorizontal,
    borderWidth: 1,
    borderColor: tokens.colors.ink,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 28,
    position: "relative",
  },
  diamondWrap: {
    width: 88,
    height: 88,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  initials: {
    position: "absolute",
    fontFamily: tokens.fonts.dmMedium,
    fontSize: 22,
    color: tokens.colors.ink,
  },
  cornerDiamond: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  name: {
    fontFamily: tokens.fonts.dmMedium,
    fontSize: 20,
    color: tokens.colors.ink,
  },
  tag: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.textSecondary,
    marginTop: 4,
  },
  collectionTitle: {
    fontFamily: tokens.fonts.playfairBold,
    fontSize: 24,
    color: tokens.colors.ink,
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 8,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: tokens.colors.divider,
    marginHorizontal: tokens.spacing.screenHorizontal,
  },
  collectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    marginHorizontal: tokens.spacing.screenHorizontal,
  },
  rowTitle: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.bodyLarge,
    color: tokens.colors.ink,
  },
  rowSub: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.textSecondary,
    marginTop: 4,
  },
  countBadge: {
    fontFamily: tokens.fonts.dmBold,
    fontSize: 20,
    color: tokens.colors.primaryRed,
  },
  databaseBox: {
    flexDirection: "row",
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginTop: 24,
    marginBottom: 8,
    padding: 16,
    backgroundColor: tokens.colors.warmSand,
    alignItems: "flex-start",
  },
  databaseTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  databaseTitle: {
    fontFamily: tokens.fonts.playfairBold,
    fontSize: tokens.fontSize.subtitle,
    color: tokens.colors.ink,
    marginBottom: 8,
  },
  databaseBody: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.ink,
    lineHeight: 20,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 12,
  },
  logoutText: {
    fontFamily: tokens.fonts.dmMedium,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.primaryRed,
  },
});
