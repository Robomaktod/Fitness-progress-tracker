import axios from "axios";

// Set EXPO_PUBLIC_API_URL in .env to point at your backend (see .env.example).
// Falls back to the previous hardcoded LAN address for local dev continuity.
const baseURL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.0.106:3000/api";

export const apiClient = axios.create({
  baseURL,
});
