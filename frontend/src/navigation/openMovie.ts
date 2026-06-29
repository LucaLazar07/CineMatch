import type { NavigationProp, ParamListBase } from "@react-navigation/native";

export function openMovieDetail(
  navigation: NavigationProp<ParamListBase>,
  movieId: number,
  mood?: string
): void {
  const parent = navigation.getParent();
  if (parent) {
    parent.navigate("MovieDetail", { movieId, mood });
  }
}

export function openMoodResults(
  navigation: NavigationProp<ParamListBase>,
  mood: string,
  genreIds?: number[],
  maxRuntime?: number
): void {
  const parent = navigation.getParent();
  if (parent) {
    parent.navigate("MoodResults", { mood, genreIds, maxRuntime });
  }
}
