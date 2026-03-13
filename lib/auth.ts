export const AUTH_STORAGE_KEY = "foreman-app-authenticated";

export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
};
