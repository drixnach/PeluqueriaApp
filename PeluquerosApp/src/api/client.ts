import { useAuthStore } from "@/store/authStore";
import Constants from "expo-constants";

function getApiUrl() {
    const envUrl = process.env.EXPO_PUBLIC_API_URL;
    if (envUrl) return envUrl;

    const hostUri =
        Constants.expoConfig?.hostUri ||
        (Constants as any).manifest2?.extra?.expoClient?.hostUri ||
        (Constants as any).manifest?.debuggerHost;

    if (hostUri) {
        const host = hostUri.split(":")[0];
        return `http://${host}:5143/api`;
    }

    return "http://10.0.2.2:5143/api";
}

const API_URL = getApiUrl();

type ApiFetchOptions = RequestInit & { skipAuth?: boolean }

export async function apiFetch(path: string, { skipAuth = false, ...options }: ApiFetchOptions = {}) {
    const token = skipAuth ? null : useAuthStore.getState().token;

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (response.status === 401 && token) {
        useAuthStore.getState().logout();
    }

    return response;
}

