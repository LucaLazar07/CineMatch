import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { AuthUser } from "../services/api";

export type { AuthUser };

export type AuthSession = {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  user: AuthUser;
};

const KEY_AUTH_SESSION = "cinematch_auth_session";

function isSecureStoreAvailable(): boolean {
  return Platform.OS !== "web";
}

async function readSessionRaw(): Promise<string | null> {
  if (isSecureStoreAvailable()) {
    return SecureStore.getItemAsync(KEY_AUTH_SESSION);
  }
  return AsyncStorage.getItem(KEY_AUTH_SESSION);
}

async function writeSessionRaw(value: string): Promise<void> {
  if (isSecureStoreAvailable()) {
    await SecureStore.setItemAsync(KEY_AUTH_SESSION, value);
    return;
  }
  await AsyncStorage.setItem(KEY_AUTH_SESSION, value);
}

async function deleteSessionRaw(): Promise<void> {
  if (isSecureStoreAvailable()) {
    await SecureStore.deleteItemAsync(KEY_AUTH_SESSION);
    return;
  }
  await AsyncStorage.removeItem(KEY_AUTH_SESSION);
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const raw = await readSessionRaw();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.access_token || !parsed?.user) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function saveAuthSession(session: AuthSession): Promise<void> {
  await writeSessionRaw(JSON.stringify(session));
}

export async function clearAuthSession(): Promise<void> {
  await deleteSessionRaw();
}
