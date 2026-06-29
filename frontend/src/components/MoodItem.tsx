import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { tokens } from "../theme/tokens";

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export default function MoodItem({
  label,
  active,
  onPress,
}: Props): React.ReactElement {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(translateX, { toValue: 8, useNativeDriver: true, friction: 8, tension: 200 }),
      Animated.timing(opacity, { toValue: 0.7, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true, friction: 6, tension: 200 }),
      Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View>
      <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} style={styles.press}>
        <Animated.Text
          style={[styles.label, active && styles.labelActive, { transform: [{ translateX }], opacity }]}
        >
          {label}
        </Animated.Text>
      </Pressable>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  press: {
    paddingVertical: tokens.spacing.rowVertical,
    paddingRight: 8,
  },
  label: {
    fontFamily: tokens.fonts.dmRegular,
    fontSize: tokens.fontSize.bodyLarge,
    color: tokens.colors.ink,
    lineHeight: tokens.lineHeight.bodyTight,
  },
  labelActive: {
    color: tokens.colors.primaryRed,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: tokens.colors.divider,
    width: "100%",
  },
});
