import React from "react";
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import type { MovieSummary } from "../services/api";
import { tokens } from "../theme/tokens";

const TMDB = "https://image.tmdb.org/t/p/w342";

type Props = {
  movie: MovieSummary;
  watchedOnLabel: string;
  onPress: () => void;
};

function SprocketColumn(): React.ReactElement {
  return (
    <View style={styles.sprocketCol}>
      <View style={styles.hole} />
      <View style={styles.hole} />
      <View style={styles.hole} />
      <View style={styles.hole} />
    </View>
  );
}

export default function FilmStripCard({
  movie,
  watchedOnLabel,
  onPress,
}: Props): React.ReactElement {
  const uri = movie.poster_path ? `${TMDB}${movie.poster_path}` : null;
  const { width: screenWidth } = useWindowDimensions();
  const frameSize = screenWidth < 480 ? 100 : 140;

  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <View style={styles.filmRow}>
        <SprocketColumn />
        {uri ? (
          <Image source={{ uri }} style={[styles.frame, { width: frameSize, height: frameSize }]} resizeMode="cover" />
        ) : (
          <View style={[styles.frame, styles.framePh, { width: frameSize, height: frameSize }]} />
        )}
        <SprocketColumn />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {movie.title}
      </Text>
      <Text style={styles.dateLine}>{watchedOnLabel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: tokens.spacing.section,
    marginHorizontal: tokens.spacing.screenHorizontal,
  },
  filmRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sprocketCol: {
    width: 14,
    justifyContent: "space-between",
    paddingVertical: 6,
    alignItems: "center",
  },
  hole: {
    width: 8,
    height: 5,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: tokens.colors.divider,
    backgroundColor: tokens.colors.bg,
  },
  frame: {
    backgroundColor: tokens.colors.filmFrameEmpty,
  },
  framePh: {
    borderWidth: 1,
    borderColor: tokens.colors.divider,
  },
  title: {
    fontFamily: tokens.fonts.dmMedium,
    fontSize: tokens.fontSize.bodyLarge,
    color: tokens.colors.ink,
    marginTop: 8,
  },
  dateLine: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.meta,
    color: tokens.colors.textSecondary,
    marginTop: 4,
  },
});
