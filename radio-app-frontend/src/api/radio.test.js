import { describe, it, expect, vi, beforeEach } from "vitest";
import * as http from "./http";

vi.mock("@/config/api-config", () => ({
  API_ENDPOINT: {
    getCurrentTrack: "/api/radio/track",
    getCurrentPlaylist: "/api/radio/playlist",
    getCurrentQueue: "/api/radio/queue",
    getCurrentHost: "/api/radio/host",
  },
}));

const getJsonSpy = vi.spyOn(http, "getJson");

describe("Radio API Getter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getJsonSpy.mockResolvedValue({});
  });

  describe("getCurrentTrack", () => {
    it("calls getJson with track endpoint", async () => {
      getJsonSpy.mockResolvedValueOnce({ track: "Song" });
      const result = await import("./radio").then((m) => m.getCurrentTrack());
      expect(getJsonSpy).toHaveBeenCalledWith("/api/radio/track");
      expect(result).toEqual({ track: "Song" });
    });
  });

  describe("getCurrentPlaylist", () => {
    it("calls getJson with playlist endpoint", async () => {
      await import("./radio").then((m) => m.getCurrentPlaylist());
      expect(getJsonSpy).toHaveBeenCalledWith("/api/radio/playlist");
    });
  });

  describe("getCurrentQueue", () => {
    it("calls getJson with queue endpoint", async () => {
      await import("./radio").then((m) => m.getCurrentQueue());
      expect(getJsonSpy).toHaveBeenCalledWith("/api/radio/queue");
    });
  });

  describe("getCurrentHost", () => {
    it("calls getJson with host endpoint", async () => {
      await import("./radio").then((m) => m.getCurrentHost());
      expect(getJsonSpy).toHaveBeenCalledWith("/api/radio/host");
    });
  });
});
