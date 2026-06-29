import React from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { MovieSummary } from "../services/api";
import { posterAccentColor } from "../utils/movieColors";
import { tokens } from "../theme/tokens";

const TMDB = "https://image.tmdb.org/t/p/w185";

type Props = {
  movie: MovieSummary;
  directorLine: string;
  yearLine: string;
  stackOffset: number;
  onPress: () => void;
};

export default function MagazineClipCard({
  movie,
  directorLine,
  yearLine,
  stackOffset,
  onPress,
}: Props): React.ReactElement {
  const swatch = posterAccentColor(movie.id);
  const { width: screenWidth } = useWindowDimensions();
  const colorBlockWidth = screenWidth < 480 ? 48 : 72;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.wrap, { marginTop: stackOffset }, tokens.layout.maxShadow]}
    >
      <View style={[styles.colorBlock, { backgroundColor: swatch, width: colorBlockWidth }]} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {directorLine}
        </Text>
        <Text style={styles.meta}>{yearLine}</Text>
        <View style={styles.bookmark}>
          <Feather name="bookmark" size={18} color={tokens.colors.primaryRed} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: tokens.colors.white,
    borderWidth: 1,
    borderColor: tokens.colors.divider,
    marginBottom: tokens.spacing.cardGap,
    marginHorizontal: tokens.spacing.screenHorizontal,
  },
  colorBlock: {
    width: tokens.layout.magazineColorBlock,
    minHeight: 100,
  },
  body: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    paddingRight: 36,
    justifyContent: "center",
  },
  title: {
    fontFamily: tokens.fonts.playfairBold,
    fontSize: tokens.fontSize.movieTitleMedium,
    color: tokens.colors.ink,
    marginBottom: 4,
  },
  meta: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.textSecondary,
  },
  bookmark: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});
