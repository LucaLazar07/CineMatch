import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getMovieDetails,
  getRecommendationsWithMood,
  getSavedList,
  getWatchedList,
  addSaved,
  removeSaved,
  markWatched,
  type MovieDetail,
  type MovieSummary,
} from "../services/api";
import type { RootStackParamList } from "../navigation/types";
import { layoutStyles } from "../theme/layoutStyles";
import { tokens } from "../theme/tokens";

const TMDB_POST = "https://image.tmdb.org/t/p/w500";
const TMDB_SMALL = "https://image.tmdb.org/t/p/w185";

type Nav = NativeStackNavigationProp<RootStackParamList, "MovieDetail">;
type R = RouteProp<RootStackParamList, "MovieDetail">;

function pullQuote(overview: string | undefined | null): string {
  if (!overview) return "";
  const s = overview.trim();
  const end = s.search(/[.!?]/);
  const first = end >= 0 ? s.slice(0, end + 1) : s.slice(0, 120);
  const rest = s.slice(first.length).trim();
  const secondEnd = rest.search(/[.!?]/);
  const second =
    secondEnd >= 0 ? rest.slice(0, secondEnd + 1) : rest.slice(0, 120);
  return `${first} ${second}`.trim();
}

export default function MovieDetailScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<R>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const movieId = route.params.movieId;

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [recs, setRecs] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [recsLoading, setRecsLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [seen, setSeen] = useState(false);

  const contentAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!loading && movie) {
      Animated.timing(contentAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }
  }, [loading, movie]);

  const load = useCallback(async () => {
    setLoading(true);
    setRecsLoading(true);
    try {
      const d = await getMovieDetails(movieId);
      setMovie(d);
      setLoading(false);

      // Load recs + collection status in the background after the screen is visible.
      const [r, savedList, watchedList] = await Promise.all([
        getRecommendationsWithMood(movieId, 3, (route.params as any).mood).catch(() => ({ recommendations: [] })),
        getSavedList().catch(() => ({ items: [] })),
        getWatchedList().catch(() => ({ items: [] })),
      ]);
      setRecs((r.recommendations || []).map((x) => x.movie).slice(0, 3));
      setSaved(savedList.items.some((s) => s.movie_id === movieId));
      setSeen(watchedList.items.some((w) => w.movie_id === movieId));
    } catch {
      setMovie(null);
      setLoading(false);
    } finally {
      setRecsLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    load();
  }, [load]);

  const onToggleSave = async () => {
    const next = !saved;
    setSaved(next);
    try {
      if (next) {
        await addSaved(movieId);
      } else {
        await removeSaved(movieId);
      }
    } catch {
      setSaved(!next);
    }
  };

  const onSeen = async () => {
    setSeen(true);
    try {
      await markWatched(movieId);
    } catch {
      setSeen(false);
    }
  };

  if (loading || !movie) {
    return (
      <View style={[layoutStyles.screen, styles.center]}>
        <View style={layoutStyles.grainOverlay} />
        <ActivityIndicator color={tokens.colors.primaryRed} />
      </View>
    );
  }

  const director =
    movie.crew?.find((c) => c.job === "Director")?.name ?? "—";
  const year =
    movie.release_date && movie.release_date.length >= 4
      ? movie.release_date.slice(0, 4)
      : "—";
  const rating =
    movie.vote_average > 0 ? movie.vote_average.toFixed(1) : "—";
  const runtime =
    movie.runtime > 0 ? `${movie.runtime} min` : "—";
  const quote = pullQuote(movie.overview);

  const posterUri = movie.poster_path
    ? `${TMDB_POST}${movie.poster_path}`
    : null;

  const isSmall = width < 720;

  return (
    <View style={layoutStyles.screen}>
      <View style={layoutStyles.grainOverlay} />
      <ScrollView
        contentContainerStyle={[
          layoutStyles.scrollContent,
          { paddingTop: insets.top + 12 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Animated.View
          style={{
            opacity: contentAnim,
            transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
          }}
        >
          <View style={[styles.topRow, isSmall && styles.topRowColumn]}>
            <View style={[styles.posterCard, tokens.layout.maxShadow, isSmall && styles.posterCardNarrow]}>
              {posterUri ? (
                <Image
                  source={{ uri: posterUri }}
                  style={[styles.poster, isSmall && { width: 160, height: 240 }]}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.poster, styles.posterPh, isSmall && { width: 160, height: 240 }]} />
              )}
            </View>
            <Text style={[styles.title, isSmall && { fontSize: 22, lineHeight: 28 }]}>{movie.title}</Text>
          </View>

          <View style={styles.redRule} />

          <Text style={styles.pullQuote}>{quote}</Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Runtime</Text>
              <Text style={styles.tableVal}>{runtime}</Text>
            </View>
            <View style={styles.tableLine} />
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Year</Text>
              <Text style={styles.tableVal}>{year}</Text>
            </View>
            <View style={styles.tableLine} />
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Rating</Text>
              <Text style={styles.tableVal}>{rating}</Text>
            </View>
            <View style={styles.tableLine} />
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={onSeen}
              style={[styles.stamp, seen && styles.stampDisabled]}
              disabled={seen}
            >
              <Text style={styles.stampText}>I&apos;ve Seen This</Text>
            </Pressable>
            <Pressable onPress={onToggleSave} style={styles.saveTextBtn}>
              <Text style={styles.saveText}>
                {saved ? "Saved" : "Save It"}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionHead}>If you liked this</Text>
          {recsLoading && (
            <ActivityIndicator
              color={tokens.colors.primaryRed}
              style={styles.recsSpinner}
            />
          )}
          {recs.map((m) => {
            const uri = m.poster_path ? `${TMDB_SMALL}${m.poster_path}` : null;
            const blurb =
              m.overview && m.overview.length > 0
                ? `${m.overview.slice(0, 90).trim()}…`
                : "A film worth discovering.";
            return (
              <Pressable
                key={String(m.id)}
                style={styles.suggestRow}
                onPress={() =>
                  navigation.replace("MovieDetail", { movieId: m.id })
                }
              >
                {uri ? (
                  <Image source={{ uri }} style={styles.suggestThumb} />
                ) : (
                  <View style={[styles.suggestThumb, styles.suggestPh]} />
                )}
                <View style={styles.suggestBody}>
                  <Text style={styles.suggestTitle}>{m.title}</Text>
                  <Text style={styles.suggestMicro}>{blurb}</Text>
                </View>
              </Pressable>
            );
          })}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  back: {
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  backText: {
    fontFamily: tokens.fonts.dmMedium,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.primaryRed,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 12,
  },
  topRowColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  posterCard: {
    width: tokens.layout.detailPosterWidth,
    marginRight: 12,
    marginLeft: -4,
    position: "relative",
  },
  posterCardNarrow: {
    width: 160,
    marginRight: 8,
    marginLeft: 0,
  },
  poster: {
    width: tokens.layout.detailPosterWidth,
    height: tokens.layout.detailPosterWidth * 1.5,
    backgroundColor: tokens.colors.warmSand,
  },
  posterPh: {
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  title: {
    flex: 1,
    fontFamily: tokens.fonts.playfairBold,
    fontSize: tokens.fontSize.movieTitleLarge,
    color: tokens.colors.ink,
    lineHeight: 48,
  },
  redRule: {
    height: 1,
    backgroundColor: tokens.colors.primaryRed,
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 16,
  },
  pullQuote: {
    fontFamily: tokens.fonts.playfairItalic,
    fontSize: tokens.fontSize.pullQuote,
    color: tokens.colors.ink,
    lineHeight: 24,
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 20,
  },
  table: {
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  tableLabel: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.textSecondary,
  },
  tableVal: {
    fontFamily: tokens.fonts.dmBold,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.ink,
  },
  tableLine: {
    height: 1,
    backgroundColor: tokens.colors.divider,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 16,
  },
  stamp: {
    borderWidth: 2,
    borderColor: tokens.colors.primaryRed,
    paddingVertical: 10,
    paddingHorizontal: 14,
    transform: [{ rotate: "-1deg" }],
  },
  stampDisabled: {
    opacity: 0.5,
  },
  stampText: {
    fontFamily: tokens.fonts.dmBold,
    fontSize: tokens.fontSize.stamp,
    color: tokens.colors.primaryRed,
  },
  saveTextBtn: {
    paddingVertical: 8,
  },
  saveText: {
    fontFamily: tokens.fonts.dmMedium,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.primaryRed,
  },
  sectionHead: {
    fontFamily: tokens.fonts.playfairBold,
    fontSize: tokens.fontSize.sectionTitle,
    color: tokens.colors.ink,
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 12,
  },
  suggestRow: {
    flexDirection: "row",
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: tokens.colors.divider,
  },
  suggestThumb: {
    width: 56,
    height: 84,
    backgroundColor: tokens.colors.warmSand,
    marginRight: 12,
  },
  suggestPh: {
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  suggestBody: {
    flex: 1,
  },
  suggestTitle: {
    fontFamily: tokens.fonts.playfairBold,
    fontSize: 18,
    color: tokens.colors.ink,
    marginBottom: 6,
  },
  suggestMicro: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.microReview,
    color: tokens.colors.textSecondary,
    fontStyle: "italic",
    lineHeight: 20,
  },
  recsSpinner: {
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
});
