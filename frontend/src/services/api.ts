import axios, { AxiosHeaders } from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";

function getDefaultBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "");
  }
  // When running in Expo Go over LAN, hostUri is "192.168.x.x:8081".
  // Extract just the host so every device on the same network hits the right backend.
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    return `http://${host}:8000`;
  }
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000";
  }
  return "http://127.0.0.1:8000";
}

const baseURL = `${getDefaultBaseUrl()}/api/v1`;

const client = axios.create({
  baseURL,
  timeout: 45000,
});

// Bare client for refresh calls — no interceptors attached
const refreshClient = axios.create({ baseURL, timeout: 10000 });

let accessToken: string | null = null;
let refreshToken: string | null = null;
let onLogout: (() => void) | null = null;
let onRefreshSuccess: ((tokens: { access_token: string; refresh_token?: string }) => void) | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function setRefreshToken(token: string | null): void {
  refreshToken = token;
}

export function setOnLogout(fn: () => void): void {
  onLogout = fn;
}

export function setOnRefreshSuccess(
  fn: (tokens: { access_token: string; refresh_token?: string }) => void
): void {
  onRefreshSuccess = fn;
}

client.interceptors.request.use((config) => {
  if (accessToken) {
    const headers = new AxiosHeaders(config.headers as any);
    headers.set("Authorization", `Bearer ${accessToken}`);
    config.headers = headers;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry && refreshToken) {
      original._retry = true;
      try {
        const { data } = await refreshClient.post("/auth/refresh", {
          refresh_token: refreshToken,
        });
        accessToken = data.access_token;
        if (data.refresh_token) {
          refreshToken = data.refresh_token;
        }
        onRefreshSuccess?.({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
        const newHeaders = new AxiosHeaders(original.headers as any);
        newHeaders.set("Authorization", `Bearer ${data.access_token}`);
        original.headers = newHeaders;
        return client(original);
      } catch {
        onLogout?.();
      }
    }
    return Promise.reject(error);
  }
);

export type MovieSummary = {
  id: number;
  title: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string | null;
  vote_average: number;
  vote_count: number;
  overview?: string | null;
  genre_ids?: number[];
};

export type SearchResponse = {
  results: MovieSummary[];
  page: number;
  total_pages: number;
  total_results: number;
};

export type Genre = { id: number; name: string };
export type CastMember = {
  name: string;
  character: string;
  profile_path?: string | null;
};
export type CrewMember = { name: string; job: string };

export type MovieDetail = {
  id: number;
  title: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string | null;
  vote_average: number;
  vote_count: number;
  overview?: string | null;
  runtime: number;
  genres: Genre[];
  cast: CastMember[];
  crew: CrewMember[];
  tagline?: string | null;
  keywords: string[];
};

export type RecommendationItem = {
  movie: MovieSummary;
  score: number;
  reason?: string | null;
};

export type AuthUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  display_name?: string | null;
  preferred_genre_ids: number[];
  created_at?: string;
};

export type AuthSuccessResponse = {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in?: number;
};

export type RegisterResponse =
  | AuthSuccessResponse
  | {
      user_id: number;
      email: string;
      display_name?: string | null;
    };

export type RegisterRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  preferred_genre_ids: number[];
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type HomeSuggestionResponse = {
  movie_id: number;
  reason?: string | null;
};

export type SavedItem = {
  movie_id: number;
  saved_at: string;
};

export type SavedListResponse = {
  items: SavedItem[];
  page: number;
  page_size: number;
  total: number;
};

export type WatchedItem = {
  movie_id: number;
  watched_at: string;
};

export type WatchedListResponse = {
  items: WatchedItem[];
  page: number;
  page_size: number;
  total: number;
};

export type NoteResponse = {
  movie_id: number;
  note: string;
  updated_at?: string | null;
};

export type ProfileSummary = {
  saved_count: number;
  watched_count: number;
  notes_count: number;
  last_watched_at?: string | null;
};

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function register(payload: RegisterRequest): Promise<AuthSuccessResponse> {
  const { data } = await client.post<AuthSuccessResponse>("/auth/register", payload);
  return data;
}

export async function login(payload: LoginRequest): Promise<AuthSuccessResponse> {
  const { data } = await client.post<AuthSuccessResponse>("/auth/login", payload);
  return data;
}

export async function logout(token?: string): Promise<void> {
  await client.post("/auth/logout", { refresh_token: token ?? null });
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await client.get<AuthUser>("/auth/me");
  return data;
}

// ── Movies ───────────────────────────────────────────────────────────────────

export async function getHomeSuggestion(): Promise<HomeSuggestionResponse> {
  const { data } = await client.get<HomeSuggestionResponse>("/me/home-suggestion");
  return data;
}

export async function searchMovies(query: string, page = 1): Promise<SearchResponse> {
  const { data } = await client.get<SearchResponse>("/search", {
    params: { query, page },
  });
  return data;
}

export async function getMovieDetails(movieId: number): Promise<MovieDetail> {
  const { data } = await client.get<MovieDetail>(`/movie/${movieId}`);
  return data;
}

export async function getDiscover(params: { genre_ids?: number[]; max_runtime?: number; min_vote_average?: number; page?: number; } = {}): Promise<SearchResponse> {
  const { data } = await client.get<SearchResponse>(`/movie/discover`, {
    params: {
      with_genres: params.genre_ids ? params.genre_ids.join(",") : undefined,
      "with_runtime.lte": params.max_runtime,
      vote_average_gte: params.min_vote_average,
      page: params.page ?? 1,
    },
  });
  return data;
}

export async function forgotPassword(email: string): Promise<void> {
  await client.post("/auth/forgot-password", { email });
}

export async function resetPassword(token: string, new_password: string): Promise<void> {
  await client.post("/auth/reset-password", { token, new_password });
}

export async function getMoodSearch(mood: string, genre_ids?: number[], max_runtime?: number, page = 1, top_k = 12): Promise<SearchResponse> {
  const { data } = await client.get<SearchResponse>(`/movie/mood`, {
    params: {
      mood,
      with_genres: genre_ids ? genre_ids.join(",") : undefined,
      max_runtime,
      page,
      top_k,
    },
  });
  return data;
}

export async function getMoodKnn(mood: string, top_k = 12): Promise<SearchResponse> {
  const { data } = await client.get<SearchResponse>(`/movie/mood_knn`, {
    params: { mood, top_k },
  });
  return data;
}

export async function getRecommendations(
  movieId: number,
  topK = 12
): Promise<{ recommendations: RecommendationItem[] }> {
  return getRecommendationsWithMood(movieId, topK, undefined);
}

export async function getRecommendationsWithMood(
  movieId: number,
  topK = 12,
  mood?: string
): Promise<{ recommendations: RecommendationItem[] }> {
  const { data } = await client.get<{ recommendations: RecommendationItem[] }>(
    `/movie/${movieId}/recommendations`,
    {
      params: { top_k: topK, min_vote_average: 0, min_vote_count: 0, mood },
    }
  );
  return data;
}


// ── Saved ────────────────────────────────────────────────────────────────────

export async function getSavedList(): Promise<SavedListResponse> {
  const { data } = await client.get<SavedListResponse>("/me/saved");
  return data;
}

export async function addSaved(movieId: number): Promise<void> {
  await client.put(`/me/saved/${movieId}`);
}

export async function removeSaved(movieId: number): Promise<void> {
  await client.delete(`/me/saved/${movieId}`);
}

// ── Watched ──────────────────────────────────────────────────────────────────

export async function getWatchedList(): Promise<WatchedListResponse> {
  const { data } = await client.get<WatchedListResponse>("/me/watched");
  return data;
}

export async function markWatched(movieId: number): Promise<void> {
  await client.post(`/me/watched/${movieId}`);
}

export async function removeWatched(movieId: number): Promise<void> {
  await client.delete(`/me/watched/${movieId}`);
}

// ── Notes ────────────────────────────────────────────────────────────────────

export async function getNote(movieId: number): Promise<NoteResponse> {
  const { data } = await client.get<NoteResponse>(`/me/watched/${movieId}/note`);
  return data;
}

export async function saveNote(movieId: number, note: string): Promise<NoteResponse> {
  const { data } = await client.put<NoteResponse>(`/me/watched/${movieId}/note`, { note });
  return data;
}

export async function deleteNote(movieId: number): Promise<void> {
  await client.delete(`/me/watched/${movieId}/note`);
}

// ── Summary ──────────────────────────────────────────────────────────────────

export async function getProfileSummary(): Promise<ProfileSummary> {
  const { data } = await client.get<ProfileSummary>("/me/summary");
  return data;
}
