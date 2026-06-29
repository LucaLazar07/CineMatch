import React, { useRef } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import type { MovieSummary } from "../services/api";
import { tokens } from "../theme/tokens";

const TMDB = "https://image.tmdb.org/t/p/w342";

type Props = {
  movie: MovieSummary;
  ratingLabel: string;
  onPress: () => void;
  tilt: "left" | "right";
};

export default function MovieCard({
  movie,
  ratingLabel,
  onPress,
  tilt,
}: Props): React.ReactElement {
  const { width: screenWidth } = useWindowDimensions();
  const isSmall = screenWidth < 480;
  const cardWidth = isSmall ? Math.min(320, screenWidth - 32) : 220;
  const posterWidth = Math.max(80, Math.round(cardWidth * 0.42));
  const posterUri = movie.poster_path
    ? `${TMDB}${movie.poster_path}`
    : null;

  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, friction: 8, tension: 200 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6, tension: 200 }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.outer, { width: cardWidth }]}
    >
      <Animated.View
        style={[
          styles.ticket,
          tilt === "left" ? styles.ticketTiltLeft : styles.ticketTiltRight,
          tokens.layout.maxShadow,
          { transform: [{ scale }] },
        ]}
      >
        <View style={styles.ticketInner}>
          {posterUri ? (
            <Image
              source={{ uri: posterUri }}
              style={[styles.posterHalf, { width: posterWidth, minHeight: Math.round(posterWidth * 1.2) }]}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.posterHalf, styles.posterPh, { width: posterWidth }]} />
          )}
          <View style={styles.ticketTextCol}>
            <Text
              style={[styles.ticketTitle, styles.ticketTitleTilt]}
              numberOfLines={3}
            >
              {movie.title}
            </Text>
          </View>
          <View style={styles.stamp}>
            <Text style={styles.stampText}>{ratingLabel}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginRight: tokens.spacing.section,
  },
  ticket: {
    backgroundColor: tokens.colors.white,
    borderWidth: 1,
    borderColor: tokens.colors.divider,
    overflow: "hidden",
  },
  ticketTiltLeft: {
    transform: [{ rotate: "-1.5deg" }],
  },
  ticketTiltRight: {
    transform: [{ rotate: "1.5deg" }],
  },
  ticketInner: {
    flexDirection: "row",
    minHeight: 120,
    position: "relative",
  },
  posterHalf: {
    minHeight: 120,
    backgroundColor: tokens.colors.warmSand,
  },
  posterPh: {
    justifyContent: "center",
    alignItems: "center",
  },
  ticketTextCol: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: "center",
  },
  ticketTitle: {
    fontFamily: tokens.fonts.playfairBold,
    fontSize: 16,
    color: tokens.colors.ink,
  },
  ticketTitleTilt: {
    transform: [{ rotate: "-0.5deg" }],
  },
  stamp: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: tokens.colors.primaryRed,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: tokens.colors.bg,
  },
  stampText: {
    fontFamily: tokens.fonts.dmBold,
    fontSize: 11,
    color: tokens.colors.primaryRed,
  },
});
