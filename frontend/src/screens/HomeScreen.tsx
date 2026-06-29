import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MoodItem from "../components/MoodItem";
import MovieCard from "../components/MovieCard";
import {
  getHomeSuggestion,
  getMovieDetails,
  getRecommendations,
  type MovieDetail,
  type MovieSummary,
} from "../services/api";
import { layoutStyles } from "../theme/layoutStyles";
import { tokens } from "../theme/tokens";
import { openMovieDetail, openMoodResults } from "../navigation/openMovie";
import {
  FALLBACK_FEATURED_FILM,
  FALLBACK_RECOMMENDATIONS,
} from "../data/fallbackHome";

const MOODS = [
  "Something that will make me cry",
  "A film I can get lost in",
  "Under 90 minutes, no excuses",
  "Something beautiful and strange",
];

const MOOD_FILTERS: Array<{ genreIds?: number[]; maxRuntime?: number } | null> = [
  { genreIds: [18] },
  { genreIds: [12, 14, 9648] },
  { maxRuntime: 90 },
  { genreIds: [18, 14] },
];

const DAILY_HERO_POOL = [
  238,    // The Godfather
  278,    // The Shawshank Redemption
  240,    // The Godfather Part II
  424,    // Schindler's List
  680,    // Pulp Fiction
  155,    // The Dark Knight
  129,    // Spirited Away
  27205,  // Inception
  157336, // Interstellar
  550,    // Fight Club
  769,    // Goodfellas
  598,    // City of God
  637,    // Life is Beautiful
  807,    // Se7en
  1422,   // The Departed
  244786, // Whiplash
  77338,  // The Intouchables
  497,    // The Green Mile
  274,    // The Silence of the Lambs
  1124,   // The Prestige
  289,    // Casablanca
  73,     // American History X
  372058, // Your Name
  15121,  // In Bruges
  311,    // Once Upon a Time in America
  167,    // Princess Mononoke
  13,     // Forrest Gump
];
const HERO_ID = DAILY_HERO_POOL[Math.floor(Date.now() / 86_400_000) % DAILY_HERO_POOL.length];

const TMDB_POST = "https://image.tmdb.org/t/p/w342";

