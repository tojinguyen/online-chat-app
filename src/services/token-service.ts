import { AUTH_CONSTANTS } from "@/constants";

/**
 * Service for managing authentication tokens in localStorage
 */
export const tokenService = {
  /**
   * Get the access token from localStorage
   * @returns The access token or null if not found
   */
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Get the refresh token from localStorage
   * @returns The refresh token or null if not found
   */
  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Set the access token in localStorage
   * @param token The access token to store
   */
  setAccessToken: (token: string): void => {
    if (typeof window === "undefined") return;

    localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  /**
   * Set the refresh token in localStorage
   * @param token The refresh token to store
   */
  setRefreshToken: (token: string): void => {
    if (typeof window === "undefined") return;

    localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  /**
   * Remove all tokens from localStorage
   */
  clearTokens: (): void => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Check if an access token exists
   * @returns true if an access token exists, false otherwise
   */
  hasAccessToken: (): boolean => {
    if (typeof window === "undefined") return false;

    return !!localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Check if a refresh token exists
   * @returns true if a refresh token exists, false otherwise
   */
  hasRefreshToken: (): boolean => {
    if (typeof window === "undefined") return false;

    return !!localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
  },
};
