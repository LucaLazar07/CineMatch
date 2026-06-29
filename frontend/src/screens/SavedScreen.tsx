import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Polygon } from "react-native-svg";
import MagazineClipCard from "../components/MagazineClipCard";
import { getSavedList, getMovieDetails, type MovieDetail } from "../services/api";
import { layoutStyles } from "../theme/layoutStyles";
import { tokens } from "../theme/tokens";
import { openMovieDetail } from "../navigation/openMovie";

export default function SavedScreen(): React.ReactElement {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<MovieDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items: saved } = await getSavedList();
      const details = await Promise.all(
        saved.map((s) =>
          getMovieDetails(s.movie_id).catch(() => null as MovieDetail | null)
        )
      );
      setItems(details.filter((x): x is MovieDetail => x != null));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const empty = !loading && items.length === 0;

  return (
    <View style={layoutStyles.screen}>
      <View style={layoutStyles.grainOverlay} />
      <Text style={[styles.header, { marginTop: insets.top + 16 }]}>
        Saved
      </Text>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={tokens.colors.primaryRed} />
        </View>
      ) : null}
      {empty ? (
        <View style={styles.emptyWrap}>
          <Svg width={72} height={72} viewBox="0 0 100 100">
            <Polygon
              points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
              fill="none"
              stroke={tokens.colors.ink}
              strokeWidth={1.5}
            />
          </Svg>
          <Text style={styles.emptyText}>
            Nothing saved yet. Start somewhere.
          </Text>
        </View>
      ) : null}
      {!loading && items.length > 0 ? (
        <ScrollView
          contentContainerStyle={layoutStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {items.map((m, i) => {
            const director =
              m.crew?.find((c) => c.job === "Director")?.name ?? "—";
            const year =
              m.release_date && m.release_date.length >= 4
                ? m.release_date.slice(0, 4)
                : "—";
            return (
              <MagazineClipCard
                key={String(m.id)}
                movie={m}
                directorLine={director}
                yearLine={year}
                stackOffset={i * 3}
                onPress={() => openMovieDetail(navigation, m.id)}
              />
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontFamily: tokens.fonts.playfairItalic,
    fontSize: tokens.fontSize.profileHeader,
    color: tokens.colors.ink,
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: tokens.spacing.screenHorizontal,
  },
  emptyText: {
    fontFamily: tokens.fonts.playfairItalic,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.textSecondary,
    textAlign: "center",
    marginTop: 16,
    lineHeight: tokens.lineHeight.body,
  },
});