export default function HomeScreen(): React.ReactElement {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [hero, setHero] = useState<MovieDetail | null>(null);
  const [recs, setRecs] = useState<MovieSummary[]>([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [recsLoading, setRecsLoading] = useState(true);

  const heroAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!heroLoading && hero) {
      Animated.timing(heroAnim, { toValue: 1, duration: 480, useNativeDriver: true }).start();
    }
  }, [heroLoading, hero]);

  const load = useCallback(() => {
    let cancelled = false;
    setHeroLoading(true);
    setRecs([]);
    setRecsLoading(true);

    const resolveHeroId = async (): Promise<number> => {
      try {
        const suggestion = await getHomeSuggestion();
        if (suggestion.movie_id > 0) {
          return suggestion.movie_id;
        }
      } catch {
        // Falls back to editorial hero when personalization is unavailable.
      }
      return HERO_ID;
    };

    resolveHeroId().then((heroId) => {
      getMovieDetails(heroId)
        .then((detail) => {
          if (!cancelled) {
            setHero(detail);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setHero(FALLBACK_FEATURED_FILM);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setHeroLoading(false);
          }
        });

      getRecommendations(heroId, 8)
        .then((r) => {
          if (!cancelled) {
            const list = (r.recommendations || []).map((x) => x.movie);
            setRecs(list.length > 0 ? list : FALLBACK_RECOMMENDATIONS);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setRecs(FALLBACK_RECOMMENDATIONS);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setRecsLoading(false);
          }
        });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, [load]);

  const stripW = Math.min(tokens.layout.heroPosterStrip, width * 0.22);
  const isSmall = width < 720;
  const director =
    hero?.crew?.find((c) => c.job === "Director")?.name ?? "—";
  const year =
    hero?.release_date && hero.release_date.length >= 4
      ? hero.release_date.slice(0, 4)
      : "—";
  const genre =
    hero?.genres && hero.genres.length > 0
      ? hero.genres[0].name.toUpperCase()
      : "FILM";

  if (heroLoading) {
    return (
      <View style={[layoutStyles.screen, styles.center]}>
        <View style={layoutStyles.grainOverlay} />
        <ActivityIndicator color={tokens.colors.primaryRed} />
      </View>
    );
  }

  if (!hero) {
    return (
      <View style={[layoutStyles.screen, styles.center]}>
        <View style={layoutStyles.grainOverlay} />
        <ActivityIndicator color={tokens.colors.primaryRed} />
      </View>
    );
  }

  const posterUri = hero.poster_path
    ? `${TMDB_POST}${hero.poster_path}`
    : null;

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
        <Animated.View
          style={{
            opacity: heroAnim,
            transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
          }}
        >
          {!!(hero.tagline || hero.overview) && (
            <Text style={styles.moodQuote}>
              {hero.tagline && hero.tagline.trim().length > 0
                ? hero.tagline
                : hero.overview!.split(/[.!?]/)[0].trim()}
            </Text>
          )}

          <View style={[styles.heroRow, isSmall && styles.heroRowColumn]}>
            <View style={[styles.heroLeft, isSmall && styles.heroLeftNarrow]}>
              <Text style={styles.heroTitle}>{hero.title}</Text>
              <Text style={styles.director}>{director.toUpperCase()}</Text>
              <Text style={styles.metaLine}>
                {year} · {genre}
              </Text>
            </View>
            <View style={styles.heroAccent} />
            {posterUri ? (
              <Image
                source={{ uri: posterUri }}
                style={[styles.posterStrip, { width: isSmall ? Math.min(width * 0.6, 300) : stripW }]}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[styles.posterStrip, styles.posterPh, { width: isSmall ? Math.min(width * 0.6, 300) : stripW }]}
              />
            )}
          </View>
        </Animated.View>

        <Text style={styles.sectionTitle}>In the Mood For</Text>
        {MOODS.map((m, i) => {
          const filter = MOOD_FILTERS[i];
          return (
            <MoodItem
              key={m}
              label={m}
              active={false}
              onPress={() =>
                openMoodResults(navigation, m, filter?.genreIds, filter?.maxRuntime)
              }
            />
          );
        })}

        <Text style={[styles.sectionTitle, styles.recentTitle]}>
          You Might Like
        </Text>
        {recsLoading ? (
          <View style={styles.recsPending}>
            <ActivityIndicator
              color={tokens.colors.primaryRed}
              style={styles.recsSpinner}
            />
          </View>
        ) : recs.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
          >
            {recs.map((m, i) => (
              <MovieCard
                key={String(m.id)}
                movie={m}
                ratingLabel={
                  m.vote_average > 0 ? m.vote_average.toFixed(1) : "—"
                }
                tilt={i % 2 === 0 ? "left" : "right"}
                onPress={() => openMovieDetail(navigation, m.id)}
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.recsEmpty}>
            No suggestions right now.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: tokens.spacing.screenHorizontal,
  },
  moodQuote: {
    fontFamily: tokens.fonts.playfairItalic,
    fontSize: tokens.fontSize.moodQuote,
    color: tokens.colors.textSecondary,
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: tokens.spacing.section,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "stretch",
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: tokens.spacing.section,
    minHeight: 140,
  },
  heroRowColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  heroLeft: {
    flex: 1,
    paddingRight: 8,
    justifyContent: "flex-start",
  },
  heroLeftNarrow: {
    paddingRight: 0,
    marginBottom: 12,
  },
  heroTitle: {
    fontFamily: tokens.fonts.playfairBold,
    fontSize: tokens.fontSize.heroTitleLarge,
    color: tokens.colors.ink,
    lineHeight: 56,
  },
  director: {
    fontFamily: tokens.fonts.dmMedium,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.textSecondary,
    letterSpacing: 0.8,
    marginTop: 8,
  },
  metaLine: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.textSecondary,
    marginTop: 6,
  },
  heroAccent: {
    width: 1,
    backgroundColor: tokens.colors.primaryRed,
    marginRight: 8,
  },
  posterStrip: {
    minHeight: 140,
    backgroundColor: tokens.colors.warmSand,
  },
  posterPh: {
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  sectionTitle: {
    fontFamily: tokens.fonts.playfairBold,
    fontSize: tokens.fontSize.sectionTitle,
    color: tokens.colors.ink,
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 8,
  },
  recentTitle: {
    marginTop: tokens.spacing.section,
  },
  hScroll: {
    paddingLeft: tokens.spacing.screenHorizontal,
    paddingBottom: 8,
  },
  recsPending: {
    paddingLeft: tokens.spacing.screenHorizontal,
    paddingBottom: 16,
    minHeight: 140,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  recsSpinner: {
    marginLeft: 8,
  },
  recsEmpty: {
    fontFamily: tokens.fonts.playfairItalic,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.textSecondary,
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 16,
  },
});
