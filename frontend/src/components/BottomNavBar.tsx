import React from "react";
import { View, Pressable, Text, StyleSheet, Platform } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { tokens } from "../theme/tokens";

export function BottomNavBar({
  state,
  navigation,
}: BottomTabBarProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);
  const height = tokens.spacing.navHeight + bottomPad;

  return (
    <View style={[styles.wrap, { height, paddingBottom: bottomPad }]}>
      <View style={styles.hairline} />
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const color = focused
            ? tokens.colors.primaryRed
            : tokens.colors.textSecondary;
          const size = tokens.fontSize.navIcon;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={styles.tab}
            >
              {index === 0 ? (
                <Feather name="home" size={size} color={color} />
              ) : null}
              {index === 1 ? (
                <Feather name="search" size={size} color={color} />
              ) : null}
              {index === 2 ? (
                <MaterialCommunityIcons
                  name="hexagon-outline"
                  size={size}
                  color={color}
                />
              ) : null}
              {index === 3 ? (
                <Feather name="check" size={size} color={color} />
              ) : null}
              {index === 4 ? (
                <Feather name="user" size={size} color={color} />
              ) : null}
              {focused ? <View style={styles.dot} /> : <View style={styles.dotPlaceholder} />}
              <Text style={styles.hiddenLabel}>{route.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: tokens.colors.divider,
    width: "100%",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  tab: {
    alignItems: "center",
    minWidth: 48,
    paddingVertical: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: tokens.colors.primaryRed,
    marginTop: 6,
  },
  dotPlaceholder: {
    width: 5,
    height: 5,
    marginTop: 6,
    opacity: 0,
  },
  hiddenLabel: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
    ...Platform.select({ web: { overflow: "hidden" as const } }),
  },
});
