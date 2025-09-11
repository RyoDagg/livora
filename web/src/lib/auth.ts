import { api } from "./api";

export const login = (email: string, password: string) =>
  api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (email: string, password: string, name: string) =>
  api("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });

export const me = () => api("/users/me");

export const logout = () => api("/auth/logout", { method: "POST" });
