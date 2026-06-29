import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getMoodKnn, getMoodSearch, type MovieSummary } from "../services/api";
import { layoutStyles } from "../theme/layoutStyles";
import { tokens } from "../theme/tokens";
import type { RootStackParamList } from "../navigation/types";

const TMDB = "https://image.tmdb.org/t/p/w342";

function AnimatedCard({
  movie: m,
  index,
  cardWidth,
  gap,
  mood,
  onPress,
}: {
  movie: MovieSummary;
  index: number;
  cardWidth: number;
  gap: number;
  mood: string;
  onPress: () => void;
}): React.ReactElement {
  const anim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 340,
      delay: Math.min(index, 11) * 55,
      useNativeDriver: true,
    }).start();
  }, []);

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, friction: 8, tension: 200 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6, tension: 200 }).start();

  const uri = m.poster_path ? `${TMDB}${m.poster_path}` : null;
  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={[
          styles.card,
          {
            width: cardWidth,
            marginBottom: gap + 4,
            opacity: anim,
            transform: [
              { scale },
              { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
            ],
          },
        ]}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={[styles.poster, { width: cardWidth, height: Math.round(cardWidth * 1.5) }]}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.poster, styles.posterPh, { width: cardWidth, height: Math.round(cardWidth * 1.5) }]} />
        )}
        <Text style={[styles.cardTitle, { width: cardWidth }]} numberOfLines={2}>
          {m.title}
        </Text>
        {m.vote_average > 0 && (
          <Text style={styles.cardRating}>{m.vote_average.toFixed(1)}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

type Nav = NativeStackNavigationProp<RootStackParamList, "MoodResults">;
type R = RouteProp<RootStackParamList, "MoodResults">;

export default function MoodResultsScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<R>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { mood, genreIds, maxRuntime } = route.params;

  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        let resp = null;
        if (!maxRuntime) {
          try {
            resp = await getMoodKnn(mood, 24);
          } catch {}
        }
        if (!resp || resp.results.length === 0) {
          resp = await getMoodSearch(mood, genreIds, maxRuntime);
        }
        if (!cancelled) setMovies(resp?.results || []);
      } catch {
        if (!cancelled) setMovies([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [mood]);

  const numCols = width >= 720 ? 3 : 2;
  const hPad = tokens.spacing.screenHorizontal;
  const gap = 10;
  const cardWidth = (width - hPad * 2 - gap * (numCols - 1)) / numCols;

  const renderItem = ({ item: m, index }: { item: MovieSummary; index: number }) => {
    return (
      <AnimatedCard
        movie={m}
        index={index}
        cardWidth={cardWidth}
        mood={mood}
        gap={gap}
        onPress={() => navigation.navigate("MovieDetail", { movieId: m.id, mood })}
      />
    );
  };

  return (
    <View style={layoutStyles.screen}>
      <View style={layoutStyles.grainOverlay} />
      <FlatList
        data={movies}
        numColumns={numCols}
        key={numCols}
        keyExtractor={(m) => String(m.id)}
        columnWrapperStyle={numCols > 1 ? { paddingHorizontal: hPad, gap } : undefined}
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 32 }}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.back}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
            <Text style={styles.heading}>{mood}</Text>
            <View style={styles.rule} />
          </View>
        }
        ListEmptyComponent={
          loading ? null : (
            <Text style={styles.empty}>No films found.</Text>
          )
        }
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={tokens.colors.primaryRed} size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: tokens.spacing.screenHorizontal,
    marginBottom: 16,
  },
  back: {
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  backText: {
    fontFamily: tokens.fonts.dmMedium,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.primaryRed,
  },
  heading: {
    fontFamily: tokens.fonts.playfairBold,
    fontSize: tokens.fontSize.sectionTitle,
    color: tokens.colors.ink,
    marginBottom: 12,
  },
  rule: {
    height: 1,
    backgroundColor: tokens.colors.primaryRed,
  },
  card: {
    alignItems: "flex-start",
  },
  poster: {
    backgroundColor: tokens.colors.warmSand,
  },
  posterPh: {
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  cardTitle: {
    fontFamily: tokens.fonts.playfairBold,
    fontSize: 13,
    color: tokens.colors.ink,
    marginTop: 6,
    lineHeight: 18,
  },
  cardRating: {
    fontFamily: tokens.fonts.dmBold,
    fontSize: 11,
    color: tokens.colors.primaryRed,
    marginTop: 2,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    fontFamily: tokens.fonts.playfairItalic,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.textSecondary,
    marginHorizontal: tokens.spacing.screenHorizontal,
    marginTop: 24,
  },
});
