/**
 * CineMatch editorial design system — single source of truth.
 * Import only from this file for colors, type scale, spacing, and font keys.
 */

export const colors = {
  bg: "#F5F2EE",
  primaryRed: "#C0392B",
  ink: "#141414",
  warmSand: "#E8DDD0",
  fadedGold: "#B8945A",
  textSecondary: "#888888",
  divider: "#D9D3CB",
  white: "#FFFFFF",
  filmFrameEmpty: "#E5E0D8",
  modalScrim: "rgba(20, 20, 20, 0.35)",
} as const;

export const fonts = {
  playfairRegular: "PlayfairDisplay_400Regular",
  playfairItalic: "PlayfairDisplay_400Regular_Italic",
  playfairBold: "PlayfairDisplay_700Bold",
  playfairBoldItalic: "PlayfairDisplay_700Bold_Italic",
  dmRegular: "DMSans_400Regular",
  dmMedium: "DMSans_500Medium",
  dmBold: "DMSans_700Bold",
} as const;

export const fontSize = {
  moodQuote: 16,
  heroTitle: 48,
  heroTitleLarge: 64,
  sectionTitle: 32,
  movieTitleMedium: 20,
  movieTitleLarge: 52,
  movieTitleXL: 64,
  body: 15,
  bodyLarge: 18,
  meta: 13,
  metaSmall: 12,
  searchInput: 40,
  profileHeader: 48,
  subtitle: 18,
  pullQuote: 16,
  stamp: 14,
  microReview: 14,
  navIcon: 24,
} as const;

export const lineHeight = {
  body: 15 * 1.6,
  bodyTight: 22,
} as const;

export const spacing = {
  screenHorizontal: 24,
  section: 24,
  rowVertical: 20,
  cardGap: 12,
  navHeight: 60,
} as const;

export const layout = {
  heroPosterStrip: 80,
  searchPosterThumb: 50,
  detailPosterWidth: 120,
  magazineColorBlock: 80,
  maxShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

export const tokens = {
  colors,
  fonts,
  fontSize,
  lineHeight,
  spacing,
  layout,
} as const;

export type ColorKey = keyof typeof colors;
