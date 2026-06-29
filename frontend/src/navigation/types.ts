export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  MainTabs: undefined;
  MovieDetail: { movieId: number; mood?: string };
  MoodResults: { mood: string; genreIds?: number[]; maxRuntime?: number };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Saved: undefined;
  Watched: undefined;
  Profile: undefined;
};
