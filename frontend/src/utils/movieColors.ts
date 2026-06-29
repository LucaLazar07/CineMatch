import { colors as t } from "../theme/tokens";

/** Deterministic “dominant” swatch from poster id (no native image sampling). */
export function posterAccentColor(movieId: number): string {
  const palette = [
    t.warmSand,
    "#DDD4C8",
    "#D4C4B0",
    "#C9B8A8",
    "#E0D5C8",
    "#DBCFC0",
  ];
  const i = Math.abs(movieId) % palette.length;
  return palette[i];
}
