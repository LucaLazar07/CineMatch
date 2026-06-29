import { StyleSheet } from "react-native";
import { tokens } from "./tokens";

/** Shared screen chrome — background + optional subtle grain layer (5% ink). */
export const layoutStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  grainOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    pointerEvents: "none",
  },
  scrollContent: {
    paddingBottom: 100,
  },
});
