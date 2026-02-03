import { describe, it, expect, vi, beforeEach } from "vitest";
import * as http from "./http";
import { attachToken } from "./auth";

vi.mock("@/config/api-config", () => ({
  API_ENDPOINT: {
    postRegister: "/api/auth/register",
    postLogin: "/api/auth/login",
  },
}));

const postJsonSpy = vi.spyOn(http, "postJson");

describe("Auth API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    postJsonSpy.mockResolvedValue({ success: true });
  });

  describe("register", () => {
    it("calls postJson with registration credentials on /auth/register", async () => {
      const { register } = await import("./auth");
      const email = "newlistener@radio.de";
      const password = "DanceFlow2026!";

      const result = await register({ email, password });

      expect(postJsonSpy).toHaveBeenCalledWith("/api/auth/register", {
        email,
        password,
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe("login", () => {
    it("calls postJson with login credentials on /auth/login", async () => {
      const { login } = await import("./auth");
      const email = "dj@station.fm";
      const password = "LiveMix789#";

      const result = await login({ email, password });

      expect(postJsonSpy).toHaveBeenCalledWith("/api/auth/login", {
        email,
        password,
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe("attachToken", () => {
    it("formats raw token as Bearer token", () => {
      expect(attachToken("raw-jwt-token-123")).toBe("Bearer raw-jwt-token-123");
      expect(attachToken("short-token")).toBe("Bearer short-token");
    });

    it("preserves special characters in token", () => {
      const tokenWithSpecialChars = "token@with!special#chars$";

      expect(attachToken(tokenWithSpecialChars)).toBe(
        "Bearer token@with!special#chars$",
      );
    });
  });
});
