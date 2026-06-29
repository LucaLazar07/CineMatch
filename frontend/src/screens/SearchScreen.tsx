import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { searchMovies, type MovieSummary } from "../services/api";
import { factForIndex } from "../data/filmFacts";
import { layoutStyles } from "../theme/layoutStyles";
import { tokens } from "../theme/tokens";
import { openMovieDetail } from "../navigation/openMovie";

const TMDB = "https://image.tmdb.org/t/p/w92";

type Row =
  | { kind: "result"; movie: MovieSummary; index: number }
  | { kind: "aside"; fact: string; key: string };

function buildRows(movies: MovieSummary[]): Row[] {
  const rows: Row[] = [];
  movies.forEach((movie, index) => {
    if (index >= 3 && (index + 1) % 4 === 0) {
      rows.push({
        kind: "aside",
        fact: factForIndex(Math.floor((index + 1) / 4)),
        key: `aside-${index}`,
      });
    }
    rows.push({ kind: "result", movie, index });
  });
  return rows;
}

export default function SearchScreen(): React.ReactElement {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const listAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (results.length > 0) {
      listAnim.setValue(0);
      Animated.timing(listAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
  }, [results]);

  const runSearch = useCallback(async (query: string) => {
    const t = query.trim();
    if (!t) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await searchMovies(t, 1);
      setResults(res.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      runSearch(q);
    }, 400);
    return () => clearTimeout(t);
  }, [q, runSearch]);

  const rows = buildRows(results);

  const listEmpty =
    searched && !loading && results.length === 0 && q.trim().length > 0;

  const showStartHint = !searched && q.trim().length === 0;

  return (
    <View style={layoutStyles.screen}>
      <View style={layoutStyles.grainOverlay} />
      <View style={[styles.pad, { paddingTop: insets.top + 16 }]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Type a title, director, or feeling…"
          placeholderTextColor={tokens.colors.textSecondary}
          value={q}
          onChangeText={setQ}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <View style={styles.underline} />
        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            color={tokens.colors.primaryRed}
          />
        ) : null}
      </View>

      {showStartHint ? (
        <View style={styles.emptyCenter}>
          <Text style={styles.startHint}>
            Start typing to discover films.
          </Text>
        </View>
      ) : null}

      {listEmpty ? (
        <View style={styles.emptyCenter}>
          <Text style={styles.noResults}>
            Nothing yet. Try a director&apos;s name.
          </Text>
        </View>
      ) : null}

      {!showStartHint && !listEmpty && results.length > 0 ? (
        <Animated.View
          style={{
            flex: 1,
            opacity: listAnim,
            transform: [{ translateY: listAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
          }}
        >
        <FlatList
          data={rows}
          keyExtractor={(item) =>
            item.kind === "aside" ? item.key : `m-${item.movie.id}-${item.index}`
          }
          contentContainerStyle={layoutStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.kind === "aside") {
              return (
                <View style={styles.asideBlock}>
                  <View style={styles.redRule} />
                  <Text style={styles.asideLabel}>Also worth knowing:</Text>
                  <Text style={styles.asideFact}>{item.fact}</Text>
                </View>
              );
            }
            const m = item.movie;
            const year =
              m.release_date && m.release_date.length >= 4
                ? m.release_date.slice(0, 4)
                : "—";
            const uri = m.poster_path ? `${TMDB}${m.poster_path}` : null;
            return (
              <View>
                <Pressable
                  onPress={() => openMovieDetail(navigation, m.id)}
                  accessibilityRole="button"
                >
                  <View style={styles.resultRow}>
                    <View style={styles.resultText}>
                      <Text style={styles.resultTitle} numberOfLines={2}>
                        {m.title}
                      </Text>
                      <Text style={styles.resultSub} numberOfLines={1}>
                        Cinema · {year}
                      </Text>
                    </View>
                    {uri ? (
                      <Image source={{ uri }} style={styles.thumb} />
                    ) : (
                      <View style={[styles.thumb, styles.thumbPh]} />
                    )}
                  </View>
                </Pressable>
                <View style={styles.rowDivider} />
              </View>
            );
          }}
        />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    paddingHorizontal: tokens.spacing.screenHorizontal,
  },
  searchInput: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.searchInput,
    color: tokens.colors.ink,
    paddingVertical: 8,
    minHeight: 52,
  },
  underline: {
    height: 1,
    backgroundColor: tokens.colors.primaryRed,
    width: "100%",
  },
  loader: {
    marginTop: 12,
  },
  emptyCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: tokens.spacing.screenHorizontal,
  },
  startHint: {
    fontFamily: tokens.fonts.playfairItalic,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.textSecondary,
    textAlign: "center",
    lineHeight: tokens.lineHeight.body,
  },
  noResults: {
    fontFamily: tokens.fonts.playfairItalic,
    fontSize: tokens.fontSize.body,
    color: tokens.colors.textSecondary,
    textAlign: "center",
    lineHeight: tokens.lineHeight.body,
  },
  asideBlock: {
    paddingVertical: 16,
    paddingHorizontal: tokens.spacing.screenHorizontal,
  },
  redRule: {
    height: 1,
    backgroundColor: tokens.colors.primaryRed,
    marginBottom: 8,
  },
  asideLabel: {
    fontFamily: tokens.fonts.playfairItalic,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.primaryRed,
    marginBottom: 4,
  },
  asideFact: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.textSecondary,
    fontStyle: "italic",
    lineHeight: 20,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: tokens.spacing.screenHorizontal,
  },
  resultText: {
    flex: 1,
    paddingRight: 12,
  },
  resultTitle: {
    fontFamily: tokens.fonts.playfairBold,
    fontSize: 22,
    color: tokens.colors.ink,
  },
  resultSub: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.textSecondary,
    fontStyle: "italic",
    marginTop: 6,
  },
  thumb: {
    width: tokens.layout.searchPosterThumb,
    height: 72,
    backgroundColor: tokens.colors.warmSand,
  },
  thumbPh: {
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: tokens.colors.divider,
    marginLeft: tokens.spacing.screenHorizontal,
    marginRight: tokens.spacing.screenHorizontal,
  },
});
