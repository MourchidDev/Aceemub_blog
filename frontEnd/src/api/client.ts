import axios from "axios";

const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) ?? "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const API_ORIGIN =
  ((import.meta.env.VITE_API_URL as string) ?? "http://localhost:5000/api").replace(/\/api\/?$/, "");

export default apiClient;
